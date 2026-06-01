const fs = require('fs');
const path = require('path');

const scanReportPath = 'd:\\NextProject\\pdfcraft\\scratch\\chinese-scan-report.json';
const mappingPath = 'd:\\NextProject\\pdfcraft\\scratch\\mapping.json';

const report = JSON.parse(fs.readFileSync(scanReportPath, 'utf8'));
const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

// Convert tool key to camelCase namespace
const toolToNamespace = {
  'ai-pdf-reflower': 'aiPdfReflower',
  'booklet-folding-simulator': 'bookletFoldingSimulator',
  'cert-cryptor': 'certCryptor',
  'citation-linker': 'citationLinker',
  'compare-pdfs': 'comparePdfs',
  'compress': 'compress',
  'deep-sanitize': 'deepSanitize',
  'edit-pdf': 'editPdf',
  'eink-optimizer': 'einkOptimizer',
  'FileUploader': 'fileUploader',
  'find-and-redact': 'findAndRedact',
  'form-logic-designer': 'formLogicDesigner',
  'handwriting-ink-contrast-booster': 'handwritingInkContrastBooster',
  'n-up': 'nUpPdf',
  'ocr': 'ocr',
  'overlay': 'overlay',
  'page-labels': 'pageLabels',
  'pdf-deskew-aligner': 'pdfDeskewAligner',
  'pdf-lossless-slicer': 'pdfLosslessSlicer',
  'pdf-page-resizer-uniform': 'pdfPageResizerUniform',
  'pdf-signature-anchor-helper': 'pdfSignatureAnchorHelper',
  'pdf-spine-bookbinder': 'pdfSpineBookbinder',
  'pdf-to-cbz': 'pdfToCbz',
  'pdf-to-slide': 'pdfToSlide',
  'pdf-to-tiff': 'pdfToTiff',
  'pdf-two-column-reflower': 'pdfTwoColumnReflower',
  'remove-blank-pages': 'removeBlankPages',
  'rotate': 'rotate',
  'timestamp': 'timestamp',
  'vector-extractor': 'vectorExtractor',
  // Below are other possible tools from git status
  'annotation-exporter': 'annotationExporter',
  'batch-barcode-injector': 'batchBarcodeInjector',
  'batch-watermark-remover': 'batchWatermarkRemover',
  'bookmarks-auto-generator': 'bookmarksAutoGenerator',
  'dead-link-debugger': 'deadLinkDebugger',
  'global-invoice-parser': 'globalInvoiceParser',
  'interactive-toc-generator': 'interactiveTocGenerator',
  'passport-id-composer': 'passportIdComposer',
  'pdf-scratchpad-canvas': 'pdfScratchpadCanvas',
  'signature-ink-optimizer': 'signatureInkOptimizer',
  'smart-data-redactor': 'smartDataRedactor',
  'photo-tiling-prepress': 'photoTilingPrepress'
};

// Guess tool name from filepath
function getToolName(filePath) {
  const parts = filePath.split(path.sep);
  // Look for components/tools/xxx
  const toolsIdx = parts.indexOf('tools');
  if (toolsIdx !== -1 && toolsIdx + 1 < parts.length) {
    const rawName = parts[toolsIdx + 1];
    // if rawName is a file (like FileUploader.tsx), remove extension
    const tool = rawName.replace('.tsx', '').replace('.ts', '');
    return toolToNamespace[tool] || tool;
  }
  return null;
}

const specialReplacements = {
  // We can add custom logic for templates/interpolations here if needed
};

