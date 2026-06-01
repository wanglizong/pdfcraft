import json
import os

INPUT_FILE = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk2.json"
OUT_DIR = "d:/NextProject/pdfcraft/scratch/parts"
os.makedirs(OUT_DIR, exist_ok=True)

with open(INPUT_FILE, "r", encoding="utf-8") as f:
    data = json.load(f)

keys = list(data.keys())
chunk_size = 80

for i in range(0, len(keys), chunk_size):
    chunk_keys = keys[i:i+chunk_size]
    chunk_data = {k: data[k] for k in chunk_keys}
    part_num = (i // chunk_size) + 1
    out_file = os.path.join(OUT_DIR, f"part_{part_num}.json")
    with open(out_file, "w", encoding="utf-8") as out_f:
        json.dump(chunk_data, out_f, ensure_ascii=False, indent=2)
    print(f"Saved part_{part_num}.json with {len(chunk_data)} keys.")
