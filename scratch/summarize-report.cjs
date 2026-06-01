const fs = require('fs');

const reportPath = 'd:\\NextProject\\pdfcraft\\scratch\\chinese-scan-report.json';
if (!fs.existsSync(reportPath)) {
  console.log("Report file not found!");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

console.log(`总文件数: ${data.filesScanned}`);
console.log(`发现含有中文的文件数: ${data.matchFilesCount}`);
console.log(`总计中文行数: ${data.totalMatches}`);
console.log("\n含有中文的组件列表:\n");

data.results.forEach((res, idx) => {
  const relPath = res.filePath.replace('d:\\NextProject\\pdfcraft\\', '');
  console.log(`${idx + 1}. [${res.matches.length}行中文] ${relPath}`);
});
