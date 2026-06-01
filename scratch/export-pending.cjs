const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const SCRATCH_DIR = 'd:\\NextProject\\pdfcraft\\scratch';
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

function shouldTranslate(val, key) {
  if (typeof val !== 'string') return false;
  // 如果不包含英文字母，不需要翻译
  if (!/[a-zA-Z]/.test(val)) return false;
  
  // 排除一些特定的纯技术缩写或数字加单位等
  const techTerms = [
    'pdf', 'dpi', 'cad', 'rgb', 'sha-256', 'sha256', 'tsa', 'rfc 3161', 
    'pdf/a', 'url', 'html', 'css', 'js', 'json', 'xml', 'csv', 'svg', 
    'png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff', 'epub', 'mobi', 'docx', 
    'xlsx', 'pptx', 'txt', 'rtf', 'zip', 'rar', '7z', 'tar', 'gz',
    'b', 'kb', 'mb', 'gb', 'tb'
  ];
  
  const trimmed = val.trim().toLowerCase();
  if (techTerms.includes(trimmed)) return false;
  
  // 排除纯占位符，如 "{value}" 或 "{count}"
  if (/^\{[a-zA-Z0-9_]+\}$/.test(trimmed)) return false;
  
  return true;
}

const enPath = path.join(MESSAGES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = getKeys(enData);
const enKeysSet = new Set(Object.keys(enKeys));

console.log(`English base file loaded. Total keys: ${enKeysSet.size}`);

// 用于汇总所有语言待翻译条目的对象
// 格式: { key: { en: "english text", zh: "chinese text" (if available/needed), de: "", ja: "", ... } }
const pendingTranslations = {};

languages.forEach(lang => {
  if (lang === 'en') return;
  
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  let langKeys = {};
  if (fs.existsSync(langPath)) {
    try {
      const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
      langKeys = getKeys(langData);
    } catch (e) {
      console.error(`Error parsing ${langPath}:`, e.message);
    }
  }
  
  const langKeysSet = new Set(Object.keys(langKeys));
  let countMissing = 0;
  let countFallback = 0;
  
  enKeysSet.forEach(k => {
    const enVal = enKeys[k];
    const hasKey = langKeysSet.has(k);
    const langVal = hasKey ? langKeys[k] : null;
    
    let needsTranslation = false;
    
    if (!hasKey) {
      needsTranslation = shouldTranslate(enVal, k);
      if (needsTranslation) countMissing++;
    } else {
      // 如果和英文完全一样，且符合翻译规则，且该语言不是英文本身
      if (langVal === enVal && shouldTranslate(enVal, k)) {
        needsTranslation = true;
        countFallback++;
      }
    }
    
    if (needsTranslation) {
      if (!pendingTranslations[k]) {
        pendingTranslations[k] = {
          en: enVal
        };
      }
      pendingTranslations[k][lang] = ''; // 标记该语言需要翻译这个key
    }
  });
  
  console.log(`Language [${lang}]: Missing requiring translation: ${countMissing}, Fallbacks requiring translation: ${countFallback}`);
});

const pendingKeys = Object.keys(pendingTranslations);
console.log(`Total unique keys needing translation across all languages: ${pendingKeys.length}`);

// 写入本地的 pending 汇总 JSON 文件
const outputPath = path.join(SCRATCH_DIR, 'pending-all.json');
fs.writeFileSync(outputPath, JSON.stringify(pendingTranslations, null, 2), 'utf8');
console.log(`Exported all pending translations to ${outputPath}`);
