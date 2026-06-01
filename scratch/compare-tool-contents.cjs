const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';
const languages = ['zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'vi', 'ar']; // ro doesn't have a .ts file, falls back to en

function extractToolIds(filePath) {
  if (!fs.existsSync(filePath)) return new Set();
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Use regex to find tool IDs which are keys inside the main export object
  // Keys look like: 'pdf-multi-tool': { or "pdf-multi-tool": { or 'pdf-multi-tool':{
  const regex = /['"]([^'"]+)['"]\s*:\s*\{/g;
  const ids = new Set();
  let match;
  while ((match = regex.exec(content)) !== null) {
    // Exclude sub-objects like step/faq/useCase properties
    const id = match[1];
    if (id !== 'howToUse' && id !== 'useCases' && id !== 'faq' && id !== 'step') {
      ids.add(id);
    }
  }
  return ids;
}

const enPath = path.join(TOOL_CONTENT_DIR, 'en.ts');
const enIds = extractToolIds(enPath);

console.log(`English (en.ts) has ${enIds.size} tools defined.`);

languages.forEach(lang => {
  const filePath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  const ids = extractToolIds(filePath);
  
  const missing = [...enIds].filter(id => !ids.has(id));
  const extra = [...ids].filter(id => !enIds.has(id));
  
  console.log(`Language [${lang}]:`);
  console.log(`  - Total tools: ${ids.size}`);
  console.log(`  - Missing tools: ${missing.length}`);
  if (missing.length > 0) {
    console.log(`    Missing IDs: ${missing.join(', ')}`);
  }
});
