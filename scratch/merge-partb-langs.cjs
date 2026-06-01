const fs = require('fs');
const path = require('path');

const dir = 'd:/NextProject/pdfcraft/scratch';
const languages = ['es', 'fr', 'pt', 'it'];
const merged = {};

for (const lang of languages) {
  const filePath = path.join(dir, `translated-messages-chunk3-partB-${lang}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    merged[lang] = data;
    console.log(`Loaded ${lang}: ${Object.keys(data).length} keys.`);
  } else {
    console.error(`Missing file for ${lang}`);
  }
}

const outPath = path.join(dir, 'translated-messages-chunk3-partB.json');
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Successfully merged all Part B languages to:', outPath);
