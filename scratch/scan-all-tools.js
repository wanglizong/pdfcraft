const fs = require('fs');
const path = require('path');

const srcDir = 'd:\\NextProject\\pdfcraft\\src\\components\\tools';
const CHINESE_REGEX = /[\u4e00-\u9fa5]/;

const ignorePaths = [
  'node_modules',
  '.next',
  '__tests__',
  '\\.test\\.',
  '\\.spec\\.'
];

let filesScanned = 0;
let matchFilesCount = 0;
let totalMatches = 0;

const results = [];

function scanDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      if (ignorePaths.some(p => new RegExp(p).test(fullPath))) {
        return;
      }
      scanDirectory(fullPath);
    } else if (stat.isFile() && (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.jsx'))) {
      if (ignorePaths.some(p => new RegExp(p).test(fullPath))) {
        return;
      }
      scanFile(fullPath);
    }
  });
}

function scanFile(filePath) {
  filesScanned++;
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const fileMatches = [];
  
  let inMultiLineComment = false;
  
  lines.forEach((line, idx) => {
    let cleanLine = line;
    
    // 简单的单行注释剥离
    if (cleanLine.includes('//')) {
      const parts = cleanLine.split('//');
      cleanLine = parts[0];
    }
    
    // 处理多行注释
    if (inMultiLineComment) {
      if (cleanLine.includes('*/')) {
        inMultiLineComment = false;
        cleanLine = cleanLine.substring(cleanLine.indexOf('*/') + 2);
      } else {
        cleanLine = '';
      }
    }
    
    if (cleanLine.includes('/*')) {
      if (cleanLine.includes('*/')) {
        cleanLine = cleanLine.replace(/\/\*[\s\S]*?\*\//g, '');
      } else {
        inMultiLineComment = true;
        cleanLine = cleanLine.substring(0, cleanLine.indexOf('/*'));
      }
    }
    
    // 剥离 console.log
    if (cleanLine.includes('console.')) {
      cleanLine = '';
    }
    
    // 如果剥离注释后仍然存在中文字符，则记录
    if (CHINESE_REGEX.test(cleanLine)) {
      fileMatches.push({
        lineNum: idx + 1,
        content: line.trim()
      });
    }
  });
  
  if (fileMatches.length > 0) {
    matchFilesCount++;
    totalMatches += fileMatches.length;
    results.push({
      filePath,
      matches: fileMatches
    });
  }
}

console.log("=== 开始扫描 src/components/tools 目录下的硬编码中文 ===");
scanDirectory(srcDir);
console.log(`扫描完成！`);
console.log(`总计扫描文件数: ${filesScanned}`);
console.log(`发现含有中文的文件数: ${matchFilesCount}`);
console.log(`总计发现硬编码行数: ${totalMatches}`);

// 写入 JSON 报告文件
const reportPath = 'd:\\NextProject\\pdfcraft\\scratch\\chinese-scan-report.json';
fs.writeFileSync(reportPath, JSON.stringify({
  filesScanned,
  matchFilesCount,
  totalMatches,
  results
}, null, 2), 'utf8');

console.log(`报告已保存至: ${reportPath}`);
