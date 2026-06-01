const fs = require('fs');
const path = require('path');

const chunk = process.argv[2];
if (!chunk) {
  console.error("Usage: node merge-parts.cjs <chunk_number>");
  process.exit(1);
}

const dir = 'd:/NextProject/pdfcraft/scratch';
const partAPath = path.join(dir, `translated-messages-chunk${chunk}-partA.json`);
const partBPath = path.join(dir, `translated-messages-chunk${chunk}-partB.json`);
const partCPath = path.join(dir, `translated-messages-chunk${chunk}-partC.json`);

if (!fs.existsSync(partAPath)) {
  console.error(`Error: Part A not found at ${partAPath}`);
  process.exit(1);
}
if (!fs.existsSync(partBPath)) {
  console.error(`Error: Part B not found at ${partBPath}`);
  process.exit(1);
}
if (!fs.existsSync(partCPath)) {
  console.error(`Error: Part C not found at ${partCPath}`);
  process.exit(1);
}

const partA = JSON.parse(fs.readFileSync(partAPath, 'utf8'));
const partB = JSON.parse(fs.readFileSync(partBPath, 'utf8'));
const partC = JSON.parse(fs.readFileSync(partCPath, 'utf8'));

const merged = {
  ...partA,
  ...partB,
  ...partC
};

const outPath = path.join(dir, `translated-messages-chunk${chunk}.json`);
fs.writeFileSync(outPath, JSON.stringify(merged, null, 2), 'utf8');
console.log(`Successfully merged chunk ${chunk} into: ${outPath}`);
