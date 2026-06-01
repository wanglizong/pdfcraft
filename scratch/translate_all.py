import json
import time
import re
import sys
from deep_translator import GoogleTranslator

# Set stdout to UTF-8 to prevent console print encoding errors
sys.stdout.reconfigure(encoding='utf-8')

INPUT_PATH = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk4.json"
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
            print(f"Fixed placeholder space/case: {match.group()} -> {ph}")
            continue
            
        # 2. Try capitalized name, e.g. "{Count}"
        pattern_cap = re.compile(r'\{\s*' + re.escape(name.capitalize()) + r'\s*\}')
        match_cap = pattern_cap.search(fixed_target)
        if match_cap:
            fixed_target = fixed_target[:match_cap.start()] + ph + fixed_target[match_cap.end():]
            print(f"Fixed placeholder capitalized: {match_cap.group()} -> {ph}")
            continue

        # 3. Look for the translated word inside braces if possible, or print a warning
        print(f"WARNING: Placeholder {ph} might be missing or translated in target: '{target}' (Source: '{source}')")
            
    return fixed_target

def translate_list_with_retry(translator, texts, lang_code, batch_size=40):
    translated_texts = []
    
    for i in range(0, len(texts), batch_size):
        batch = texts[i:i+batch_size]
        print(f"Translating batch {i//batch_size + 1}/{(len(texts)-1)//batch_size + 1} ({len(batch)} items) to {lang_code}...")
        
        # Attempt translation with retry
        success = False
        retries = 3
        delay = 2.0
        
        for attempt in range(retries):
            try:
                result = translator.translate_batch(batch)
                if len(result) == len(batch):
                    translated_texts.extend(result)
                    success = True
                    break
                else:
                    print(f"Warning: batch output length mismatch ({len(result)} vs {len(batch)}). Retrying...")
            except Exception as e:
                print(f"Error on attempt {attempt+1}/{retries}: {e}")
                time.sleep(delay)
                delay *= 2
                
        if not success:
            # Fallback to translate one-by-one for this batch
            print(f"Failed batch translation. Falling back to one-by-one translation for this batch...")
            for text in batch:
                item_success = False
                for item_attempt in range(3):
                    try:
                        res = translator.translate(text)
                        translated_texts.append(res)
                        item_success = True
                        break
                    except Exception as e:
                        print(f"Item translation error: {e}. Retrying in 3s...")
                        time.sleep(3.0)
                if not item_success:
                    print(f"Critical Error: Failed to translate item: '{text}'. Appending original text as fallback.")
                    translated_texts.append(text)
                time.sleep(0.5)
        
        # Polite delay between batch requests
        time.sleep(1.5)
        
    return translated_texts

def main():
    # Load input JSON
    with open(INPUT_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    keys = list(data.keys())
    source_texts = []
    
    # We use 'en' as the source language for highest translation quality
    for key in keys:
        source_texts.append(data[key]['en'])
        
    languages = {
        "ja": "ja",
        "ko": "ko",
        "de": "de"
    }
    
    translated_results = {lang: {} for lang in languages}
    
    for lang_key, lang_code in languages.items():
        print(f"\n=== START TRANSLATION FOR {lang_key.upper()} ===")
        translator = GoogleTranslator(source='en', target=lang_code)
        
        translated_texts = translate_list_with_retry(translator, source_texts, lang_key)
        
        # Verify and match back
        for key, src, tr in zip(keys, source_texts, translated_texts):
            fixed_tr = fix_placeholders(src, tr)
            translated_results[lang_key][key] = fixed_tr
            
        print(f"=== COMPLETED {lang_key.upper()} ({len(translated_results[lang_key])} keys) ===\n")
        
    # Write final output format
    output_data = {
        "ja": translated_results["ja"],
        "ko": translated_results["ko"],
        "de": translated_results["de"]
    }
    
    with open(OUTPUT_PATH, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully wrote the output file to: {OUTPUT_PATH}")

if __name__ == "__main__":
    main()
