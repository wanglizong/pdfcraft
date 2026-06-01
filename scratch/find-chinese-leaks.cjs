const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

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

console.log("=== SCANNING CHINESE LEAKS IN TARGET LANGUAGES ===");

languages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  const langKeys = getKeys(langData);
  
  let leaks = [];
  Object.entries(langKeys).forEach(([k, val]) => {
    if (typeof val === 'string' && /[\u4e00-\u9fa5]/.test(val)) {
      leaks.push({ key: k, value: val });
    }
  });
  
  if (leaks.length > 0) {
    console.log(`Language [${lang}]: Found ${leaks.length} leaks containing Chinese characters:`);
    leaks.forEach(l => {
      console.log(`  - ${l.key}: "${l.value}"`);
    });
  } else {
    console.log(`Language [${lang}]: 0 Chinese leaks. Clean!`);
  }
});
