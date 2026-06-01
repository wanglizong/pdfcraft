const fs = require('fs');
const list = JSON.parse(fs.readFileSync('d:\\NextProject\\pdfcraft\\scratch\\untranslated-tools-pairs.json', 'utf8'));

console.log("Total entries in untranslated-tools-pairs:", list.length);
console.log("Peeking first 15 entries:");
list.slice(0, 15).forEach((entry, idx) => {
  console.log(`${idx + 1}: en="${entry.en}", zh="${entry.zh}"`);
  console.log(`   Keys:`, entry.keys.slice(0, 3), entry.keys.length > 3 ? `... and ${entry.keys.length - 3} more` : '');
  console.log(`   Langs:`, entry.langs);
});
