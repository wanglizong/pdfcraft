const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

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
  // If it doesn't contain any English letter, no need to translate (likely numbers or symbols)
  if (!/[a-zA-Z]/.test(val)) return false;
  
  // Exclude brief uppercase words (likely standard acronyms)
  const uppercaseWordsOnly = /^[A-Z0-9\s_\-\.\:\(\)\,\/\|\+\&]+$/;
  if (uppercaseWordsOnly.test(val) && val.length < 15) return false;
  
  // Specific skip words
  const skipWords = new Set([
    'pdf', 'dpi', 'cad', 'rgb', 'sha-256', 'tsa', 'rfc 3161', 'cny', 'usd', 'eur', 'jpy', 'zip', 'png', 'jpg', 'jpeg', 'svg',
    'outline', 'helvetica', 'noto sans sc', 'cni', 'pki', 'comodo', 'ssl.com', 'freetsa.org', 'digicert tsa', 'mesign tsa', 'sectigo tsa',
    'cny (chinese yuan)', 'usd (us dollar)', 'eur (euro)', 'jpy (japanese yen)',
    'cny (\u4eba\u6c11\u5e01)', 'usd (\u7f8e\u5143)', 'eur (\u6b27\u5143)', 'jpy (\u65e5\u5143)'
  ]);
  if (skipWords.has(val.toLowerCase().trim())) return false;
  
  // Check if it's a variables placeholder string like "{rate}" or "{count}" only
  if (val.trim().startsWith('{') && val.trim().endsWith('}') && !val.includes(' ')) return false;
  
  return true;
}

const enPath = path.join(MESSAGES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = getKeys(enData);
const enKeysSet = new Set(Object.keys(enKeys));

const zhPath = path.join(MESSAGES_DIR, 'zh.json');
const zhData = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
const zhKeys = getKeys(zhData);

console.log("=== COUNT PENDING TRANSLATIONS ===");
languages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = getKeys(langData);
  
  let toTranslate = 0;
  let sample = [];
  
  enKeysSet.forEach(k => {
    const enVal = enKeys[k];
    const langVal = langKeys[k];
    
    // It's untranslated if:
    // 1. Value is same as english (for non-zh languages) AND shouldTranslate is true
    // 2. Or if value contains Chinese characters (for non-zh languages)
    const isFallback = langVal === enVal && shouldTranslate(enVal, k);
    const containsChinese = langVal && /[\u4e00-\u9fa5]/.test(langVal);
    
    if (isFallback || containsChinese) {
      toTranslate++;
      if (sample.length < 5) {
        sample.push({ key: k, en: enVal, current: langVal, reason: isFallback ? 'fallback' : 'contains_chinese' });
      }
    }
  });
  
  console.log(`Language [${lang}]: ${toTranslate} keys need translation.`);
  if (sample.length > 0) {
    console.log("  Samples:");
    sample.forEach(s => {
      console.log(`    - ${s.key}: EN="${s.en}" | Current="${s.current}" (${s.reason})`);
    });
  }
});
