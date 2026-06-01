const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';

// Parse en.ts and zh.ts to memory objects using the evaluation method
function loadToolContent(lang) {
  const filePath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  if (!fs.existsSync(filePath)) return {};
  const content = fs.readFileSync(filePath, 'utf8');
  
  const varMap = {
    'en': 'toolContentEn',
    'zh': 'toolContentZh'
  };
  const varName = varMap[lang];
  const startIndex = content.indexOf(`${varName}:`);
  if (startIndex === -1) return {};
  const braceIndex = content.indexOf('{', startIndex);
  if (braceIndex === -1) return {};
  const objectString = content.substring(braceIndex);
  try {
    return new Function(`return ${objectString}`)();
  } catch (err) {
    console.error(`Failed to parse ${lang}.ts:`, err.message);
    return {};
  }
}

const enContent = loadToolContent('en');
const zhContent = loadToolContent('zh');

const missingReport = JSON.parse(fs.readFileSync('d:\\NextProject\\pdfcraft\\scratch\\missing-tool-contents.json', 'utf8'));

const pendingTranslations = {};

Object.entries(missingReport).forEach(([lang, missingIds]) => {
  if (missingIds.length === 0) return;
  pendingTranslations[lang] = {};
  
  missingIds.forEach(id => {
    pendingTranslations[lang][id] = {
      en: enContent[id] || null,
      zh: zhContent[id] || null
    };
  });
});

fs.writeFileSync('d:\\NextProject\\pdfcraft\\scratch\\pending-tool-contents.json', JSON.stringify(pendingTranslations, null, 2), 'utf8');
console.log("Successfully extracted pending tool contents to scratch/pending-tool-contents.json");

// Output total count
let totalCount = 0;
Object.entries(pendingTranslations).forEach(([lang, tools]) => {
  const count = Object.keys(tools).length;
  totalCount += count;
  console.log(`Language [${lang}]: ${count} tools pending translation.`);
});
console.log(`Total tool-content items to translate: ${totalCount}`);
