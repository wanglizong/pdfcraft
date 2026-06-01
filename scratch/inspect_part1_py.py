import sys
sys.stdout.reconfigure(encoding='utf-8')

with open(r"d:\NextProject\pdfcraft\scratch\part1.py", "r", encoding="utf-8") as f:
    lines = f.readlines()
print("".join(lines[:30]))
