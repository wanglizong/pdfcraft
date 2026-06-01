import json

file_path = "d:/NextProject/pdfcraft/scratch/pending-messages-chunk3.json"
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)

print(f"Total keys: {len(data)}")
# print some key names
keys = list(data.keys())
for i in range(min(5, len(keys))):
    print(keys[i], data[keys[i]])
