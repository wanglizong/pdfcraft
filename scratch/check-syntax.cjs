const fs = require('fs');

const filePath = 'd:\\NextProject\\pdfcraft\\scratch\\i18n-builder-extended.cjs';
const content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');

console.log("Lines 1600 to 1690:");
for (let i = 1600; i < Math.min(lines.length, 1690); i++) {
  console.log(`${i}: ${lines[i]}`);
}
