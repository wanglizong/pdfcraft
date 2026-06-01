# Chinese Hardcode Details Report

## 1. src\components\tools\ai-pdf-reflower\AIPDFReflowerTool.tsx (13 matches)

| Line | Content |
|---|---|
| 243 | `label="上传需要自适应重排的 PDF 文档"` |
| 244 | `description="拖放学术论文、双栏文档或文字类 PDF 到此处。系统将自动执行行重组和双栏解析。"` |
| 269 | `{totalPages > 0 ? `${totalPages} 页` : '解析文档结构中...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 294 | `自适应阅读设置` |
| 297 | `实时修改右侧 3D 手机模拟器内的文字排版风格。` |
| 305 | `阅读底色方案` |
| 309 | `{ id: 'sepia', name: '护眼纸张', bg: 'bg-[#f4ebd0] text-[#5b4636]' },` |
| 310 | `{ id: 'light', name: '亮白清爽', bg: 'bg-white text-zinc-800 border' },` |
| 311 | `{ id: 'green', name: '清新柔绿', bg: 'bg-[#e2edd9] text-[#1c3016]' },` |
| 312 | `{ id: 'dark', name: '夜间极客', bg: 'bg-zinc-900 text-zinc-100' },` |
| 330 | `<span className="flex items-center gap-1.5"><Type className="w-4 h-4" /> 阅读字号大小</span>` |
| 365 | `拉动拉绳一键导出` |
| 400 | `<span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2 tracking-wider">下拉环快速保存 (Markdown)</span>` |

## 2. src\components\tools\booklet-folding-simulator\BookletFoldingSimulatorTool.tsx (10 matches)

| Line | Content |
|---|---|
| 136 | `<div className="font-bold text-sm">4页对折</div>` |
| 137 | `<div className="text-[10px] opacity-75 mt-1">1张印张双面</div>` |
| 147 | `<div className="font-bold text-sm">8页骑马钉</div>` |
| 148 | `<div className="text-[10px] opacity-75 mt-1">2张印张中缝装订</div>` |
| 158 | `3D 折叠阻尼系数` |
| 171 | `<span>纯平展开</span>` |
| 172 | `<span>完全折合</span>` |
| 218 | `{is3DMode ? '2D 视图' : '3D 仿真'}` |
| 242 | `<div className="text-[9px] text-neutral-400 text-center">左半版面 (对折装订)</div>` |
| 258 | `<div className="text-[9px] text-neutral-400 text-center">右半版面</div>` |

## 3. src\components\tools\cert-cryptor\CertCryptorTool.tsx (9 matches)

| Line | Content |
|---|---|
| 167 | `{tTools('waxColor')} (物理火漆风格)` |
| 171 | `{ id: 'gold', label: '皇家黄金', bg: 'bg-yellow-600 border-yellow-500 text-yellow-100' },` |
| 172 | `{ id: 'red', label: '复古深红', bg: 'bg-red-700 border-red-600 text-red-100' },` |
| 173 | `{ id: 'bronze', label: '古铜赤金', bg: 'bg-amber-800 border-amber-700 text-amber-100' }` |
| 195 | `启用证书双钥锁 (256位强加密)` |
| 207 | `<label className="text-[10px] text-neutral-400">设置解密所持密码 (PFX 解密密钥)</label>` |
| 210 | `placeholder="默认密码: pdfcraft"` |
| 257 | `<span>数字证书盖印坐标: X: {sealPos.x}px, Y: {sealPos.y}px</span>` |
| 258 | `<span>在白纸处点击以重定位印章</span>` |

## 4. src\components\tools\citation-linker\CitationLinkerTool.tsx (18 matches)

