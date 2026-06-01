import json
import os

original_file = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk3.json"
splits_dir = "d:/NextProject/pdfcraft/scratch/chunk3_splits"
output_file = "d:/NextProject/pdfcraft/scratch/translated-messages-chunk3-partA.json"

# Load original keys
with open(original_file, "r", encoding="utf-8") as f:
    original_data = json.load(f)
original_keys = set(original_data.keys())

# Initialize empty translation dicts
merged = {
    "ja": {},
    "ko": {},
    "de": {}
}

# Merge each split
for i in range(6):
    split_file = os.path.join(splits_dir, f"translated_split_{i}.json")
    if not os.path.exists(split_file):
        print(f"Error: {split_file} does not exist.")
        continue
    
    with open(split_file, "r", encoding="utf-8") as f:
        split_data = json.load(f)
        
    for lang in ["ja", "ko", "de"]:
        if lang in split_data:
            merged[lang].update(split_data[lang])

# Validate key matching
all_keys_ok = True
for lang in ["ja", "ko", "de"]:
    lang_keys = set(merged[lang].keys())
    missing = original_keys - lang_keys
    extra = lang_keys - original_keys
    
    print(f"[{lang}] Total keys: {len(lang_keys)}")
    if missing:
        print(f"[{lang}] Missing keys: {sorted(list(missing))}")
        all_keys_ok = False
    if extra:
        print(f"[{lang}] Extra keys: {sorted(list(extra))}")
        all_keys_ok = False

if all_keys_ok and len(original_keys) == 480:
    print("Success: All 480 keys match original exactly for all target languages!")
else:
    print(f"Warning: Keys mismatch. Original count: {len(original_keys)}. Target ja: {len(merged['ja'])}, ko: {len(merged['ko'])}, de: {len(merged['de'])}")

# Save merged output
with open(output_file, "w", encoding="utf-8") as out_f:
    json.dump(merged, out_f, ensure_ascii=False, indent=2)

print(f"Saved merged translations to {output_file}")
