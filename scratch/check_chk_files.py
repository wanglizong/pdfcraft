import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

for i in range(8):
    chk_path = os.path.join(scratch_dir, f"chk_{i}.json")
    trans_path = os.path.join(scratch_dir, f"trans_chk_{i}.json")
    
    chk_exists = os.path.exists(chk_path)
    trans_exists = os.path.exists(trans_path)
    
    if chk_exists:
        with open(chk_path, "r", encoding="utf-8") as f:
            chk_data = json.load(f)
        chk_keys = len(chk_data)
    else:
        chk_keys = 0
        
    if trans_exists:
        with open(trans_path, "r", encoding="utf-8") as f:
            trans_data = json.load(f)
        trans_langs = list(trans_data.keys())
        trans_keys = {l: len(trans_data[l]) for l in trans_langs}
    else:
        trans_keys = {}
        
    print(f"chk_{i}.json: keys={chk_keys} | trans_chk_{i}.json: {trans_keys}")
