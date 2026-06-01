import json
import time
import re
import sys
import os
from deep_translator import GoogleTranslator

# Set stdout to UTF-8 to prevent console print encoding errors
sys.stdout.reconfigure(encoding='utf-8')

INPUT_PATH = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk4.json"
PROGRESS_PATH = "d:/NextProject/pdfcraft/scratch/progress.json"
OUTPUT_PATH = "d:/NextProject/pdfcraft/scratch/translated-messages-chunk4-partA.json"

def fix_placeholders(source, target):
    placeholders = re.findall(r'\{[a-zA-Z0-9_]+}', source)
    if not placeholders:
        return target
    
    fixed_target = target
    for ph in placeholders:
        name = ph[1:-1]  # e.g., "query"
        if ph in fixed_target:
            continue
        
        # 1. Try case-insensitive and spacing matches, e.g. "{ query }" or "{Query}"
        pattern = re.compile(r'\{\s*' + re.escape(name) + r'\s*\}', re.IGNORECASE)
        match = pattern.search(fixed_target)
        if match:
            fixed_target = fixed_target[:match.start()] + ph + fixed_target[match.end():]
            continue
            
        # 2. Try capitalized name, e.g. "{Count}"
        pattern_cap = re.compile(r'\{\s*' + re.escape(name.capitalize()) + r'\s*\}')
        match_cap = pattern_cap.search(fixed_target)
        if match_cap:
            fixed_target = fixed_target[:match_cap.start()] + ph + fixed_target[match_cap.end():]
            continue
            
    return fixed_target

def save_progress(progress_data):
    with open(PROGRESS_PATH, 'w', encoding='utf-8') as f:
        json.dump(progress_data, f, ensure_ascii=False, indent=2)
        f.flush()
        os.fsync(f.fileno())

def load_progress():
    if os.path.exists(PROGRESS_PATH):
        try:
            with open(PROGRESS_PATH, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception as e:
            print(f"Warning: Failed to load progress file: {e}. Starting fresh.")
    return {"ja": {}, "ko": {}, "de": {}}

def main():
    # Load input JSON
    with open(INPUT_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    keys = list(data.keys())
    
    languages = {
        "ja": "ja",
        "ko": "ko",
        "de": "de"
    }
    
    progress = load_progress()
    
    # Ensure all languages are in progress structure
    for lang in languages:
        if lang not in progress:
            progress[lang] = {}
            
    batch_size = 30
    
    for lang_key, lang_code in languages.items():
        print(f"\n=== TRANSLATION FOR {lang_key.upper()} ===")
        translator = GoogleTranslator(source='en', target=lang_code)
        
        # Filter keys that need translation for this language
        pending_keys = [k for k in keys if k not in progress[lang_key]]
        if not pending_keys:
            print(f"All {len(keys)} keys already translated for {lang_key.upper()}!")
            continue
            
        print(f"Found {len(pending_keys)} pending keys of {len(keys)} total.")
        
        # Translate in batches
        for i in range(0, len(pending_keys), batch_size):
            batch_keys = pending_keys[i:i+batch_size]
            batch_texts = [data[k]['en'] for k in batch_keys]
            
            print(f"Translating batch {i//batch_size + 1}/{(len(pending_keys)-1)//batch_size + 1} ({len(batch_keys)} items)...")
            
            success = False
            retries = 3
            delay = 2.0
            
            for attempt in range(retries):
                try:
                    result = translator.translate_batch(batch_texts)
                    if len(result) == len(batch_keys):
                        # Save batch results
                        for k, src, tr in zip(batch_keys, batch_texts, result):
                            progress[lang_key][k] = fix_placeholders(src, tr)
                        save_progress(progress)
                        success = True
                        print(f"Batch saved successfully. (Total progress for {lang_key}: {len(progress[lang_key])}/{len(keys)})")
                        break
                    else:
                        print(f"Warning: batch output length mismatch. Retrying...")
                except Exception as e:
                    print(f"Error on batch attempt {attempt+1}/{retries}: {e}")
                    time.sleep(delay)
                    delay *= 2
            
            if not success:
                print("Batch failed. Falling back to one-by-one translation for this batch...")
                for k, src in zip(batch_keys, batch_texts):
                    item_success = False
                    for item_attempt in range(3):
                        try:
                            tr = translator.translate(src)
                            progress[lang_key][k] = fix_placeholders(src, tr)
                            save_progress(progress)
                            item_success = True
                            print(f"Translated and saved: '{k}'")
                            break
                        except Exception as e:
                            print(f"Item translation error for '{k}': {e}. Retrying...")
                            time.sleep(3.0)
                    if not item_success:
                        print(f"Critical Fallback: Using English text for '{k}'")
                        progress[lang_key][k] = src
                        save_progress(progress)
                    time.sleep(0.5)
            
            # Delay between batches
            time.sleep(2.0)
            
        print(f"=== COMPLETED {lang_key.upper()} ===\n")
        
    # Write final output format
    output_data = {
        "ja": progress["ja"],
        "ko": progress["ko"],
        "de": progress["de"]
    }
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully wrote the output file to: {OUTPUT_PATH}")
    
    # Remove progress file on success
    if os.path.exists(PROGRESS_PATH):
        try:
            os.remove(PROGRESS_PATH)
            print("Cleaned up intermediate progress file.")
        except Exception as e:
            print(f"Warning: Failed to delete progress file: {e}")

if __name__ == "__main__":
    main()
