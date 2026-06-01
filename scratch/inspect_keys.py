import json
import os

input_path = r"d:\NextProject\pdfcraft\scratch\pending-messages-chunk1.json"
with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

keys = list(data.keys())
print(f"Total keys: {len(keys)}")

# Let's inspect some keys
for i in range(min(5, len(keys))):
    print(keys[i], data[keys[i]])
