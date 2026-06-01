const { execSync } = require('child_process');

try {
  const out = execSync('node -c d:\\NextProject\\pdfcraft\\scratch\\i18n-builder-extended.cjs', { encoding: 'utf8' });
  console.log("No syntax errors! Output:", out);
} catch (err) {
  console.log("Syntax error output:\n", err.stdout || err.stderr || err.message);
}
