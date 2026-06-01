const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const SCRATCH_DIR = 'd:\\NextProject\\pdfcraft\\scratch';
const languages = ['zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

// 获取嵌套对象的所有叶子节点
function getKeys(obj, prefix = '') {
  let keys = {};
  for (let key in obj) {
    const val = obj[key];
    const newPrefix = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
      // 检查这是否是一个被错误拆分的字符串对象
      // 如果所有的 key 都是数字，说明可能是个被拆分的字符串
      const keysOfVal = Object.keys(val);
      const isSplitString = keysOfVal.length > 0 && keysOfVal.every(k => !isNaN(Number(k)));
      
      if (isSplitString) {
        // 尝试恢复它
        try {
          const sortedChars = keysOfVal
            .sort((a, b) => Number(a) - Number(b))
            .map(k => val[k])
            .join('');
          keys[newPrefix] = sortedChars;
        } catch (e) {
          keys[newPrefix] = val; // 留待后处理
        }
      } else {
        Object.assign(keys, getKeys(val, newPrefix));
      }
    } else {
      keys[newPrefix] = val;
    }
  }
  return keys;
}

// unflatten: 将扁平化 key 恢复为嵌套对象
function unflatten(flatObj) {
  const result = {};
  for (const path in flatObj) {
    const keys = path.split('.');
    let current = result;
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if (i === keys.length - 1) {
        current[key] = flatObj[path];
      } else {
        if (!current[key] || typeof current[key] !== 'object' || Array.isArray(current[key])) {
          current[key] = {};
        }
        current = current[key];
      }
    }
  }
  return result;
}

const enPath = path.join(MESSAGES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = getKeys(enData);
const enKeysSet = new Set(Object.keys(enKeys));

console.log(`=== STARTING NORMALIZE & RECOVER ===`);
console.log(`English base file loaded. leaf keys: ${enKeysSet.size}`);

languages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) {
    console.log(`[${lang}] File does not exist, creating from template...`);
    // 直接用 en.json 作为基础
    fs.writeFileSync(langPath, JSON.stringify(enData, null, 2), 'utf8');
    return;
  }
  
  let rawData;
  try {
    rawData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  } catch (e) {
    console.error(`[${lang}] Failed to parse JSON: ${e.message}. Using template...`);
    rawData = {};
  }
  
  const parsedKeys = getKeys(rawData);
  const normalizedFlat = {};
  
  let recoveredCount = 0;
  let missingCount = 0;
  let redundantCount = 0;
  
  // 以 en.json 的 keys 为准进行重构
  enKeysSet.forEach(k => {
    const enVal = enKeys[k];
    const rawVal = parsedKeys[k];
    
    if (rawVal === undefined) {
      // 缺失值，填补英文 fallback
      normalizedFlat[k] = enVal;
      missingCount++;
    } else if (typeof rawVal === 'object' && rawVal !== null) {
      // 仍然是对象（未能自动在 getKeys 里恢复，或者是一个嵌套结构），强制拼接
      try {
        const keysOfVal = Object.keys(rawVal);
        const sortedChars = keysOfVal
          .sort((a, b) => Number(a) - Number(b))
          .map(charKey => rawVal[charKey])
          .join('');
        normalizedFlat[k] = sortedChars;
        recoveredCount++;
      } catch (e) {
        normalizedFlat[k] = enVal; // 恢复失败，fallback
        missingCount++;
      }
    } else {
      // 正常字符串
      normalizedFlat[k] = rawVal;
    }
  });
  
  // 检查冗余 key
  Object.keys(parsedKeys).forEach(k => {
    if (!enKeysSet.has(k)) {
      redundantCount++;
    }
  });
  
  // 还原为嵌套对象并保存
  const nestedResult = unflatten(normalizedFlat);
  
  fs.writeFileSync(langPath, JSON.stringify(nestedResult, null, 2), 'utf8');
  
  console.log(`[${lang}] Normalized successfully:`);
  console.log(`  - Recovered character-split keys: ${recoveredCount}`);
  console.log(`  - Missing (filled with English fallback): ${missingCount}`);
  console.log(`  - Redundant keys dropped: ${redundantCount}`);
  console.log(`  - Total final keys: ${Object.keys(normalizedFlat).length}`);
});

console.log(`=== NORMALIZE COMPLETED ===`);
