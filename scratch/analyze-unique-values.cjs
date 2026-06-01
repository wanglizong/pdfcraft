const fs = require('fs');
const path = require('path');

const SCRATCH_DIR = 'd:\\NextProject\\pdfcraft\\scratch';
const pendingPath = path.join(SCRATCH_DIR, 'pending-all.json');

if (!fs.existsSync(pendingPath)) {
  console.error("pending-all.json does not exist!");
  process.exit(1);
}

const pending = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));

// 聚合唯一的英文值
const valueMap = {}; // value -> { keys: [], langs: Set }

Object.entries(pending).forEach(([key, info]) => {
  const enVal = info.en;
  if (!valueMap[enVal]) {
    valueMap[enVal] = {
      keys: [],
      langs: new Set()
    };
  }
  valueMap[enVal].keys.push(key);
  Object.keys(info).forEach(lang => {
    if (lang !== 'en') {
      valueMap[enVal].langs.add(lang);
    }
  });
});

const sortedValues = Object.entries(valueMap).sort((a, b) => b[1].keys.length - a[1].keys.length);

console.log(`=== ANALYZING PENDING TRANSLATIONS ===`);
console.log(`Total key-language pairs to translate: ${Object.values(pending).reduce((sum, item) => sum + Object.keys(item).length - 1, 0)}`);
console.log(`Total unique English values: ${sortedValues.length}`);

// 打印前20个最常出现的英文文本
console.log(`\nTop 20 most frequent English values:`);
sortedValues.slice(0, 20).forEach(([val, data], i) => {
  console.log(`${i+1}. "${val}" (appears in ${data.keys.length} keys, languages: ${Array.from(data.langs).join(', ')})`);
});

// 保存聚合后的结果，方便我们分组翻译
const exportData = sortedValues.map(([val, data]) => ({
  en: val,
  langs: Array.from(data.langs)
}));

fs.writeFileSync(path.join(SCRATCH_DIR, 'unique-values.json'), JSON.stringify(exportData, null, 2), 'utf8');
console.log(`Saved unique values map to scratch/unique-values.json`);
