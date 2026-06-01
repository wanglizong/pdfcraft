import json
import os
import sys

# Set stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

def inspect_file(filename):
    path = os.path.join(scratch_dir, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
        print(f"File {filename}: type={type(data)}")
        if isinstance(data, dict):
            print(f"Keys (languages): {list(data.keys())}")
            for k in list(data.keys()):
                val = data[k]
                if isinstance(val, dict):
                    print(f"  {k} keys count: {len(val)}")
                else:
                    print(f"  {k} type: {type(val)}")
    else:
        print(f"File {filename} does not exist")

inspect_file("translated-messages-chunk3-partA.json")
inspect_file("translated-messages-chunk3-partC.json")