| Line | Content |
|---|---|
| 253 | `label="上传带有参考文献列表的学术 PDF"` |
| 254 | `description="拖放学术文献、期刊论文或会议报告。系统将自动找出引用标记（如 [1]）并关联参考文献。"` |
| 279 | `{totalPages > 0 ? `${totalPages} 页` : '扫描文本结构中...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 301 | `引文链接激活选项` |
| 313 | `<span className="text-xs font-semibold text-[hsl(var(--color-foreground))]">自动检测参考文献 DOI 超链接</span>` |
| 322 | `<span className="text-xs font-semibold text-[hsl(var(--color-foreground))]">无 DOI 时自动启用“页内跳转” (GoTo Page)</span>` |
| 330 | `<span className="text-xs font-bold text-amber-500">正在修改引文: {selectedCitation.marker}</span>` |
| 331 | `<span className="text-[10px] opacity-60">所在页面: 第 {selectedCitation.pageNum} 页</span>` |
| 335 | `文献: {selectedCitation.refText}` |
| 343 | `placeholder="请输入此文献的 DOI / URL 链接"` |
| 356 | `扫描出的引文列表 ({citations.length})` |
| 382 | `<span className="text-[10px] text-zinc-400 font-medium">页内跳转</span>` |
| 400 | `激活超链接注入` |
| 518 | `<span>绿实线: DOI 外部链接</span>` |
| 519 | `<span>灰虚线: 参考文献页内跳转</span>` |
| 556 | `<h4 className="text-sm font-bold text-[hsl(var(--color-foreground))]">正在注入高强可点击引文注释...</h4>` |
| 570 | `<h3 className="text-base font-extrabold text-[hsl(var(--color-foreground))]">引文超链接激活成功！</h3>` |
| 572 | `共为 {citations.length} 处引文符号注入了关联链接和页内跳转跳转点，文档可在任意符合标准的 PDF 阅读器中完美交互。` |

## 5. src\components\tools\compare-pdfs\ComparePDFsTool.tsx (48 matches)

| Line | Content |
|---|---|
| 252 | `setProgressMessage('正在解构并提取源文档 (Original PDF)...');` |
| 261 | `setError(err instanceof Error ? err.message : '无法提取源文档。');` |
| 271 | `setProgressMessage('正在解构并提取修改文档 (Modified PDF)...');` |
| 280 | `setError(err instanceof Error ? err.message : '无法提取比对文档。');` |
| 294 | `setProgressMessage('正在运行智能 CJK 双端语义对齐与段落差分...');` |
| 337 | `setError('运行智能语义比对时发生算法异常。');` |
| 415 | `源文档 (Original PDF / Left Version)` |
| 423 | `<p className="text-xs text-[hsl(var(--color-muted-foreground))]">{file1.pageCount} 页 • {(file1.file.size / (1024 * 1024)).toFixed(2)} MB</p>` |
| 426 | `<Button variant="ghost" size="sm" onClick={() => setFile1(null)}>移除</Button>` |
| 435 | `label="上传源 PDF 文档"` |
| 436 | `description="作为被差分比对的基本原始版面"` |
| 445 | `比对文档 (Modified PDF / Right Version)` |
| 453 | `<p className="text-xs text-[hsl(var(--color-muted-foreground))]">{file2.pageCount} 页 • {(file2.file.size / (1024 * 1024)).toFixed(2)} MB</p>` |
| 456 | `<Button variant="ghost" size="sm" onClick={() => setFile2(null)}>移除</Button>` |
| 465 | `label="上传比对 PDF 文档"` |
| 466 | `description="包含修改、添加、删除或位置偏移的最新版面"` |
| 484 | `开始智能语义差分比对` |
| 511 | `智能语义比对完成 (Acrobat 商业级对齐)` |
| 514 | `共对齐 {pairedPages.length} 页 •` |
| 515 | `其中 <span className="font-bold text-red-500 mx-1">{pairedPages.filter(p => p.hasDifference).length} 页</span> 包含语义性差异` |
| 523 | `高亮过滤 (Filter)` |
| 534 | `文字增删` |
| 545 | `格式变化 (Fonts)` |
| 556 | `页眉页脚 (低噪)` |
| 567 | `段落位移` |
| 571 | `重置新比对` |
| 586 | `上一页对齐` |
| 591 | `对齐序列 {currentPairIdx + 1} / {pairedPages.length} 页` |
| 599 | `{currentPair.pageIndex1 === -1 && '📂 插入页 (Inserted Page)'}` |
| 600 | `{currentPair.pageIndex2 === -1 && '❌ 移除页 (Deleted Page)'}` |
| 603 | `? `⚠️ 检出 ${currentPair.diffPercentage.toFixed(1)}% 语义差异`` |
| 604 | `: '✅ 无差异 (完全一致)'` |
| 616 | `title={isFullscreen ? "退出全屏" : "全屏沉浸比对"}` |
| 628 | `下一页对齐` |
| 645 | `{file1?.file.name} (原版本)` |
| 648 | `{currentPair?.pageIndex1 !== -1 ? `第 ${currentPair.pageIndex1 + 1} 页` : '---'}` |
| 700 | `{hl.type === 'deleted' && '❌ 移除了文本'}` |
| 701 | `{hl.type === 'modified' && '⚠️ 文本被修改'}` |
| 702 | `{hl.type === 'moved' && '➡️ 段落在此处发生跨行位移'}` |
| 713 | `<p className="text-xs font-black text-emerald-400">📂 插入页面 (Inserted Page)</p>` |
| 715 | `此页面为修改版本中强行增加的页面。原版本在此无对应映射，已自动实现隔空对齐。` |
| 726 | `{file2?.file.name} (修改版)` |
| 729 | `{currentPair?.pageIndex2 !== -1 ? `第 ${currentPair.pageIndex2 + 1} 页` : '---'}` |
| 781 | `{hl.type === 'added' && '💚 新增了文本'}` |
| 782 | `{hl.type === 'modified' && '⚠️ 文本被修改'}` |
| 783 | `{hl.type === 'moved' && '⬅️ 承接自前方的段落跨行位移'}` |
| 794 | `<p className="text-xs font-black text-red-400">❌ 移除页面 (Deleted Page)</p>` |
| 796 | `此页面在修改版本中已被完全删除。系统在此处插入空白对齐，以防扰乱后续页面的比对秩序。` |

## 6. src\components\tools\compress\CompressPDFTool.tsx (22 matches)

| Line | Content |
|---|---|
| 260 | `待压缩文件列表 ({files.length})` |
| 263 | `<Trash2 className="w-4 h-4 mr-1.5" /> 清空全部` |
| 295 | `拖动中间分割滑条查看无级压缩画质对比 (第 1 页)` |
| 298 | `左: 原始画质 (100%) \| 右: 模拟压缩 ({quality.toUpperCase()})` |
| 446 | `<span>体积缩水率 (轻)</span>` |
| 447 | `<span>像素清晰度 (重)</span>` |
| 455 | `<Sliders className="w-4 h-4" /> 压缩质量档位选择` |
| 468 | `{q === 'low' && '低质量'}` |
| 469 | `{q === 'medium' && '中等'}` |
| 470 | `{q === 'high' && '高质量'}` |
| 471 | `{q === 'maximum' && '极限无损'}` |
| 476 | `{quality === 'low' && '体积大幅压缩 60%-80%，适合普通发票收据与纯文字汇报。'}` |
| 477 | `{quality === 'medium' && '均衡型，在保持清晰可读的字体边缘时获得 40% 体积优化。'}` |
| 478 | `{quality === 'high' && '保证摄影级图片的高对比度和颜色动态，略微减少体积。'}` |
| 479 | `{quality === 'maximum' && '接近 1:1 的极限高精，只清理隐藏垃圾碎片与未引用块。'}` |
| 492 | `<span className="text-xs font-semibold">优化嵌入的所有图形资产</span>` |
| 501 | `<span className="text-xs font-semibold">强力清空作者/软件描述元数据</span>` |
| 521 | `{isProcessing ? '优化执行中...' : '开始优化压缩 PDF'}` |
| 546 | `<h4 className="text-sm font-bold">压缩操作执行完毕！</h4>` |
| 550 | `打包下载 ZIP ({completedCount} 个文件)` |
| 566 | `<h3 className="text-base font-extrabold text-[hsl(var(--color-foreground))]">文档优化压缩完毕！</h3>` |
| 568 | `原始大小: {(singleFile.size / (1024 * 1024)).toFixed(2)} MB • 成功在本地清理了非必要废弃片段和无用元数据流。` |

## 7. src\components\tools\deep-sanitize\DeepSanitizeTool.tsx (16 matches)

| Line | Content |
|---|---|
| 301 | `label="上传需要脱敏防溯源的 PDF 文档"` |
| 302 | `description="拖放商业合同、机密文件或政府底档。系统将扫描可选图层、PieceInfo 历史并强制重构 xref 树。"` |
| 327 | `{totalPages > 0 ? `${totalPages} 页` : '深度结构预检中...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 349 | `深度擦除控制选项` |
| 363 | `<p className="font-bold text-[hsl(var(--color-foreground))]">抹除 XMP XML 元数据与常规描述</p>` |
| 364 | `<p className="text-[10px] text-zinc-400">Title, Author, Producer, 各种修改历史摘要流</p>` |
| 377 | `<p className="font-bold text-[hsl(var(--color-foreground))]">清理 PieceInfo 专属编辑器私有属性</p>` |
| 378 | `<p className="text-[10px] text-zinc-400">Adobe Acrobat 等软件留存的页面节点修改痕迹</p>` |
| 391 | `<p className="font-bold text-[hsl(var(--color-foreground))]">剥离 OCProperties 可选内容水印图层</p>` |
| 392 | `<p className="text-[10px] text-zinc-400">很多公司的防泄密动态不可见水印的底层承载层</p>` |
| 405 | `<p className="font-bold text-[hsl(var(--color-foreground))]">彻底擦除所有交互式批注与外链 (慎用)</p>` |
| 406 | `<p className="text-[10px] text-zinc-400">将删除文档中的可点击外链、手写文字高亮和备注批注</p>` |
| 422 | `执行深度净化脱敏` |
| 457 | `扫描发现的安全风险排查报告:` |
| 484 | `<h3 className="text-base font-extrabold text-[hsl(var(--color-foreground))]">深度元数据净化完成！</h3>` |
| 486 | `已将原始文档的 XMP 元数据、描述字典、PieceInfo 缓冲、可选内容图层（OCG）全部剔除，并完成 xref 的物理重构。旧版本修改残留已不具恢复可能。` |

## 8. src\components\tools\edit-pdf\EditPDFTool.tsx (18 matches)

| Line | Content |
|---|---|
| 71 | `if (text === '保存' \|\| text === 'Save') {` |
| 87 | `'cloud': '云线',` |
| 88 | `'rectangle': '矩形',` |
| 89 | `'circle': '圆形',` |
| 90 | `'arrow': '箭头',` |
| 91 | `'freehand': '自由绘制',` |
| 92 | `'freeText': '文字',` |
| 93 | `'freeHighlight': '自由高亮',` |
| 94 | `'note': '注解',` |
| 95 | `'signature': '签名',` |
| 96 | `'stamp': '盖章'` |
| 337 | `colorLabel.textContent = '自定义描边色:';` |
| 381 | `fillLabel.textContent = '启用填充色:';` |
| 449 | `const transName = toolNameTranslations[ann.name] \|\| '标注';` |
| 450 | `const targetAuthor = transName + ' (不具名用户)';` |
| 451 | `if (ann.author !== targetAuthor && ann.author === '不具名用户') {` |
| 528 | `undoBtn.innerHTML = '<span style="margin-right:2px; font-weight:bold;">↩</span>撤销';` |
| 541 | `redoBtn.innerHTML = '<span style="margin-right:2px; font-weight:bold;">↪</span>重做';` |

## 9. src\components\tools\eink-optimizer\EinkOptimizerTool.tsx (11 matches)

| Line | Content |
|---|---|
| 159 | `{tTools('binarizationThreshold')} (大津偏置)` |
| 172 | `<span>保留更多笔画</span>` |
| 173 | `<span>剥离杂质底色</span>` |
| 181 | `{tTools('dilationAmount')} (字迹加粗)` |
| 185 | `{ val: 0, label: '原笔迹' },` |
| 186 | `{ val: 1, label: '微加粗 (1px)' },` |
| 187 | `{ val: 2, label: '强加粗 (2px)' },` |
| 250 | `优化后：视网膜级高对比度文字` |
| 253 | `古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑？惑而不从师，其为惑也，终不解矣。生乎吾前，其闻道也固先乎吾，吾从而师之...` |
| 271 | `原始扫描页：底色发灰、字迹浅淡` |
| 274 | `古之学者必有师。师者，所以传道受业解惑也。人非生而知之者，孰能无惑？惑而不从师，其为惑也，终不解矣。生乎吾前，其闻道也固先乎吾，吾从而师之...` |

## 10. src\components\tools\FileUploader.tsx (6 matches)

| Line | Content |
|---|---|
| 517 | `此文档已加密` |
| 521 | `请输入密码以解锁并载入：<br/>` |
| 534 | `placeholder="请输入文档密码"` |
| 557 | `取消` |
| 567 | `解密中...` |
| 570 | `'解密并继续'` |

## 11. src\components\tools\find-and-redact\FindAndRedactTool.tsx (4 matches)

| Line | Content |
|---|---|
| 432 | `placeholder={tTools('searchInputPlaceholder') \|\| '输入搜索词，用逗号分隔多个词'}` |
| 445 | `{tTools('searchInputHelp') \|\| '提示：用逗号（,）分隔多个搜索词'}` |
| 453 | `{tTools('termsCount', { count: parsedTerms.length }) \|\| `${parsedTerms.length} 个搜索词`}` |
| 682 | `全部 ({matches.length})` |

## 12. src\components\tools\form-logic-designer\FormLogicDesignerTool.tsx (7 matches)

| Line | Content |
|---|---|
| 138 | `label: '触发联动'` |
| 226 | `{detectedFields.length} 个交互字段已就绪` |
| 245 | `联动关系编译说明` |
| 248 | `<li>在右侧发光毛玻璃节点中，找到控制源节点（如勾选框）。</li>` |
| 249 | `<li>从小圆点拉出连线，连接至被联动目标字段。</li>` |
| 250 | `<li>如果源是复选框：默认生成<b>当勾选时激活该字段</b>的 Validate JS 脚本。</li>` |
| 251 | `<li>连接线上会泛起紫色粒子，代表动作联动已联通。</li>` |

## 13. src\components\tools\handwriting-ink-contrast-booster\HandwritingInkContrastBoosterTool.tsx (10 matches)

| Line | Content |
|---|---|
| 123 | `发光探照对比镜 (拖拽鼠标穿透漂除霉斑)` |
| 126 | `清空` |
| 147 | `Handwritten Ink / 签字笔迹` |
| 150 | `(拉动右侧滑块漂白纸张)` |
| 184 | `<label className="text-zinc-500 font-bold">目标提取种类</label>` |
| 190 | `<option value="auto">自动增强色彩特征</option>` |
| 191 | `<option value="dark-ink">深色签字字迹增强</option>` |
| 192 | `<option value="red-stamp">红色盖章印泥还原</option>` |
| 198 | `<span>背景擦除亮度阈值</span>` |
| 213 | `<span>笔画笔锋对比度</span>` |

## 14. src\components\tools\n-up\NUpPDFTool.tsx (8 matches)

| Line | Content |
|---|---|
| 483 | `{orientation === 'landscape' ? '横向' : orientation === 'portrait' ? '纵向' : '自动'}` |
| 493 | `<div className="text-xs text-[hsl(var(--color-muted-foreground))]">{tTools('nUpPdf.gridLabel') \|\| '网格布局'}</div>` |
| 497 | `<div className="text-xs text-[hsl(var(--color-muted-foreground))]">{tTools('nUpPdf.outputPages') \|\| '输出页数'}</div>` |
| 504 | `<span className="font-medium text-[hsl(var(--color-foreground))]">{totalPages}</span> {tTools('nUpPdf.pagesLabel') \|\| '页'} →` |
| 505 | `<span className="font-medium text-[hsl(var(--color-foreground))]"> {outputSheets}</span> {tTools('nUpPdf.sheetsLabel') \|\| '张'}` |
| 506 | `<span className="opacity-70"> ({actualPagesPerSheet} {tTools('nUpPdf.perSheetLabel') \|\| '页/张'})</span>` |
| 520 | `? (tTools('nUpPdf.topToBottom') \|\| '从上到下')` |
| 521 | `: (tTools('nUpPdf.leftToRight') \|\| '从左到右，然后向下')` |

## 15. src\components\tools\ocr\OCRPDFTool.tsx (18 matches)

| Line | Content |
|---|---|
| 364 | `OCR 文字识别参数配置` |
| 371 | `<Languages className="w-4 h-4" /> 选择识别语言 (支持多选)` |
| 398 | `输出文件格式` |
| 405 | `<option value="searchable-pdf">双层可搜索 PDF</option>` |
| 406 | `<option value="text">提取纯文本文件 (.txt)</option>` |
| 413 | `渲染识别精度` |
| 420 | `<option value="1">标清 (适合清晰原件)</option>` |
| 421 | `<option value="2">高清 (推荐，识别更稳)</option>` |
| 422 | `<option value="3">超清 (慢，适合模糊件)</option>` |
| 429 | `指定识别页码` |
| 435 | `placeholder="如: 1-3, 5"` |
| 453 | `开始文字识别` |
| 481 | `双层 PDF 核心优势:` |
| 484 | `重构后的可搜索 PDF 功能，会在后台计算 OCR 文字排版物理 Bounding Box，在原始 PDF 图层上层精确注入<b>完全透明的文字图层 (Invisible Text Layer)</b>。这不仅保持了原始扫描文件的图纸外观，还让文本完美支持<b>划词复制、检索和选定</b>。` |
| 513 | `<h3 className="text-base font-extrabold text-[hsl(var(--color-foreground))]">文字识别提取完成！</h3>` |
| 516 | `? '双层可搜索 PDF 编译完成。原始扫描图片已被文字遮罩覆盖，您可以使用任意 PDF 查看器打开文件并进行划词搜索与复制。'` |
| 517 | `: '纯文本文件结构提取成功，已在下方显示文本流预览。'` |
| 539 | `提取出来的文本流预览` |

## 16. src\components\tools\overlay\OverlayPDFTool.tsx (24 matches)

| Line | Content |
|---|---|
| 166 | `1. 上传主文档 (Base PDF)` |
| 181 | `{basePages > 0 ? `${basePages} 页` : '正在载入...'} • {(baseFile.size / (1024 * 1024)).toFixed(2)} MB` |
| 202 | `label="点击上传主 PDF"` |
| 203 | `description="该文档的内容会作为合并的基本骨架"` |
| 212 | `2. 上传覆叠层文档 (Layer PDF)` |
| 227 | `{layerPages > 0 ? `${layerPages} 页` : '正在载入...'} • {(layerFile.size / (1024 * 1024)).toFixed(2)} MB` |
| 248 | `label="点击上传图层 PDF"` |
| 249 | `description="如公章、带有设计背景的信托网格、信笺等"` |
| 271 | `3D 层叠层级动态预览` |
| 294 | `<p className="text-sm">主页面</p>` |
| 311 | `<p className="text-sm">图层面</p>` |
| 320 | `? '📂 前景层模式 (Overlay)：图层文档渲染在主文档的页面内容之上。'` |
| 321 | `: '🎨 背景层模式 (Underlay)：图层文档垫在主文档所有页面内容的最底层。'` |
| 332 | `覆叠拼接配置` |
| 338 | `A. 覆叠层级模式 (Placement Mode)` |
| 349 | `前景覆叠 (Overlay)` |
| 359 | `背景垫底 (Underlay)` |
| 368 | `B. 目标作用页面范围 (Target Page Range)` |
| 371 | `空表示应用至全部主页面` |
| 376 | `placeholder="例如：1-5, 8, odd, even"` |
| 387 | `C. 循环重复图层文档 (Loop Shorter Overlay Document)` |
| 390 | `当图层文件总页数短于主 PDF 时，自动循环重复套用该图层（例如信笺背景）。若关闭，则超出页数的页面不再应用覆叠。` |
| 418 | `{isProcessing ? '正在拼版编译中...' : '开始应用覆叠生成 PDF'}` |
| 437 | `🎉 PDF 覆叠拼版处理成功！点击上方按钮进行下载。` |

## 17. src\components\tools\page-labels\AddPageLabelsTool.tsx (33 matches)

| Line | Content |
|---|---|
| 80 | `setError('无法解析主 PDF 的元数据，该文件可能已损坏。');` |
| 181 | `setError('请上传待添加页面标签的 PDF。');` |
| 205 | `setProgressMessage(message \|\| '正在批量注入页面标签...');` |
| 219 | `setError(output.error?.message \|\| '注入页面标签失败。');` |
| 224 | `setError(err instanceof Error ? err.message : '发生未知错误。');` |
| 249 | `1. 上传文档 (PDF)` |
| 270 | `{totalPages > 0 ? `${totalPages} 页` : '正在载入...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 291 | `label="点击或拖拽上传 PDF"` |
| 292 | `description="本工具将直接在 PDF Catalog 中注入标准的 PageLabels 字典，与 Adobe Acrobat 完全兼容。"` |
| 316 | `2. 配置标签映射规则 (Page Label Rules)` |
| 326 | `添加新规则` |
| 339 | `规则 #{idx + 1}` |
| 346 | `title="删除此规则"` |
| 358 | `页码作用范围` |
| 361 | `留空应用到所有页` |
| 366 | `placeholder="例如: 1-9, odd, even"` |
| 376 | `标签编码样式` |
| 383 | `<option value="D">1, 2, 3... (阿拉伯数字)</option>` |
| 384 | `<option value="R">I, II, III... (大写罗马)</option>` |
| 385 | `<option value="r">i, ii, iii... (小写罗马)</option>` |
| 386 | `<option value="A">A, B, C... (大写字母)</option>` |
| 387 | `<option value="a">a, b, c... (小写字母)</option>` |
| 388 | `<option value="none">无数字样式 (仅前缀)</option>` |
| 395 | `自定义前缀 (Prefix)` |
| 399 | `placeholder="例如: Appendix-, A-"` |
| 409 | `起始数值 (Start Value)` |
| 434 | `{isProcessing ? '正在注入标签并编译...' : '开始注入 PageLabels'}` |
| 453 | `🎉 页面标签注入成功！请下载已签名的 PDF 并在专业阅读器中查看侧栏导航。` |
| 463 | `页面标签序列实时流预览` |
| 474 | `<span className="font-bold text-[hsl(var(--color-foreground))]">规则优先覆盖与不相交算法：</span>` |
| 475 | `下方徽章代表 PDF 内部每一页最终算出的标签序列。物理页码旁的渐变色小徽章，即为其展现给用户的结构标签。` |
| 498 | `还有 {totalPages - maxPreviewCount} 页未显示，已自动折叠以提升交互性能。` |
| 506 | `加载完整 {totalPages} 页预览` |

## 18. src\components\tools\pdf-deskew-aligner\PdfDeskewAlignerTool.tsx (8 matches)

| Line | Content |
|---|---|
| 110 | `发光陀螺仪对齐罗盘` |
| 113 | `清空` |
| 128 | `右侧设置检测灵敏度。陀螺仪探针正在纠偏物理轴线。` |
| 146 | `<span>检测分辨率 (DPI)</span>` |
| 154 | `<option value={72}>72 DPI (极速检测)</option>` |
| 155 | `<option value={150}>150 DPI (标准平衡)</option>` |
| 156 | `<option value={300}>300 DPI (高清拟合)</option>` |
| 162 | `<span>歪斜检测阈值</span>` |

## 19. src\components\tools\pdf-lossless-slicer\PdfLosslessSlicerTool.tsx (5 matches)

| Line | Content |
|---|---|
| 133 | `发光绿色激光切割网格 (按住拖拽以缩放裁剪网格)` |
| 136 | `清空` |
| 184 | `<label className="text-zinc-500 font-bold">目标切片页码</label>` |
| 196 | `<span>切片宽度: {(sliceWidth * 100).toFixed(0)}%</span>` |
| 197 | `<span>切片高度: {(sliceHeight * 100).toFixed(0)}%</span>` |

## 20. src\components\tools\pdf-page-resizer-uniform\PdfPageResizerUniformTool.tsx (11 matches)

| Line | Content |
|---|---|
| 110 | `3D 多规格纸张叠放收纳舱` |
| 113 | `清空` |
| 132 | `已加载 {files.length} 个多规格文档` |
| 135 | `各种物理纸张尺寸将在环形光幕矩阵中自动等比平移缩放、完美居中裁剪。` |
| 152 | `<label className="text-zinc-500 font-bold">目标统一纸张规格</label>` |
| 158 | `<option value="A4">A4 标准国际标准 (595 x 842 pt)</option>` |
| 159 | `<option value="A3">A3 大型工程尺寸 (842 x 1191 pt)</option>` |
| 160 | `<option value="Letter">Letter 美规标准信纸 (612 x 792 pt)</option>` |
| 165 | `<label className="text-zinc-500 font-bold">缩放及边界填充模式</label>` |
| 171 | `<option value="fit">等比自适应缩放且留白对齐 (推荐)</option>` |
| 172 | `<option value="fill">等比填满并无损居中剪裁边缘</option>` |

## 21. src\components\tools\pdf-signature-anchor-helper\PdfSignatureAnchorHelperTool.tsx (5 matches)

| Line | Content |
|---|---|
| 24 | `const [anchorLabel, setAnchorLabel] = useState('Sign Here / 此处签字');` |
| 128 | `合同签字指引定位台 (在画面任意处点击以修改定位)` |
| 131 | `清空` |
| 183 | `<label className="text-zinc-500 font-bold">指引图层铭文内容</label>` |
| 193 | `<label className="text-zinc-500 font-bold">生效目标页码</label>` |

## 22. src\components\tools\pdf-spine-bookbinder\PdfSpineBookbinderTool.tsx (11 matches)

| Line | Content |
|---|---|
| 123 | `3D 书籍胶装折页模型 (按住鼠标左键任意旋转)` |
| 126 | `预测书脊厚度: {spineWidthMm.toFixed(2)} mm` |
| 186 | `<label className="text-zinc-500 font-bold">书脊版面铭刻文字</label>` |
| 191 | `placeholder="例如: 毕业设计论文 / 商业合同"` |
| 198 | `<span>装订书籍总面数 (Pages)</span>` |
| 199 | `<span className="font-mono text-primary font-bold">{pageCount} 面</span>` |
| 213 | `<label className="text-zinc-500 font-bold">内页纸张克重 (GSM)</label>` |
| 219 | `<option value={80}>80g 复印纸 (每面厚 0.05mm)</option>` |
| 220 | `<option value={100}>100g 铜版纸 (每面厚 0.06mm)</option>` |
| 221 | `<option value={120}>120g 哑粉纸 (每面厚 0.07mm)</option>` |
| 222 | `<option value={150}>150g 重型艺术纸 (每面厚 0.09mm)</option>` |

## 23. src\components\tools\pdf-to-cbz\PDFToCBZTool.tsx (37 matches)

| Line | Content |
|---|---|
| 84 | `setError('无法解析主 PDF 漫画的元数据。该文件可能已损坏。');` |
| 102 | `setError('请上传待转换的漫画 PDF 文件。');` |
| 132 | `setProgressMessage(message \|\| '正在提取漫画页面中...');` |
| 146 | `setError(output.error?.message \|\| '编译漫画包 CBZ 失败。');` |
| 151 | `setError(err instanceof Error ? err.message : '打包转换时发生未知错误。');` |
| 170 | `1. 上传漫画/插画 (PDF)` |
| 191 | `{totalPages > 0 ? `${totalPages} 页` : '正在载入...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 212 | `label="点击上传漫画 PDF 文档"` |
| 213 | `description="渲染高清页面的同时，自动嵌入 OPF / XML / Comment 漫画专属多维度数据库信息。"` |
| 238 | `3D 漫画体三维动态封面预览` |
| 271 | `{series \|\| title \|\| '漫画标题'}` |
| 284 | `{writer \|\| '佚名作者'}` |
| 315 | `? '右翻页模式 (Right to Left)：经典日漫读向，书脊对齐右侧翻开。'` |
| 316 | `: '左翻页模式 (Left to Right)：标准小说/美漫读向，书脊对齐左侧翻开。'` |
| 331 | `2. 完善书籍信息与元数据 (Metadata)` |
| 339 | `漫画标题 (Title)` |
| 352 | `所属系列/书名 (Series)` |
| 356 | `placeholder="如: 海贼王、进击的巨人"` |
| 366 | `单册期数/话号 (Issue Number)` |
| 379 | `分卷号 (Volume)` |
| 393 | `编剧与绘画作者 (Writer/Artist)` |
| 397 | `placeholder="如: 尾田荣一郎"` |
| 407 | `发行商/出版社 (Publisher)` |
| 411 | `placeholder="如: 集英社"` |
| 422 | `题材题材题材 (Genre)` |
| 426 | `placeholder="如: 热血 / 少年 / 动作"` |
| 437 | `漫画书籍阅读顺序` |
| 444 | `<option value="No">从左至右 (LTR - 普通电子书)</option>` |
| 445 | `<option value="YesAndRightToLeft">从右至左 (RTL - 日漫读向)</option>` |
| 454 | `3. 图像画质与设备调谐` |
| 462 | `图像压缩画质 (JPEG/WebP Quality)` |
| 483 | `分辨率比例 (Scale Multiplier)` |
| 503 | `压缩保存图像格式` |
| 529 | `墨水屏灰阶处理` |
| 532 | `脱色加速墨水屏刷新率与画质对比度` |
| 565 | `{isProcessing ? '正在高清打包编译漫画...' : '开始提取编译 CBZ 漫画包'}` |
| 585 | `🎉 漫画 CBZ 打包成功！内置 metadata.opf 与 ComicInfo.xml 元数据。请一键下载。` |

## 24. src\components\tools\pdf-to-slide\PDFToSlideTool.tsx (6 matches)

| Line | Content |
|---|---|
| 142 | `PPT 主题基色` |
| 217 | `正在解构页面层次并重建幻灯片大纲...` |
| 266 | `上一页` |
| 275 | `下一页` |
| 285 | `<p className="text-sm text-neutral-400">大纲与图表将在这里渲染为卡片大纲预览</p>` |
| 286 | `<p className="text-xs text-neutral-600">选择您的主题色并点击生成开始大纲幻灯片重建</p>` |

## 25. src\components\tools\pdf-to-tiff\PDFToTIFFTool.tsx (32 matches)

| Line | Content |
|---|---|
| 69 | `setError('无法解析主 PDF 元数据，该文件可能已损坏。');` |
| 86 | `setError('请上传待转换为 TIFF 的 PDF 文件。');` |
| 112 | `setProgressMessage(message \|\| '正在将页面序列化为单文件多页 TIFF...');` |
| 126 | `setError(output.error?.message \|\| '编译多页 TIFF 文件失败。');` |
| 131 | `setError(err instanceof Error ? err.message : '序列化打包时发生未知错误。');` |
| 150 | `1. 上传文档 (PDF)` |
| 171 | `{totalPages > 0 ? `${totalPages} 页` : '正在载入...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 192 | `label="点击上传待转换 PDF 文件"` |
| 193 | `description="手写二进制 IFD 拼接编译器，直接合并生成单个包含多页面（Multi-page）的合法高保真 TIFF。"` |
| 218 | `3D 晶格像素密度与光谱实时预览` |
| 270 | `? '24-bit 印刷全彩 (RGB)：每像素占用 3 字节，完美还原丰富的光谱色彩。'` |
| 272 | `? '8-bit 专业灰度：使用经典光敏系数脱色，层次分明，适合黑白文卷存档。'` |
| 273 | `: '1-bit 纯黑白二值：基于半色调 127 阀值二值化，极具对比度，体积缩减至 1/24。'` |
| 288 | `2. 印刷级多页 TIFF 输出配置` |
| 295 | `A. 色彩表达模式 (Color Mode)` |
| 299 | `{ mode: 'color', label: '全彩 (RGB 24-bit)' },` |
| 300 | `{ mode: 'grayscale', label: '灰阶 (8-bit)' },` |
| 301 | `{ mode: 'mono', label: '黑白单色 (1-bit)' }` |
| 323 | `B. 图像压缩算法 (Compression Method)` |
| 327 | `{ cmp: 'none', label: '无压缩 (None - 极大兼容)' },` |
| 328 | `{ cmp: 'packbits', label: '无损游程压缩 (PackBits RLE)' }` |
| 351 | `C. 高精度 DPI 分辨率滑轨 (Resolution)` |
| 354 | `{dpi} DPI ({Math.round(dpi / 72 * 100)}% 视网膜缩放)` |
| 369 | `<span>72 DPI (屏幕低精)</span>` |
| 370 | `<span>150 DPI (普通办公)</span>` |
| 371 | `<span>300 DPI (印刷级高清)</span>` |
| 372 | `<span>600 DPI (视网膜超清)</span>` |
| 380 | `<span className="font-bold text-[hsl(var(--color-foreground))]">印刷与存档提示：</span>` |
| 381 | `多页 TIFF (Multi-page TIFF) 在导入 Acrobat 或 Photoshop 时，可像 PDF 一样顺畅地进行页面上下滚动，但其完全由光栅位图构成。对图表和文字，我们极力推荐使用` |
| 382 | `<span className="text-[hsl(var(--color-primary))] font-extrabold mx-0.5">300 DPI</span>以确保字符边缘丝般圆润。` |
| 398 | `{isProcessing ? '正在将光栅序列化为 TIFF...' : '开始编译并生成多页 TIFF'}` |
| 418 | `🎉 单文件多页 TIFF 编译成功！所有页面已合并就位。一键极速下载。` |

## 26. src\components\tools\pdf-two-column-reflower\PdfTwoColumnReflowerTool.tsx (6 matches)

| Line | Content |
|---|---|
| 110 | `3D 微折叠透视渲染预览页` |
| 113 | `清空` |
| 168 | `<span>中缝定位分栏比例</span>` |
| 183 | `<label className="text-zinc-500 font-bold">阅读流平铺方向</label>` |
| 189 | `<option value="vertical">纵向瀑布流平铺 (推荐)</option>` |
| 190 | `<option value="horizontal">横向折页式流</option>` |

## 27. src\components\tools\remove-blank-pages\RemoveBlankPagesTool.tsx (21 matches)

| Line | Content |
|---|---|
| 344 | `{pages.length} 页 • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 390 | `过滤状态汇总` |
| 394 | `共 {pages.length} 页` |
| 397 | `待删除: {blankPagesCount} 页` |
| 400 | `保留: {keepPagesCount} 页` |
| 408 | `<Undo2 className="w-3 h-3" /> 重置手动修改` |
| 411 | `保留全部页` |
| 414 | `删除全部页` |
| 432 | `全部页面 ({pages.length})` |
| 442 | `推荐删除 ({blankPagesCount})` |
| 452 | `保留页面 ({keepPagesCount})` |
| 479 | `当前视图下没有页面可供显示` |
| 523 | `? `系统已清理 ${removedCount} 页空白页，保留并重新编译了剩余页面。`` |
| 524 | `: '文档中未检测到被删除的页面，已直接导出。'}` |
| 538 | `处理新文件` |
| 639 | `{isRemoved ? '点击保留该页' : '点击删除该页'}` |
| 651 | `第 {page.pageNumber} 页` |
| 656 | `熵: {page.entropy.toFixed(3)}` |
| 664 | `强删` |
| 669 | `强留` |
| 674 | `空页` |

## 28. src\components\tools\rotate\RotatePDFTool.tsx (28 matches)

| Line | Content |
|---|---|
| 540 | `校准控制中心` |
| 543 | `选择下方页面，使用快调或无极表盘精准矫正歪斜或翻转的文档。` |
| 550 | `已选中 {selectedPages.size} / {totalPages} 页` |
| 557 | `全选` |
| 563 | `清除` |
| 580 | `快捷快调` |
| 590 | `无极微调 (细粒度)` |
| 608 | `左旋 90°` |
| 620 | `右旋 90°` |
| 632 | `翻转 180°` |
| 644 | `一键清零` |
| 650 | `<p className="text-[11px] font-semibold text-[hsl(var(--color-muted-foreground))] mb-2">快速选择页组：</p>` |
| 657 | `仅奇数页` |
| 664 | `仅偶数页` |
| 722 | `<p className="text-[10px] uppercase font-bold tracking-widest text-[hsl(var(--color-muted-foreground))]">校正</p>` |
| 726 | `<p className="text-[9px] text-[hsl(var(--color-primary))] font-semibold">滚动滚轮微调</p>` |
| 734 | `<span>-180.0° (左)</span>` |
| 735 | `<span className="text-[hsl(var(--color-primary))] font-bold">精细微调滑块</span>` |
| 736 | `<span>+180.0° (右)</span>` |
| 752 | `<span className="text-xs font-semibold text-[hsl(var(--color-muted-foreground))]">精密输入：</span>` |
| 798 | `💡 <strong>输入提示：</strong>您可以输入任意角度，比如较大值，在失焦或按下回车时系统将<strong>自动取模规范化</strong>在 <code>[-180°, 180°]</code> 的等效区间内。` |
| 822 | `? '旋转处理中...'` |
| 823 | `: `开始旋转 ${rotatedCount} 个已校准页面`` |
| 846 | `🎉 PDF 页面物理旋转保存成功！点击上方按钮进行下载。` |
| 857 | `<span className="text-sm font-semibold text-[hsl(var(--color-foreground))]">实时物理预览视窗</span>` |
| 860 | `点击页面切换选择 • 拖拽左侧控制进行细粒度微调` |
| 869 | `正在解压并加载 PDF 预览图...` |
| 935 | `第 {preview.pageNumber} 页` |

## 29. src\components\tools\timestamp\TimestampPDFTool.tsx (19 matches)

| Line | Content |
|---|---|
| 25 | `{ id: 'MeSign', name: 'MeSign TSA', desc: '中国信安可信时间戳权威机构', speed: '快速' },` |
| 26 | `{ id: 'DigiCert', name: 'DigiCert TSA', desc: '全球领先的 PKI 安全时间戳提供商', speed: '极速' },` |
| 27 | `{ id: 'Sectigo', name: 'Sectigo TSA', desc: 'Comodo 安全原子钟授时服务', speed: '极速' },` |
| 28 | `{ id: 'SSL.com', name: 'SSL.com TSA', desc: '北美可信第三方权威授时节点', speed: '稳定' },` |
| 29 | `{ id: 'FreeTSA', name: 'FreeTSA.org', desc: '开源高强密码学免费确权机构', speed: '中速' },` |
| 164 | `label="上传待签名确权 PDF"` |
| 165 | `description="将 PDF 文件拖放到此处。支持所有标准和加密 PDF 的自动解密载入。"` |
| 190 | `{totalPages > 0 ? `${totalPages} 页` : '载入元数据中...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 218 | `1. 选择受信任 TSA 服务器 (RFC 3161)` |
| 221 | `系统只发送无规律的 SHA-256 哈希值与服务器交互，绝对保障文档隐私。` |
| 255 | `tsa.speed === '极速' \|\| tsa.speed === '快速'` |
| 293 | `签署可信时间戳` |
| 311 | `<h4 className="text-sm font-bold text-[hsl(var(--color-foreground))]">等待时间戳确权签署</h4>` |
| 313 | `上传文件并选择 TSA，点击“签署可信时间戳”生成由权威授时中心盖章的加密证书凭证。` |
| 327 | `电子存证可信时间戳凭据` |
| 350 | `<p className="text-[10px] text-[hsl(var(--color-muted-foreground))] uppercase font-bold tracking-wider">TSA 原子钟授时时间 (UTC)</p>` |
| 359 | `<p className="text-[10px] text-[hsl(var(--color-muted-foreground))] uppercase font-bold tracking-wider">安全文件哈希校验和 (SHA-256)</p>` |
| 368 | `<p className="text-[10px] text-[hsl(var(--color-muted-foreground))] uppercase font-bold tracking-wider">授时权威商 (TSA)</p>` |
| 374 | `<p className="text-[10px] text-[hsl(var(--color-muted-foreground))] uppercase font-bold tracking-wider">证书序列号 (Serial)</p>` |

## 30. src\components\tools\vector-extractor\PDFVectorExtractorTool.tsx (11 matches)

| Line | Content |
|---|---|
| 259 | `label="上传需要提取矢量的 PDF 文件"` |
| 260 | `description="拖放带有徽标 Logo、插图、CAD 图表或复杂数学公式的 PDF。系统将把图层翻译为高保真 SVG 画布。"` |
| 286 | `{totalPages > 0 ? `共 ${totalPages} 页` : '载入元数据中...'} • {(file.size / (1024 * 1024)).toFixed(2)} MB` |
| 299 | `<span className="text-[11px] font-bold">第 {targetPage} 页</span>` |
| 329 | `移动鼠标悬停以 3D 包围高亮元素，点击选择。` |
| 362 | `矢量元素属性` |
| 369 | `<h4 className="text-xs font-bold text-[hsl(var(--color-foreground))]">未选中任何元素</h4>` |
| 370 | `<p className="text-[10px]">点击左侧画布上的任何矢量线条、文字或色块进行高保真单独提取。</p>` |
| 387 | `<Palette className="w-4 h-4" /> 色彩预填充 (RGB)` |
| 411 | `{copied ? '代码已复制' : '复制 SVG 源代码'}` |
| 422 | `下载选中矢量图` |

