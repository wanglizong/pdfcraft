import json
import os

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

# Load pending-messages-chunk3.json
pending_path = os.path.join(scratch_dir, "pending-messages-chunk3.json")
with open(pending_path, "r", encoding="utf-8") as f:
    pending_data = json.load(f)

print(f"Total keys in chunk3: {len(pending_data)}")

# List splits in chunk3_splits
splits_dir = os.path.join(scratch_dir, "chunk3_splits")
splits = sorted([f for f in os.listdir(splits_dir) if f.startswith("split_") and f.endswith(".json")])

for split in splits:
    split_path = os.path.join(splits_dir, split)
    with open(split_path, "r", encoding="utf-8") as f:
        split_data = json.load(f)
    print(f"Split {split}: {len(split_data)} keys")

# Check if there are other translated parts
part_a_path = os.path.join(scratch_dir, "translated-messages-chunk3-partA.json")
if os.path.exists(part_a_path):
    with open(part_a_path, "r", encoding="utf-8") as f:
        part_a_data = json.load(f)
    print(f"Part A exists: keys in 'es' = {len(part_a_data.get('es', {}))}")
else:
    print("Part A does not exist")

part_c_path = os.path.join(scratch_dir, "translated-messages-chunk3-partC.json")
if os.path.exists(part_c_path):
    with open(part_c_path, "r", encoding="utf-8") as f:
        part_c_data = json.load(f)
    print(f"Part C exists: keys in 'es' = {len(part_c_data.get('es', {}))}")
else:
    print("Part C does not exist")
