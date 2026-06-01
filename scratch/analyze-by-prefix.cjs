const fs = require('fs');
const path = require('path');

const report = JSON.parse(fs.readFileSync('d:\\NextProject\\pdfcraft\\scratch\\untranslated-messages-report.json', 'utf8'));

const prefixCount = {};

Object.keys(report).forEach(lang => {
  const list = report[lang];
  list.forEach(item => {
    const parts = item.key.split('.');
    const prefix = parts.slice(0, 2).join('.');
    prefixCount[prefix] = (prefixCount[prefix] || 0) + 1;
  });
});

const sorted = Object.entries(prefixCount).sort((a, b) => b[1] - a[1]);

console.log("=== Untranslated Keys Prefix Counts ===");
sorted.slice(0, 30).forEach(([prefix, count]) => {
  console.log(`  - ${prefix}: ${count} references across all languages`);
});
