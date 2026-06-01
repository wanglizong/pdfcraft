import urllib.request
import urllib.parse
import json
import sys
import re

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

# Test 1: Direct translation with dictionary word placeholders
text1 = "Sheet {current} of {total}"
print("Direct es:", translate_text(text1, "es"))
print("Direct fr:", translate_text(text1, "fr"))

# Test 2: Placeholder protection using regex
def translate_with_protection(text, target_lang):
    # Find all placeholders like {brand}, {current}, etc. and <strong1>, </strong1>
    placeholders = re.findall(r'\{[a-zA-Z0-9_]+\}|\<\/?[a-zA-Z0-9_]+\>', text)
    temp_text = text
    for i, p in enumerate(placeholders):
        # We replace them with a very safe unique token that is typically preserved
        # Let's try [P_0], [P_1] etc.
        temp_text = temp_text.replace(p, f" [P_{i}] ")
    
    translated = translate_text(temp_text, target_lang)
    if translated is None:
        return None
        
    # Let's restore the placeholders
    for i, p in enumerate(placeholders):
        # We need to handle potential spaces added around P_i or lowercase p_i
        pattern = re.compile(rf'\s*\[\s*[pP]_{i}\s*\]\s*')
        # If the pattern is not found, try a simpler replacement
        if pattern.search(translated):
            translated = pattern.sub(p, translated)
        else:
            translated = translated.replace(f"[P_{i}]", p).replace(f"[p_{i}]", p)
            
    # Clean up any potential double spaces around placeholders
    translated = re.sub(r'\s+', ' ', translated).strip()
    return translated

print("Protected es:", translate_with_protection(text1, "es"))
print("Protected fr:", translate_with_protection(text1, "fr"))

text2 = "For <strong1>WebAssembly</strong1> - For near-native PDF processing performance"
print("Protected HTML es:", translate_with_protection(text2, "es"))
print("Protected HTML fr:", translate_with_protection(text2, "fr"))
