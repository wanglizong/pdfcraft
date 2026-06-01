const fs = require('fs');

const data = JSON.parse(fs.readFileSync('d:\\NextProject\\pdfcraft\\scratch\\pending-translations-map.json', 'utf8'));
const entries = Object.entries(data);

console.log(`Total messages keys to translate: ${entries.length}`);

// We can split them into 4 chunks (around 450 keys per chunk)
const CHUNK_SIZE = 480;
const chunks = [];

for (let i = 0; i < entries.length; i += CHUNK_SIZE) {
  const chunk = {};
  entries.slice(i, i + CHUNK_SIZE).forEach(([k, v]) => {
    chunk[k] = v;
  });
  chunks.push(chunk);
}

chunks.forEach((chunk, idx) => {
  const outPath = `d:\\NextProject\\pdfcraft\\scratch\\pending-messages-chunk${idx + 1}.json`;
  fs.writeFileSync(outPath, JSON.stringify(chunk, null, 2), 'utf8');
  console.log(`Saved chunk ${idx + 1} with ${Object.keys(chunk).length} keys to ${outPath}`);
});
