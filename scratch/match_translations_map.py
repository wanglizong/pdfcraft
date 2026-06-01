import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

# Load pending-messages-chunk3.json
pending_path = os.path.join(scratch_dir, "pending-messages-chunk3.json")
with open(pending_path, "r", encoding="utf-8") as f:
    pending_data = json.load(f)

# Load pending-translations-map.json if exists
map_path = os.path.join(scratch_dir, "pending-translations-map.json")
map_data = {}
if os.path.exists(map_path):
    with open(map_path, "r", encoding="utf-8") as f:
        map_data = json.load(f)
    print(f"Loaded {len(map_data)} items from pending-translations-map.json.")

# Let's inspect a few items in map_data
print("Map data sample keys:", list(map_data.keys())[:5])

# Let's check if english text or key matches map_data
found_in_map = 0
for key in pending_data:
    en_val = pending_data[key].get("en")
    if en_val in map_data:
        found_in_map += 1

print(f"Found {found_in_map} / {len(pending_data)} keys/en_val in pending-translations-map.json.")
