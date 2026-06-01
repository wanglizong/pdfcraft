const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';

const langToVar = {
  'en': 'toolContentEn',
  'ja': 'toolContentJa',
  'ko': 'toolContentKo',
  'es': 'toolContentEs',
  'fr': 'toolContentFr',
  'de': 'toolContentDe',
  'zh': 'toolContentZh',
  'zh-TW': 'toolContentZhTW',
  'pt': 'toolContentPt',
  'ar': 'toolContentAr',
  'it': 'toolContentIt',
  'id': 'toolContentId',
  'vi': 'toolContentVn'
};

// Check args
const args = process.argv.slice(2);
if (args.length < 1) {
  console.log("Usage: node import-ts-translations.cjs <path-to-translated-tool-contents.json>");
  process.exit(1);
}

const inputPath = path.resolve(args[0]);
if (!fs.existsSync(inputPath)) {
  console.error(`Input file not found at ${inputPath}`);
  process.exit(1);
}

const importData = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

console.log("=== IMPORTING TS TOOL CONTENTS ===");

Object.entries(importData).forEach(([lang, toolsData]) => {
  const filePath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  if (!fs.existsSync(filePath)) {
    console.warn(`Target file ${filePath} does not exist. Skipping...`);
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Locate the export line to parse the object.
  // Example: export const toolContentJa: Record<string, ToolContent> = {
  const varName = langToVar[lang];
  if (!varName) {
    console.warn(`Unknown variable mapping for language: ${lang}. Skipping...`);
    return;
  }
  
  const startIndex = content.indexOf(`${varName}:`);
  if (startIndex === -1) {
    console.error(`Could not find variable ${varName} inside ${filePath}`);
    return;
  }
  
  // Find the opening brace of the object
  const braceIndex = content.indexOf('{', startIndex);
  if (braceIndex === -1) {
    console.error(`Could not find opening brace for ${varName}`);
    return;
  }
  
  const objectString = content.substring(braceIndex);
  
  // Load en.ts contents to resolve reference variables like toolContentEn
  const enFilePath = path.join(TOOL_CONTENT_DIR, 'en.ts');
  let enContent = {};
  if (fs.existsSync(enFilePath)) {
    const enRaw = fs.readFileSync(enFilePath, 'utf8');
    const enStartIndex = enRaw.indexOf('toolContentEn:');
    if (enStartIndex !== -1) {
      const enBraceIndex = enRaw.indexOf('{', enStartIndex);
      if (enBraceIndex !== -1) {
        try {
          enContent = new Function(`return ${enRaw.substring(enBraceIndex)}`)();
        } catch (e) {
          console.error("Failed to parse en.ts content:", e.message);
        }
      }
    }
  }

  let currentObj = {};
  try {
    // Safely evaluate the object string by passing toolContentEn as context
    currentObj = new Function('toolContentEn', `return ${objectString}`)(enContent);
  } catch (err) {
    console.error(`Failed to evaluate object structure inside ${lang}.ts:`, err.message);
    return;
  }
  
  // Merge new translations
  let mergeCount = 0;
  Object.entries(toolsData).forEach(([toolId, data]) => {
    currentObj[toolId] = data;
    mergeCount++;
  });
  
  // Reconstruct TS file
  // Keep the imports at the top
  const header = content.substring(0, braceIndex).trim();
  const newContent = `${header} ${JSON.stringify(currentObj, null, 2)};\n`;
  
  fs.writeFileSync(filePath, newContent, 'utf8');
  console.log(`Language [${lang}]: Successfully merged ${mergeCount} tools metadata into ${filePath}`);
});

console.log("=== TS IMPORT COMPLETE ===");
