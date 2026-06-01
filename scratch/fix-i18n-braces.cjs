const fs = require('fs');
const { execSync } = require('child_process');

const filePath = 'd:\\NextProject\\pdfcraft\\scratch\\i18n-builder-extended.cjs';
if (!fs.existsSync(filePath)) {
  console.log("File not found!");
  process.exit(1);
}

let content = fs.readFileSync(filePath, 'utf8');
let lines = content.split('\n');

// We know line 1590 (1-indexed, i.e., index 1589) is "};" which is extra.
console.log("Line 1589 index content before removal:", JSON.stringify(lines[1589]));

if (lines[1589].trim() === '};') {
  lines.splice(1589, 1);
  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log("Removed line index 1589!");
} else {
  console.log("Line index 1589 was not '};', it was:", JSON.stringify(lines[1589]));
}

// Now verify syntax
try {
  const out = execSync('node -c ' + filePath, { encoding: 'utf8' });
  console.log("Syntax is clean! node -c output:", out);
} catch (err) {
  console.error("Syntax check failed after change:\n", err.stdout || err.stderr || err.message);
}
