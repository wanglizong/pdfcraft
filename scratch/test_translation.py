import json
import time
from deep_translator import GoogleTranslator

# Test keys
test_data = {
  "tools.compressPdf.photonWarning": {
    "en": "Note: Photon converts pages to images, which may reduce text quality and lose interactivity (links, forms).",
    "zh": "注意：Photon 压缩会将页面转换为图像，这可能会降低文字质量并丢失交互性（如链接、表单）。"
  },
  "tools.search.noResults": {
    "en": "No tools found for \"{query}\"",
    "zh": "未找到\"{query}\"相关的工具"
  },
  "tools.formCreator.saveInfo": {
    "en": "{fields} form field(s) will be saved.",
    "zh": "将保存 {fields} 个表单字段。"
  }
}

languages = {
    "ja": "ja",
    "ko": "ko",
    "de": "de"
}

results = {lang: {} for lang in languages}

for lang_code, lang_name in languages.items():
    print(f"Translating to {lang_code}...")
    translator = GoogleTranslator(source='en', target=lang_name)
    for key, val in test_data.items():
        src_text = val['en']
        translated = translator.translate(src_text)
        results[lang_code][key] = translated
        print(f"  {key}: {src_text} -> {translated}")
        time.sleep(0.5)

print(json.dumps(results, indent=2, ensure_ascii=False))
