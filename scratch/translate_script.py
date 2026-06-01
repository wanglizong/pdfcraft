import json
import urllib.parse
import urllib.request
import time
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed

def translate(text, target_lang, source_lang='en'):
    if not text:
        return ""
    # Google translate single endpoint
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl={source_lang}&tl={target_lang}&dt=t&q={urllib.parse.quote(text)}"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=10) as response:
                res = json.loads(response.read().decode('utf-8'))
                translated_text = "".join([x[0] for x in res[0] if x[0]])
                return translated_text
        except Exception as e:
            time.sleep(1)
    return ""

def translate_task(key, source_text, sl, lang):
    translated = translate(source_text, lang, source_lang=sl)
    return key, lang, translated

def main():
    input_path = r'd:/NextProject/pdfcraft/scratch/pending-messages-chunk4.json'
    output_path = r'd:/NextProject/pdfcraft/scratch/google-translated.json'
    
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    results = {
        "id": {},
        "ro": {},
        "vi": {},
        "ar": {}
    }
    
    langs = ["id", "ro", "vi", "ar"]
    
    total = len(data)
    print(f"Starting multi-threaded translation of {total} keys to {langs}...")
    
    tasks = []
    with ThreadPoolExecutor(max_workers=20) as executor:
        for key, val in data.items():
            source_text = val.get("en", "")
            if not source_text:
                source_text = val.get("zh", "")
                sl = 'zh-CN'
            else:
                sl = 'en'
                
            for lang in langs:
                tasks.append(executor.submit(translate_task, key, source_text, sl, lang))
        
        count = 0
        total_tasks = len(tasks)
        for future in as_completed(tasks):
            key, lang, translated = future.result()
            results[lang][key] = translated
            count += 1
            if count % 100 == 0 or count == total_tasks:
                print(f"Completed {count}/{total_tasks} translation queries...")
                
    # Sort the dictionary keys to match original order
    sorted_results = {}
    for lang in langs:
        sorted_results[lang] = {}
        for key in data.keys():
            sorted_results[lang][key] = results[lang].get(key, "")
            
    with open(output_path, 'w', encoding='utf-8') as out:
        json.dump(sorted_results, out, ensure_ascii=False, indent=2)
    
    print("Done! Saved translations to", output_path)

if __name__ == '__main__':
    main()
