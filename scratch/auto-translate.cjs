const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

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

function setDeepValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part]) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
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

async function translateSingle(text, googleLang) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${googleLang}&dt=t&q=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return text;
    const json = await res.json();
    if (json && json[0] && json[0][0]) {
      return json[0].map(item => item[0]).join('').trim();
    }
  } catch (err) {
    console.error(`Single translation error for "${text}":`, err);
  }
  return text;
}

async function translateBatch(texts, targetLang) {
  if (texts.length === 0) return [];
  const delimiter = "\n---\n";
  const queryText = texts.join(delimiter);
  
  let googleLang = targetLang;
  if (targetLang === 'zh') googleLang = 'zh-CN';
  if (targetLang === 'zh-TW') googleLang = 'zh-TW';
  
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${googleLang}&dt=t&q=${encodeURIComponent(queryText)}`;
  
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const json = await res.json();
    
    let fullTranslation = '';
    if (json && json[0]) {
      fullTranslation = json[0].map(item => item[0]).join('');
    }
    
    const translatedArray = fullTranslation.split(/\n\s*---\s*\n/i).map(s => s.trim());
    
    if (translatedArray.length !== texts.length) {
      console.warn(`[Warning] Mismatch in batch size for ${targetLang}. Expected ${texts.length}, got ${translatedArray.length}. Falling back to single queries.`);
      const results = [];
      for (const t of texts) {
        results.push(await translateSingle(t, googleLang));
      }
      return results;
    }
    return translatedArray;
  } catch (err) {
    console.warn(`[Warning] Batch translation failed: ${err.message}. Using single fallback...`);
    const results = [];
    for (const t of texts) {
      results.push(await translateSingle(t, googleLang));
    }
    return results;
  }
}

async function startTranslation() {
  console.log("=== STARTING DYNAMIC AUTO-TRANSLATION ===");
  
  // Load english keys
  const enPath = path.join(MESSAGES_DIR, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enKeys = getKeys(enData);
  const enKeysList = Object.keys(enKeys);
  
  // Limit of keys to translate per run per language to prevent API abuse
  const LIMIT_PER_LANG = 150;
  
  for (const lang of languages) {
    const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
    if (!fs.existsSync(langPath)) continue;
    
    const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
    const langKeys = getKeys(langData);
    
    // Identify keys needing translation
    const keysToTranslate = [];
    for (const key of enKeysList) {
      const enVal = enKeys[key];
      const langVal = langKeys[key];
      
      const isMissing = langVal === undefined;
      const isFallback = lang !== 'zh' && lang !== 'zh-TW' && langVal === enVal;
      
      if ((isMissing || isFallback) && shouldTranslate(enVal, key)) {
        keysToTranslate.push({ key, text: enVal });
      }
    }
    
    if (keysToTranslate.length === 0) {
      console.log(`Language [${lang}]: 100% complete! No keys need translation.`);
      continue;
    }
    
    console.log(`Language [${lang}]: Found ${keysToTranslate.length} keys needing translation. Translating top ${Math.min(LIMIT_PER_LANG, keysToTranslate.length)}...`);
    
    const batchList = keysToTranslate.slice(0, LIMIT_PER_LANG);
    
    // Process in smaller sub-batches of 25 to protect rate limit
    const SUB_BATCH_SIZE = 25;
    let successCount = 0;
    
    for (let i = 0; i < batchList.length; i += SUB_BATCH_SIZE) {
      const subBatch = batchList.slice(i, i + SUB_BATCH_SIZE);
      const textsToTranslate = subBatch.map(item => item.text);
      
      console.log(`  Translating sub-batch ${Math.floor(i / SUB_BATCH_SIZE) + 1} (${subBatch.length} items)...`);
      const translatedTexts = await translateBatch(textsToTranslate, lang);
      
      for (let j = 0; j < subBatch.length; j++) {
        const item = subBatch[j];
        const translatedVal = translatedTexts[j];
        setDeepValue(langData, item.key, translatedVal);
        successCount++;
      }
      
      // Delay between sub-batches
      await new Promise(r => setTimeout(r, 1500));
    }
    
    // Write back immediately
    fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
    console.log(`Language [${lang}]: Successfully translated and saved ${successCount} keys.`);
  }
  
  console.log("=== TRANSLATION RUN COMPLETED ===");
}

startTranslation();
