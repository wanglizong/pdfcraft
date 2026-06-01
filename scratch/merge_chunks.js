import fs from 'fs';
import path from 'path';

const dir = 'd:/NextProject/pdfcraft/scratch';
const languages = ['id', 'ro', 'vi', 'ar'];

const merged = {
  id: {},
  ro: {},
  vi: {},
  ar: {}
};

for (let i = 0; i < 8; i++) {
  const filePath = path.join(dir, `trans_chk_${i}.json`);
  const content = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(content);
  for (const lang of languages) {
    if (data[lang]) {
      Object.assign(merged[lang], data[lang]);
    }
  }
}

// Verify count
const counts = {};
for (const lang of languages) {
  counts[lang] = Object.keys(merged[lang]).length;
}
console.log('Merged Key Counts:', counts);

const outPath = path.join(dir, 'translated-messages-chunk3-partC.json');
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
console.log('Successfully saved to:', outPath);
