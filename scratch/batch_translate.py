import urllib.request
import urllib.parse
import json
import sys
import re
import os
import time

sys.stdout.reconfigure(encoding='utf-8')

INPUT_FILE = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk3.json"
OUTPUT_FILE = "d:/NextProject/pdfcraft/scratch/translated-messages-chunk3-partB.json"
CACHE_FILE = "d:/NextProject/pdfcraft/scratch/translation_cache.json"

TARGET_LANGS = ["es", "fr", "pt", "it"]

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
    save_json(CACHE_FILE, cache)

def translate_api_call(text, target_lang, retries=5, delay=2.0):
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
            print(f"\n[Warning] Attempt {attempt+1} failed translating to {target_lang} for text '{text[:30]}...': {e}")
            if attempt < retries - 1:
                time.sleep(delay * (2 ** attempt))
            else:
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
    
    # Initialize output structures
    output = {lang: {} for lang in TARGET_LANGS}
    
    # Compile a list of all translations to perform
    tasks = []
    for key, val in pending_data.items():
        # Get English source
        src_text = val.get("en")
        if not src_text:
            src_text = val.get("zh", "")
            
        for lang in TARGET_LANGS:
            tasks.append((key, src_text, lang))
            
    total_tasks = len(tasks)
    print(f"Total translation tasks: {total_tasks}")
    
    completed_count = 0
    cache_hits = 0
    
    for idx, (key, src_text, lang) in enumerate(tasks):
        # We use a cache key like "lang:src_text"
        cache_key = f"{lang}:{src_text}"
        
        if cache_key in cache:
            translated_val = cache[cache_key]
            cache_hits += 1
        else:
            # Let's perform translation
            translated_val = translate_with_protection(src_text, lang)
            if translated_val is None:
                print(f"\n[Error] Failed to translate: '{src_text}' to {lang}")
                # We save cache and exit, so we can retry
                save_cache(cache)
                sys.exit(1)
                
            cache[cache_key] = translated_val
            # Sleep slightly to prevent rate limit
            time.sleep(0.05)
            
            # Periodically save cache to disk every 50 translations
            if idx % 50 == 0:
                save_cache(cache)
                
        output[lang][key] = translated_val
        completed_count += 1
        
        # Print progress
        if idx % 20 == 0 or idx == total_tasks - 1:
            sys.stdout.write(f"\rProgress: {completed_count}/{total_tasks} ({completed_count/total_tasks*100:.1f}%) | Cache Hits: {cache_hits}")
            sys.stdout.flush()
            
    # Save final cache
    save_cache(cache)
    print("\n\nAll translations completed successfully!")
    
    # Save final output
    print(f"Saving final translated object to {OUTPUT_FILE}...")
    save_json(OUTPUT_FILE, output)
    print("Saved successfully!")

if __name__ == "__main__":
    main()
