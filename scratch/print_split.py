import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"
splits_dir = os.path.join(scratch_dir, "chunk3_splits")

split_idx = int(sys.argv[1]) if len(sys.argv) > 1 else 0
path = os.path.join(splits_dir, f"split_{split_idx}.json")

with open(path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"--- SPLIT {split_idx} ---")
for k, v in data.items():
    print(f"{k} | {v['en']}")
