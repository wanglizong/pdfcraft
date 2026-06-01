const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

// 我们设计这 133 个 keys 对应的多语言翻译字典
const dict = {
  // Eink Optimizer
  "common.einkOptimizer.otsueThresholdSuffix": {
    "en": " (Otsu Offset)", "zh": " (Otsu 阈值偏移)", "zh-TW": " (Otsu 閾值偏移)", "ja": " (大津しきい値オフセット)", "ko": " (오츠 임계값 오프셋)", "de": " (Otsu-Offset)", "es": " (Desviación Otsu)", "fr": " (Décalage d'Otsu)", "id": " (Offset Otsu)", "it": " (Offset Otsu)", "pt": " (Desvio Otsu)", "ro": " (Offset Otsu)", "vi": " (Độ lệch Otsu)", "ar": " (إزاحة أوتسو)"
  },
  "common.einkOptimizer.keepStrokes": {
    "en": "Preserve Handwriting Stroking", "zh": "保留手写笔迹", "zh-TW": "保留手寫筆跡", "ja": "手書きの筆跡を保持", "ko": "손글씨 필적 유지", "de": "Handschriftliche Pinselstriche beibehalten", "es": "Preservar trazos de escritura a mano", "fr": "Préserver les traits d'écriture manuscrite", "id": "Pertahankan Goresan Tulisan Tangan", "it": "Preserva tratti di scrittura a mano", "pt": "Preservar traços de manuscrito", "ro": "Păstrarea liniilor de scris de mână", "vi": "Giữ nét viết tay", "ar": "الحفاظ على خط اليد"
  },
  "common.einkOptimizer.stripBackground": {
    "en": "Strip Paper Noise & Dusts", "zh": "清除纸张杂色与灰尘", "zh-TW": "清除紙張雜色與灰塵", "ja": "用紙のノイズとホコリを除去", "ko": "종이 노이즈 및 먼지 제거", "de": "Papierrauschen & Staub entfernen", "es": "Eliminar ruido de papel y polvo", "fr": "Supprimer le bruit et la poussière du papier", "id": "Hapus Derau Kertas & Debu", "it": "Rimuovi rumore e polvere della carta", "pt": "Remover ruído de papel e poeira", "ro": "Eliminarea zgomotului și prafului de pe hârtie", "vi": "Xóa nhiễu nền và bụi", "ar": "إزالة ضوضاء الورق والغبار"
  },
  "common.einkOptimizer.dilationSuffix": {
    "en": " (Text Dilation)", "zh": " (文字加粗)", "zh-TW": " (文字加粗)", "ja": " (テキストの太字化)", "ko": " (텍스트 굵게)", "de": " (Textdehnung)", "es": " (Dilatación de texto)", "fr": " (Dilation de texte)", "id": " (Dilasi Teks)", "it": " (Dilatazione testo)", "pt": " (Dilatação de texto)", "ro": " (Dilatare text)", "vi": " (Giãn chữ)", "ar": " (تمديد النص)"
  },
  "common.einkOptimizer.microDilation": {
    "en": "Micro-Bold (1px)", "zh": "轻微加粗 (1px)", "zh-TW": "輕微加粗 (1px)", "ja": "極細の太字 (1px)", "ko": "미세 굵게 (1px)", "de": "Leicht fett (1px)", "es": "Micro-negrita (1px)", "fr": "Micro-gras (1px)", "id": "Sangat Tebal (1px)", "it": "Micro-grassetto (1px)", "pt": "Micro-negrito (1px)", "ro": "Micro-bold (1px)", "vi": "Làm đậm nhẹ (1px)", "ar": "تغميق خفيف (1 بكسل)"
  },
  "common.einkOptimizer.strongDilation": {
    "en": "Strong-Bold (2px)", "zh": "强力加粗 (2px)", "zh-TW": "強力加粗 (2px)", "ja": "太字 (2px)", "ko": "강하게 굵게 (2px)", "de": "Stark fett (2px)", "es": "Negrita fuerte (2px)", "fr": "Gras fort (2px)", "id": "Lebih Tebal (2px)", "it": "Grassetto forte (2px)", "pt": "Negrito forte (2px)", "ro": "Strong-bold (2px)", "vi": "Làm đậm mạnh (2px)", "ar": "تغميق قوي (2 بكسل)"
  },
  "common.einkOptimizer.afterLabel": {
    "en": "Optimized: Retina-grade High Contrast Text", "zh": "优化后：视网膜级高对比度文字", "zh-TW": "優化後：視網膜級高對比度文字", "ja": "最適化後：Retina級の高コントラストテキスト", "ko": "최적화 후: 레티나급 고대비 텍스트", "de": "Optimiert: Text mit hohem Kontrast in Retina-Qualität", "es": "Optimizado: Texto de alto contraste de calidad Retina", "fr": "Optimisé : Texte haute résolution à contraste élevé", "id": "Dioptimalkan: Teks Kontras Tinggi Tingkat Retina", "it": "Ottimizzato: Testo ad alto contrasto di qualità Retina", "pt": "Otimizado: Texto de alto contraste de qualidade Retina", "ro": "Optimizat: Text de înalt contrast la nivel Retina", "vi": "Đã tối ưu hóa: Văn bản tương phản cao sắc nét", "ar": "مُحسَّن: نص عالي التباين بجودة شاشة ريتنا"
  },
  "common.einkOptimizer.beforeSampleText": {
    "en": "The philosophy of education is the study of the purpose, nature, and effects of education...", "zh": "教育哲学是对教育目的、本质和影响的研究。广义上说，教育是社会传递其累积知识的过程...", "zh-TW": "教育哲學是對教育目的、本質和影響的研究。廣義上說，教育是社會傳遞其累積知識的過程...", "ja": "教育哲学とは、教育の目的、本質、および影響に関する研究です。広義には、教育とは社会がその蓄積された知識を伝達するプロセスです...", "ko": "교육 철학은 교육의 목적, 본질, 효과에 대한 연구입니다. 넓게 보면 교육은 사회가 축적된 지식을 전달하는 과정입니다...", "de": "Die Philosophie der Erziehung ist das Studium des Zwecks, der Natur und der Auswirkungen der Erziehung. Allgemein definiert ist Erziehung der Prozess, durch den die Gesellschaft ihr angesammeltes Wissen weitergibt...", "es": "La filosofía de la educación es el estudio del propósito, la naturaleza y los efectos de la educación. Definida a grandes rasgos, la educación es el proceso mediante el cual la sociedad transmite sus conocimientos acumulados...", "fr": "La philosophie de l'éducation est l'étude du but, de la nature et des effets de l'éducation. Définie au sens large, l'éducation est le processus par lequel la société transmet ses connaissances accumulées...", "id": "Filsafat pendidikan adalah studi tentang tujuan, hakikat, und dampak pendidikan. Secara luas, pendidikan adalah proses di mana masyarakat meneruskan pengetahuan yang diakumulasikannya...", "it": "La filosofia dell'educazione è lo studio dello scopo, della natura e degli effetti dell'educazione. In senso lato, l'educazione è il processo attraverso il quale la società trasmette le sue conoscenze accumulate...", "pt": "A filosofia da educação é o estudo do propósito, natureza e efeitos da educação. Definida de forma ampla, a educação é o processo pelo qual a sociedade transmite o seu conhecimento acumulado...", "ro": "Filozofia educației este studiul scopului, naturii și efectelor educației. Definită în sens larg, educația este procesul prin care societatea își transmite cunoștințele acumulate...", "vi": "Triết học giáo dục là nghiên cứu về mục đích, bản chất và ảnh hưởng của giáo dục. Định nghĩa rộng hơn, giáo dục là quá trình qua đó xã hội truyền tải kiến thức tích lũy của mình...", "ar": "فلسفة التربية هي دراسة الغرض من التعليم وطبيعته وآثاره. يُعرَّف التعليم بمعناه الواسع بأنه العملية التي ينقل بها المجتمع معرفته المتراكمة..."
  },
  "common.einkOptimizer.beforeLabel": {
    "en": "Original Scan: Dusty background with faint fonts", "zh": "原扫描件：带灰尘背景与暗淡文字", "zh-TW": "原掃描件：帶灰塵背景與暗淡文字", "ja": "元のスキャン：かすれたフォントとホコリの背景", "ko": "원본 스캔: 흐린 폰트와 지저분한 배경", "de": "Originalscan: Staubiger Hintergrund mit schwachen Schriftarten", "es": "Escaneo original: Fondo polvoriento con fuentes tenues", "fr": "Scan original : Fond poussiéreux avec polices pâles", "id": "Pindaian Asli: Latar belakang berdebu dengan font redup", "it": "Scansione originale: Sfondo polveroso con caratteri tenui", "pt": "Digitalização original: Fundo empoeirado com fontes fracas", "ro": "Scanare originală: Fundal cu praf și fonturi șterse", "vi": "Bản quét gốc: Nền nhiều bụi và chữ mờ", "ar": "المسح الأصلي: خلفية مغبرة مع خطوط باهتة"
  },

  // PDF Page Resizer Uniform
  "common.pdfPageResizerUniform.uploadLabel": {
    "en": "Upload PDF Documents to Resize", "zh": "上传需要调整尺寸的 PDF 文档", "zh-TW": "上傳需要調整尺寸的 PDF 文檔", "ja": "サイズ変更するPDFドキュメントをアップロード", "ko": "크기를 조정할 PDF 문서 업로드", "de": "PDF-Dokumente zum Anpassen hochladen", "es": "Subir documentos PDF para cambiar tamaño", "fr": "Téléverser les documents PDF à redimensionner", "id": "Unggah Dokumen PDF untuk Diubah Ukurannya", "it": "Carica documenti PDF da ridimensionare", "pt": "Carregar documentos PDF para redimensionar", "ro": "Încărcați documente PDF pentru redimensionare", "vi": "Tải lên tài liệu PDF để đổi kích thước", "ar": "تحميل مستندات PDF لتغيير حجمها"
  },
  "common.pdfPageResizerUniform.uploadDescription": {
    "en": "Scale and center-align varied page sizes (like A3, Letter, custom invoices) to uniform target layout sheet dimensions.",
    "zh": "将各种不同大小的页面尺寸（如A3、Letter、自定义发票）缩放并居中对齐，统一调整为标准的目标版面尺寸。",
    "zh-TW": "將各種不同大小的頁面尺寸（如A3、Letter、自定義發票）縮放並居中對齊，統一調整為標準的目标版面尺寸。",
    "ja": "さまざまなページサイズ（A3、レター、カスタム請求書など）を、統一されたターゲットレイアウトシートの寸法にスケーリングして中央揃えします。",
    "ko": "다양한 페이지 크기(A3, Letter, 사용자 정의 송장 등)를 균일한 대상 레이아웃 시트 크기로 조정하고 가운데로 정렬합니다.",
    "de": "Skalieren und zentrieren Sie unterschiedliche Seitengrößen (wie A3, Letter, benutzerdefinierte Rechnungen) auf einheitliche Layoutabmessungen.",
    "es": "Escale y centre diferentes tamaños de página (como A3, Carta, facturas personalizadas) a dimensiones de hoja uniformes.",
    "fr": "Mettre à l'échelle et centrer différentes tailles de pages (comme A3, Lettre, factures personnalisées) vers des dimensions uniformes.",
    "id": "Skala dan luruskan ukuran halaman yang bervariasi (seperti A3, Letter, faktur khusus) ke dimensi lembar tata letak target yang seragam.",
    "it": "Ridimensiona e centra le varie dimensioni di pagina (come A3, Letter, fatture personalizzate) a dimensioni uniformi della pagina di destinazione.",
    "pt": "Redimensionar e alinhar ao centro vários tamanhos de página (como A3, Carta, faturas personalizadas) para dimensões uniformes.",
    "ro": "Scalați și centrați pagini de diverse dimensiuni (cum ar fi A3, Letter, facturi personalizate) la dimensiuni uniforme ale colii de machetă.",
    "vi": "Tỷ lệ và căn giữa các kích thước trang khác nhau (như A3, Letter, hóa đơn tùy chỉnh) thành kích thước chuẩn thống nhất.",
    "ar": "توسيع وتوسيط أحجام الصفحات المتنوعة (مثل A3، وLetter، والفواتير المخصصة) إلى أبعاد ورقة تخطيط موحدة."
  },
  "common.pdfPageResizerUniform.magnifierTitle": {
    "en": "3D Uniform Multi-Size Page Tray", "zh": "3D 统一多尺寸页面托盘", "zh-TW": "3D 統一多尺寸頁面托盤", "ja": "3D統一マルチサイズページトレイ", "ko": "3D 균일 멀티 사이즈 페이지 트레이", "de": "3D-einheitliches Fach für mehrere Seitengrößen", "es": "Bandeja de páginas multitamano uniforme 3D", "fr": "Bac de pages multi-tailles uniforme 3D", "id": "Baki Halaman Multi-Ukuran Seragam 3D", "it": "Vassoio di pagine multi-dimensione uniforme 3D", "pt": "Bandeja de página multi-tamanho uniforme 3D", "ro": "Tavă 3D pentru pagini uniforme de dimensiuni multiple", "vi": "Khay trang đa kích thước thống nhất 3D", "ar": "صينية صفحات ثلاثية الأبعاد موحدة متعددة الأحجام"
  },
  "common.pdfPageResizerUniform.uniformHelp": {
    "en": "Various page shapes (A3, Letter, custom sheets) are scaled and aligned uniformly under the circular light beam.",
    "zh": "各种页面形状（A3、Letter、自定义纸张）将在圆形光束下统一缩放和对齐。",
    "zh-TW": "各種頁面形狀（A3、Letter、自定義紙張）將在圓形光束下統一縮放和對齊。",
    "ja": "さまざまなページ形状（A3、レター、カスタムシート）が、円形光線の下で均一にスケーリングされ整列されます。",
    "ko": "다양한 페이지 모양(A3, Letter, 사용자 정의 시트)이 원형 광선 아래에서 균일하게 조정되고 정렬됩니다.",
    "de": "Verschiedene Seitenformen (A3, Letter, benutzerdefinierte Blätter) werden unter dem kreisförmigen Lichtstrahl einheitlich skalierbar und ausgerichtet.",
    "es": "Varias formas de página (A3, Carta, hojas personalizadas) se escalan y alinean uniformemente bajo el haz de luz circular.",
    "fr": "Différentes formes de pages (A3, Lettre, feuilles personnalisées) sont mises à l'échelle et alignées sous le faisceau lumineux.",
    "id": "Berbagai bentuk halaman (A3, Letter, lembar khusus) diskalakan dan diratakan secara seragam di bawah sinar cahaya lingkaran.",
    "it": "Varie forme di pagina (A3, Letter, fogli personalizzati) sono ridimensionate e allineate in modo uniforme sotto il fascio di luce circolare.",
    "pt": "Várias formas de página (A3, Carta, folhas personalizadas) são dimensionadas e alinhadas uniformemente sob o feixe de luz circular.",
    "ro": "Diferite forme de pagini (A3, Letter, coli personalizate) sunt scalate și aliniate uniform sub fasciculul circular de lumină.",
    "vi": "Các hình dạng trang khác nhau (A3, Letter, trang tùy chỉnh) được điều chỉnh tỷ lệ và căn chỉnh đồng đều dưới luồng sáng tròn.",
    "ar": "يتم توسيع ومحاذاة أشكال الصفحات المختلفة (A3، Letter، الأوراق المخصصة) بشكل موحد تحت شعاع الضوء الدائري."
  },
  "common.pdfPageResizerUniform.optionsTitle": {
    "en": "Uniform Resize Settings", "zh": "统一尺寸设置", "zh-TW": "統一尺寸設置", "ja": "サイズ統一設定", "ko": "균일 크기 설정", "de": "Einstellungen zur einheitlichen Größenänderung", "es": "Configuración de tamaño uniforme", "fr": "Paramètres de redimensionnement uniforme", "id": "Pengaturan Ukuran Seragam", "it": "Impostazioni ridimensionamento uniforme", "pt": "Configurações de redimensionamento uniforme", "ro": "Setări de redimensionare uniformă", "vi": "Thiết lập đổi kích thước thống nhất", "ar": "إعدادات تغيير الحجم الموحدة"
  },
  "common.pdfPageResizerUniform.targetSpecLabel": {
    "en": "Target Uniform Paper Specification", "zh": "目标统一纸张规格", "zh-TW": "目標統一紙張規格", "ja": "統一対象の用紙仕様", "ko": "대상 균일 용지 규격", "de": "Ziel-Papierlaufbahn-Spezifikation", "es": "Especificación de papel uniforme objetivo", "fr": "Spécification du papier uniforme cible", "id": "Spesifikasi Kertas Target Seragam", "it": "Specifiche della carta uniforme di destinazione", "pt": "Especificação do papel uniforme de destino", "ro": "Specificație uniformă a hârtiei țintă", "vi": "Quy cách giấy chuẩn đích", "ar": "مواصفات الورق الموحد المستهدف"
  },
  "common.pdfPageResizerUniform.specA4": {
    "en": "A4 Standard Sheet (595 x 842 pt)", "zh": "A4 标准纸张 (595 x 842 pt)", "zh-TW": "A4 標準紙張 (595 x 842 pt)", "ja": "A4 標準シート (595 x 842 pt)", "ko": "A4 표준 시트 (595 x 842 pt)", "de": "A4 Standardblatt (595 x 842 Pt)", "es": "Hoja estándar A4 (595 x 842 pt)", "fr": "Feuille standard A4 (595 x 842 pt)", "id": "Lembar Standar A4 (595 x 842 pt)", "it": "Foglio standard A4 (595 x 842 pt)", "pt": "Folha padrão A4 (595 x 842 pt)", "ro": "Foaie standard A4 (595 x 842 pt)", "vi": "Trang tiêu chuẩn A4 (595 x 842 pt)", "ar": "ورقة A4 القياسية (595 × 842 نقطة)"
  },
  "common.pdfPageResizerUniform.specA3": {
    "en": "A3 Engineering Large (842 x 1191 pt)", "zh": "A3 工程大纸张 (842 x 1191 pt)", "zh-TW": "A3 工程大紙張 (842 x 1191 pt)", "ja": "A3 エンジニアリング大型シート (842 x 1191 pt)", "ko": "A3 엔지니어링 대형 시트 (842 x 1191 pt)", "de": "A3 Technisches Großformat (842 x 1191 Pt)", "es": "Grande ingeniería A3 (842 x 1191 pt)", "fr": "Grand format A3 Ingénierie (842 x 1191 pt)", "id": "A3 Teknik Besar (842 x 1191 pt)", "it": "Foglio grande A3 per ingegneria (842 x 1191 pt)", "pt": "Folha grande de engenharia A3 (842 x 1191 pt)", "ro": "Foaie mare de inginerie A3 (842 x 1191 pt)", "vi": "Khổ lớn thiết kế A3 (842 x 1191 pt)", "ar": "ورقة هندسية كبيرة A3 (842 × 1191 نقطة)"
  },
  "common.pdfPageResizerUniform.specLetter": {
    "en": "US Letter Size (612 x 792 pt)", "zh": "美标 Letter 尺寸 (612 x 792 pt)", "zh-TW": "美標 Letter 尺寸 (612 x 792 pt)", "ja": "US レターサイズ (612 x 792 pt)", "ko": "미국 레터 크기 (612 x 792 pt)", "de": "US Letter-Format (612 x 792 Pt)", "es": "Tamaño Carta EE. UU. (612 x 792 pt)", "fr": "Format Lettre US (612 x 792 pt)", "id": "Ukuran Surat AS (612 x 792 pt)", "it": "Dimensione US Letter (612 x 792 pt)", "pt": "Tamanho Carta EUA (612 x 792 pt)", "ro": "Dimensiune scrisoare SUA (612 x 792 pt)", "vi": "Kích thước Letter Mỹ (612 x 792 pt)", "ar": "حجم رسالة الولايات المتحدة (612 × 792 نقطة)"
  },
  "common.pdfPageResizerUniform.scaleModeLabel": {
    "en": "Scaling & Margin Padding Mode", "zh": "缩放与边距填充模式", "zh-TW": "縮放與邊距填充模式", "ja": "スケーリングと余白パディングモード", "ko": "크기 조절 및 여백 채우기 모드", "de": "Skalierungs- & Randausfüllmodus", "es": "Modo de escalado y relleno de margen", "fr": "Mode de mise à l'échelle et de remplissage des marges", "id": "Mode Penskalaan & Pengisi Margin", "it": "Modalità di ridimensionamento e riempimento dei margini", "pt": "Modo de dimensionamento e preenchimento de margem", "ro": "Mod de scalare și umplere a marginilor", "vi": "Chế độ thu phóng và căn lề", "ar": "وضع التوسيع وتعبئة الهوامش"
  },
  "common.pdfPageResizerUniform.modeFit": {
    "en": "Adaptive Fit (Aspect ratio kept, padded margins)", "zh": "自适应合适尺寸 (保持宽高比，留白填充)", "zh-TW": "自適應合適尺寸 (保持寬高比，留白填充)", "ja": "自動フィット (等倍比率維持、余白を追加)", "ko": "자동 맞춤 (종횡비 유지, 여백 추가)", "de": "Adaptive Anpassung (Seitenverhältnis beibehalten, Ränder aufgefüllt)", "es": "Ajuste adaptativo (Relación de aspecto mantenida, márgenes rellenos)", "fr": "Ajustement adaptatif (Ratio d'aspect conservé, marges remplies)", "id": "Kecocokan Adaptif (Aspek rasio dipertahankan, margin diisi)", "it": "Adattamento adattivo (Rapporto d'aspetto mantenuto, margini riempiti)", "pt": "Ajuste adaptativo (Proporção mantida, margens preenchidas)", "ro": "Potrivire adaptivă (Raport de aspect păstrat, margini umplute)", "vi": "Tự động vừa khít (Giữ tỷ lệ khung hình, thêm viền lề)", "ar": "ملاءمة تكيفية (مع الحفاظ على نسبة العرض إلى الارتفاع وهوامش معبأة)"
  },
  "common.pdfPageResizerUniform.modeFill": {
    "en": "Aspect Fill (Aspect ratio kept, centered crop)", "zh": "等比填充裁剪 (保持宽高比，居中裁剪)", "zh-TW": "等比填充裁剪 (保持寬高比，居中裁剪)", "ja": "アスペクトフィル (等倍比率維持、中央トリミング)", "ko": "비율 채우기 (종횡비 유지, 중앙 자르기)", "de": "Ausfüllen (Seitenverhältnis beibehalten, zentrierter Zuschnitt)", "es": "Relleno de aspecto (Relación de aspecto mantenida, recorte centrado)", "fr": "Remplissage d'aspect (Ratio d'aspect conservé, découpe centrée)", "id": "Isian Aspek (Aspek rasio dipertahankan, potong tengah)", "it": "Riempimento aspetto (Rapporto d'aspetto mantenuto, ritaglio centrato)", "pt": "Preenchimento de proporção (Proporção mantida, corte centrado)", "ro": "Umplere aspect (Raport de aspect păstrat, decupare centrată)", "vi": "Lấp đầy khung hình (Giữ tỷ lệ, cắt ở giữa)", "ar": "تعبئة المظهر (مع الحفاظ على نسبة العرض إلى الارتفاع واقتصاص ممركز)"
  },
  "common.pdfPageResizerUniform.processButton": {
    "en": "Unify Dimensions Layout", "zh": "统一页面尺寸", "zh-TW": "統一頁面尺寸", "ja": "レイアウト寸法を統一", "ko": "레이아웃 크기 통일", "de": "Layoutabmessungen vereinheitlichen", "es": "Unificar diseño de dimensiones", "fr": "Unifier les dimensions de mise en page", "id": "Satukan Tata Letak Dimensi", "it": "Unifica le dimensioni del layout", "pt": "Unificar layout de dimensões", "ro": "Unificarea dimensiunilor machetei", "vi": "Thống nhất khổ trang", "ar": "توحيد تخطيط الأبعاد"
  },

  // PDF Spine Bookbinder
  "common.pdfSpineBookbinder.magnifierTitle": {
    "en": "3D Book Binding Crease Model (Drag mouse to rotate)", "zh": "3D 装订折痕模型 (拖动鼠标旋转)", "zh-TW": "3D 裝訂折痕模型 (拖動滑鼠旋轉)", "ja": "3D製本折り目モデル (マウスドラッグで回転)", "ko": "3D 도서 제본 주름 모델 (마우스로 드래그하여 회전)", "de": "3D-Buchbindung-Falzmodell (Zum Drehen ziehen)", "es": "Modelo de pliegue de encuadernación de libros 3D (Arrastrar para girar)", "fr": "Modèle de pli de reliure 3D (Glisser la souris pour tourner)", "id": "Model Lipatan Penjilidan Buku 3D (Seret mouse untuk memutar)", "it": "Modello di piegatura della rilegatura in 3D (Trascina il mouse per ruotare)", "pt": "Modelo de dobra de encadernação de livros 3D (Arraste para girar)", "ro": "Model 3D de pliere pentru legarea cărților (Trageți cu mouse-ul pentru a roti)", "vi": "Mô hình nếp gấp gáy sách 3D (Kéo chuột để xoay)", "ar": "نموذج تجعيد تجليد الكتب ثلاثي الأبعاد (اسحب بالماوس للتدوير)"
  },
  "common.pdfSpineBookbinder.optionsTitle": {
    "en": "Bookbinder Spine Settings", "zh": "书脊装订参数设置", "zh-TW": "書脊裝訂參數設置", "ja": "ブックバインダー背表紙設定", "ko": "제본 책등 설정", "de": "Buchbinder-Buchrücken-Einstellungen", "es": "Configuración del lomo de encuadernación", "fr": "Paramètres du dos de reliure", "id": "Pengaturan Punggung Buku Penjilidan", "it": "Impostazioni dorso del rilegatore", "pt": "Configurações do lomo de encadernação", "ro": "Setări cotor pentru legarea cărților", "vi": "Thiết lập gáy sách", "ar": "إعدادات كعب تجليد الكتب"
  },
  "common.pdfSpineBookbinder.spineTextLabel": {
    "en": "Spine Engraving Text", "zh": "书脊刻印文字", "zh-TW": "書脊刻印文字", "ja": "背表紙の刻印テキスト", "ko": "책등 새김 텍스트", "de": "Buchrücken-Prägungstext", "es": "Texto grabado en el lomo", "fr": "Texte gravé sur le dos", "id": "Teks Ukiran Punggung Buku", "it": "Testo incisione dorso", "pt": "Texto gravado no lomo", "ro": "Text gravat pe cotor", "vi": "Chữ khắc trên gáy sách", "ar": "نص نقش كعب الكتاب"
  },
  "common.pdfSpineBookbinder.spineTextPlaceholder": {
    "en": "e.g., Thesis / Commercial Agreement", "zh": "例如：毕业论文 / 商业合同", "zh-TW": "例如：畢業論文 / 商業合同", "ja": "例：学位論文 / 商業協定", "ko": "예: 학위 논문 / 상업 협정", "de": "z.B. Abschlussarbeit / Handelsvertrag", "es": "ej. Tesis / Acuerdo comercial", "fr": "ex. Thèse / Contrat commercial", "id": "misal, Tesis / Perjanjian Komersial", "it": "es. Tesi / Accordo commerciale", "pt": "ex. Tese / Contrato comercial", "ro": "ex. Teză / Acord comercial", "vi": "Ví dụ: Luận văn / Hợp đồng thương mại", "ar": "مثال: أطروحة / اتفاقية تجارية"
  },
  "common.pdfSpineBookbinder.totalPagesLabel": {
    "en": "Total Binding Page Sides (Pages)", "zh": "装订总面数 (页)", "zh-TW": "裝訂總面數 (頁)", "ja": "製本総ページ数 (ページ数)", "ko": "총 제본 페이지 수 (페이지)", "de": "Gesamte Buchbindeseiten (Seiten)", "es": "Páginas totales de encuadernación (Páginas)", "fr": "Nombre total de pages à relier (Pages)", "id": "Total Halaman Penjilidan (Halaman)", "it": "Pagine totali della rilegatura (Pagine)", "pt": "Total de páginas de encadernação (Páginas)", "ro": "Total pagini de legat (Pagini)", "vi": "Tổng số trang đóng (Trang)", "ar": "إجمالي صفحات التجليد (صفحات)"
  },
  "common.pdfSpineBookbinder.gsmLabel": {
    "en": "Inside Paper Density Weight (GSM)", "zh": "内页纸张克重 (GSM)", "zh-TW": "內頁紙張克重 (GSM)", "ja": "本文用紙の紙厚/坪量 (GSM)", "ko": "내지 종이 무게 (GSM)", "de": "Papierdichte der Innenseiten (GSM)", "es": "Gramaje del papel interior (GSM)", "fr": "Grammage du papier intérieur (GSM)", "id": "Berat Kerapatan Kertas Dalam (GSM)", "it": "Grammatura carta interna (GSM)", "pt": "Gramatura do papel interno (GSM)", "ro": "Gramaj hârtie interioară (GSM)", "vi": "Độ dày/Định lượng giấy ruột (GSM)", "ar": "وزن كثافة الورق الداخلي (جرام لكل متر مربع)"
  },
  "common.pdfSpineBookbinder.gsm80": {
    "en": "80g Standard Office Paper (0.05mm/side)", "zh": "80g 标准复印纸 (单页 0.05mm)", "zh-TW": "80g 標準複印紙 (單頁 0.05mm)", "ja": "80g 標準コピー用紙 (片面0.05mm)", "ko": "80g 표준 사무용 종이 (단면 0.05mm)", "de": "80g Standard-Büropapier (0,05mm/Seite)", "es": "Papel de oficina estándar 80g (0.05mm/lado)", "fr": "Papier de bureau standard 80g (0,05mm/page)", "id": "Kertas Kantor Standar 80g (0,05mm/halaman)", "it": "Carta standard da ufficio da 80g (0,05mm/pagina)", "pt": "Papel de escritório padrão 80g (0,05mm/lado)", "ro": "Hârtie de birou standard 80g (0,05mm/pagină)", "vi": "Giấy văn phòng chuẩn 80g (0.05mm/trang)", "ar": "ورق مكتب قياسي 80 جرام (0.05 مم/جانب)"
  },
  "common.pdfSpineBookbinder.gsm100": {
    "en": "100g Smooth Coated Paper (0.06mm/side)", "zh": "100g 高档双胶纸 (单页 0.06mm)", "zh-TW": "100g 高檔雙膠紙 (單頁 0.06mm)", "ja": "100g 上質紙 (片面0.06mm)", "ko": "100g 부드러운 코팅지 (단면 0.06mm)", "de": "100g Glattes gestrichenes Papier (0,06mm/Seite)", "es": "Papel estucado suave 100g (0.06mm/lado)", "fr": "Papier couché lisse 100g (0,06mm/page)", "id": "Kertas Coated Halus 100g (0,06mm/halaman)", "it": "Carta patinata liscia da 100g (0,06mm/pagina)", "pt": "Papel revestido liso 100g (0,06mm/lado)", "ro": "Hârtie lucioasă 100g (0,06mm/pagină)", "vi": "Giấy couche mịn 100g (0.06mm/trang)", "ar": "ورق مصقول ناعم 100 جرام (0.06 مم/جانب)"
  },
  "common.pdfSpineBookbinder.gsm120": {
    "en": "120g Matte Art Paper (0.07mm/side)", "zh": "120g 哑粉纸/艺术纸 (单页 0.07mm)", "zh-TW": "120g 啞粉紙/藝術紙 (單頁 0.07mm)", "ja": "120g マットアート紙 (片面0.07mm)", "ko": "120g 무광 아트지 (단면 0.07mm)", "de": "120g Mattes Bilderdruckpapier (0,07mm/Seite)", "es": "Papel mate artístico 120g (0.07mm/lado)", "fr": "Papier couché mat 120g (0,07mm/page)", "id": "Kertas Seni Matte 120g (0,07mm/halaman)", "it": "Carta patinata opaca da 120g (0,07mm/pagina)", "pt": "Papel mate artístico 120g (0,07mm/lado)", "ro": "Hârtie mată artă 120g (0,07mm/pagină)", "vi": "Giấy mỹ thuật mờ 120g (0.07mm/trang)", "ar": "ورق فني مطفأ 120 جرام (0.07 مم/جانب)"
  },
  "common.pdfSpineBookbinder.gsm150": {
    "en": "150g Heavy Matte Cardboard (0.09mm/side)", "zh": "150g 厚涂布纸/轻卡纸 (单页 0.09mm)", "zh-TW": "150g 厚塗布紙/輕卡紙 (單頁 0.09mm)", "ja": "150g 厚手マットコート紙 (片面0.09mm)", "ko": "150g 두꺼운 무광 카드보드 (단면 0.09mm)", "de": "150g Schwerer matter Karton (0,09mm/Seite)", "es": "Cartulina mate pesada 150g (0.09mm/lado)", "fr": "Carton mat lourd 150g (0,09mm/page)", "id": "Karton Matte Tebal 150g (0,09mm/halaman)", "it": "Cartoncino opaco pesante da 150g (0,09mm/pagina)", "pt": "Cartolina mate pesada 150g (0,09mm/lado)", "ro": "Carton mat gros 150g (0,09mm/pagină)", "vi": "Bìa giấy mờ dày 150g (0.09mm/trang)", "ar": "ورق مقوى مطفأ ثقيل 150 جرام (0.09 مم/جانب)"
  },
  "common.pdfSpineBookbinder.processButton": {
    "en": "Compile Binder Crease Cover", "zh": "生成装订书脊封面", "zh-TW": "生成裝訂書脊封面", "ja": "製本折り目カバーを作成", "ko": "제본 책등 커버 컴파일", "de": "Bindungsfalz-Cover kompilieren", "es": "Compilar portada de encuadernación", "fr": "Générer la couverture de reliure", "id": "Kompilasi Sampul Lipatan Penjilid", "it": "Genera copertina della rilegatura", "pt": "Compilar capa de encadernação", "ro": "Compilați coperta pentru legarea cărților", "vi": "Tạo bìa nếp gấp đóng sách", "ar": "إنشاء غلاف تجعيد المجلد"
  },

  // PDF Lossless Slicer
  "common.pdfLosslessSlicer.uploadLabel": {
    "en": "Upload Ultra-Large CAD PDF Blueprint", "zh": "上传超大 CAD PDF 图纸", "zh-TW": "上傳超大 CAD PDF 圖紙", "ja": "超大型CAD PDF図面をアップロード", "ko": "초대형 CAD PDF 청사진 업로드", "de": "Übergroßen CAD-PDF-Entwurf hochladen", "es": "Subir plano CAD PDF ultra grande", "fr": "Téléverser le plan CAD PDF ultra-large", "id": "Unggah Cetak Biru PDF CAD Sangat Besar", "it": "Carica disegno CAD PDF di dimensioni extra large", "pt": "Carregar desenho CAD PDF ultra grande", "ro": "Încărcați proiectul PDF CAD extrem de mare", "vi": "Tải lên bản vẽ CAD PDF cực lớn", "ar": "تحميل مخططات CAD PDF فائقة الضخامة"
  },
  "common.pdfLosslessSlicer.uploadDescription": {
    "en": "Rewrites MediaBox viewport matrix. Physically slices local regions without rendering to blurry images, retaining clear vectors.",
    "zh": "通过重写 MediaBox 视口矩阵，物理切割局部区域。不经过栅格化渲染，绝不模糊，100% 保留清晰矢量线条。",
    "zh-TW": "通過重寫 MediaBox 視口矩陣，物理切割局部區域。不經過柵格化渲染，絕不模糊，100% 保留清晰矢量線條。",
    "ja": "MediaBoxビューポートマトリクスを書き換えます。不鮮明な画像にレンダリングすることなく、ローカル領域を物理的にスライスし、クリアなベクターを維持します。",
    "ko": "MediaBox 뷰포트 행렬을 재작성합니다. 흐린 이미지로 렌더링하지 않고 로컬 영역을 물리적으로 슬라이스하여 선명한 벡터를 유지합니다.",
    "de": "Schreibt die MediaBox-Viewport-Matrix neu. Schneidet lokale Bereiche physikalisch aus, ohne in unscharfe Bilder zu rendern, und erhält klare Vektoren.",
    "es": "Reescribe la matriz de visualización de MediaBox. Corta físicamente regiones locales sin renderizar a imágenes borrosas, conservando vectores claros.",
    "fr": "Réécrit la matrice d'affichage de la MediaBox. Découpe physiquement les zones sans tramage en images floues, conservant les vecteurs nets.",
    "id": "Menulis ulang matriks viewport MediaBox. Mengiris wilayah lokal secara fisik tanpa merender gambar menjadi buram, mempertahankan vektor yang jelas.",
    "it": "Riscrive la matrice della finestra di visualizzazione di MediaBox. Taglia fisicamente le regioni locali senza rendering in immagini sfocate, mantenendo vettori nitidi.",
    "pt": "Reescreve a matriz da janela de visualização do MediaBox. Corta fisicamente regiões locais sem renderizar para imagens borradas, retendo vetores claros.",
    "ro": "Rescrie matricea ferestrei de vizualizare MediaBox. Decupează fizic regiunile locale fără redare în imagini neclare, păstrând vectorii clari.",
    "vi": "Ghi đè ma trận chế độ xem MediaBox. Cắt vùng cục bộ mà không render thành ảnh mờ, giữ nguyên các nét vẽ vector sắc nét.",
    "ar": "إعادة كتابة مصفوفة منفذ العرض MediaBox. يقتص ماديًا المناطق المحلية دون تحويلها لصور ضبابية، مع الاحتفاظ بمتجهات واضحة."
  },
  "common.pdfLosslessSlicer.magnifierTitle": {
    "en": "Laser Crop Matrix (Drag and scale visual crop borders)", "zh": "激光裁剪网格 (拖动并缩放可视化裁剪边框)", "zh-TW": "激光裁剪網格 (拖動並縮放可視化裁剪邊框)", "ja": "レーザークロップマトリクス (切り取り境界線をドラッグ＆スケール)", "ko": "레이저 크롭 행렬 (시각적 자르기 테두리 드래그 및 크기 조절)", "de": "Laser-Zuschnitt-Matrix (Zuschnittränder ziehen und skalieren)", "es": "Matriz de recorte láser (Arrastrar y escalar bordes visuales)", "fr": "Matrice de découpe laser (Glisser et ajuster les bordures de recadrage)", "id": "Matriks Pangkas Laser (Seret dan skala batas pangkasan)", "it": "Matrice di ritaglio laser (Trascina e ridimensiona i bordi di ritaglio)", "pt": "Matriz de corte a laser (Arraste e dimensione as bordas de corte)", "ro": "Matrice de decupare laser (Trageți și scalați marginile vizuale)", "vi": "Khung cắt Laser (Kéo và chỉnh kích thước biên cắt)", "ar": "مصفوفة اقتصاص الليزر (اسحب وحدد حجم حدود الاقتصاص المرئية)"
  },
  "common.pdfLosslessSlicer.optionsTitle": {
    "en": "Lossless Laser Slicer Settings", "zh": "无损激光切片设置", "zh-TW": "無損激光切片設置", "ja": "無劣化レーザースライサー設定", "ko": "무손실 레이저 슬라이서 설정", "de": "Einstellungen für verlustfreien Laser-Schnitt", "es": "Configuración de cortador láser sin pérdidas", "fr": "Paramètres de découpe laser sans perte", "id": "Pengaturan Pemotong Laser Tanpa Kerugian", "it": "Impostazioni taglierina laser senza perdita", "pt": "Configurações de corte a laser sem perdas", "ro": "Setări pentru decuparea laser fără pierderi", "vi": "Thiết lập cắt Laser không hao hao", "ar": "إعدادات أداة اقتصاص الليزر بدون فقدان"
  },
  "common.pdfLosslessSlicer.targetPageLabel": {
    "en": "Target Slice Page", "zh": "目标裁剪页面", "zh-TW": "目標裁剪頁面", "ja": "対象のスライス対象ページ", "ko": "대상 슬라이스 페이지", "de": "Ziel-Schnittseite", "es": "Página de corte objetivo", "fr": "Page cible pour la découpe", "id": "Halaman Target Irisan", "it": "Pagina di ritaglio di destinazione", "pt": "Página de corte de destino", "ro": "Pagina țintă pentru decupat", "vi": "Trang cắt đích", "ar": "صفحة الاقتصاص المستهدفة"
  },
  "common.pdfLosslessSlicer.sliceWidth": {
    "en": "Slice Width: {percent}%", "zh": "裁剪宽度: {percent}%", "zh-TW": "裁剪寬度: {percent}%", "ja": "スライス幅: {percent}%", "ko": "슬라이스 너비: {percent}%", "de": "Schnittbreite: {percent}%", "es": "Ancho de corte: {percent}%", "fr": "Largeur de découpe : {percent}%", "id": "Lebar Irisan: {percent}%", "it": "Larghezza ritaglio: {percent}%", "pt": "Largura de corte: {percent}%", "ro": "Lățime decupaj: {percent}%", "vi": "Chiều rộng cắt: {percent}%", "ar": "عرض الاقتصاص: {percent}%"
  },
  "common.pdfLosslessSlicer.sliceHeight": {
    "en": "Slice Height: {percent}%", "zh": "裁剪高度: {percent}%", "zh-TW": "裁剪高度: {percent}%", "ja": "スライス高さ: {percent}%", "ko": "슬라이스 높이: {percent}%", "de": "Schnitthöhe: {percent}%", "es": "Alto de corte: {percent}%", "fr": "Hauteur de découpe : {percent}%", "id": "Tinggi Irisan: {percent}%", "it": "Altezza ritaglio: {percent}%", "pt": "Altura de corte: {percent}%", "ro": "Înălțime decupaj: {percent}%", "vi": "Chiều cao cắt: {percent}%", "ar": "ارتفاع الاقتصاص: {percent}%"
  },
  "common.pdfLosslessSlicer.processButton": {
    "en": "Slice Lossless local Matrix", "zh": "导出局部无损区域", "zh-TW": "導出局部無損區域", "ja": "局所無劣化マトリクスを切り出し", "ko": "로컬 무손실 행렬 슬라이스", "de": "Lokalen Bereich verlustfrei ausschneiden", "es": "Cortar matriz local sin pérdidas", "fr": "Extraire la zone locale sans perte", "id": "Iris Matriks Lokal Tanpa Kerugian", "it": "Taglia la matrice locale senza perdite", "pt": "Cortar matriz local sem perdas", "ro": "Decupează matricea locală fără pierderi", "vi": "Cắt vùng cục bộ không hao hao", "ar": "اقتصاص مصفوفة محلية بدون فقدان"
  },

  // Compress
  "common.compress.sliderTooltip": {
    "en": "Drag the slider to compare original vs optimized quality (Page 1)",
    "zh": "拖动滑块对比原始与压缩优化后的质量 (第 1 页)",
    "zh-TW": "拖動滑塊對比原始與壓縮優化後的質量 (第 1 頁)",
    "ja": "スライダーをドラッグして、圧縮前と最適化後の画質を比較 (ページ 1)",
    "ko": "슬라이더를 드래그하여 압축 전후의 품질을 비교 (1 페이지)",
    "de": "Ziehen Sie den Schieberegler, um die Original- mit der optimierten Qualität zu vergleichen (Seite 1)",
    "es": "Arrastre el deslizador para comparar calidad original vs optimizada (Pág. 1)",
    "fr": "Glisser le curseur pour comparer la qualité originale et optimisée (Page 1)",
    "id": "Seret penggeser untuk membandingkan kualitas asli vs kualitas dioptimalkan (Halaman 1)",
    "it": "Trascina il cursore per confrontare la qualità originale con quella ottimizzata (Pagina 1)",
    "pt": "Arraste o controle deslizante para comparar a qualidade original e otimizada (Página 1)",
    "ro": "Trageți glisorul pentru a compara calitatea originală cu cea optimizată (Pagina 1)",
    "vi": "Kéo thanh trượt để so sánh chất lượng gốc và đã tối ưu (Trang 1)",
    "ar": "اسحب الشريط المقارنة بين الجودة الأصلية والمحسنة (الصفحة 1)"
  },
  "common.compress.sizeShrink": {
    "en": "Volume Reduction (Light)", "zh": "体积减小 (轻度)", "zh-TW": "體積減小 (輕度)", "ja": "容量縮小 (軽度)", "ko": "용량 축소 (약하게)", "de": "Volumenreduzierung (Leicht)", "es": "Reducción de tamaño (Ligera)", "fr": "Réduction de taille (Légère)", "id": "Pengurangan Ukuran (Ringan)", "it": "Riduzione volume (Leggera)", "pt": "Redução de volume (Leve)", "ro": "Reducere volum (Ușoară)", "vi": "Giảm dung lượng (Nhẹ)", "ar": "تقليص الحجم (خفيف)"
  },
  "common.compress.pixelSharpness": {
    "en": "Pixel Clarity (Heavy)", "zh": "像素清晰度 (重度)", "zh-TW": "像素清晰度 (重度)", "ja": "画質鮮明度 (重度)", "ko": "화질 선명도 (강하게)", "de": "Pixelschärfe (Stark)", "es": "Claridad de píxeles (Fuerte)", "fr": "Clarté des pixels (Forte)", "id": "Kejelasan Piksel (Berat)", "it": "Nitidezza dei pixel (Forte)", "pt": "Nitidez dos pixels (Forte)", "ro": "Claritate pixeli (Intensă)", "vi": "Độ sắc nét điểm ảnh (Mạnh)", "ar": "وضوح البكسل (قوي)"
  },
  "common.compress.qualityTitle": {
    "en": "Optimization Quality Level", "zh": "压缩优化质量等级", "zh-TW": "壓縮優化質量等級", "ja": "最適化品質レベル", "ko": "최적화 품질 등급", "de": "Optimierungsqualitätsstufe", "es": "Nivel de calidad de optimización", "fr": "Niveau de qualité de l'optimisation", "id": "Tingkat Kualitas Optimasi", "it": "Livello di qualità dell'ottimizzazione", "pt": "Nível de qualidade de otimização", "ro": "Nivel de calitate optimizare", "vi": "Mức độ chất lượng tối ưu hóa", "ar": "مستوى جودة التحسين"
  },
  "common.compress.qualityLow": {
    "en": "Low Quality", "zh": "低画质高压缩", "zh-TW": "低畫質高壓縮", "ja": "低画質・高圧縮", "ko": "낮은 품질", "de": "Niedrige Qualität", "es": "Baja calidad", "fr": "Qualité faible", "id": "Kualitas Rendah", "it": "Bassa qualità", "pt": "Qualidade baixa", "ro": "Calitate scăzută", "vi": "Chất lượng thấp", "ar": "جودة منخفضة"
  },
  "common.compress.qualityMedium": {
    "en": "Medium Balanced", "zh": "中等平衡压缩", "zh-TW": "中等平衡壓縮", "ja": "標準・バランス型", "ko": "중간 균형", "de": "Mittlere Balance", "es": "Calidad media equilibrada", "fr": "Moyenne équilibrée", "id": "Kualitas Sedang Seimbang", "it": "Media bilanciata", "pt": "Qualidade média equilibrada", "ro": "Calitate medie echilibrată", "vi": "Cân bằng trung bình", "ar": "جودة متوازنة متوسطة"
  },
  "common.compress.qualityHigh": {
    "en": "High Quality", "zh": "高画质轻度压缩", "zh-TW": "高畫質輕度壓縮", "ja": "高画質・低圧縮", "ko": "높은 품질", "de": "Hohe Qualität", "es": "Alta calidad", "fr": "Qualité élevée", "id": "Kualitas Tinggi", "it": "Alta qualità", "pt": "Qualidade alta", "ro": "Calitate ridicată", "vi": "Chất lượng cao", "ar": "جودة عالية"
  },
  "common.compress.qualityMaximum": {
    "en": "Maximum Quality (Lossless)", "zh": "极佳无损优化", "zh-TW": "極佳無損優化", "ja": "最高品質・無劣化", "ko": "최고 품질 (무손실)", "de": "Maximale Qualität (Verlustfrei)", "es": "Calidad máxima (Sin pérdidas)", "fr": "Qualité maximale (Sans perte)", "id": "Kualitas Maksimal (Tanpa Kerugian)", "it": "Qualità massima (Senza perdite)", "pt": "Qualidade máxima (Sem perdas)", "ro": "Calitate maximă (Fără pierderi)", "vi": "Chất lượng tối đa (Không hao)", "ar": "جودة قصوى (بدون فقدان)"
  },
  "common.compress.descLow": {
    "en": "Highly compressed (60%-80% size reduction). Best for pure texts and receipts.",
    "zh": "高度压缩 (减小体积 60%-80%)。最适用于纯文本与收据发票。",
    "zh-TW": "高度壓縮 (減小體積 60%-80%)。最適用於純文本與收據發票。",
    "ja": "高圧縮 (容量を60%〜80%削減)。純テキストやレシートに最適です。",
    "ko": "높은 압축 (용량 60%-80% 감소). 텍스트 위주 문서와 영수증에 최적화.",
    "de": "Stark komprimiert (60-80 % Größenreduzierung). Bestens geeignet für reinen Text und Belege.",
    "es": "Altamente comprimido (reducción del 60%-80%). Ideal para textos puros y recibos.",
    "fr": "Très compressé (réduction de 60 à 80 %). Idéal pour les textes seuls et les reçus.",
    "id": "Sangat dikompresi (pengurangan ukuran 60%-80%). Terbaik untuk teks murni dan kuitansi.",
    "it": "Altamente compresso (riduzione del 60%-80% delle dimensioni). Ideale per soli testi e ricevute.",
    "pt": "Altamente compactado (redução de 60%-80%). Ideal para texto puro e recibos.",
    "ro": "Foarte comprimat (reducere de 60%-80%). Excelent pentru documente cu text simplu și chitanțe.",
    "vi": "Nén ở mức cao (giảm 60%-80% dung lượng). Tốt nhất cho văn bản thuần túy và hóa đơn.",
    "ar": "مضغوط بشدة (تقليص الحجم بنسبة 60%-80%). الأفضل للنصوص البسيطة والإيصالات."
  },
  "common.compress.descMedium": {
    "en": "Balanced (40% size reduction). Preserves crisp font shapes and layout edges.",
    "zh": "中等平衡压缩 (减小体积 40%)。保留清晰的字体轮廓和版面布局边缘。",
    "zh-TW": "中等平衡壓縮 (減小體積 40%)。保留清晰的字體輪廓和版面布局邊緣。",
    "ja": "バランス型 (容量を40%削減)。はっきりとしたフォント形状とレイアウトエッジを維持します。",
    "ko": "균형 잡힌 압축 (용량 40% 감소). 선명한 글꼴 형태와 레이아웃 가장자리 유지.",
    "de": "Ausgewogen (40 % Größenreduzierung). Erhält scharfe Schriftformen und Layoutkanten.",
    "es": "Equilibrado (reducción del 40%). Conserva formas de fuente y bordes de diseño nítidos.",
    "fr": "Équilibré (réduction de 40 %). Conserve la netteté des polices et des bordures.",
    "id": "Seimbang (pengurangan ukuran 40%). Mempertahankan bentuk font yang tajam dan tepi tata letak.",
    "it": "Bilanciato (riduzione del 40% delle dimensioni). Preserva forme dei caratteri e bordi di layout definiti.",
    "pt": "Equilibrado (redução de 40%). Preserva formas de fontes nítidas e bordas de layout.",
    "ro": "Echilibrat (reducere de 40%). Păstrează conturul clar al fonturilor și marginile machetei.",
    "vi": "Cân bằng (giảm 40% dung lượng). Giữ nguyên hình dáng chữ và lề bố cục sắc nét.",
    "ar": "متوازن (تقليص الحجم بنسبة 40%). يحافظ على أشكال الخطوط وحواف التخطيط الواضحة."
  },
  "common.compress.descHigh": {
    "en": "Preserves high color dynamics and photo resolutions with slight compression.",
    "zh": "保留高动态色彩和照片分辨率，仅进行轻度压缩。",
    "zh-TW": "保留高動態色彩和照片分辨率，僅進行輕度壓縮。",
    "ja": "わずかな圧縮で、高い色ダイナミクスと写真の解像度を維持します。",
    "ko": "가벼운 압축으로 풍부한 색상 대비와 사진 해상도를 그대로 유지.",
    "de": "Erhält hohe Farbdynamik und Bildauflösungen bei geringer Komprimierung.",
    "es": "Conserva la dinámica del color y resoluciones fotográficas con compresión leve.",
    "fr": "Conserve les dynamiques de couleur et résolutions photo avec une légère compression.",
    "id": "Mempertahankan dinamika warna tinggi dan resolusi foto dengan sedikit kompresi.",
    "it": "Preserva dinamiche di colore elevate e risoluzione delle foto con una leggera compressione.",
    "pt": "Preserva alta dinâmica de cores e resoluções fotográficas com compactação leve.",
    "ro": "Păstrează culorile dinamice vii și rezoluțiile foto prin comprimare ușoară.",
    "vi": "Giữ nguyên độ động màu sắc và độ phân giải hình ảnh với mức nén nhẹ.",
    "ar": "يحافظ على ديناميكية الألوان العالية ودقة الصور مع ضغط طفيف."
  },
  "common.compress.descMaximum": {
    "en": "Near 1:1 lossless optimization. Cleans debris and unused object chunks.",
    "zh": "接近 1:1 无损优化。清理冗余碎片和未使用的底层对象数据块。",
    "zh-TW": "接近 1:1 無損優化。清理冗餘碎片和未使用的底層對象數據塊。",
    "ja": "ほぼ1:1の無劣化最適化。不要なゴミや未使用のオブジェクトデータを削除します。",
    "ko": "1:1에 가까운 무손실 최적화. 불필요한 데이터 조각 및 사용하지 않는 객체 정리.",
    "de": "Nahezu verlustfreie 1:1-Optimierung. Bereinigt Fragmente und ungenutzte Objektteile.",
    "es": "Optimización casi 1:1 sin pérdidas. Limpia fragmentos y bloques de objetos no utilizados.",
    "fr": "Optimisation presque 1:1 sans perte. Nettoie les débris et blocs d'objets inutilisés.",
    "id": "Optimasi tanpa kerugian mendekati 1:1. Membersihkan sisa sampah dan blok objek yang tidak digunakan.",
    "it": "Ottimizzazione quasi 1:1 senza perdite. Pulisce frammenti e blocchi di oggetti inutilizzati.",
    "pt": "Otimização quase 1:1 sem perdas. Limpa fragmentos e blocos de objetos não utilizados.",
    "ro": "Optimizare aproape 1:1 fără pierderi. Curăță fragmentele redundante și blocurile de obiecte neutilizate.",
    "vi": "Tối ưu hóa không hao hao gần 1:1. Làm sạch rác và phân mảnh đối tượng không dùng.",
    "ar": "تحسين بدون فقدان قريب من 1:1. ينظف الحطام وكتل الكائنات غير المستخدمة."
  },
  "common.compress.optimizeGraphics": {
    "en": "Optimize embedded graphical assets", "zh": "优化嵌入式图片及图形资源", "zh-TW": "優化嵌入式圖片及圖形資源", "ja": "埋め込み画像・グラフィックアセットを最適化", "ko": "포함된 그래픽 및 이미지 최적화", "de": "Eingebettete Grafiken optimieren", "es": "Optimizar recursos gráficos incrustados", "fr": "Optimiser les ressources graphiques intégrées", "id": "Optimalkan aset grafis yang disematkan", "it": "Ottimizza risorse grafiche incorporate", "pt": "Otimizar ativos gráficos incorporados", "ro": "Optimizarea elementelor grafice încorporate", "vi": "Tối ưu hóa hình ảnh đồ họa nhúng", "ar": "تحسين الأصول الرسومية المضمنة"
  },
  "common.compress.clearMetadata": {
    "en": "Strip author and editor metadata fully", "zh": "彻底清除作者、修改工具等元数据", "zh-TW": "徹底清除作者、修改工具等元數據", "ja": "作成者や編集ツールなどのメタデータを完全に消去", "ko": "작성자 및 편집기 메타데이터 완전히 지우기", "de": "Autoren- und Editor-Metadaten vollständig entfernen", "es": "Eliminar metadatos de autor y editor por completo", "fr": "Supprimer complètement les métadonnées d'auteur et d'éditeur", "id": "Hapus metadata penulis dan editor sepenuhnya", "it": "Rimuovi completamente i metadati dell'autore e dell'editor", "pt": "Remover metadados do autor e editor completamente", "ro": "Eliminarea completă a metadatelor despre autor și editor", "vi": "Xóa hoàn toàn siêu dữ liệu người tạo và công cụ sửa", "ar": "تجريد البيانات الوصفية للمؤلف والمحرر بالكامل"
  },
  "common.compress.processingButton": {
    "en": "Optimizing layout streams...", "zh": "正在优化排版数据流...", "zh-TW": "正在優化排版數據流...", "ja": "レイアウトストリームを最適化中...", "ko": "레이아웃 스트림 최적화 중...", "de": "Layoutströme werden optimiert...", "es": "Optimizando flujos de diseño...", "fr": "Optimisation des flux de mise en page...", "id": "Mengoptimalkan aliran tata letak...", "it": "Ottimizzazione dei flussi di layout...", "pt": "Otimizando fluxos de layout...", "ro": "Se optimizează fluxul de date al machetei...", "vi": "Đang tối ưu dòng dữ liệu bố cục...", "ar": "تحسين تدفقات التخطيط..."
  },
  "common.compress.successTitle": {
    "en": "Optimization Complete!", "zh": "优化完成！", "zh-TW": "優化完成！", "ja": "最適化が完了しました！", "ko": "최적화 완료!", "de": "Optimierung abgeschlossen!", "es": "¡Optimización completada!", "fr": "Optimisation terminée !", "id": "Optimasi Selesai!", "it": "Ottimizzazione completata!", "pt": "Otimização concluída!", "ro": "Optimizare finalizată!", "vi": "Tối ưu hóa thành công!", "ar": "اكتمل التحسين!"
  },
  "common.compress.successDone": {
    "en": "PDF document optimized locally!", "zh": "PDF 文档已在本地优化成功！", "zh-TW": "PDF 文檔已在本地優化成功！", "ja": "PDFドキュメントがローカルで最適化されました！", "ko": "PDF 문서가 로컬에서 최적화되었습니다!", "de": "PDF-Dokument lokal optimiert!", "es": "¡Documento PDF optimizado localmente!", "fr": "Document PDF optimisé localement !", "id": "Dokumen PDF dioptimalkan secara lokal!", "it": "Documento PDF ottimizzato localmente!", "pt": "Documento PDF otimizado localmente!", "ro": "Documentul PDF a fost optimizat local!", "vi": "Tài liệu PDF đã được tối ưu cục bộ!", "ar": "تم تحسين مستند PDF محليًا!"
  },

  // Compare PDFs
  "common.comparePdfs.progressExtractingOriginal": {
    "en": "Analyzing and extracting Original PDF layout...", "zh": "正在分析并提取原始 PDF 的版面结构...", "zh-TW": "正在分析並提取原始 PDF 的版面結構...", "ja": "元のPDFレイアウトを分析・抽出中...", "ko": "원본 PDF 레이아웃 분석 및 추출 중...", "de": "Original-PDF-Layout wird analysiert und extrahiert...", "es": "Analizando y extrayendo diseño del PDF original...", "fr": "Analyse et extraction de la mise en page du PDF original...", "id": "Menganalisis dan mengekstrak tata letak PDF Asli...", "it": "Analisi ed estrazione del layout PDF originale...", "pt": "Analisando e extraindo o layout do PDF original...", "ro": "Se analizează și se extrage macheta PDF-ului original...", "vi": "Đang phân tích và trích xuất bố cục PDF gốc...", "ar": "تحليل واستخراج تخطيط PDF الأصلي..."
  },
  "common.comparePdfs.errorExtractingOriginal": {
    "en": "Failed to extract Original PDF.", "zh": "提取原始 PDF 失败。", "zh-TW": "提取原始 PDF 失敗。", "ja": "元のPDFの抽出に失敗しました。", "ko": "원본 PDF 추출 실패.", "de": "Extraktion der Original-PDF fehlgeschlagen.", "es": "Error al extraer el PDF original.", "fr": "Échec de l'extraction du PDF original.", "id": "Gagal mengekstrak PDF Asli.", "it": "Estrazione del PDF originale fallita.", "pt": "Falha ao extrair PDF original.", "ro": "Nu s-a putut extrage PDF-ul original.", "vi": "Trích xuất PDF gốc thất bại.", "ar": "فشل استخراج ملف PDF الأصلي."
  },
  "common.comparePdfs.progressExtractingModified": {
    "en": "Analyzing and extracting Modified PDF layout...", "zh": "正在分析并提取修改后 PDF 的版面结构...", "zh-TW": "正在分析並提取修改後 PDF 的版面結構...", "ja": "変更されたPDFレイアウトを分析・抽出中...", "ko": "수정된 PDF 레이아웃 분석 및 추출 중...", "de": "Geändertes PDF-Layout wird analysiert und extrahiert...", "es": "Analizando y extrayendo diseño del PDF modificado...", "fr": "Analyse et extraction de la mise en page du PDF modifié...", "id": "Menganalisis dan mengekstrak tata letak PDF yang Dimodifikasi...", "it": "Analisi ed estrazione del layout PDF modificato...", "pt": "Analisando e extraindo o layout do PDF modificado...", "ro": "Se analizează și se extrage macheta PDF-ului modificat...", "vi": "Đang phân tích và trích xuất bố cục PDF đã sửa...", "ar": "تحليل واستخراج تخطيط PDF المعدل..."
  },
  "common.comparePdfs.errorExtractingModified": {
    "en": "Failed to extract Modified PDF.", "zh": "提取修改后 PDF 失败。", "zh-TW": "提取修改後 PDF 失敗。", "ja": "変更されたPDFの抽出に失敗しました。", "ko": "수정된 PDF 추출 실패.", "de": "Extraktion der geänderten PDF fehlgeschlagen.", "es": "Error al extraer el PDF modificado.", "fr": "Échec de l'extraction du PDF modifié.", "id": "Gagal mengekstrak PDF yang Dimodifikasi.", "it": "Estrazione del PDF modificato fallita.", "pt": "Falha ao extrair PDF modificado.", "ro": "Nu s-a putut extrage PDF-ul modificat.", "vi": "Trích xuất PDF đã sửa thất bại.", "ar": "فشل استخراج ملف PDF المعدل."
  },
  "common.comparePdfs.progressRunningDiff": {
    "en": "Running CJK semantic alignment and paragraph diffing...", "zh": "正在运行中日韩语义对齐及段落差异对比...", "zh-TW": "正在運行中日韓語義對齊及段落差異對比...", "ja": "日中韓セマンティック配置と段落比較を実行中...", "ko": "한중일 세만틱 정렬 및 단락 비교 진행 중...", "de": "CJK-semantischer Abgleich und Absatzvergleich werden ausgeführt...", "es": "Ejecutando alineación semántica CJK y diferencias de párrafos...", "fr": "Alignement sémantique CJK et comparaison des paragraphes en cours...", "id": "Menjalankan penyelarasan semantik CJK dan perbedaan paragraf...", "it": "Allineamento semantico CJK e diff dei paragrafi in corso...", "pt": "Executando alinhamento semântico CJK e comparação de parágrafos...", "ro": "Se rulează alinierea semantică CJK și compararea paragrafelor...", "vi": "Đang chạy đối chiếu ngữ nghĩa CJK và so sánh đoạn văn...", "ar": "تشغيل المحاذاة الدلالية CJK ومقارنة الفقرات..."
  },
  "common.comparePdfs.errorDiffFailed": {
    "en": "Algorithm exception occurred during semantic comparison.", "zh": "语义对比分析时发生算法异常。", "zh-TW": "語義對比分析時發生算法異常。", "ja": "比較アルゴリズムの実行中に例外が発生しました。", "ko": "비교 알고리즘 실행 중 예외가 발생했습니다.", "de": "Algorithmus-Ausnahme beim semantischen Vergleich aufgetreten.", "es": "Ocurrió una excepción algorítmica durante la comparación semántica.", "fr": "Exception de l'algorithme survenue lors de la comparaison sémantique.", "id": "Pengecualian algoritma terjadi selama perbandingan semantik.", "it": "Si è verificata un'eccezione dell'algoritmo durante il confronto semantico.", "pt": "Ocorreu uma exceção de algoritmo durante a comparação semântica.", "ro": "A apărut o excepție de algoritm în timpul comparării semantice.", "vi": "Xảy ra lỗi thuật toán trong quá trình so sánh ngữ nghĩa.", "ar": "حدث استثناء في الخوارزمية أثناء المقارنة الدلالية."
  },
  "common.comparePdfs.originalPdfTitle": {
    "en": "Original PDF (Left Version)", "zh": "原始 PDF (左侧版本)", "zh-TW": "原始 PDF (左側版本)", "ja": "元のPDF (左側のバージョン)", "ko": "원본 PDF (왼쪽 버전)", "de": "Original-PDF (Linke Version)", "es": "PDF original (Versión izquierda)", "fr": "PDF original (Version gauche)", "id": "PDF Asli (Versi Kiri)", "it": "PDF originale (Versione sinistra)", "pt": "PDF original (Versão esquerda)", "ro": "PDF original (Versiunea stângă)", "vi": "PDF gốc (Bản bên trái)", "ar": "ملف PDF الأصلي (النسخة اليسرى)"
  },
  "common.comparePdfs.originalPdfLabel": {
    "en": "Upload Original PDF", "zh": "上传原始版本 PDF", "zh-TW": "上傳原始版本 PDF", "ja": "元のPDFをアップロード", "ko": "원본 PDF 업로드", "de": "Original-PDF hochladen", "es": "Subir PDF original", "fr": "Téléverser le PDF original", "id": "Unggah PDF Asli", "it": "Carica PDF originale", "pt": "Carregar PDF original", "ro": "Încărcați PDF-ul original", "vi": "Tải lên PDF gốc", "ar": "تحميل ملف PDF الأصلي"
  },
  "common.comparePdfs.originalPdfDesc": {
    "en": "Serves as the baseline/original layout", "zh": "作为基准对比的原始版面", "zh-TW": "作為基準對比的原始版面", "ja": "基準となる元のレイアウトとして使用", "ko": "기준이 되는 원본 레이아웃 역할", "de": "Dient als Vergleichsbasis", "es": "Sirve como diseño original de referencia", "fr": "Sert de mise en page originale de référence", "id": "Berfungsi sebagai tata letak asli", "it": "Funge da layout originale di riferimento", "pt": "Serve como layout original de referência", "ro": "Servește ca machetă originală de bază", "vi": "Làm bố cục gốc để đối chiếu", "ar": "يعمل كتخطيط أصلي مرجعي"
  },
  "common.comparePdfs.modifiedPdfTitle": {
    "en": "Modified PDF (Right Version)", "zh": "修改后 PDF (右侧版本)", "zh-TW": "修改後 PDF (右側版本)", "ja": "変更されたPDF (右側のバージョン)", "ko": "수정된 PDF (오른쪽 버전)", "de": "Geänderte PDF (Rechte Version)", "es": "PDF modificado (Versión derecha)", "fr": "PDF modifié (Version droite)", "id": "PDF Modifikasi (Versi Kanan)", "it": "PDF modificato (Versione destra)", "pt": "PDF modificado (Versão direita)", "ro": "PDF modificat (Versiunea dreaptă)", "vi": "PDF đã sửa (Bản bên phải)", "ar": "ملف PDF المعدل (النسخة اليمنى)"
  },
  "common.comparePdfs.modifiedPdfLabel": {
    "en": "Upload Modified PDF", "zh": "上传修改版本 PDF", "zh-TW": "上傳修改版本 PDF", "ja": "変更後のPDFをアップロード", "ko": "수정된 PDF 업로드", "de": "Geänderte PDF hochladen", "es": "Subir PDF modificado", "fr": "Téléverser le PDF modifié", "id": "Unggah PDF Modifikasi", "it": "Carica PDF modificato", "pt": "Carregar PDF modificado", "ro": "Încărcați PDF-ul modificat", "vi": "Tải lên PDF đã sửa", "ar": "تحميل ملف PDF المعدل"
  },
  "common.comparePdfs.modifiedPdfDesc": {
    "en": "Contains edits, additions, deletions, or structural shifts", "zh": "包含编辑、增加、删除或版面结构偏移", "zh-TW": "包含編輯、增加、刪除或版面結構偏移", "ja": "編集、追加、削除、または構造のずれを含みます", "ko": "수정, 추가, 삭제 또는 레이아웃 구조 변화 포함", "de": "Enthält Änderungen, Hinzufügungen, Löschungen oder Strukturverschiebungen", "es": "Contiene modificaciones, adiciones, eliminaciones o cambios de estructura", "fr": "Contient des modifications, ajouts, suppressions ou décalages structurels", "id": "Berisi suntingan, penambahan, penghapusan, atau pergeseran struktur", "it": "Contiene modifiche, aggiunte, eliminazioni o spostamenti strutturali", "pt": "Contém edições, adições, exclusões ou mudanças estruturais", "ro": "Conține modificări, adăugări, ștergeri sau schimbări de structură", "vi": "Chứa các sửa đổi, thêm, xóa hoặc dịch chuyển cấu trúc", "ar": "يحتوي على تعديلات أو إضافات أو حذف أو تغييرات هيكلية"
  },
  "common.comparePdfs.startCompare": {
    "en": "Run Semantic Comparison", "zh": "运行语义对比", "zh-TW": "運行語義對比", "ja": "セマンティック比較を実行", "ko": "세만틱 비교 실행", "de": "Semantischen Vergleich ausführen", "es": "Ejecutar comparación semántica", "fr": "Lancer la comparaison sémantique", "id": "Jalankan Perbandingan Semantik", "it": "Esegui confronto semantico", "pt": "Executar comparação semântica", "ro": "Rulează compararea semantică", "vi": "Chạy so sánh ngữ nghĩa", "ar": "بدء المقارنة الدلالية"
  },
  "common.comparePdfs.successTitle": {
    "en": "Semantic Comparison Complete (Acrobat-grade alignment)",
    "zh": "语义对比分析完成 (专业 Acrobat 级文字对齐)",
    "zh-TW": "語義對比分析完成 (專業 Acrobat 級文字對齊)",
    "ja": "セマンティック比較完了 (Acrobat仕様アライメント)",
    "ko": "세만틱 비교 완료 (Acrobat 수준 정렬)",
    "de": "Semantischer Vergleich abgeschlossen (Acrobat-Ausrichtung)",
    "es": "Comparación semántica completada (Alineación estilo Acrobat)",
    "fr": "Comparaison sémantique terminée (Alignement de qualité Acrobat)",
    "id": "Perbandingan Semantik Selesai (Penyelarasan tingkat Acrobat)",
    "it": "Confronto semantico completato (Allineamento di livello Acrobat)",
    "pt": "Comparação semântica concluída (Alinhamento nível Acrobat)",
    "ro": "Comparare semantică finalizată (Aliniere nivel Acrobat)",
    "vi": "So sánh ngữ nghĩa hoàn tất (Chuẩn đối chiếu Acrobat)",
    "ar": "اكتملت المقارنة الدلالية (محاذاة بمستوى Acrobat)"
  },
  "common.comparePdfs.filterLabel": {
    "en": "Highlight Filters", "zh": "高亮过滤项", "zh-TW": "高亮過濾項", "ja": "ハイライトフィルター", "ko": "강조 필터", "de": "Hervorhebungsfilter", "es": "Filtros de resaltado", "fr": "Filtres de surbrillance", "id": "Filter Sorotan", "it": "Filtri evidenziati", "pt": "Filtros de realce", "ro": "Filtre evidențiere", "vi": "Bộ lọc làm nổi bật", "ar": "فلتر التمييز"
  },
  "common.comparePdfs.filterText": {
    "en": "Text Changes", "zh": "文本内容变更", "zh-TW": "文本內容變更", "ja": "テキストの変更", "ko": "텍스트 변경 사항", "de": "Textänderungen", "es": "Cambios de texto", "fr": "Modifications de texte", "id": "Perubahan Teks", "it": "Modifiche del testo", "pt": "Alterações de texto", "ro": "Modificări text", "vi": "Thay đổi văn bản", "ar": "تغييرات النص"
  },
  "common.comparePdfs.filterFont": {
    "en": "Font & Format Changes", "zh": "字体与格式变更", "zh-TW": "字體與格式變更", "ja": "フォントと書式の変更", "ko": "글꼴 및 서식 변경", "de": "Schriftart- & Formatänderungen", "es": "Cambios de fuente y formato", "fr": "Modifications de police et format", "id": "Perubahan Font & Format", "it": "Modifiche di caratteri e formato", "pt": "Alterações de fonte e formato", "ro": "Modificări font și format", "vi": "Thay đổi phông và định dạng", "ar": "تغييرات الخط والتنسيق"
  },
  "common.comparePdfs.filterHeaderFooter": {
    "en": "Headers & Footers (Low Noise)", "zh": "页眉与页脚 (降噪忽略)", "zh-TW": "頁眉與頁腳 (降噪忽略)", "ja": "ヘッダーとフッター (低ノイズ)", "ko": "머리글 및 바닥글 (낮은 노이즈)", "de": "Kopf- & Fußzeilen (Rauscharm)", "es": "Encabezados y pies de página (Bajo ruido)", "fr": "En-têtes et pieds de page (Bruit réduit)", "id": "Header & Footer (Rendah Derau)", "it": "Intestazioni e piè di pagina (Basso rumore)", "pt": "Cabeçalhos e rodapés (Baixo ruído)", "ro": "Anteturi și subsoluri (Zgomot redus)", "vi": "Đầu trang và chân trang (Bỏ qua nhiễu)", "ar": "الرؤوس والتذييلات (ضوضاء منخفضة)"
  },
  "common.comparePdfs.filterMoved": {
    "en": "Shifted Paragraphs", "zh": "被移动的段落位置", "zh-TW": "被移動的段落位置", "ja": "移動された段落", "ko": "이동된 단락", "de": "Verschobene Absätze", "es": "Párrafos desplazados", "fr": "Paragraphes déplacés", "id": "Paragraf yang Bergeser", "it": "Paragrafi spostati", "pt": "Parágrafos deslocados", "ro": "Paragrafuri mutate", "vi": "Đoạn văn bị dịch chuyển", "ar": "الفقرات المنقولة"
  },
  "common.comparePdfs.resetButton": {
    "en": "Reset Comparison", "zh": "重置对比", "zh-TW": "重置對比", "ja": "比較をリセット", "ko": "비교 초기화", "de": "Vergleich zurücksetzen", "es": "Restablecer comparación", "fr": "Réinitialiser la comparaison", "id": "Reset Perbandingan", "it": "Reimposta confronto", "pt": "Redefinir comparação", "ro": "Resetați compararea", "vi": "Đặt lại đối chiếu", "ar": "إعادة تعيين المقارنة"
  },
  "common.comparePdfs.prevPair": {
    "en": "Prev Page Pair", "zh": "上一页对比", "zh-TW": "上一頁對比", "ja": "前のページペア", "ko": "이전 페이지 쌍", "de": "Vorheriges Seitenpaar", "es": "Pareja de pág. anterior", "fr": "Paire de pages précédente", "id": "Pasangan Halaman Sebelomnya", "it": "Coppia di pagine prec.", "pt": "Pares de pág. anterior", "ro": "Perechea de pagini anterioară", "vi": "Cặp trang trước", "ar": "زوج الصفحات السابق"
  },
  "common.comparePdfs.insertedPage": {
    "en": "📂 Inserted Page", "zh": "📂 已插入页面", "zh-TW": "📂 已插入頁面", "ja": "📂 挿入されたページ", "ko": "📂 삽입된 페이지", "de": "📂 Eingefügte Seite", "es": "📂 Página insertada", "fr": "📂 Page insérée", "id": "📂 Halaman yang Disisipkan", "it": "📂 Pagina inserita", "pt": "📂 Página inserida", "ro": "📂 Pagină inserată", "vi": "📂 Trang đã thêm", "ar": "📂 صفحة مدرجة"
  },
  "common.comparePdfs.deletedPage": {
    "en": "❌ Deleted Page", "zh": "❌ 已删除页面", "zh-TW": "❌ 已刪除頁面", "ja": "❌ 削除されたページ", "ko": "❌ 삭제된 페이지", "de": "❌ Gelöschte Seite", "es": "❌ Página eliminada", "fr": "❌ Page supprimée", "id": "❌ Halaman yang Dihapus", "it": "❌ Pagina eliminata", "pt": "❌ Página excluída", "ro": "❌ Pagină ștearsă", "vi": "❌ Trang đã xóa", "ar": "❌ صفحة محذوفة"
  },
  "common.comparePdfs.noDiff": {
    "en": "✅ No Differences (Identical)", "zh": "✅ 无差异 (完全相同)", "zh-TW": "✅ 無差異 (完全相同)", "ja": "✅ 差異なし (同一)", "ko": "✅ 차이 없음 (동일함)", "de": "✅ Keine Unterschiede (Identisch)", "es": "✅ Sin diferencias (Idénticos)", "fr": "✅ Aucune différence (Identique)", "id": "✅ Tidak Ada Perbedaan (Identik)", "it": "✅ Nessuna differenza (Identico)", "pt": "✅ Sem diferenças (Idêntico)", "ro": "✅ Nicio diferență (Identic)", "vi": "✅ Không có khác biệt (Giống nhau)", "ar": "✅ لا توجد اختلافات (متطابق)"
  },
  "common.comparePdfs.fullscreenTooltip": {
    "en": "Toggle Fullscreen Comparison", "zh": "切换全屏对比", "zh-TW": "切換全屏對比", "ja": "全画面比較を切り替え", "ko": "전체 화면 비교 토글", "de": "Vollbildvergleich umschalten", "es": "Alternar comparación a pantalla completa", "fr": "Basculer en comparaison plein écran", "id": "Alihkan Perbandingan Layar Penuh", "it": "Attiva confronto a schermo intero", "pt": "Alternar comparação em tela cheia", "ro": "Comutare comparare pe tot ecranul", "vi": "Bật/Tắt đối chiếu toàn màn hình", "ar": "تبديل المقارنة بملء الشاشة"
  },
  "common.comparePdfs.nextPair": {
    "en": "Next Page Pair", "zh": "下一页对比", "zh-TW": "下一頁對比", "ja": "次のページペア", "ko": "다음 페이지 쌍", "de": "Nächstes Seitenpaar", "es": "Pareja de pág. siguiente", "fr": "Paire de pages suivante", "id": "Pasangan Halaman Berikutnya", "it": "Coppia di pagine succ.", "pt": "Pares de pág. seguinte", "ro": "Perechea de pagini următoare", "vi": "Cặp trang tiếp theo", "ar": "زوج الصفحات التالي"
  },
  "common.comparePdfs.originalVersion": {
    "en": " (Original)", "zh": " (原始版)", "zh-TW": " (原始版)", "ja": " (オリジナル版)", "ko": " (원본)", "de": " (Original)", "es": " (Original)", "fr": " (Original)", "id": " (Asli)", "it": " (Originale)", "pt": " (Original)", "ro": " (Original)", "vi": " (Bản gốc)", "ar": " (الأصل)"
  },
  "common.comparePdfs.removedText": {
    "en": "❌ Removed text", "zh": "❌ 已删除的文字", "zh-TW": "❌ 已刪除的文字", "ja": "❌ 削除されたテキスト", "ko": "❌ 삭제된 텍스트", "de": "❌ Gelöschter Text", "es": "❌ Texto eliminado", "fr": "❌ Texte supprimé", "id": "❌ Teks yang dihapus", "it": "❌ Testo rimosso", "pt": "❌ Texto removido", "ro": "❌ Text șters", "vi": "❌ Chữ đã xóa", "ar": "❌ النص المزال"
  },
  "common.comparePdfs.modifiedText": {
    "en": "⚠️ Text modified", "zh": "⚠️ 被修改的文字", "zh-TW": "⚠️ 被修改的文字", "ja": "⚠️ 修正されたテキスト", "ko": "⚠️ 수정된 텍스트", "de": "⚠️ Geänderter Text", "es": "⚠️ Texto modificado", "fr": "⚠️ Texte modifié", "id": "⚠️ Teks dimodifikasi", "it": "⚠️ Testo modificato", "pt": "⚠️ Texto modificado", "ro": "⚠️ Text modificat", "vi": "⚠️ Chữ đã sửa", "ar": "⚠️ النص المعدل"
  },
  "common.comparePdfs.paragraphMovedRight": {
    "en": "➡️ Paragraph shifted downwards", "zh": "➡️ 段落位置下移", "zh-TW": "➡️ 段落位置下移", "ja": "➡️ 段落が下方にシフトしました", "ko": "➡️ 단락이 아래로 이동됨", "de": "➡️ Absatz nach unten verschoben", "es": "➡️ Párrafo desplazado hacia abajo", "fr": "➡️ Paragraphe décalé vers le bas", "id": "➡️ Paragraf bergeser ke bawah", "it": "➡️ Paragrafo spostato verso il basso", "pt": "➡️ Parágrafo deslocado para baixo", "ro": "➡️ Paragraf mutat în jos", "vi": "➡️ Đoạn văn bị đẩy xuống", "ar": "➡️ تم نقل الفقرة لأسفل"
  },
  "common.comparePdfs.insertedPageTitle": {
    "en": "📂 Inserted Page", "zh": "📂 已插入页面", "zh-TW": "📂 已插入頁面", "ja": "📂 挿入されたページ", "ko": "📂 삽입된 페이지", "de": "📂 Eingefügte Seite", "es": "📂 Página insertada", "fr": "📂 Page insérée", "id": "📂 Halaman yang Disisipkan", "it": "📂 Pagina inserita", "pt": "📂 Página inserida", "ro": "📂 Pagină inserată", "vi": "📂 Trang đã thêm", "ar": "📂 صفحة مدرجة"
  },
  "common.comparePdfs.insertedPageDesc": {
    "en": "This page was added in the modified document. The original version has no corresponding layout, automatically aligned.",
    "zh": "此页面是修改后的文档中新增的。原始文档无对应页面，已自动对齐填充。",
    "zh-TW": "此頁面是修改後的文檔中新增的。原始文檔無對應頁面，已自動對齊填充。",
    "ja": "このページは変更されたドキュメントで追加されました。元のバージョンには対応するレイアウトがないため、自動的に整列されます。",
    "ko": "수정된 문서에서 추가된 페이지입니다. 원본 문서에 대응하는 레이아웃이 없어 자동으로 정렬되었습니다.",
    "de": "Diese Seite wurde im geänderten Dokument hinzugefügt. Das Originaldokument hat kein entsprechendes Layout, automatische Ausrichtung.",
    "es": "Esta página fue agregada en el documento modificado. La versión original no tiene un diseño correspondiente, alineación automática.",
    "fr": "Cette page a été ajoutée dans le document modifié. La version originale n'ayant pas de mise en page correspondante, elle est alignée automatiquement.",
    "id": "Halaman ini ditambahkan dalam dokumen yang dimodifikasi. Versi asli tidak memiliki tata letak yang sesuai, diselaraskan secara otomatis.",
    "it": "Questa pagina è stata aggiunta nel documento modificato. La versione originale non ha un layout corrispondente, allineata automaticamente.",
    "pt": "Esta página foi adicionada no documento modificado. A versão original não tem um layout correspondente, alinhada automaticamente.",
    "ro": "Această pagină a fost adăugată în documentul modificat. Versiunea originală nu are o machetă corespunzătoare, fiind aliniată automat.",
    "vi": "Trang này đã được thêm trong tài liệu đã sửa. Bản gốc không có bố cục tương ứng nên hệ thống tự động căn lề.",
    "ar": "تم إضافة هذه الصفحة في المستند المعدل. لا تحتوي النسخة الأصلية على تخطيط مطابق، تم المحاذاة تلقائيًا."
  },
  "common.comparePdfs.modifiedVersion": {
    "en": " (Modified)", "zh": " (修改版)", "zh-TW": " (修改版)", "ja": " (変更版)", "ko": " (수정본)", "de": " (Geändert)", "es": " (Modificado)", "fr": " (Modifié)", "id": " (Dimodifikasi)", "it": " (Modificato)", "pt": " (Modificado)", "ro": " (Modificat)", "vi": " (Bản sửa)", "ar": " (المعدل)"
  },
  "common.comparePdfs.addedText": {
    "en": "💚 Added text", "zh": "💚 新增的文字", "zh-TW": "💚 新增的文字", "ja": "💚 追加されたテキスト", "ko": "💚 추가된 텍스트", "de": "💚 Hinzugefügter Text", "es": "💚 Texto agregado", "fr": "💚 Texte ajouté", "id": "💚 Teks yang ditambahkan", "it": "💚 Testo aggiunto", "pt": "💚 Texto adicionado", "ro": "💚 Text adăugat", "vi": "💚 Chữ đã thêm", "ar": "💚 النص المضاف"
  },
  "common.comparePdfs.paragraphMovedLeft": {
    "en": "⬅️ Paragraph shifted from preceding section", "zh": "⬅️ 段落从前一章节平移而来", "zh-TW": "⬅️ 段落從前一章節平移而來", "ja": "⬅️ 段落が前のセクションから移動しました", "ko": "⬅️ 이전 섹션에서 단락이 이동됨", "de": "⬅️ Absatz aus vorherigem Abschnitt verschoben", "es": "⬅️ Párrafo desplazado de la sección precedente", "fr": "⬅️ Paragraphe déplacé de la section précédente", "id": "⬅️ Paragraf bergeser dari bagian sebelumnya", "it": "⬅️ Paragrafo spostato dalla sezione precedente", "pt": "⬅️ Parágrafo deslocado da seção anterior", "ro": "⬅️ Paragraf mutat din secțiunea precedentă", "vi": "⬅️ Đoạn văn dịch chuyển từ phần phía trước", "ar": "⬅️ تم نقل الفقرة من المقطع السابق"
  },
  "common.comparePdfs.deletedPageTitle": {
    "en": "❌ Deleted Page", "zh": "❌ 已删除页面", "zh-TW": "❌ 已刪除頁面", "ja": "❌ 削除されたページ", "ko": "❌ 삭제된 페이지", "de": "❌ Gelöschte Seite", "es": "❌ Página eliminada", "fr": "❌ Page supprimée", "id": "❌ Halaman yang Dihapus", "it": "❌ Pagina eliminata", "pt": "❌ Página excluída", "ro": "❌ Pagină ștearsă", "vi": "❌ Trang đã xóa", "ar": "❌ صفحة محذوفة"
  },
  "common.comparePdfs.deletedPageDesc": {
    "en": "This page was completely deleted in the modified document. Aligned with a blank filler to preserve subsequent page flows.",
    "zh": "此页面在修改后的文档中被完整删除。已用空白页填充对齐，以保证后续页面的流向对应关系不变。",
    "zh-TW": "此頁面在修改後的文檔中被完整刪除。已用空白頁填充對齊，以保證後續頁面的流向對應關係不變。",
    "ja": "このページは変更されたドキュメントで完全に削除されました。後続のページのフローを維持するために、空白のフィラーと整列されています。",
    "ko": "수정된 문서에서 이 페이지가 완전히 삭제되었습니다. 이후 페이지 흐름을 유지하기 위해 빈 칸으로 정렬되었습니다.",
    "de": "Diese Seite wurde im geänderten Dokument vollständig gelöscht. Mit einem leeren Platzhalter ausgerichtet, um den nachfolgenden Seitenfluss zu erhalten.",
    "es": "Esta página fue completamente eliminada en el documento modificado. Alineada con un marcador de posición vacío para conservar los flujos de página posteriores.",
    "fr": "Cette page a été complètement supprimée dans le document modifié. Alignée avec un espace vide pour conserver le flux des pages suivantes.",
    "id": "Halaman ini sepenuhnya dihapus dalam dokumen yang dimodifikasi. Diselaraskan dengan pengisi kosong untuk menjaga alur halaman berikutnya.",
    "it": "Questa pagina è stata completamente eliminata nel documento modificato. Allineata con un riempitivo vuoto per preservare i flussi di pagina successivi.",
    "pt": "Esta página foi completamente excluída no documento modificado. Alinhada com um preenchimento em branco para preservar os fluxos de página subsequentes.",
    "ro": "Această pagină a fost ștearsă complet în documentul modificat. Aliniată cu o completare goală pentru a păstra fluxurile de pagini ulterioare.",
    "vi": "Trang này đã bị xóa hoàn toàn khỏi tài liệu đã sửa. Hệ thống thêm trang trống để đảm bảo các trang sau khớp nhau.",
    "ar": "تم حذف هذه الصفحة تمامًا في المستند المعدل. تم محاذاتها مع مساحة فارغة للحفاظ على تدفقات الصفحات اللاحقة."
  },

  // Edit PDF
  "common.editPdf.annCloud": {
    "en": "Cloud", "zh": "云朵批注", "zh-TW": "雲朵批註", "ja": "クラウド", "ko": "구름", "de": "Wolke", "es": "Nube", "fr": "Nuage", "id": "Awan", "it": "Nuvola", "pt": "Nuvem", "ro": "Nor", "vi": "Đám mây", "ar": "سحابة"
  },
  "common.editPdf.annRectangle": {
    "en": "Rectangle", "zh": "矩形框", "zh-TW": "矩形框", "ja": "長方形", "ko": "직사각형", "de": "Rechteck", "es": "Rectángulo", "fr": "Rectangle", "id": "Persegi Panjang", "it": "Rettangolo", "pt": "Retângulo", "ro": "Dreptunghi", "vi": "Hình chữ nhật", "ar": "مستطيل"
  },
  "common.editPdf.annCircle": {
    "en": "Circle", "zh": "圆形框", "zh-TW": "圓形框", "ja": "円形", "ko": "원형", "de": "Kreis", "es": "Círculo", "fr": "Cercle", "id": "Lingkaran", "it": "Cerchio", "pt": "Círculo", "ro": "Cerc", "vi": "Hình tròn", "ar": "دائرة"
  },
  "common.editPdf.annArrow": {
    "en": "Arrow", "zh": "箭头", "zh-TW": "箭頭", "ja": "矢印", "ko": "화살표", "de": "Pfeil", "es": "Flecha", "fr": "Flèche", "id": "Panah", "it": "Freccia", "pt": "Seta", "ro": "Săgeată", "vi": "Mũi tên", "ar": "سهم"
  },
  "common.editPdf.annFreehand": {
    "en": "Draw", "zh": "手写涂鸦", "zh-TW": "手寫涂鴉", "ja": "手書き", "ko": "그리기", "de": "Zeichnen", "es": "Dibujar", "fr": "Dessiner", "id": "Gambar", "it": "Disegno", "pt": "Desenhar", "ro": "Desen", "vi": "Vẽ tay", "ar": "رسم"
  },
  "common.editPdf.annFreeText": {
    "en": "Text", "zh": "文本框", "zh-TW": "文本框", "ja": "テキスト", "ko": "텍스트", "de": "Text", "es": "Texto", "fr": "Texte", "id": "Teks", "it": "Testo", "pt": "Texto", "ro": "Text", "vi": "Văn bản", "ar": "نص"
  },
  "common.editPdf.annFreeHighlight": {
    "en": "Highlight", "zh": "荧光笔高亮", "zh-TW": "熒光筆高亮", "ja": "ハイライト", "ko": "형광펜", "de": "Hervorheben", "es": "Resaltar", "fr": "Surligner", "id": "Sorot", "it": "Evidenziatore", "pt": "Realçar", "ro": "Evidențiere", "vi": "Tô sáng", "ar": "تمييز"
  },
  "common.editPdf.annNote": {
    "en": "Note", "zh": "便签", "zh-TW": "便簽", "ja": "メモ", "ko": "메모", "de": "Notiz", "es": "Nota", "fr": "Note", "id": "Catatan", "it": "Nota", "pt": "Nota", "ro": "Notă", "vi": "Ghi chú", "ar": "ملاحظة"
  },
  "common.editPdf.annSignature": {
    "en": "Signature", "zh": "签名", "zh-TW": "簽名", "ja": "署名", "ko": "서명", "de": "Unterschrift", "es": "Firma", "fr": "Signature", "id": "Tanda Tangan", "it": "Firma", "pt": "Assinatura", "ro": "Semnătură", "vi": "Chữ ký", "ar": "توقيع"
  },
  "common.editPdf.annStamp": {
    "en": "Stamp", "zh": "图章", "zh-TW": "圖章", "ja": "スタンプ", "ko": "스탬프", "de": "Stempel", "es": "Sello", "fr": "Tampon", "id": "Cap", "it": "Timbro", "pt": "Carimbo", "ro": "Stampă", "vi": "Con dấu", "ar": "طابع"
  },
  "common.editPdf.strokeColorLabel": {
    "en": "Border Color:", "zh": "边框颜色:", "zh-TW": "邊框顏色:", "ja": "枠線の色:", "ko": "테두리 색상:", "de": "Randfarbe:", "es": "Color de borde:", "fr": "Couleur de bordure :", "id": "Warna Batas:", "it": "Colore del bordo:", "pt": "Cor da borda:", "ro": "Culoare chenar:", "vi": "Màu viền:", "ar": "لون الحدود:"
  },
  "common.editPdf.fillColorLabel": {
    "en": "Enable Fill Color:", "zh": "启用填充颜色:", "zh-TW": "啟用填充顏色:", "ja": "塗りつぶし色を有効化:", "ko": "채우기 색상 활성화:", "de": "Füllfarbe aktivieren:", "es": "Habilitar color de relleno:", "fr": "Activer la couleur de remplissage :", "id": "Aktifkan Warna Isian:", "it": "Abilita colore di riempimento:", "pt": "Habilitar cor de preenchimento:", "ro": "Activare culoare umplere:", "vi": "Bật màu tô:", "ar": "تمكين لون التعبئة:"
  },
  
  // Rotate PDF
  "tools.rotatePdf.rotate180": {
    "en": "Rotate 180°", "zh": "旋转 180°", "zh-TW": "旋轉 180°", "ja": "180°回転", "ko": "180° 회전", "de": "180° drehen", "es": "Rotar 180°", "fr": "Tourner de 180°", "id": "Putar 180°", "it": "Ruota di 180°", "pt": "Rotacionar 180°", "ro": "Rotire 180°", "vi": "Xoay 180°", "ar": "تدوير 180 درجة"
  },
  "tools.rotatePdf.successMessage": {
    "en": "PDF pages rotated successfully! Click the download button to save your file.",
    "zh": "PDF 页面旋转完成！请点击下载按钮保存文件。",
    "zh-TW": "PDF 頁面旋轉完成！請點擊下載按鈕保存文件。",
    "ja": "PDFページの回転に成功しました！ダウンロードボタンをクリックして保存してください。",
    "ko": "PDF 페이지가 성공적으로 회전되었습니다! 다운로드 버튼을 클릭하여 파일을 저장하세요.",
    "de": "PDF-Seiten erfolgreich gedreht! Klicken Sie auf die Schaltfläche 'Herunterladen', um Ihre Datei zu speichern.",
    "es": "¡Páginas PDF rotadas con éxito! Haga clic en el botón de descarga para guardar su archivo.",
    "fr": "Pages PDF tournées avec succès ! Cliquez sur le bouton de téléchargement pour enregistrer votre fichier.",
    "id": "Halaman PDF berhasil diputar! Klik tombol unduh untuk menyimpan file Anda.",
    "it": "Pagine PDF ruotate con successo! Fai clic sul pulsante di download per salvare il file.",
    "pt": "Páginas do PDF rotacionadas com sucesso! Clique no botão de download para salvar o arquivo.",
    "ro": "Paginile PDF au fost rotite cu succes! Faceți clic pe butonul de descărcare pentru a salva fișierul.",
    "vi": "Xoay trang PDF thành công! Hãy nhấn nút tải xuống để lưu tệp tin.",
    "ar": "تم تدوير صفحات PDF بنجاح! انقر فوق زر التنزيل لحفظ ملفك."
  }
};

// 递归向嵌套对象中写入属性
function setDeepValue(obj, keyPath, value) {
  const parts = keyPath.split('.');
  let current = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (!current[part] || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }
  current[parts[parts.length - 1]] = value;
}

console.log("=== STARTING IMPORT RECENT TRANSLATIONS ===");

languages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) {
    console.warn(`File for ${lang} not found.`);
    return;
  }
  
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  let updatedCount = 0;
  
  Object.entries(dict).forEach(([key, translations]) => {
    // 找出目标语言的译文，若该语言在字典中不存在则fallback到英文
    let translatedVal = translations[lang] || translations['en'];
    
    // 如果翻译字典里有这一个key
    if (translatedVal !== undefined) {
      setDeepValue(langData, key, translatedVal);
      updatedCount++;
    }
  });
  
  fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
  console.log(`Language [${lang}]: Injected ${updatedCount} translations.`);
});

console.log("=== IMPORT COMPLETE ===");
