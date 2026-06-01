import json
import os

with open(r'd:\NextProject\pdfcraft\scratch\pending-messages-chunk2.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

keys = list(data.keys())
chunk_size = 96
chunks = [keys[i:i + chunk_size] for i in range(0, len(keys), chunk_size)]

os.makedirs(r'd:\NextProject\pdfcraft\scratch\chunks', exist_ok=True)

for idx, chunk in enumerate(chunks):
    chunk_data = {k: data[k] for k in chunk}
    with open(f'd:/NextProject/pdfcraft/scratch/chunks/chunk_{idx}.json', 'w', encoding='utf-8') as f_out:
        json.dump(chunk_data, f_out, ensure_ascii=False, indent=2)

print(f"Created {len(chunks)} chunks.")
