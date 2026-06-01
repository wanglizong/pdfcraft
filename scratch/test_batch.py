import sys
import json
import time
from deep_translator import GoogleTranslator

# Set stdout to UTF-8
sys.stdout.reconfigure(encoding='utf-8')

translator = GoogleTranslator(source='en', target='ja')
texts = [
    "Note: Photon converts pages to images, which may reduce text quality and lose interactivity (links, forms).",
    "No tools found for \"{query}\"",
    "{fields} form field(s) will be saved."
]

print("Translating batch to Japanese:")
results = translator.translate_batch(texts)
for src, res in zip(texts, results):
    print(f"SRC: {src}")
    print(f"RES: {res}\n")
