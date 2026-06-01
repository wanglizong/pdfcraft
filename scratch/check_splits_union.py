import json
import os

scratch_dir = r"d:\NextProject\pdfcraft\scratch"
pending_path = os.path.join(scratch_dir, "pending-messages-chunk3.json")
with open(pending_path, "r", encoding="utf-8") as f:
    pending_data = json.load(f)

pending_keys = set(pending_data.keys())

splits_dir = os.path.join(scratch_dir, "chunk3_splits")
split_keys = set()
for i in range(6):
    path = os.path.join(splits_dir, f"split_{i}.json")
    with open(path, "r", encoding="utf-8") as f:
        split_data = json.load(f)
    split_keys.update(split_data.keys())

print(f"Pending keys count: {len(pending_keys)}")
print(f"Splits keys count: {len(split_keys)}")
print(f"Is union equal to pending keys? {pending_keys == split_keys}")
