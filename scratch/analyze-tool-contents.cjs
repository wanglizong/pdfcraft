const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';
const languages = ['en', 'zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ar', 'vi'];

console.log("=== ANALYZING TOOL CONTENT TRANSLATIONS ===");

// Helper to extract tool IDs from a .ts file
function getToolIds(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /['"]([a-zA-Z0-9-]+)['"]\s*:\s*\{/g;
  const ids = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    // Exclude imports/types if any match
    if (match[1] !== 'Record' && match[1] !== 'ToolContent') {
      ids.add(match[1]);
    }
  }
  return ids;
}

const enPath = path.join(TOOL_CONTENT_DIR, 'en.ts');
const enIds = getToolIds(enPath);
console.log(`English (en.ts) has ${enIds.size} tools defined.`);

languages.forEach(lang => {
  if (lang === 'en') return;
  const langPath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  const langIds = getToolIds(langPath);
  
  const missing = [];
  enIds.forEach(id => {
    if (!langIds.has(id)) {
      missing.push(id);
    }
  });
  
  console.log(`Language [${lang}]: Total=${langIds.size}, Missing count=${missing.length}`);
  if (missing.length > 0 && ['ja', 'ko', 'zh-TW'].includes(lang)) {
    console.log(`  - Missing: ${missing.join(', ')}`);
  }
});
