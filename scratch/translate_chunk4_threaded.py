import urllib.request
import urllib.parse
import json
import sys
import re
import os
import time
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed

sys.stdout.reconfigure(encoding='utf-8')

INPUT_FILE = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk4.json"
OUTPUT_FILE = "d:/NextProject/pdfcraft/scratch/translated-messages-chunk4-partA.json"
CACHE_FILE = "d:/NextProject/pdfcraft/scratch/translation_cache.json"

TARGET_LANGS = ["ja", "ko", "de"]
MAX_WORKERS = 15  # 15 parallel threads for rapid translation

cache_lock = threading.Lock()

def load_json(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

def load_cache():
    if os.path.exists(CACHE_FILE):
        try:
            return load_json(CACHE_FILE)
        except Exception:
            return {}
    return {}

def save_cache(cache):
    with cache_lock:
        save_json(CACHE_FILE, cache)

def translate_api_call(text, target_lang, retries=5, delay=1.0):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "auto",
        "tl": target_lang,
        "dt": "t",
        "q": text
    }
    query_string = urllib.parse.urlencode(params)
    req = urllib.request.Request(url + "?" + query_string, headers={"User-Agent": "Mozilla/5.0"})
    
    for attempt in range(retries):
        try:
            response = urllib.request.urlopen(req, timeout=10)
            data = json.loads(response.read().decode('utf-8'))
            translated = "".join([segment[0] for segment in data[0] if segment[0]])
            return translated
        except Exception as e:
            time.sleep(delay * (1.5 ** attempt))
            if attempt == retries - 1:
                print(f"\n[Warning] All attempts failed to translate to {target_lang} for text '{text[:30]}...': {e}")
                return None

def translate_with_protection(text, target_lang):
    if not text.strip():
        return text
        
    # Find all placeholders like {brand}, {current}, etc. and tags like <strong1>, </strong1>
    placeholders = re.findall(r'\{[a-zA-Z0-9_]+\}|\<\/?[a-zA-Z0-9_]+\>', text)
    
    # Map placeholders to unique uppercase tokens
    token_map = {}
    temp_text = text
    for i, p in enumerate(placeholders):
        token = f"PLACEHOLDERTOKEN{i}"
        token_map[token] = p
        temp_text = temp_text.replace(p, token)
        
    translated = translate_api_call(temp_text, target_lang)
    if translated is None:
        return None
        
    # Restore placeholders
    for token, p in token_map.items():
        pattern = re.compile(re.escape(token), re.IGNORECASE)
        translated = pattern.sub(p, translated)
        
    return translated

def main():
    print("Loading pending messages...")
    pending_data = load_json(INPUT_FILE)
    print(f"Loaded {len(pending_data)} keys.")
    
    # Load cache
    cache = load_cache()
    print(f"Loaded translation cache with {len(cache)} entries.")
    
    # Compile a list of all translations to perform
    tasks = []
    for key, val in pending_data.items():
        src_text = val.get("en")
        if not src_text:
            src_text = val.get("zh", "")
            
        for lang in TARGET_LANGS:
            cache_key = f"{lang}:{src_text}"
            tasks.append((key, src_text, lang, cache_key))
            
    total_tasks = len(tasks)
    print(f"Total translation tasks: {total_tasks}")
    
    # Separate already cached tasks and pending ones
    pending_tasks = []
    output = {lang: {} for lang in TARGET_LANGS}
    
    cache_hits = 0
    for key, src_text, lang, cache_key in tasks:
        if cache_key in cache:
            output[lang][key] = cache[cache_key]
            cache_hits += 1
        else:
            pending_tasks.append((key, src_text, lang, cache_key))
            
    print(f"Cache Hits: {cache_hits} | Remaining Tasks to Translate: {len(pending_tasks)}")
    
    if len(pending_tasks) == 0:
        print("All translations are already in the cache! Generating output file...")
        save_json(OUTPUT_FILE, output)
        print("Done!")
        return

    # Translate pending tasks using ThreadPoolExecutor
    completed_count = cache_hits
    progress_lock = threading.Lock()
    
    def process_task(task):
        nonlocal completed_count
        key, src_text, lang, cache_key = task
        
        translated_val = translate_with_protection(src_text, lang)
        if translated_val is None:
            return False, task, None
            
        with cache_lock:
            cache[cache_key] = translated_val
            
        with progress_lock:
            output[lang][key] = translated_val
            completed_count += 1
            if completed_count % 10 == 0 or completed_count == total_tasks:
                sys.stdout.write(f"\rProgress: {completed_count}/{total_tasks} ({completed_count/total_tasks*100:.1f}%)")
                sys.stdout.flush()
                
        return True, task, translated_val

    print(f"Starting parallel translation with {MAX_WORKERS} workers...")
    
    failed_tasks = []
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(process_task, task): task for task in pending_tasks}
        
        last_save_time = time.time()
        for future in as_completed(futures):
            success, task, result = future.result()
            if not success:
                failed_tasks.append(task)
                
            if time.time() - last_save_time > 10:
                save_cache(cache)
                last_save_time = time.time()
                
    save_cache(cache)
    print("\nParallel translation pass completed.")
    
    if failed_tasks:
        print(f"\n[Warning] {len(failed_tasks)} tasks failed. Retrying them sequentially...")
        for task in failed_tasks:
            key, src_text, lang, cache_key = task
            translated_val = translate_with_protection(src_text, lang)
            if translated_val is not None:
                cache[cache_key] = translated_val
                output[lang][key] = translated_val
            else:
                print(f"[Error] Permanent failure translating '{src_text[:20]}...' to {lang}")
                sys.exit(1)
        save_cache(cache)
        print("Retry finished.")
        
    # Save final output
    print(f"Saving final translated object to {OUTPUT_FILE}...")
    save_json(OUTPUT_FILE, output)
    print("All tasks completed successfully and saved!")

if __name__ == "__main__":
    main()
