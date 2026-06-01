const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';
const languages = ['ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

console.log("=== SCANNING CHINESE LEAKS IN TS CONFIGS ===");

languages.forEach(lang => {
  const langPath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  if (!fs.existsSync(langPath)) {
    console.log(`Language [${lang}]: File does not exist.`);
    return;
  }
  
  const content = fs.readFileSync(langPath, 'utf8');
  const lines = content.split('\n');
  let leaks = [];
  
  lines.forEach((line, idx) => {
    // Skip comments and console
    let cleanLine = line;
    if (cleanLine.includes('//')) {
      cleanLine = cleanLine.split('//')[0];
    }
    if (cleanLine.includes('/*') || cleanLine.includes('*/') || cleanLine.includes('*')) {
      // Basic block comment check
      cleanLine = '';
    }
    
    if (/[\u4e00-\u9fa5]/.test(cleanLine)) {
      leaks.push({ line: idx + 1, text: line.trim() });
    }
  });
  
  if (leaks.length > 0) {
    console.log(`Language [${lang}]: Found ${leaks.length} potential leaks containing Chinese characters:`);
    leaks.forEach(l => {
      console.log(`  Line ${l.line}: "${l.text}"`);
    });
  } else {
    console.log(`Language [${lang}]: 0 Chinese leaks. Clean!`);
  }
});