report.results.forEach(res => {
  const filePath = res.filePath;
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  const toolNamespace = getToolName(filePath);
  if (!toolNamespace) {
    console.log(`Could not resolve tool namespace for: ${filePath}`);
    return;
  }

  console.log(`Processing file: ${path.basename(filePath)} (Namespace: ${toolNamespace})`);

  let fileContent = fs.readFileSync(filePath, 'utf8');
  let lines = fileContent.split('\n');
  let modifiedCount = 0;

  // Track if we need to insert useTranslations import and hook
  let needsImport = !fileContent.includes('useTranslations');
  let needsHook = !fileContent.includes('useTranslations(\'common\')') && !fileContent.includes('useTranslations("common")');

  res.matches.forEach(match => {
    const rawContent = match.content;
    const origLineNum = match.lineNum;
    
    // Find the actual line in file, as line numbers might have shifted
    let actualLineIdx = -1;
    
    // Check original line first, then look nearby
    const searchRange = 20; // look within 20 lines
    const startSearch = Math.max(0, origLineNum - 1 - searchRange);
    const endSearch = Math.min(lines.length - 1, origLineNum - 1 + searchRange);
    
    for (let i = origLineNum - 1; i >= startSearch; i--) {
      if (lines[i] && lines[i].includes(rawContent)) {
        actualLineIdx = i;
        break;
      }
    }
    if (actualLineIdx === -1) {
      for (let i = origLineNum; i <= endSearch; i++) {
        if (lines[i] && lines[i].includes(rawContent)) {
          actualLineIdx = i;
          break;
        }
      }
    }

    if (actualLineIdx === -1) {
      // Try fuzzy match, just matching the Chinese characters from the match
      const chineseOnly = rawContent.match(/[\u4e00-\u9fa5]+/g);
      if (chineseOnly) {
        const query = chineseOnly[0];
        for (let i = startSearch; i <= endSearch; i++) {
          if (lines[i] && lines[i].includes(query)) {
            actualLineIdx = i;
            break;
          }
        }
      }
    }

    if (actualLineIdx === -1) {
      console.log(`  [Warning] Could not locate match line in file for: "${rawContent}" (Original line: ${origLineNum})`);
      return;
    }

    let line = lines[actualLineIdx];
    let originalLine = line;

    // Find the Chinese text to replace inside this line
    const chineseRegex = /[\u4e00-\u9fa5\uff0c\uff1a\uff08\uff09\u3002\uff01\u201c\u201d\u3001a-zA-Z0-9\s\(\)\/\-\.\:\,\&\|\\\+]*[\u4e00-\u9fa5]+[\u4e00-\u9fa5\uff0c\uff1a\uff08\uff09\u3002\uff01\u201c\u201d\u3001a-zA-Z0-9\s\(\)\/\-\.\:\,\&\|\\\+]*/; // match Chinese + surroundings if it forms a text block
    
    // We will extract the exact Chinese string from the report and match it
    const matchChinese = rawContent.replace(/^[a-zA-Z0-9_]+=/, '').replace(/^['"`]/, '').replace(/['"`]$/, '').replace(/^[{}'"`\s\+]+/, '').replace(/[{}'"`\s\+]+$/, '').trim();
    
    // Find the matching key in mapping.json
    let keyInfo = mapping[matchChinese];
    if (!keyInfo) {
      // Try to find a partial match or strip off attributes
      const cleaned = matchChinese.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, '').trim();
      keyInfo = mapping[cleaned];
    }

    if (!keyInfo) {
      // Search mapping keys to see if one is a substring
      for (const k of Object.keys(mapping)) {
        if (matchChinese.includes(k) && k.length > 3) {
          keyInfo = mapping[k];
          break;
        }
      }
    }

    if (keyInfo) {
      const fullKey = `${keyInfo.tool}.${keyInfo.key}`;
      
      // Perform replacement based on the context in the line
      // Case 1: JSX Attribute: attr="Chinese" -> attr={t('fullKey')}
      // Note: we need to handle double quotes, single quotes
      const attrPatternDouble = new RegExp(`(\\b[a-zA-Z0-9_]+)="([^"]*?${escapeRegExp(matchChinese)}[^"]*?)"`);
      const attrPatternSingle = new RegExp(`(\\b[a-zA-Z0-9_]+)='([^']*?${escapeRegExp(matchChinese)}[^']*?)'`);
      
      if (attrPatternDouble.test(line)) {
        line = line.replace(attrPatternDouble, (m, attr, val) => {
          // If the val is exactly the Chinese, replace with {t('fullKey')}
          if (val.trim() === matchChinese) {
            return `${attr}={t('${fullKey}')}`;
          }
          // Otherwise, it might be a composite string, we replace the subpart if possible, but keep it safe
          return `${attr}={t('${fullKey}')}`;
        });
      } else if (attrPatternSingle.test(line)) {
        line = line.replace(attrPatternSingle, (m, attr, val) => {
          if (val.trim() === matchChinese) {
            return `${attr}={t('${fullKey}')}`;
          }
          return `${attr}={t('${fullKey}')}`;
        });
      }
      // Case 2: JSX text child: >Chinese< or just { 'Chinese' } or plain Chinese in JSX
      // If the line has JSX tags, like <div>Chinese</div>
      else if (line.includes(`>${matchChinese}<`)) {
        line = line.replace(`>${matchChinese}<`, `>{t('${fullKey}')}<`);
      }
      else if (line.includes(`> ${matchChinese} <`)) {
        line = line.replace(`> ${matchChinese} <`, `> {t('${fullKey}')} <`);
      }
      // Case 3: JS String in quotes: 'Chinese', "Chinese", `Chinese`
      else {
        const strPatternDouble = new RegExp(`"${escapeRegExp(matchChinese)}"`);
        const strPatternSingle = new RegExp(`'${escapeRegExp(matchChinese)}'`);
        const strPatternBacktick = new RegExp(`\`${escapeRegExp(matchChinese)}\``);
        
        if (strPatternDouble.test(line)) {
          line = line.replace(strPatternDouble, `t('${fullKey}')`);
        } else if (strPatternSingle.test(line)) {
          line = line.replace(strPatternSingle, `t('${fullKey}')`);
        } else if (strPatternBacktick.test(line)) {
          line = line.replace(strPatternBacktick, `t('${fullKey}')`);
        } else {
          // Plain text in JSX without tags: <span>...</span> \n Chinese \n <span>...</span>
          // Replace it with {t('fullKey')}
          line = line.replace(matchChinese, `{t('${fullKey}')}`);
        }
      }

      if (line !== originalLine) {
        lines[actualLineIdx] = line;
        modifiedCount++;
      } else {
        // Fallback: simple text replacement of Chinese text with bracketed translation if in JSX
        // If the line looks like it is inside a JSX block
        if (line.includes('<') || line.includes('>') || line.trim().startsWith('{')) {
          line = line.replace(matchChinese, `{t('${fullKey}')}`);
        } else {
          line = line.replace(matchChinese, `t('${fullKey}')`);
        }
        if (line !== originalLine) {
          lines[actualLineIdx] = line;
          modifiedCount++;
        } else {
          console.log(`  [Failed] Could not replace: "${matchChinese}" in line: "${originalLine.trim()}"`);
        }
      }
    } else {
      console.log(`  [NoKey] No translation key found for: "${matchChinese}"`);
    }
  });

  if (modifiedCount > 0) {
    let newContent = lines.join('\n');
    
    // Inject import useTranslations if needed
    if (needsImport) {
      // Find the last import statement and add next-intl import
      const importMatches = [...newContent.matchAll(/import\s+[\s\S]*?;\n/g)];
      if (importMatches.length > 0) {
        const lastImport = importMatches[importMatches.length - 1];
        const lastImportIndex = lastImport.index + lastImport[0].length;
        newContent = newContent.slice(0, lastImportIndex) + "import { useTranslations } from 'next-intl';\n" + newContent.slice(lastImportIndex);
        console.log(`  [Import] Injected next-intl import`);
      }
    }

    // Inject hook definition const t = useTranslations('common');
    if (needsHook) {
      // Find the component function declaration, e.g., export function ToolName({
      const funcDecl = newContent.match(/(export\s+function\s+\w+Tool\b[\s\S]*?{)/);
      if (funcDecl) {
        const idx = funcDecl.index + funcDecl[0].length;
        newContent = newContent.slice(0, idx) + "\n  const t = useTranslations('common');" + newContent.slice(idx);
        console.log(`  [Hook] Injected useTranslations hook`);
      }
    }

    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`  Successfully modified ${modifiedCount} translations in ${path.basename(filePath)}`);
  } else {
    console.log(`  No modifications made.`);
  }
});

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}
