import json
import os

input_file = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk3.json"
output_dir = "d:/NextProject/pdfcraft/scratch/chunk3_splits"
os.makedirs(output_dir, exist_ok=True)

with open(input_file, "r", encoding="utf-8") as f:
    data = json.load(f)

keys = list(data.keys())
chunk_size = 80
num_chunks = (len(keys) + chunk_size - 1) // chunk_size

for i in range(num_chunks):
    chunk_keys = keys[i*chunk_size : (i+1)*chunk_size]
    chunk_data = {k: data[k] for k in chunk_keys}
    chunk_file = os.path.join(output_dir, f"split_{i}.json")
    with open(chunk_file, "w", encoding="utf-8") as out_f:
        json.dump(chunk_data, out_f, ensure_ascii=False, indent=2)
    print(f"Created {chunk_file} with {len(chunk_data)} keys.")
