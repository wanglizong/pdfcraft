const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';

function getKeys(obj, prefix = '') {
  let keys = {};
  for (let key in obj) {
    const val = obj[key];
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      Object.assign(keys, getKeys(val, newPrefix));
    } else {
      keys[newPrefix] = val;
    }
  }
  return keys;
}

function shouldTranslate(val, keyPath) {
  if (typeof val !== 'string') return false;
  if (!/[a-zA-Z]/.test(val)) return false;
  const uppercaseWordsOnly = /^[A-Z0-9\s_\-\.\:\(\)\,\/\|\+\&]+$/;
  if (uppercaseWordsOnly.test(val) && val.length < 15) return false;
  const skipWords = new Set([
    'pdf', 'dpi', 'cad', 'rgb', 'sha-256', 'tsa', 'rfc 3161', 'cny', 'usd', 'eur', 'jpy', 'zip', 'png', 'jpg', 'jpeg', 'svg',
    'outline', 'helvetica', 'noto sans sc', 'cni', 'pki', 'comodo', 'ssl.com', 'freetsa.org', 'digicert tsa', 'mesign tsa', 'sectigo tsa',
    'cny (chinese yuan)', 'usd (us dollar)', 'eur (euro)', 'jpy (japanese yen)',
    'cny (\u4eba\u6c11\u5e01)', 'usd (\u7f8e\u5143)', 'eur (\u6b27\u5143)', 'jpy (\u65e5\u5143)', 'pdfcraft'
  ]);
  if (skipWords.has(val.toLowerCase().trim())) return false;
  if (val.trim().startsWith('{') && val.trim().endsWith('}') && !val.includes(' ')) return false;
  return true;
}

const enJsonPath = path.join(MESSAGES_DIR, 'en.json');
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const enKeys = getKeys(enJson);

const zhJsonPath = path.join(MESSAGES_DIR, 'zh.json');
const zhJson = JSON.parse(fs.readFileSync(zhJsonPath, 'utf8'));
const zhKeys = getKeys(zhJson);

// We want to find out for all non-zh, non-en languages, which keys are actually fallback in at least one language.
const languages = ['ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

const fallbackKeys = new Set();
const fallbackKeysList = [];

languages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  const langJson = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = getKeys(langJson);
  
  Object.keys(enKeys).forEach(k => {
    const enVal = enKeys[k];
    const langVal = langKeys[k];
    
    if (langVal === enVal && shouldTranslate(enVal, k)) {
      fallbackKeys.add(k);
    }
  });
});

console.log(`There are ${fallbackKeys.size} distinct keys that are untranslated in at least one language.`);

const uniqueEnglishValues = new Set();
const keyToEnAndZh = {};

fallbackKeys.forEach(k => {
  const enVal = enKeys[k];
  const zhVal = zhKeys[k] || '';
  uniqueEnglishValues.add(enVal);
  keyToEnAndZh[k] = { en: enVal, zh: zhVal };
});

console.log(`There are ${uniqueEnglishValues.size} unique English values among these keys.`);

// Save key mapping to a scratch file
fs.writeFileSync('d:\\NextProject\\pdfcraft\\scratch\\pending-translations-map.json', JSON.stringify(keyToEnAndZh, null, 2), 'utf8');
console.log("Saved pending translations mapping to scratch/pending-translations-map.json");
