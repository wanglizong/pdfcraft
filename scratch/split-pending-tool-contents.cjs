const fs = require('fs');
const path = require('path');

const filePath = 'd:\\NextProject\\pdfcraft\\scratch\\pending-tool-contents.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

Object.entries(data).forEach(([lang, tools]) => {
  const outPath = `d:\\NextProject\\pdfcraft\\scratch\\pending-tool-content-${lang}.json`;
  fs.writeFileSync(outPath, JSON.stringify(tools, null, 2), 'utf8');
  console.log(`Saved ${outPath} containing ${Object.keys(tools).length} tools.`);
});
