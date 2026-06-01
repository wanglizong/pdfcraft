import json
import re

SOURCE_FILE = r"d:/NextProject/pdfcraft/scratch/pending-messages-chunk2.json"
OUTPUT_FILE = r"d:/NextProject/pdfcraft/scratch/translated-messages-chunk2-partB.json"
LANGS = ["es", "fr", "pt", "it"]

with open(SOURCE_FILE, "r", encoding="utf-8") as f:
    source = json.load(f)
    
with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
    trans = json.load(f)

mismatches = 0
for key, data in source.items():
    src_text = data.get("en", data.get("zh", ""))
    src_vars = set(re.findall(r"\{[a-zA-Z0-9_]+\}", src_text))
    
    for lang in LANGS:
        tr_text = trans[lang].get(key, "")
        tr_vars = set(re.findall(r"\{[a-zA-Z0-9_]+\}", tr_text))
        
        if src_vars != tr_vars:
            print(f"Mismatch: key={key}, lang={lang}")
            print(f"  Source vars: {src_vars}")
            print(f"  Trans  vars: {tr_vars}")
            print(f"  Source text: {src_text}")
            print(f"  Trans  text: {tr_text}")
            mismatches += 1

print(f"Verification completed. Total mismatches: {mismatches}")
