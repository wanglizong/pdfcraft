import urllib.request
import urllib.parse
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

def translate_text(text, target_lang):
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "auto",
        "tl": target_lang,
        "dt": "t",
        "q": text
    }
    query_string = urllib.parse.urlencode(params)
    req = urllib.request.Request(url + "?" + query_string, headers={"User-Agent": "Mozilla/5.0"})
    try:
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        translated = "".join([segment[0] for segment in data[0] if segment[0]])
        return translated
    except Exception as e:
        print(f"Error translating: {e}")
        return None

text1 = "Hello {brand}, how are you?"
text2 = "Hello <span class=\"notranslate\">{brand}</span>, how are you?"

print("Direct:")
print(translate_text(text1, "es"))
print("With HTML tag:")
print(translate_text(text2, "es"))
