const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['en', 'zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

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

console.log("=== COMPARING I18N KEYS ===");

const enPath = path.join(MESSAGES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = getKeys(enData);
const enKeysSet = new Set(Object.keys(enKeys));

console.log(`English (en.json) has ${enKeysSet.size} total leaf keys.`);

languages.forEach(lang => {
  if (lang === 'en') return;
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) {
    console.log(`Missing file for ${lang}`);
    return;
  }
  
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = getKeys(langData);
  const langKeysSet = new Set(Object.keys(langKeys));
  
  let missing = [];
  let matchingEnglishFallback = [];
  
  enKeysSet.forEach(k => {
    if (!langKeysSet.has(k)) {
      missing.push(k);
    } else if (lang !== 'zh' && lang !== 'zh-TW' && langKeys[k] === enKeys[k] && typeof enKeys[k] === 'string' && /[a-zA-Z]/.test(enKeys[k])) {
      // If value is identical to English, it might be a fallback copy
      matchingEnglishFallback.push(k);
    }
  });
  
  console.log(`Language [${lang}]:`);
  console.log(`  - Total keys: ${langKeysSet.size}`);
  console.log(`  - Missing keys: ${missing.length}`);
  console.log(`  - English fallbacks (same as en): ${matchingEnglishFallback.length}`);
});
