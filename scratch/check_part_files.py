import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

for i in range(1, 6):
    path = os.path.join(scratch_dir, f"part{i}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"part{i}.json: keys={len(data)}")
    else:
        print(f"part{i}.json does not exist")
        
    py_path = os.path.join(scratch_dir, f"part{i}.py")
    if os.path.exists(py_path):
        print(f"part{i}.py exists, size={os.path.getsize(py_path)}")
