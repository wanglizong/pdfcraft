const fs = require('fs');
const path = require('path');

const TOOLS_DIR = 'd:\\NextProject\\pdfcraft\\src\\components\\tools';
const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';

const recentTools = [
  'eink-optimizer',
  'pdf-page-resizer-uniform',
  'pdf-spine-bookbinder',
  'pdf-lossless-slicer',
  'compress',
  'find-and-redact',
  'n-up',
  'compare-pdfs',
  'edit-pdf',
  'rotate',
  'timestamp',
  'vector-extractor'
];

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

// 递归查找目录下的所有 .tsx / .ts 文件
function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(filePath);
    }
  });
  return results;
}

const allUsedKeys = new Set();

recentTools.forEach(tool => {
  const toolDir = path.join(TOOLS_DIR, tool);
  if (!fs.existsSync(toolDir)) return;
  
  const files = getFiles(toolDir);
  files.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    
    // 匹配 t('some.key') 或 t("some.key")
    const regex = /t\(\s*['"]([^'"]+)['"]/g;
    let match;
    while ((match = regex.exec(content)) !== null) {
      allUsedKeys.add(match[1]);
    }
  });
});

console.log(`=== SCANNING KEYS USED IN RECENT 12 TOOLS ===`);
console.log(`Found ${allUsedKeys.size} unique keys referenced in code:`);
console.log(Array.from(allUsedKeys).sort());

// 加载 en.json 查阅具体英文值
const enPath = path.join(MESSAGES_DIR, 'en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const enKeys = getKeys(enData);

const keysInfo = [];
allUsedKeys.forEach(k => {
  // 由于 next-intl 的 useTranslations('namespace') 可能会改变 key 的前缀，
  // 我们需要寻找最匹配的 en key
  // 例如，如果组件里用了 useTranslations('common.einkOptimizer') 并且 t('title')
  // 则实际对应的 key 是 common.einkOptimizer.title
  // 我们也需要扫码 useTranslations('...') 的 namespace
  // 不过我们可以直接检查 enKeys 中是否直接存在该 key，或者模糊匹配。
  if (enKeys[k]) {
    keysInfo.push({ key: k, value: enKeys[k] });
  } else {
    // 寻找以它结尾的 key，或者包含它的 key
    const matches = Object.keys(enKeys).filter(ek => ek.endsWith('.' + k) || ek === k);
    if (matches.length > 0) {
      matches.forEach(m => {
        keysInfo.push({ key: m, value: enKeys[m] });
      });
    }
  }
});

console.log(`\nMatched ${keysInfo.length} physical keys in en.json:`);
fs.writeFileSync('d:\\NextProject\\pdfcraft\\scratch\\recent-tools-keys.json', JSON.stringify(keysInfo, null, 2), 'utf8');
console.log(`Saved to scratch/recent-tools-keys.json`);
