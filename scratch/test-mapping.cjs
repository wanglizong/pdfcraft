const fs = require('fs');
const path = require('path');

const builderPath = 'd:\\NextProject\\pdfcraft\\scratch\\i18n-builder-extended.cjs';
let builderContent = fs.readFileSync(builderPath, 'utf8');

if (!builderContent.includes('module.exports =')) {
  fs.writeFileSync(builderPath, builderContent + '\nmodule.exports = { translations };\n', 'utf8');
}

const { translations } = require('./i18n-builder-extended.cjs');

fs.writeFileSync(builderPath, builderContent, 'utf8');

const zh = translations.zh;
console.log('Successfully loaded translations. Number of tools:', Object.keys(zh).length);

const stringMap = {};
for (const tool of Object.keys(zh)) {
  for (const key of Object.keys(zh[tool])) {
    const text = zh[tool][key];
    if (typeof text === 'string') {
      stringMap[text] = { tool, key };
    }
  }
}

console.log('Built mapping. Sample mapping size:', Object.keys(stringMap).length);
fs.writeFileSync('d:\\NextProject\\pdfcraft\\scratch\\mapping.json', JSON.stringify(stringMap, null, 2), 'utf8');
console.log('Saved to scratch/mapping.json');
