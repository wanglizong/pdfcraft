import json
import os

scratch_dir = r"d:\NextProject\pdfcraft\scratch"

# Let's check if we have any cache files that have keys like tools.ocrPdf.infoText in es, fr, pt, it.
# Let's inspect unique-values.json or translation_cache.json.
def inspect_cache(filename):
    path = os.path.join(scratch_dir, filename)
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                # Load first 1000 chars to check format
                head = f.read(1000)
                print(f"File {filename} head:\n{head}\n")
        except Exception as e:
            print(f"Error reading {filename}: {e}")

inspect_cache("translation_cache.json")
inspect_cache("unique-values.json")
inspect_cache("pending-translations-map.json")
