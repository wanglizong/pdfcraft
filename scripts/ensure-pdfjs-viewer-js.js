/**
 * Generate .js copies of PDF.js viewer .mjs bundles so hosts that serve
 * unknown extensions as application/octet-stream still load the viewer.
 *
 * Usage:
 *   node scripts/ensure-pdfjs-viewer-js.js [public|out]
 */

import { copyFileSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

const target = process.argv[2] || 'public';
const viewerDir = join(rootDir, target, 'pdfjs-viewer');
const workersDir = join(rootDir, target, 'workers');

function convertMjsToJs(dir) {
  if (!existsSync(dir)) {
    console.log(`[ensure-pdfjs-js] Skip: ${dir} not found`);
    return;
  }

  const mjsFiles = readdirSync(dir).filter((name) => name.endsWith('.mjs'));
  for (const mjsFile of mjsFiles) {
    const mjsPath = join(dir, mjsFile);
    const jsPath = join(dir, mjsFile.replace(/\.mjs$/, '.js'));
    let content = readFileSync(mjsPath, 'utf8');
    content = content.replace(/\.mjs/g, '.js');
    writeFileSync(jsPath, content);
    console.log(`[ensure-pdfjs-js] ${target}/${mjsFile} -> ${mjsFile.replace(/\.mjs$/, '.js')}`);
  }
}

function patchHtmlFiles(dir) {
  if (!existsSync(dir)) return;

  for (const htmlFile of ['viewer.html', 'form-viewer.html', 'sign-viewer.html']) {
    const htmlPath = join(dir, htmlFile);
    if (!existsSync(htmlPath)) continue;

    const html = readFileSync(htmlPath, 'utf8');
    const patched = html.replace(/\.mjs/g, '.js');
    if (patched !== html) {
      writeFileSync(htmlPath, patched);
      console.log(`[ensure-pdfjs-js] Patched ${target}/pdfjs-viewer/${htmlFile}`);
    }
  }
}

function copyDeploymentFiles() {
  if (target !== 'out') return;

  const htaccessSrc = join(rootDir, '.htaccess');
  const htaccessDest = join(rootDir, 'out', '.htaccess');
  if (existsSync(htaccessSrc)) {
    copyFileSync(htaccessSrc, htaccessDest);
    console.log('[ensure-pdfjs-js] Copied .htaccess to out/');
  }
}

convertMjsToJs(viewerDir);
patchHtmlFiles(viewerDir);
convertMjsToJs(workersDir);
copyDeploymentFiles();

console.log('[ensure-pdfjs-js] Done.');
