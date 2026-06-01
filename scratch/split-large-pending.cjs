const fs = require('fs');

function splitFile(lang, partSize) {
  const filePath = `d:\\NextProject\\pdfcraft\\scratch\\pending-tool-content-${lang}.json`;
  if (!fs.existsSync(filePath)) return;
  
  const tools = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const entries = Object.entries(tools);
  
  const part1 = {};
  const part2 = {};
  
  entries.forEach(([id, val], idx) => {
    if (idx < partSize) {
      part1[id] = val;
    } else {
      part2[id] = val;
    }
  });
  
  fs.writeFileSync(`d:\\NextProject\\pdfcraft\\scratch\\pending-tool-content-${lang}-part1.json`, JSON.stringify(part1, null, 2), 'utf8');
  fs.writeFileSync(`d:\\NextProject\\pdfcraft\\scratch\\pending-tool-content-${lang}-part2.json`, JSON.stringify(part2, null, 2), 'utf8');
  console.log(`Split ${lang} into part1 (${Object.keys(part1).length}) and part2 (${Object.keys(part2).length}).`);
}

splitFile('ko', 22);
splitFile('pt', 26);
splitFile('de', 15);
