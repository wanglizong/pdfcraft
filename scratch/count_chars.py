import json

with open("d:/NextProject/pdfcraft/scratch/pending-messages-chunk2.json", "r", encoding="utf-8") as f:
    data = json.load(f)

total_chars = 0
for k, v in data.items():
    total_chars += len(v.get("en", "")) + len(v.get("zh", ""))

print(f"Total keys: {len(data)}")
print(f"Total source characters (EN+ZH): {total_chars}")
