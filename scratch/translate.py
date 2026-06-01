import json
import os
import re
import time
import urllib.request
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed

SOURCE_FILE = r"d:/NextProject/pdfcraft/scratch/pending-messages-chunk2.json"
CACHE_FILE = r"d:/NextProject/pdfcraft/scratch/translation_cache.json"
OUTPUT_FILE = r"d:/NextProject/pdfcraft/scratch/translated-messages-chunk2-partB.json"

TARGET_LANGS = ["es", "fr", "pt", "it"]

def get_variables(text):
    # Find all occurrences of {variable}
    return re.findall(r"\{[a-zA-Z0-9_]+\}", text)

def replace_variables(text, variables):
    replaced = text
    for i, var in enumerate(variables):
        replaced = replaced.replace(var, f"__VAR_{i}__")
    return replaced

def restore_variables(text, variables):
    # First, normalize any spacing or capitalization issues Google Translate might introduce
    # e.g., __ VAR_0 __, __var_0__, __ Var_0 __, __VAR_ 0__, etc.
    normalized = text
    # Replace spaces inside the double underscores
    normalized = re.sub(r"__\s*[vV][aA][rR]\s*_\s*(\d+)\s*__", r"__VAR_\1__", normalized)
    
    # Now restore the original variables
    for i, var in enumerate(variables):
        placeholder = f"__VAR_{i}__"
        if placeholder in normalized:
            normalized = normalized.replace(placeholder, var)
        else:
            # Fallback if Google Translate altered the numbers or layout slightly
            # We will search for any __VAR_i__ variant
            pattern = re.compile(rf"__VAR_{i}__", re.IGNORECASE)
            normalized = pattern.sub(var, normalized)
    return normalized

def translate_text_raw(text, target_lang, source_lang='en'):
    if not text.strip():
        return ""
    
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={source_lang}&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    
    max_retries = 5
    backoff = 2
    for attempt in range(max_retries):
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                if response.status == 200:
                    res = json.loads(response.read().decode('utf-8'))
                    translated = "".join([seg[0] for seg in res[0] if seg[0]])
                    return translated
                else:
                    print(f"[{target_lang}] Unexpected status {response.status} for text: {text}")
        except Exception as e:
            if "429" in str(e):
                print(f"[{target_lang}] Rate limited (429). Retrying in {backoff}s... (Attempt {attempt+1}/{max_retries})")
            else:
                print(f"[{target_lang}] Error: {e}. Retrying in {backoff}s... (Attempt {attempt+1}/{max_retries})")
            time.sleep(backoff)
            backoff *= 2
            
    # Try with zh if en failed, or return None
    return None

def translate_item(key, source_text, target_lang):
    # Extract variables
    vars_list = get_variables(source_text)
    masked_text = replace_variables(source_text, vars_list)
    
    # Translate
    translated_masked = translate_text_raw(masked_text, target_lang)
    if translated_masked is None:
        return key, target_lang, None
        
    # Restore variables
    final_text = restore_variables(translated_masked, vars_list)
    return key, target_lang, final_text

def main():
    # Load source
    with open(SOURCE_FILE, "r", encoding="utf-8") as f:
        source_data = json.load(f)
        
    # Load cache if exists
    cache = {}
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, "r", encoding="utf-8") as f:
                cache = json.load(f)
            print(f"Loaded cache with {len(cache)} translated keys.")
        except Exception as e:
            print(f"Error loading cache: {e}")
            
    # Structure of output: { lang: { key: value } }
    # Let's initialize output from cache
    output = {lang: {} for lang in TARGET_LANGS}
    for key, lang_dict in cache.items():
        for lang in TARGET_LANGS:
            if lang in lang_dict and lang_dict[lang] is not None:
                output[lang][key] = lang_dict[lang]
                
    # Find pending translations
    pending_tasks = []
    for key, data in source_data.items():
        # Source text: prefer 'en', fallback to 'zh'
        source_text = data.get("en", data.get("zh", ""))
        
        # Check cache for each target language
        for lang in TARGET_LANGS:
            if key not in output[lang] or not output[lang][key]:
                pending_tasks.append((key, source_text, lang))
                
    total_tasks = len(pending_tasks)
    print(f"Total pending translations: {total_tasks} (out of {len(source_data) * len(TARGET_LANGS)} total)")
    
    if total_tasks == 0:
        print("All translations are already completed!")
        write_final_output(output)
        return
        
    # We will use ThreadPoolExecutor to speed things up safely
    # Using 5 workers to avoid aggressive rate limiting
    completed = 0
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(translate_item, key, text, lang): (key, lang) for key, text, lang in pending_tasks}
        
        for future in as_completed(futures):
            key, lang = futures[future]
            try:
                res_key, res_lang, translated = future.result()
                if translated is not None:
                    output[res_lang][res_key] = translated
                    # Update cache in memory
                    if res_key not in cache:
                        cache[res_key] = {}
                    cache[res_key][res_lang] = translated
                    completed += 1
                    
                    # Periodic save of cache (every 50 keys)
                    if completed % 50 == 0:
                        save_cache(cache)
                        print(f"Completed {completed}/{total_tasks} translations...")
                else:
                    print(f"Failed to translate key {key} for lang {lang}")
            except Exception as exc:
                print(f"Task for key {key} lang {lang} generated an exception: {exc}")
                
    # Save final cache
    save_cache(cache)
    
    # Write output file
    write_final_output(output)
    print("Done!")

def save_cache(cache):
    try:
        with open(CACHE_FILE, "w", encoding="utf-8") as f:
            json.dump(cache, f, ensure_ascii=False, indent=2)
    except Exception as e:
        print(f"Error saving cache: {e}")

def write_final_output(output):
    try:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(output, f, ensure_ascii=False, indent=2)
        print(f"Successfully saved final output to {OUTPUT_FILE}")
    except Exception as e:
        print(f"Error saving final output: {e}")

if __name__ == "__main__":
    main()
