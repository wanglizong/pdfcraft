const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';

console.log("=== STARTING LOCALIZATION LEAKS HOTFIX ===");

// 1. Fix ko.json
const koPath = path.join(MESSAGES_DIR, 'ko.json');
if (fs.existsSync(koPath)) {
  const data = JSON.parse(fs.readFileSync(koPath, 'utf8'));
  
  // Update targets
  if (data.tools && data.tools.signatureInkOptimizer) {
    data.tools.signatureInkOptimizer.uploadLabel = "서명/도장 사진 업로드";
    data.tools.signatureInkOptimizer.uploadDescription = "서명 사진을 끌어다 놓아 노이즈를 제거하고 투명한 PNG 서명 레이어로 정화합니다.";
    data.tools.signatureInkOptimizer.optionsTitle = "필적 필터 및 정화 설정";
    
    fs.writeFileSync(koPath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Language [ko]: Successfully purged Chinese Hanja ('淨化', '手필') with pure Hangul.");
  } else {
    console.error("Language [ko]: Target key structure not found.");
  }
}

// 2. Fix es.json
const esPath = path.join(MESSAGES_DIR, 'es.json');
if (fs.existsSync(esPath)) {
  const data = JSON.parse(fs.readFileSync(esPath, 'utf8'));
  
  if (data.tools && data.tools.formCreator) {
    data.tools.formCreator.projectName = "Nombre del proyecto";
    
    fs.writeFileSync(esPath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Language [es]: Successfully fixed '项目名称' into 'Nombre del proyecto'.");
  } else {
    console.error("Language [es]: Target key structure not found.");
  }
}

// 3. Fix ar.json
const arPath = path.join(MESSAGES_DIR, 'ar.json');
if (fs.existsSync(arPath)) {
  const data = JSON.parse(fs.readFileSync(arPath, 'utf8'));
  
  if (data.common && data.common.pdfToCbz) {
    data.common.pdfToCbz.artistPlaceholder = "مثال: إيتشيرو أودا";
    data.common.pdfToCbz.publisherPlaceholder = "مثال: شوئيشا";
    
    fs.writeFileSync(arPath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Language [ar]: Successfully fixed '尾田荣一郎' and '集英社' to professional Arabic.");
  } else {
    console.error("Language [ar]: Target key structure not found.");
  }
}

// 4. Fix vi.ts
const viTsPath = path.join(TOOL_CONTENT_DIR, 'vi.ts');
if (fs.existsSync(viTsPath)) {
  let content = fs.readFileSync(viTsPath, 'utf8');
  if (content.includes('xếp ảnh thẻ in相纸')) {
    content = content.replace('xếp ảnh thẻ in相纸', 'Xếp ảnh thẻ in giấy ảnh');
    fs.writeFileSync(viTsPath, content, 'utf8');
    console.log("Language [vi] tool content TS: Successfully replaced 'xếp ảnh thẻ in相纸' with 'Xếp ảnh thẻ in giấy ảnh'.");
  } else {
    console.warn("Language [vi] tool content TS: Target leakage string not found.");
  }
}

console.log("=== HOTFIX COMPLETE ===");
