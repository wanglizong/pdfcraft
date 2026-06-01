const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';

function setDeepValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object' || Array.isArray(current[part])) {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

// Ensure args
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("Usage: node import-json-translations.cjs <path-to-translated-messages.json>");
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found at ${inputPath}`);
  process.exit(1);
}

const importData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log("=== IMPORTING JSON TRANSLATIONS ===");

// Expected input format:
// {
//   "ja": { "common.buttons.edit": "編集", ... },
//   "ko": { ... }
// }
Object.entries(importData).forEach(([lang, translations]) => {
  const targetPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(targetPath)) {
    console.warn(`Target file ${targetPath} does not exist. Skipping...`);
    return;
  }
  
  let targetJson = {};
  try {
    targetJson = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
  } catch (err) {
    console.error(`Error parsing existing JSON for ${lang}:`, err.message);
  }
  
  let mergedCount = 0;
  Object.entries(translations).forEach(([keyPath, val]) => {
    setDeepValue(targetJson, keyPath, val);
    mergedCount++;
  });
  
  // Write back formatted json
  fs.writeFileSync(targetPath, JSON.stringify(targetJson, null, 2), 'utf8');
  console.log(`Language [${lang}]: Successfully imported and merged ${mergedCount} translation keys.`);
});

console.log("=== IMPORT COMPLETE ===");
