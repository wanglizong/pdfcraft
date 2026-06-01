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

def translate_with_token_protection(text, target_lang):
    # Find all placeholders like {brand}, {current}, etc. and <strong1>, </strong1>
    placeholders = re.findall(r'\{[a-zA-Z0-9_]+\}|\<\/?[a-zA-Z0-9_]+\>', text)
    
    # We will map each placeholder to a unique word token
    token_map = {}
    temp_text = text
    for i, p in enumerate(placeholders):
        token = f"PLACEHOLDERTOKEN{i}"
        token_map[token] = p
        temp_text = temp_text.replace(p, token)
        
    translated = translate_text(temp_text, target_lang)
    if translated is None:
        return None
        
    # Restore placeholders
    # We replace them in reverse order or match case-insensitively just in case Google Translate lowercase it
    for token, p in token_map.items():
        # Match case-insensitively
        pattern = re.compile(re.escape(token), re.IGNORECASE)
        translated = pattern.sub(p, translated)
        
    return translated

text1 = "Sheet {current} of {total}"
print("Token-Protected es:", translate_with_token_protection(text1, "es"))
print("Token-Protected fr:", translate_with_token_protection(text1, "fr"))

text2 = "For <strong1>WebAssembly</strong1> - For near-native PDF processing performance"
print("Token-Protected HTML es:", translate_with_token_protection(text2, "es"))
print("Token-Protected HTML fr:", translate_with_token_protection(text2, "fr"))

text3 = "Will create {pdfCount} PDF file(s), packaged as a ZIP archive."
print("Token-Protected ZIP es:", translate_with_token_protection(text3, "es"))
print("Token-Protected ZIP fr:", translate_with_token_protection(text3, "fr"))
