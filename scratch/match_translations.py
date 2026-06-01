import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

# Load pending-messages-chunk3.json
pending_path = os.path.join(scratch_dir, "pending-messages-chunk3.json")
with open(pending_path, "r", encoding="utf-8") as f:
    pending_data = json.load(f)

print(f"Loaded {len(pending_data)} keys from chunk3.")

# Load translation_cache.json if exists
cache_path = os.path.join(scratch_dir, "translation_cache.json")
cache_data = {}
if os.path.exists(cache_path):
    with open(cache_path, "r", encoding="utf-8") as f:
        cache_data = json.load(f)
    print(f"Loaded {len(cache_data)} keys from translation_cache.json.")

# Let's count how many matching translations we have in the cache
langs = ["es", "fr", "pt", "it"]
found_counts = {l: 0 for l in langs}
for key in pending_data:
    en_val = pending_data[key].get("en")
    # check translation cache by key or by english value
    if key in cache_data:
        for l in langs:
            if l in cache_data[key]:
                found_counts[l] += 1
    elif en_val in cache_data:
        for l in langs:
            if l in cache_data[en_val]:
                found_counts[l] += 1

print(f"Found counts in cache_data by exact key/en_val: {found_counts}")
