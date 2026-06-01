import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

# Load pending-messages-chunk3.json
pending_path = os.path.join(scratch_dir, "pending-messages-chunk3.json")
with open(pending_path, "r", encoding="utf-8") as f:
    pending_data = json.load(f)

unique_en = set()
total_chars = 0
for k, v in pending_data.items():
    en = v.get("en", "")
    unique_en.add(en)
    total_chars += len(en)

print(f"Total keys: {len(pending_data)}")
print(f"Unique English strings: {len(unique_en)}")
print(f"Total English characters: {total_chars}")
print(f"Average length: {total_chars / len(pending_data):.1f}")
