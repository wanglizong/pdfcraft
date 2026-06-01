import json
import os

input_path = r"d:\NextProject\pdfcraft\scratch\pending-messages-chunk1.json"
parts_dir = r"d:\NextProject\pdfcraft\scratch\parts"
os.makedirs(parts_dir, exist_ok=True)

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

keys = list(data.keys())
chunk_size = 60
num_chunks = (len(keys) + chunk_size - 1) // chunk_size

for idx in range(num_chunks):
    chunk_keys = keys[idx * chunk_size : (idx + 1) * chunk_size]
    chunk_data = {k: data[k] for k in chunk_keys}
    output_path = os.path.join(parts_dir, f"part_{idx}.json")
    with open(output_path, 'w', encoding='utf-8') as out_f:
        json.dump(chunk_data, out_f, ensure_ascii=False, indent=2)

print(f"Successfully split into {num_chunks} parts.")
