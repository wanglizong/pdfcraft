const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';
const languages = ['ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'vi', 'ar']; // We check non-en, non-zh languages. zh and zh-tw are usually complete.

function extractToolIds(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /['"]([^'"]+)['"]\s*:\s*\{/g;
  const ids = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1];
    if (id !== 'howToUse' && id !== 'useCases' && id !== 'faq' && id !== 'step') {
      ids.add(id);
    }
  }
  return ids;
}

const enPath = path.join(TOOL_CONTENT_DIR, 'en.ts');
const enIds = extractToolIds(enPath);

const missingContent = {};

languages.forEach(lang => {
  const filePath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  if (!fs.existsSync(filePath)) {
    missingContent[lang] = [...enIds];
    return;
  }
  const ids = extractToolIds(filePath);
  const missing = [...enIds].filter(id => !ids.has(id));
  missingContent[lang] = missing;
});

fs.writeFileSync('d:\\NextProject\\pdfcraft\\scratch\\missing-tool-contents.json', JSON.stringify(missingContent, null, 2), 'utf8');
console.log("Saved missing tool contents report to scratch/missing-tool-contents.json");

// Output summary
Object.entries(missingContent).forEach(([lang, list]) => {
  console.log(`Language [${lang}]: missing ${list.length} tools`);
});
