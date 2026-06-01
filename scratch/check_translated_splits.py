import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"
splits_dir = os.path.join(scratch_dir, "chunk3_splits")

for i in range(6):
    path = os.path.join(splits_dir, f"translated_split_{i}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"translated_split_{i}.json languages: {list(data.keys())}")
    else:
        print(f"translated_split_{i}.json does not exist")
