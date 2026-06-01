import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const messagesDir = path.join(__dirname, '..', 'messages');
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json'));

const newTools = {
  "bookletFoldingSimulator": {
    "uploadLabel": "Upload PDF File",
    "uploadDescription": "Drag and drop a PDF file here for 3D folding simulation.",
    "optionsTitle": "Imposition & Folding Options",
    "processButton": "Apply Imposition",
    "successMessage": "Imposed folding PDF generated successfully!",
    "foldingMode": "Folding Scheme",
    "simulate3D": "3D Folding Simulation",
    "sheetProgress": "Sheet {current} of {total}"
  },
  "pdfToSlide": {
    "uploadLabel": "Upload Academic/Business PDF",
    "uploadDescription": "Drag and drop a PDF here to extract outline and charts for slide reconstruction.",
    "optionsTitle": "Slide Reconstruction Options",
    "processButton": "Reconstruct Slides (PPTX)",
    "successMessage": "Slide reconstruction successful! Click to download PPTX file.",
    "outlineExtracting": "Analyzing document structure and extracting outlines...",
    "chartExtracting": "Scanning and isolating vector charts and tables as images..."
  },
  "formLogicDesigner": {
    "uploadLabel": "Upload Interactive PDF Form",
    "uploadDescription": "Drag and drop an AcroForm PDF here to design field dependency rules.",
    "optionsTitle": "Form Logic Configuration",
    "processButton": "Inject Logic & Save",
    "successMessage": "AcroJS logic injected successfully! Smart form generated.",
    "canvasTitle": "Glassmorphic Node Logical Designer",
    "compileError": "Failed to compile AcroJS logic. Please inspect the connected flow."
  },
  "einkOptimizer": {
    "uploadLabel": "Upload Scanned PDF",
    "uploadDescription": "Drag and drop your PDF e-book here to optimize for e-Ink paper contrast.",
    "optionsTitle": "e-Ink Contrast Optimizer",
    "processButton": "Optimize & Bold Text",
    "successMessage": "e-Ink PDF optimization complete! File size successfully shrunk.",
    "binarizationThreshold": "Otsu Binarization Threshold",
    "dilationAmount": "Character Bolding (Dilation) Radius"
  },
  "certCryptor": {
    "uploadLabel": "Upload PDF to Secure",
    "uploadDescription": "Drag and drop your PDF here to apply a 3D wax seal and certificate lock.",
    "optionsTitle": "Wax Seal & Certificate Security",
    "processButton": "Execute Wax Seal Signature",
    "successMessage": "3D wax-seal imprint and certificate-based encryption applied successfully!",
    "waxColor": "Wax Seal Style",
    "signCoordinates": "Signature Placement"
  }
};

const newToolsZh = {
  "bookletFoldingSimulator": {
    "uploadLabel": "上传PDF文件",
    "uploadDescription": "拖放PDF文件到此处进行3D折页模拟。",
    "optionsTitle": "拼版折页选项",
    "processButton": "应用拼大版",
    "successMessage": "拼大版折页PDF生成成功！",
    "foldingMode": "折页方案",
    "simulate3D": "3D折叠模拟",
    "sheetProgress": "第 {current} / {total} 印张"
  },
  "pdfToSlide": {
    "uploadLabel": "上传学术/商业PDF",
    "uploadDescription": "拖放PDF文件到此处，提取大纲与图表重建幻灯片。",
    "optionsTitle": "Slide重建选项",
    "processButton": "重建幻灯片 (PPTX)",
    "successMessage": "幻灯片重建成功！点击下载PPTX文件。",
    "outlineExtracting": "正在分析文档层级并提炼大纲...",
    "chartExtracting": "正在扫描分割矢量图表与表格并保存为独立图像..."
  },
  "formLogicDesigner": {
    "uploadLabel": "上传交互式表单PDF",
    "uploadDescription": "拖放带有交互字段的PDF文件到此处以设计逻辑联动。",
    "optionsTitle": "表单联动逻辑设计",
    "processButton": "注入联动脚本并保存",
    "successMessage": "AcroJS逻辑注入成功！智能表单已生成。",
    "canvasTitle": "发光节点逻辑设计画布",
    "compileError": "编译AcroJS代码失败，请检查节点连线逻辑。"
  },
  "einkOptimizer": {
    "uploadLabel": "上传扫描版PDF",
    "uploadDescription": "拖放PDF电子书到此处，进行墨水屏护眼黑白对比优化。",
    "optionsTitle": "墨水屏调色优化选项",
    "processButton": "优化并漂白字迹",
    "successMessage": "护眼墨水屏PDF优化完成！文件已成功瘦身。",
    "binarizationThreshold": "大津二值化阀值",
    "dilationAmount": "字迹膨胀加粗程度"
  },
  "certCryptor": {
    "uploadLabel": "上传待保护PDF",
    "uploadDescription": "拖放PDF文件到此处以放置3D火漆印章及证书锁。",
    "optionsTitle": "物理签名与证书加密选项",
    "processButton": "执行黄金蜡封签名",
    "successMessage": "3D火漆签名与双钥证书加密已成功执行！",
    "waxColor": "火漆蜡色",
    "signCoordinates": "盖印坐标"
  }
};

files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  console.log(`Processing: ${file}`);
  
  try {
    const rawData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(rawData);
    
    if (data.tools) {
      // Determine language
      const isZh = file.startsWith('zh');
      const toolsToUse = isZh ? newToolsZh : newTools;
      
      // Inject missing keys
      Object.assign(data.tools, toolsToUse);
      
      // Write back
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
      console.log(`Successfully updated ${file}`);
    } else {
      console.warn(`No 'tools' key in ${file}`);
    }
  } catch (err) {
    console.error(`Error processing ${file}:`, err.message);
  }
});
