const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';

const languages = ['zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'vi', 'ar']; // ro falls back to en in config, but has json file

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
    'cny (\u4eba\u6c11\u5e01)', 'usd (\u7f8e\u5143)', 'eur (\u6b27\u5143)', 'jpy (\u65e5\u5143)', 'pdfcraft'
  ]);
  if (skipWords.has(val.toLowerCase().trim())) return false;
  
  // Check if it's a variables placeholder string like "{rate}" or "{count}" only
  if (val.trim().startsWith('{') && val.trim().endsWith('}') && !val.includes(' ')) return false;
  
  return true;
}

// 1. Analyze JSON Messages
const enJsonPath = path.join(MESSAGES_DIR, 'en.json');
const enJson = JSON.parse(fs.readFileSync(enJsonPath, 'utf8'));
const enJsonKeys = getKeys(enJson);

const zhJsonPath = path.join(MESSAGES_DIR, 'zh.json');
const zhJson = JSON.parse(fs.readFileSync(zhJsonPath, 'utf8'));
const zhJsonKeys = getKeys(zhJson);

const untranslatedMessages = {};

// We also check ro for json
const jsonLanguages = ['zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

jsonLanguages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  const langJson = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = getKeys(langJson);
  
  untranslatedMessages[lang] = [];
  
  Object.keys(enJsonKeys).forEach(k => {
    const enVal = enJsonKeys[k];
    const langVal = langKeys[k];
    const zhVal = zhJsonKeys[k] || '';
    
    if (langVal === undefined) {
      untranslatedMessages[lang].push({ key: k, en: enVal, zh: zhVal, reason: 'missing_key' });
      return;
    }
    
    // For zh-TW, we check if it has simplified Chinese characters compared to a traditionalized version
    // Actually we can skip zh-TW for now or handle it separately because zh-TW is mostly complete and just traditional Chinese.
    if (lang === 'zh-TW') {
      return; 
    }
    
    // Check if fallback to English
    const isEnglishFallback = langVal === enVal && shouldTranslate(enVal, k);
    
    // Check if it contains Chinese in non-Chinese-friendly languages (excluding ja)
    const hasChinese = lang !== 'ja' && /[\u4e00-\u9fa5]/.test(langVal);
    
    if (isEnglishFallback || hasChinese) {
      untranslatedMessages[lang].push({
        key: k,
        en: enVal,
        zh: zhVal,
        current: langVal,
        reason: isEnglishFallback ? 'english_fallback' : 'chinese_residue'
      });
    }
  });
});

// 2. Analyze tool-content TS files
function extractToolContentMap(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, 'utf8');
  
  // We can evaluate or parse the tool content. Since it is written in TS/JS format, we can parse it roughly.
  // Actually, since these are exported as ES Modules, we can convert export to module.exports temporarily and require it in a sandbox.
  // Or we can just run node with a simple wrapper. Let's do that!
  // We can compile TS using a small ts-node script or simply read the structure.
  // To keep it simple and robust, let's write a temporary JS script that runs ts-node to parse all tool contents.
}

// Write the JSON report for messages
const reportPath = 'd:\\NextProject\\pdfcraft\\scratch\\untranslated-messages-report.json';
fs.writeFileSync(reportPath, JSON.stringify(untranslatedMessages, null, 2), 'utf8');

console.log("=== JSON Messages Analysis ===");
Object.keys(untranslatedMessages).forEach(lang => {
  console.log(`  - [${lang}]: ${untranslatedMessages[lang].length} untranslated messages.`);
});
console.log(`Saved report to ${reportPath}`);
