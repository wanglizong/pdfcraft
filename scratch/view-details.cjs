const fs = require('fs');

const reportPath = 'd:\\NextProject\\pdfcraft\\scratch\\chinese-scan-report.json';
if (!fs.existsSync(reportPath)) {
  console.log("Report file not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

let out = "# Chinese Hardcode Details Report\n\n";

data.results.forEach((res, idx) => {
  const relPath = res.filePath.replace('d:\\NextProject\\pdfcraft\\', '');
  out += `## ${idx + 1}. ${relPath} (${res.matches.length} matches)\n\n`;
  out += "| Line | Content |\n|---|---|\n";
  res.matches.forEach(m => {
    out += `| ${m.lineNum} | \`${m.content.replace(/\|/g, '\\|')}\` |\n`;
  });
  out += "\n";
});

fs.writeFileSync('d:\\NextProject\\pdfcraft\\scratch\\chinese-details-report.md', out, 'utf8');
console.log("Details report written to scratch\\chinese-details-report.md");
