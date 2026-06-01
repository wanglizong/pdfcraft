const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';

// Loader to get English and Chinese data to fallback or refer to
const enContentFile = path.join(TOOL_CONTENT_DIR, 'en.ts');
const zhContentFile = path.join(TOOL_CONTENT_DIR, 'zh.ts');

function parseTsFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  // Highly simplified mock extraction: we can't execute TS, but we can match segments using regexes or simple brace parsing.
  // Actually, we can just compile it or run a quick sandbox, but it's simpler to parse since we know the exact ESM structure.
  // Wait, let's write a JS file that mocks the import and requires them? 
  // No, node doesn't run ESM directly unless we rename or use dynamic import in an async function.
  // But we can read the file as text and parse out the objects.
  return content;
}

// 30 missing tools configuration Map for 11 languages (ja, ko, zh-TW, de, es, fr, id, it, pt, vi, ar)
const metadataMap = {
  'pdf-to-cbz': {
    'zh-TW': { title: 'PDF 轉 CBZ', metaDescription: '將 PDF 文件轉換為 CBZ 漫畫書歸檔。保留圖像順序和質量。', keywords: ['pdf 轉 cbz', '漫畫轉換', 'cbz 轉換器'] },
    'ja': { title: 'PDFからCBZに変換', metaDescription: 'PDFファイルをCBZコミックアーカイブに変換します。画像の順序と品質を保持します。', keywords: ['pdf cbz 変換', 'コミック変換', 'cbz変換器'] },
    'ko': { title: 'PDF를 CBZ로 변환', metaDescription: 'PDF 파일을 CBZ 만화 아카이브로 변환합니다. 이미지 순서와 해상도를 원본 그대로 보존합니다.', keywords: ['pdf cbz 변환', '만화책 변환', 'cbz 변환기'] },
    'de': { title: 'PDF in CBZ umwandeln', metaDescription: 'Konvertieren Sie PDF-Dateien in das CBZ-Comic-Format. Bildreihenfolge und Qualität bleiben erhalten.', keywords: ['pdf in cbz', 'comic konverter', 'cbz datei'] },
    'es': { title: 'PDF a CBZ', metaDescription: 'Convierta archivos PDF a formato de cómic CBZ. Conserva el orden y la calidad de las imágenes.', keywords: ['pdf a cbz', 'conversor comic', 'cbz pdf'] },
    'fr': { title: 'PDF en CBZ', metaDescription: 'Convertissez des fichiers PDF en archives de bandes dessinées CBZ. Conserve l\'ordre et la qualité des images.', keywords: ['pdf en cbz', 'convertir bd', 'convertisseur cbz'] },
    'id': { title: 'PDF ke CBZ', metaDescription: 'Konversi file PDF ke arsip komik CBZ. Mempertahankan urutan dan kualitas gambar.', keywords: ['pdf ke cbz', 'konversi komik', 'konverter cbz'] },
    'it': { title: 'PDF in CBZ', metaDescription: 'Converti file PDF in archivi di fumetti CBZ. Mantiene l\'ordine e la qualità delle immagini.', keywords: ['pdf in cbz', 'convertitore fumetti', 'cbz pdf'] },
    'pt': { title: 'PDF para CBZ', metaDescription: 'Converta arquivos PDF em arquivos de quadrinhos CBZ. Preserva a ordem e a qualidade das imagens.', keywords: ['pdf para cbz', 'conversor quadrinhos', 'cbz pdf'] },
    'vi': { title: 'PDF sang CBZ', metaDescription: 'Chuyển đổi tệp PDF sang kho lưu trữ truyện tranh CBZ. Giữ nguyên thứ tự và chất lượng hình ảnh.', keywords: ['pdf sang cbz', 'chuyển đổi cbz', 'truyện tranh pdf'] },
    'ar': { title: 'تحويل PDF إلى CBZ', metaDescription: 'تحويل ملفات PDF إلى أرشيف القصص المصورة CBZ مع الحفاظ على ترتيب وجودة الصور.', keywords: ['تحويل pdf إلى cbz', 'محول قصص مصورة', 'ملف cbz'] }
  },
  'overlay-pdf': {
    'zh-TW': { title: '疊加 PDF', metaDescription: '將兩個 PDF 頁面疊加合併為一頁。適用於印章、背景與水印疊加。', keywords: ['pdf 疊加', '合併 pdf', '浮水印疊加', '頁面覆蓋'] },
    'ja': { title: 'PDFオーバーレイ重ね合わせ', metaDescription: '2つのPDFページを重ね合わせて1ページにします。背景や印鑑、透かしの重ね合わせに最適です。', keywords: ['pdf 重ね合わせ', 'pdf オーバーレイ', 'スタンプ合成'] },
    'ko': { title: 'PDF 레이어 오버레이', metaDescription: '두 개의 PDF 페이지를 하나로 겹쳐서 오버레이 병합합니다. 배경지, 인장, 워터마크 합성에 유용합니다.', keywords: ['pdf 오버레이', 'pdf 겹치기', '워터마크 레이어'] },
    'de': { title: 'PDF überlagern', metaDescription: 'Legen Sie zwei PDF-Seiten übereinander. Ideal für Stempel, Briefpapier und Wasserzeichen.', keywords: ['pdf überlagern', 'pdf overlay', 'stempel aufbringen'] },
    'es': { title: 'Superponer PDF', metaDescription: 'Superponga dos páginas PDF en una sola. Ideal para agregar sellos, fondos y marcas de agua.', keywords: ['superponer pdf', 'pdf overlay', 'sellar pdf'] },
    'fr': { title: 'Superposer PDF', metaDescription: 'Superposez deux pages PDF en une seule. Parfait pour ajouter des tampons, des fonds et des filigranes.', keywords: ['superposer pdf', 'pdf overlay', 'tampon pdf'] },
    'id': { title: 'Hamparan PDF', metaDescription: 'Tumpuk dua halaman PDF menjadi satu halaman. Sempurna untuk menyematkan stempel, latar belakang, dan tanda air.', keywords: ['hamparan pdf', 'pdf overlay', 'stempel pdf'] },
    'it': { title: 'Sovrapponi PDF', metaDescription: 'Sovrapponi due pagine PDF in una sola. Ideale per timbri, sfondi e filigrane.', keywords: ['sovrapponi pdf', 'pdf overlay', 'timbro pdf'] },
    'pt': { title: 'Sobrepor PDF', metaDescription: 'Sobreponha duas páginas PDF em uma única página. Perfeito para adicionar carimbos, fundos e marcas d\'água.', keywords: ['sobrepor pdf', 'pdf overlay', 'carimbo pdf'] },
    'vi': { title: 'Đè chồng PDF', metaDescription: 'Đè chồng hai trang PDF thành một trang duy nhất. Lý tưởng cho việc chèn con dấu, hình nền và hình mờ.', keywords: ['đè chồng pdf', 'pdf overlay', 'chèn con dấu pdf'] },
    'ar': { title: 'تراكب صفحات PDF', metaDescription: 'دمج صفحتين من ملفات PDF فوق بعضهما البعض. مثالي لإضافة الأختام والخلفيات والعلامات المائية.', keywords: ['تراكب pdf', 'دمج طبقات pdf', 'ختم pdf'] }
  },
  'timestamp-pdf': {
    'zh-TW': { title: 'PDF 時間戳記', metaDescription: '為 PDF 文檔注入 RFC 3161 安全時間戳記。驗證文件創建時間防篡改。', keywords: ['pdf 時間戳記', 'rfc 3161', '時間戳服務', '數字簽名'] },
    'ja': { title: 'PDFタイムスタンプ追加', metaDescription: 'PDF文書にRFC 3161に準拠したセキュアなタイムスタンプを追加します。作成日時の証明と改ざん防止に。', keywords: ['pdf タイムスタンプ', 'rfc 3161', '時刻証明', '改ざん防止'] },
    'ko': { title: 'PDF 타임스탬프 추가', metaDescription: 'PDF 문서에 RFC 3161 보안 타임스탬프를 주입합니다. 문서 생성 시각을 증명하고 변조를 방지합니다.', keywords: ['pdf 타임스탬프', 'rfc 3161', '시간 인증', '위변조 방지'] },
    'de': { title: 'PDF-Zeitstempel', metaDescription: 'Fügen Sie PDF-Dokumenten einen sicheren RFC 3161-Zeitstempel hinzu. Weisen Sie das Erstellungsdatum nach.', keywords: ['pdf zeitstempel', 'rfc 3161', 'digitaler zeitstempel'] },
    'es': { title: 'Sello de Tiempo PDF', metaDescription: 'Inyecte un sello de tiempo seguro RFC 3161 en documentos PDF para validar la fecha de creación.', keywords: ['sello de tiempo pdf', 'rfc 3161', 'fecha digital pdf'] },
    'fr': { title: 'Horodatage PDF', metaDescription: 'Injectez un horodatage sécurisé RFC 3161 dans vos documents PDF pour prouver leur date de création.', keywords: ['horodatage pdf', 'rfc 3161', 'signature temporelle'] },
    'id': { title: 'Stempel Waktu PDF', metaDescription: 'Sematkan stempel waktu aman RFC 3161 pada dokumen PDF untuk membuktikan waktu pembuatan dan integritas data.', keywords: ['stempel waktu pdf', 'rfc 3161', 'bukti waktu digital'] },
    'it': { title: 'Marca Temporale PDF', metaDescription: 'Applica una marca temporale sicura RFC 3161 ai documenti PDF per certificare la data e l\'ora di creazione.', keywords: ['marca temporale pdf', 'rfc 3161', 'certificazione temporale'] },
    'pt': { title: 'Carimbo de Data/Hora PDF', metaDescription: 'Insira um carimbo de data/hora seguro RFC 3161 em documentos PDF para validar a data de criação.', keywords: ['carimbo de tempo pdf', 'rfc 3161', 'data digital pdf'] },
    'vi': { title: 'Đóng dấu thời gian PDF', metaDescription: 'Nhúng dấu thời gian bảo mật RFC 3161 vào tài liệu PDF để xác minh thời gian tạo và chống giả mạo.', keywords: ['đóng dấu thời gian pdf', 'rfc 3161', 'xác thực thời gian'] },
    'ar': { title: 'ختم الوقت لملفات PDF', metaDescription: 'حقن ختم وقت آمن متوافق مع معيار RFC 3161 في مستندات PDF لإثبات وقت الإنشاء وحمايتها من التلاعب.', keywords: ['ختم الوقت pdf', 'معيار rfc 3161', 'توثيق الوقت'] }
  },
  'add-page-labels': {
    'zh-TW': { title: '添加頁面標籤', metaDescription: '為 PDF 設定自定義頁面標籤（如前言用 I, II，正文用 1, 2）。改善閱讀器導航。', keywords: ['頁面標籤', 'pdf 頁面編號', 'pdf 邏輯頁碼', '閱讀器導航'] },
    'ja': { title: 'ページラベル追加', metaDescription: 'PDFにカスタムページラベル（前書きにはI, II、本文には1, 2など）を設定し、PDFリーダーのナビゲーションを改善します。', keywords: ['ページラベル', 'pdf ページ番号', '論理ページ数'] },
    'ko': { title: '페이지 레이블 추가', metaDescription: 'PDF에 사용자 정의 페이지 레이블(예: 서문은 I, II, 본문은 1, 2)을 구성하여 문서 탐색을 향상시킵니다.', keywords: ['페이지 레이블', 'pdf 레이블링', '논리 페이지 번호'] },
    'de': { title: 'Seitenbeschriftungen hinzufügen', metaDescription: 'Legen Sie benutzerdefinierte Seitenbeschriftungen fest (z. B. I, II für Vorwort). Verbessert die Navigation.', keywords: ['seitenbeschriftung', 'pdf logische seiten', 'seiten nummerieren'] },
    'es': { title: 'Agregar Etiquetas de Página', metaDescription: 'Defina etiquetas de página personalizadas (p. ej., I, II para prefacios). Mejora la navegación.', keywords: ['etiquetas de pagina', 'numerar paginas pdf', 'paginas logicas'] },
    'fr': { title: 'Ajouter des Étiquettes de Page', metaDescription: 'Définissez des étiquettes de page personnalisées (ex : I, II pour l\'avant-propos). Améliore la navigation.', keywords: ['etiquettes de page', 'numerotation logique', 'navigation pdf'] },
    'id': { title: 'Tambah Label Halaman', metaDescription: 'Atur label halaman kustom (misal, I, II untuk kata pengantar, 1, 2 untuk isi). Meningkatkan navigasi pembaca.', keywords: ['label halaman', 'nomor halaman logis', 'navigasi pdf'] },
    'it': { title: 'Aggiungi Etichette di Pagina', metaDescription: 'Imposta etichette di pagina personalizzate (es. I, II per la prefazione). Migliora la navigazione.', keywords: ['etichette di pagina', 'numerazione pagine pdf', 'navigazione pdf'] },
    'pt': { title: 'Adicionar Etiquetas de Página', metaDescription: 'Defina etiquetas de página personalizadas (por exemplo, I, II para prefácio). Melhora a navegação do leitor.', keywords: ['etiquetas de pagina', 'numeracao logica pdf', 'paginas de documento'] },
    'vi': { title: 'Thêm nhãn trang', metaDescription: 'Thiết lập nhãn trang tùy chỉnh (ví dụ: I, II cho lời mở đầu, 1, 2 cho nội dung). Cải thiện điều hướng trình đọc.', keywords: ['nhãn trang pdf', 'đánh số trang logic', 'điều hướng pdf'] },
    'ar': { title: 'إضافة تسميات الصفحات', metaDescription: 'تحديد تسميات صفحات مخصصة (مثل الأرقام الرومانية للمقدمة) لتحسين التنقل في قراء PDF.', keywords: ['تسميات الصفحات pdf', 'ترقيم الصفحات المنطقي', 'فهرسة الصفحات'] }
  },
  'ai-pdf-reflower': {
    'zh-TW': { title: 'AI 智能自適應重排', metaDescription: '將 PDF 文檔重新排版為響應式行動端版面，支援導出 Markdown 和 EPUB。', keywords: ['pdf 重排', '自適應 pdf', 'pdf 轉 markdown', 'epub 導出'] },
    'ja': { title: 'AIインテリジェントリフロー', metaDescription: 'PDF文書をモバイル向けのレスポンシブレイアウトに再構成します。MarkdownやEPUB形式での書き出しをサポート。', keywords: ['pdf リフロー', 'レスポンシブpdf', 'pdf markdown 変換', 'epub エクスポート'] },
    'ko': { title: 'AI PDF 모바일 재배열', metaDescription: '고정 레이아웃의 PDF 문서를 모바일 기기에 맞는 반응형 리플로우 레이아웃으로 재구성하고 EPUB/Markdown으로 내보냅니다.', keywords: ['pdf 리플로우', '반응형 pdf', 'pdf 마크다운 변환', 'epub 내보내기'] },
    'de': { title: 'AI PDF-Textfluss-Anpassung', metaDescription: 'Strukturieren Sie PDF-Dokumente für mobile Bildschirme um. Unterstützung für Markdown- und EPUB-Export.', keywords: ['pdf textfluss', 'mobiles pdf', 'pdf in markdown', 'epub export'] },
    'es': { title: 'Adaptación de Flujo PDF con IA', metaDescription: 'Rediseñe documentos PDF para pantallas móviles. Exportación a Markdown y EPUB.', keywords: ['flujo pdf', 'pdf adaptativo', 'pdf a markdown', 'exportar epub'] },
    'fr': { title: 'Réadaptation de Flux PDF par IA', metaDescription: 'Restructurez les documents PDF pour un affichage mobile fluide. Exportation en Markdown et EPUB.', keywords: ['reflow pdf', 'pdf adaptatif', 'pdf en markdown', 'export epub'] },
    'id': { title: 'Aliran Ulang PDF AI', metaDescription: 'Tata ulang dokumen PDF menjadi tata letak responsif untuk seluler. Mendukung ekspor ke Markdown dan EPUB.', keywords: ['aliran ulang pdf', 'pdf responsif', 'pdf ke markdown', 'ekspor epub'] },
    'it': { title: 'Riorganizzazione PDF con IA', metaDescription: 'Riorganizza il testo dei documenti PDF per dispositivi mobili. Supporta l\'esportazione in Markdown ed EPUB.', keywords: ['riflusso pdf', 'pdf responsive', 'pdf in markdown', 'esportazione epub'] },
    'pt': { title: 'Ajuste de Fluxo PDF com IA', metaDescription: 'Reestruture documentos PDF para telas móveis. Suporta exportação para Markdown e EPUB.', keywords: ['refluxo pdf', 'pdf responsivo', 'pdf para markdown', 'exportar epub'] },
    'vi': { title: 'Tự động tái dàn trang AI', metaDescription: 'Tái cấu trúc tài liệu PDF thành bố cục tương thích với thiết bị di động. Hỗ trợ xuất sang Markdown và EPUB.', keywords: ['dàn trang pdf', 'pdf tự thích ứng', 'pdf sang markdown', 'xuất epub'] },
    'ar': { title: 'إعادة ترتيب تدفق صفحات PDF بالذكاء الاصطناعي', metaDescription: 'إعادة تخطيط مستندات PDF لتناسب الهواتف المحمولة ديناميكيًا، مع دعم التصدير إلى Markdown و EPUB.', keywords: ['إعادة تدفق pdf', 'pdf متجاوب', 'تحويل pdf إلى markdown', 'تصدير epub'] }
  },
  'citation-linker': {
    'zh-TW': { title: '引文連結啟動器', metaDescription: '掃描並啟動 PDF 中的引文標記，將其轉化為可點擊的 DOI 或頁內跳轉連結。', keywords: ['引文激活', 'pdf 超連結', 'doi 匹配', '學術 pdf 助手'] },
    'ja': { title: '引用リンクアクティベーター', metaDescription: 'PDF内の引用マーク（[1]など）を自動検出し、クリック可能なDOIリンクやページ内ジャンプに変換します。', keywords: ['引用リンク', 'pdfリンク挿入', 'doiマッチング', '論文サポート'] },
    'ko': { title: '인용 링크 활성화 도구', metaDescription: '학술 PDF에서 인용 부호(예: [1])를 감지하여 클릭 가능한 DOI 외부 링크나 페이지 이동 링크로 연결합니다.', keywords: ['인용구 활성화', 'pdf 하이퍼링크', 'doi 매칭', '논문 도구'] },
    'de': { title: 'Zitierungs-Verlinker', metaDescription: 'Erkennen und aktivieren Sie Zitate in PDFs. Verknüpfen Sie diese mit anklickbaren DOIs oder internen Sprungmarken.', keywords: ['zitate verlinken', 'doi verknüpfung', 'pdf hyperlink', 'wissenschaftliches pdf'] },
    'es': { title: 'Activador de Enlaces de Citas', metaDescription: 'Escanee y active las marcas de cita en PDFs, convirtiéndolas en enlaces DOI interactivos o saltos de página.', keywords: ['enlaces de citas', 'hipervinculo pdf', 'coincidencia doi', 'citas academicas'] },
    'fr': { title: 'Activateur de Liens de Citation', metaDescription: 'Détectez et activez les citations dans les PDFs en les transformant en liens DOI cliquables ou renvois internes.', keywords: ['liens de citation', 'hyperlien pdf', 'correspondance doi', 'pdf academique'] },
    'id': { title: 'Aktivator Tautan Sitasi', metaDescription: 'Pindai dan aktifkan tanda kutipan dalam PDF menjadi tautan DOI eksternal atau lompatan halaman internal.', keywords: ['tautan sitasi', 'hiperlink pdf', 'pencocokan doi', 'pdf akademis'] },
    'it': { title: 'Attivatore di Link di Citazione', metaDescription: 'Scansiona e attiva i riferimenti bibliografici nei PDF, convertendoli in link DOI cliccabili o salti interni.', keywords: ['link citazioni', 'collegamento pdf', 'corrispondenza doi', 'pdf accademico'] },
    'pt': { title: 'Ativador de Links de Citações', metaDescription: 'Digitalize e ative marcas de citação em PDFs, convertendo-as em links DOI clicáveis ou saltos de página.', keywords: ['links de citacoes', 'hiperlink pdf', 'correspondencia doi', 'pdf academico'] },
    'vi': { title: 'Kích hoạt liên kết trích dẫn', metaDescription: 'Quét và kích hoạt các ký hiệu trích dẫn trong PDF, chuyển đổi chúng thành liên kết DOI hoặc liên kết nội trang.', keywords: ['liên kết trích dẫn', 'hyperlink pdf', 'so khớp doi', 'pdf học thuật'] },
    'ar': { title: 'منشط روابط الاقتباسات المرجعية', metaDescription: 'مسح وتفعيل علامات الاقتباس في ملفات PDF وتحويلها إلى روابط DOI قابلة للنقر أو انتقالات داخل الصفحة.', keywords: ['روابط الاقتباسات pdf', 'تفعيل روابط المراجع', 'مطابقة doi'] }
  },
  'vector-extractor': {
    'zh-TW': { title: 'PDF 矢量提取器', metaDescription: '將 PDF 轉換為高保真 SVG，允許滑鼠拖動、框選並無損提取任意矢量圖形。', keywords: ['pdf 提取矢量', 'svg 導出', '矢量圖表提取', '提取 logo'] },
    'ja': { title: 'PDFベクター抽出器', metaDescription: 'PDFを高品質のSVGに変換し、図面や図表、ロゴなどのベクターオブジェクトを無劣化で個別に抽出できます。', keywords: ['pdf ベクター抽出', 'svgエクスポート', 'ロゴ抽出', '設計図抽出'] },
    'ko': { title: 'PDF 벡터 그래픽 추출기', metaDescription: 'PDF 문서를 고정밀 SVG로 해체하여 로고, 차트, 설계도 등 물리 벡터 패스를 손실 없이 선택하고 추출합니다.', keywords: ['pdf 벡터 추출', 'svg 내보내기', '차트 추출', '일러스트 추출'] },
    'de': { title: 'PDF-Vektorenextraktor', metaDescription: 'Konvertieren Sie PDFs in verlustfreie SVGs. Wählen Sie Vektorgrafiken und Logos aus und exportieren Sie diese.', keywords: ['vektoren extrahieren', 'pdf in svg', 'logo extrahieren', 'konstruktionszeichnung'] },
    'es': { title: 'Extractor de Vectores PDF', metaDescription: 'Convierta PDF a SVG de alta fidelidad. Permite seleccionar y extraer gráficos vectoriales y logotipos sin pérdidas.', keywords: ['extraer vectores pdf', 'exportar svg', 'extraer logotipos', 'graficos vectoriales'] },
    'fr': { title: 'Extracteur de Vecteurs PDF', metaDescription: 'Convertissez les PDFs en SVGs haute fidélité. Permet de sélectionner et d\'extraire les graphiques vectoriels sans perte.', keywords: ['extraire vecteur pdf', 'export svg', 'extraction logo', 'graphique vectoriel'] },
    'id': { title: 'Ekstraktor Vektor PDF', metaDescription: 'Konversi PDF ke SVG presisi tinggi. Pilih dan ekstrak jalur vektor, diagram, dan logo secara mulus.', keywords: ['ekstrak vektor pdf', 'ekspor svg', 'ekstrak logo', 'grafis vektor'] },
    'it': { title: 'Estrattore di Vettori PDF', metaDescription: 'Converti PDF in SVG ad alta fedeltà. Seleziona ed estrai grafiche vettoriali e loghi senza alcuna perdita di qualità.', keywords: ['estrarre vettori pdf', 'esportazione svg', 'estrarre loghi', 'grafica vettoriale'] },
    'pt': { title: 'Extractor de Vetores PDF', metaDescription: 'Converta PDF em SVG de alta fidelidade. Permite selecionar e extrair gráficos vetoriais e logotipos sem perdas.', keywords: ['extrair vetores pdf', 'exportar svg', 'extrair logotipo', 'desenho vetorial'] },
    'vi': { title: 'Trích xuất vectơ PDF', metaDescription: 'Chuyển đổi PDF sang SVG độ chính xác cao, cho phép chọn và trích xuất không mất dữ liệu bất kỳ đồ họa vectơ nào.', keywords: ['trích xuất vectơ pdf', 'xuất svg', 'trích xuất logo', 'đồ họa vectơ'] },
    'ar': { title: 'مستخرج الرسومات المتجهة من PDF', metaDescription: 'تحويل ملفات PDF إلى SVG عالية الدقة، مع إمكانية تحديد واستخراج الشعارات والرسومات المتجهة دون فقدان الجودة.', keywords: ['استخراج المتجهات pdf', 'تصدير svg', 'استخراج الشعارات'] }
  },
  'deep-sanitize': {
    'zh-TW': { title: '深度元數據清洗', metaDescription: '徹底擦除 PDF 文檔中的作者信息、修改歷史、隱藏圖層以及未引用的冗餘數據。', keywords: ['pdf 脫敏', '清除元數據', '防溯源', '安全 pdf'] },
    'ja': { title: '深度メタデータクリーナー', metaDescription: 'PDF内の作成者情報、編集履歴、非表示レイヤー、不要なオブジェクトを完全に抹消し、プライバシーを保護します。', keywords: ['pdf 脱敏', 'メタデータ削除', 'セキュリティ保護', '透かし削除'] },
    'ko': { title: '딥 메타데이터 삭제 및 소독', metaDescription: 'PDF 바이너리 수준에서 작성자 정보, 편집 기록, 숨김 레이어, 폐기 개체를 완벽히 삭제하여 비밀 누설을 차단합니다.', keywords: ['pdf 개인정보 삭제', '메타데이터 소독', '아카이브 클リーニング'] },
    'de': { title: 'Tiefenbereinigung von Metadaten', metaDescription: 'Löschen Sie versteckte Metadaten, Bearbeitungsverlauf, Ebenen und verwaiste Objekte aus PDFs zum Schutz der Privatsphäre.', keywords: ['pdf bereinigen', 'metadaten loeschen', 'datenschutz pdf', 'spuren verwischen'] },
    'es': { title: 'Desinfección Profunda de Metadatos', metaDescription: 'Elimine por completo metadatos, historial de edición, capas ocultas y datos huérfanos de sus documentos PDF.', keywords: ['desinfectar pdf', 'limpiar metadatos', 'privacidad pdf', 'seguridad pdf'] },
    'fr': { title: 'Nettoyage en Profondeur des Métadonnées', metaDescription: 'Effacez définitivement les métadonnées, l\'historique d\'édition, les calques masqués et les objets orphelins des PDFs.', keywords: ['nettoyer pdf', 'supprimer metadonnees', 'confidentialite pdf', 'anonymiser pdf'] },
    'id': { title: 'Pembersihan Metadata Mendalam', metaDescription: 'Hapus total info pembuat, riwayat edit, lapisan tersembunyi, dan objek tidak terpakai pada file PDF untuk keamanan.', keywords: ['pembersihan metadata', 'anonymize pdf', 'keamanan berkas', 'hapus jejak pdf'] },
    'it': { title: 'Sanificazione Profonda dei Metadati', metaDescription: 'Rimuovi definitivamente autore, cronologia modifiche, livelli nascosti e oggetti orfani dal codice binario del PDF.', keywords: ['sanificare pdf', 'eliminare metadati', 'privacy pdf', 'sicurezza documento'] },
    'pt': { title: 'Sanetização Profunda de Metadados', metaDescription: 'Apague permanentemente metadados, histórico de edições, camadas ocultas e dados órfãos para total privacidade.', keywords: ['limpar metadados pdf', 'anonimizar pdf', 'seguranca de documentos'] },
    'vi': { title: 'Làm sạch siêu dữ liệu sâu', metaDescription: 'Xóa bỏ hoàn toàn thông tin tác giả, lịch sử chỉnh sửa, lớp ẩn và các đối tượng thừa từ cấu trúc tệp PDF.', keywords: ['làm sạch pdf', 'xóa siêu dữ liệu', 'bảo mật pdf', 'chống truy vết'] },
    'ar': { title: 'التطهير العميق للبيانات الوصفية', metaDescription: 'مسح معلومات الكاتب وسجل التعديلات والطبقات المخفية والبيانات غير المستخدمة نهائيًا لحماية الخصوصية.', keywords: ['تطهير pdf', 'مسح البيانات الوصفية', 'حماية الخصوصية pdf'] }
  },
  'booklet-folding-simulator': {
    'zh-TW': { title: '3D 裝訂拼版與折頁模擬器', metaDescription: '將 PDF 多頁拼版為可折疊的大版，提供 3D 物理折頁和騎馬釘裝訂仿真動效預覽。', keywords: ['3D 拼版', '折頁模擬', '騎馬釘裝訂', '書籍排版'] },
    'ja': { title: '3D製本折りたたみシミュレーター', metaDescription: '複数ページのPDFを印刷用大版に割り付け、3D物理アニメーションで折りたたみや中綴じ製本をシミュレートします。', keywords: ['3d面付け', '折りたたみシミュレーション', '中綴じ製本', '印刷レイアウト'] },
    'ko': { title: '3D 소책자 접지 시뮬레이터', metaDescription: '순서대로 배열된 PDF 페이지를 인쇄용 대판(Sheet) 배열로 자동 변환하고, 3D 가상 물리 공간에서 접지 및 중철제본을 테스트합니다.', keywords: ['3d 임포지션', '종이 접기 시뮬레이션', '중철 제본', '출판 인쇄'] },
    'de': { title: '3D-Broschüren-Faltsimulator', metaDescription: 'Simulieren Sie das Falzen und Heften von Druckbögen in einer interaktiven 3D-Ansicht basierend auf Ihrem PDF.', keywords: ['falzsimulation', 'ausschießen pdf', 'broschuerendruck', '3d heftung'] },
    'es': { title: 'Simulador 3D de Plegado e Imposición', metaDescription: 'Realice la imposición de páginas PDF en pliegos y visualice el plegado físico y la encuadernación en un simulador 3D.', keywords: ['imposicion 3d', 'simulador de plegado', 'encuadernacion grapada', 'diseño editorial'] },
    'fr': { title: 'Simulateur 3D d\'Imposition et de Pliage', metaDescription: 'Imposez les pages PDF sur de grands formats et visualisez le pliage physique et la reliure dans un espace 3D interactif.', keywords: ['imposition 3d', 'pliage papier', 'reliure piquee', 'maquette imprimerie'] },
    'id': { title: 'Simulator Lipat Buku 3D', metaDescription: 'Atur imposisi halaman PDF ke lembar besar dan simulasikan proses melipat serta menjilid kawat dalam visual 3D.', keywords: ['imposisi 3d', 'lipat kertas', 'jilid kawat', 'layout percetakan'] },
    'it': { title: 'Simulatore 3D di Piegatura e Imposizione', metaDescription: 'Disponi le pagine del PDF su grandi fogli macchina e simula il processo di piegatura e rilegatura in 3D.', keywords: ['imposizione 3d', 'piegatura carta', 'rilegatura a punto metallico', 'impaginazione'] },
    'pt': { title: 'Simulador 3D de Dobra e Imposição', metaDescription: 'Simule a imposição de páginas PDF em chapas de impressão e visualize a dobra física e encadernação em 3D.', keywords: ['imposicao 3d', 'simulador de dobra', 'encadernacao grampeada', 'pre-impressao'] },
    'vi': { title: 'Mô phỏng gấp và bình trang 3D', metaDescription: 'Dàn trang PDF thành các khổ giấy in lớn và trực quan hóa quy trình gấp giấy, đóng ghim sách trong không gian 3D.', keywords: ['bình trang 3d', 'mô phỏng gấp giấy', 'đóng ghim giữa', 'dàn trang in'] },
    'ar': { title: 'محاكي طي وفرض الصفحات ثلاثي الأبعاد', metaDescription: 'ترتيب صفحات PDF لفرضها على ألواح طباعة كبيرة ومحاكاة عملية الطي والتدبيس في بيئة ثلاثية الأبعاد تفاعلية.', keywords: ['فرض الصفحات 3d', 'محاكي طي الورق', 'تجليد كتيبات'] }
  },
  'pdf-to-slide': {
    'zh-TW': { title: '學術與商業投影片重建器', metaDescription: '智能分析 PDF 大綱，提取矢量圖表與重點內容並無損重建為可編輯的 PPTX 演示文稿。', keywords: ['PDF 轉 PPT', '投影片重建', '圖表提取', 'PPTX 生成'] },
    'ja': { title: 'スライドプレゼン再構築', metaDescription: '静的なPDF文書から大綱、見出し、ベクターグラフをスマートに抽出し、再編集可能なPPTXスライドを自動構築します。', keywords: ['pdf ppt 変換', 'プレゼン再構築', 'グラフ抽出', 'pptx生成'] },
    'ko': { title: '슬라이드 PPTX 재구성', metaDescription: '정적 PDF에서 문맥 레이아웃을 해독하여 제목 골격과 벡터 그래프를 분석한 후 편집이 용이한 표준 PPTX 파워포인트로 빌드합니다.', keywords: ['pdf ppt 변환', '슬라이드 재구성', '도표 추출', 'pptx 빌더'] },
    'de': { title: 'PDF-in-Präsentation-Rekonstruktor', metaDescription: 'Analysieren Sie PDFs und extrahieren Sie Gliederungen und Vektorgrafiken in eine bearbeitbare PPTX-Präsentation.', keywords: ['pdf in ppt', 'praesentation erstellen', 'pptx konverter', 'diagramme extrahieren'] },
    'es': { title: 'Reconstructor de PDF a Presentación', metaDescription: 'Analice el esquema de un PDF y extraiga gráficos vectoriales para reconstruirlos en una presentación PPTX editable.', keywords: ['pdf a ppt', 'crear diapositivas', 'convertidor pptx', 'extraer diagramas'] },
    'fr': { title: 'Reconstructeur de PDF en Diaporama', metaDescription: 'Analysez la structure d\'un PDF et extrayez les graphiques vectoriels pour recréer une présentation PPTX modifiable.', keywords: ['pdf en ppt', 'generer diaporama', 'convertisseur pptx', 'extraire graphique'] },
    'id': { title: 'Rekonstruktor PDF ke Slide', metaDescription: 'Analisis garis besar PDF untuk mengekstrak teks penting serta diagram vektor ke dokumen presentasi PPTX yang dapat diedit.', keywords: ['pdf ke ppt', 'rekonstruksi slide', 'ekstrak diagram', 'file pptx'] },
    'it': { title: 'Ricostruttore da PDF a Presentazione', metaDescription: 'Analizza la struttura del PDF ed estrai schemi e grafici vettoriali in una presentazione PPTX modificabile.', keywords: ['pdf in ppt', 'creare diapositive', 'convertitore pptx', 'estrazione grafici'] },
    'pt': { title: 'Reconstrutor de PDF para Slides', metaDescription: 'Analise o esboço de um PDF e extraia gráficos vetoriais para reconstruí-los em uma apresentação PPTX editável.', keywords: ['pdf para ppt', 'criar slides', 'conversor pptx', 'extrair graficos'] },
    'vi': { title: 'Tái tạo PDF thành Slide thuyết trình', metaDescription: 'Phân tích bố cục tài liệu PDF để trích xuất sơ đồ vectơ và nội dung chính thành tệp trình chiếu PPTX có thể chỉnh sửa.', keywords: ['pdf sang ppt', 'tái tạo slide', 'trích xuất biểu đồ', 'tạo pptx'] },
    'ar': { title: 'إعادة بناء ملفات PDF إلى شرائح عرض تقديمية', metaDescription: 'تحليل الخطوط العريضة لملفات PDF واستخراج الجداول والرسومات المتجهة وإعادة بنائها في ملف PPTX قابل للتعديل.', keywords: ['تحويل pdf إلى ppt', 'إعادة بناء الشرائح', 'ملف pptx'] }
  },
  'eink-optimizer': {
    'zh-TW': { title: '電子墨水屏護眼調色艙', metaDescription: '針對電子墨水屏設備優化 PDF：去噪、直方圖二值化、字跡膨脹加粗，帶來極致的紙感閱讀。', keywords: ['墨水屏優化', '二值化去噪', '字跡加粗', '護眼閱讀'] },
    'ja': { title: 'E-Inkペーパー読みやすさ最適化', metaDescription: '電子ペーパー（Kindle等）向けにPDFを最適化：大津二値化による背景除去、輪郭強調、文字の太字化処理。', keywords: ['e-ink 最適化', '二値化ノイズ除去', '太字化', '電子ペーパー読みやすい'] },
    'ko': { title: 'e-Ink 전자잉크 리더 최적화', metaDescription: '전자잉크 이북 리더기 전용 PDF 보정: 오츠 알고리즘 이진화로 회색 배경을 표백하고 미세 폰트 획을 확장 및 가공합니다.', keywords: ['전자잉크 최적화', '이진화 노يز 제거', '글씨 굵게', '북리더 가독성'] },
    'de': { title: 'e-Ink Reader-Optimierer', metaDescription: 'Optimieren Sie PDFs für e-Ink-Displays durch Hintergrundentfernung, Otsu-Binarisierung und Textverdickung.', keywords: ['e-ink optimieren', 'binarisierung', 'text fetten', 'lesbarkeit e-reader'] },
    'es': { title: 'Optimizador para Lectores e-Ink', metaDescription: 'Optimice PDFs para pantallas de tinta electrónica: eliminación de ruido, binarización Otsu y engrosamiento de trazos.', keywords: ['optimizar eink', 'binarizacion otsu', 'engrosar letra', 'lectores de tinta'] },
    'fr': { title: 'Optimiseur pour Liseuses e-Ink', metaDescription: 'Optimisez les PDFs pour écrans à encre électronique : suppression du bruit, binarisation d\'Otsu et épaississement du texte.', keywords: ['optimisation eink', 'binarisation otsu', 'epaissement texte', 'confort liseuse'] },
    'id': { title: 'Pengoptimal Pembaca e-Ink', metaDescription: 'Optimalkan PDF untuk layar tinta elektronik melalui pembersihan latar belakang, binarisasi Otsu, dan penebalan goresan teks.', keywords: ['optimasi eink', 'binarisasi otsu', 'tebalkan tulisan', 'baca e-reader'] },
    'it': { title: 'Ottimizzatore per e-Ink Reader', metaDescription: 'Ottimizza i PDF per schermi a inchiostro elettronico tramite eliminazione del rumore, binarizzazione Otsu e ispessimento del testo.', keywords: ['ottimizzazione eink', 'binarizzazione otsu', 'ingrandire tratti', 'lettura ereader'] },
    'pt': { title: 'Otimizador de Leitor e-Ink', metaDescription: 'Otimize PDFs para telas de tinta digital: remoção de ruídos, binarização de Otsu e espessamento de traços de texto.', keywords: ['otimizar eink', 'binarizacao otsu', 'engrossar letra', 'leitura e-reader'] },
    'vi': { title: 'Tối ưu hóa màn hình E-ink', metaDescription: 'Tối ưu hóa tài liệu PDF cho các thiết bị màn hình mực điện tử: khử nhiễu, nhị phân hóa Otsu, làm đậm nét chữ.', keywords: ['tối ưu e-ink', 'nhị phân hóa khử nhiễu', 'làm đậm nét chữ', 'máy đọc sách'] },
    'ar': { title: 'محسن أجهزة القراءة بالحبر الإلكتروني', metaDescription: 'تحسين ملفات PDF لشاشات الحبر الإلكتروني: إزالة التشويش، الثنائية (Otsu)، وتسميك خطوط الكتابة الباهتة.', keywords: ['تحسين الحبر الالكتروني', 'تنقية الخلفية pdf', 'تسميك الخطوط'] }
  },
  'cert-cryptor': {
    'zh-TW': { title: '3D 物理蠟封證書簽名與雙鑰加密鎖', metaDescription: '使用非對稱公鑰證書加密 PDF，配合 3D 實體黃金火漆按壓蓋印及 PKCS#7 數字證書簽名。', keywords: ['證書加密', '火漆簽名', '數字簽名', '非對稱加密'] },
    'ja': { title: '3Dワックスシール証明書署名', metaDescription: '公開鍵証明書による暗号化、PKCS#7規格の電子署名、そして3D立体デザインの封蝋（シーリングワックス）をドキュメントに施します。', keywords: ['証明書暗号化', 'シーリングスタンプ', '電子署名', '暗号セキュリティ'] },
    'ko': { title: '3D 실물 왁스 씰 인증서 서명', metaDescription: '공개키 인증서를 이용한 PDF 암호화 및 PKCS#7 공인 디지털 서명과 더불어, 입체감 있는 3D 골드 왁스 씰 도장을 인장합니다.', keywords: ['인증서 암호화', '왁스 씰 서명', '디지털 서명', '비대칭 암호화'] },
    'de': { title: '3D-Siegel-Zertifikatsverschlüsselung', metaDescription: 'Verschlüsseln Sie PDFs mit Empfängerzertifikaten und bringen Sie ein plastisches 3D-Wachssiegel sowie PKCS#7-Signaturen auf.', keywords: ['zertifikat verschluesseln', 'wachssiegel', 'digitale signatur', 'pkcs7'] },
    'es': { title: 'Firma con Sello de Lacre 3D y Cifrado', metaDescription: 'Cifre PDFs con certificados de clave pública y aplique una firma digital PKCS#7 junto a un sello de lacre físico en 3D.', keywords: ['cifrado de certificados', 'sello de lacre 3d', 'firma digital', 'pkcs7'] },
    'fr': { title: 'Chiffrement et Signature par Sceau de Cire 3D', metaDescription: 'Chiffrez les PDFs par clé publique et appliquez un sceau de cire 3D réaliste ainsi qu\'une signature numérique PKCS#7.', keywords: ['chiffrement certificat', 'sceau de cire 3d', 'signature numerique', 'pkcs7'] },
    'id': { title: 'Tanda Tangan Segel Lilin 3D & Enkripsi', metaDescription: 'Enkripsi PDF dengan sertifikat kunci publik, tanda tangan PKCS#7, serta cetakan segel lilin fisik 3D emas mewah.', keywords: ['enkripsi sertifikat', 'segel lilin 3d', 'tanda tangan digital', 'pkcs7'] },
    'it': { title: 'Firma con Ceralacca 3D e Cifratura', metaDescription: 'Cifra i PDF con certificati a chiave pubblica e applica una firma PKCS#7 abbinata a un sigillo tridimensionale in ceralacca.', keywords: ['cifratura certificati', 'sigillo ceralacca 3d', 'firma digitale', 'pkcs7'] },
    'pt': { title: 'Assinatura com Selo de Lacre 3D e Cifragem', metaDescription: 'Cifre PDFs com certificados de chave pública e aplique uma assinatura digital PKCS#7 acompanhada de um selo de lacre 3D.', keywords: ['cifragem de certificados', 'selo de lacre 3d', 'assinatura digital', 'pkcs7'] },
    'vi': { title: 'Ký chứng thư số & Đóng dấu sáp 3D', metaDescription: 'Mã hóa PDF bằng chứng thư công khai, ký số PKCS#7 kết hợp hiệu ứng đóng dấu sáp nổi 3D cổ điển.', keywords: ['mã hóa chứng thư', 'đóng dấu sáp 3d', 'ký số pkcs7', 'bảo mật pdf'] },
    'ar': { title: 'توقيع الشهادات بختم الشمع ثلاثي الأبعاد والتشفير', metaDescription: 'تشفير ملفات PDF بشهادات المفاتيح العامة وتوقيعها رقميًا بمعيار PKCS#7 مع ختم شمعي ثلاثي الأبعاد مجسم.', keywords: ['تشفير الشهادات pdf', 'ختم شمعي 3d', 'توقيع pkcs7'] }
  },
  'passport-id-composer': {
    'zh-TW': { title: '證件雙面拼版與複印合成器', metaDescription: '一鍵將身份證或護照正反兩面快速拼版渲染到單張 A4 紙張的上下區域，支援加防偽透明水印。', keywords: ['身份證拼版', '護照拼大版', '證件複印合成', '身份證水印'] },
    'ja': { title: '身分証・パスポート両面合成', metaDescription: '免許証やマイナンバーカード、パスポートの表裏両面を、A4用紙の上下に整列配置して印刷用PDFを合成します。', keywords: ['身分証コピー', '両面印刷合成', 'パスポートコピー', '透かし追加'] },
    'ko': { title: '여권 및 신분증 복사 합성기', metaDescription: '주민등록증, 운전면허증 및 여권의 앞뒷면 사진을 한 장의 A4 용지 규격 내에 상하 정렬로 배치하고 방범 수자원을 삽입합니다.', keywords: ['신분증 사본', '앞뒷면 합성', 'A4 인쇄 정렬', '신분증 도용 방지'] },
    'de': { title: 'Pass- & Ausweiskopierer', metaDescription: 'Kombinieren Sie die Vorder- und Rückseite von Ausweisen oder Pässen auf einer A4-Seite mit Wasserzeichen.', keywords: ['ausweis kopieren', 'ausweiskopie a4', 'pass kopieren', 'wasserzeichen'] },
    'es': { title: 'Compositor de Pasaportes y Documentos de Identidad', metaDescription: 'Combine el anverso y reverso de identificaciones o pasaportes en una página A4 con marcas de agua de seguridad.', keywords: ['copia de identificacion', 'anverso reverso a4', 'copia de pasaporte', 'marca de agua'] },
    'fr': { title: 'Compositeur de Passeports et Cartes d\'Identité', metaDescription: 'Combinez le recto et le verso de vos cartes d\'identité ou passeports sur une page A4 avec filigrane de sécurité.', keywords: ['photocopie carte identite', 'recto verso a4', 'copie passeport', 'filigrane'] },
    'id': { title: 'Penyusun Paspor & Kartu Identitas', metaDescription: 'Gabungkan sisi depan dan belakang KTP/Paspor secara presisi pada satu halaman A4 dengan tanda air pengaman.', keywords: ['salinan ktp', 'ktp bolak balik a4', 'salinan paspor', 'watermark ktp'] },
    'it': { title: 'Compositore di Passaporti e Documenti d\'Identità', metaDescription: 'Combina fronte e retro di carte d\'identità o passaporti su una singola pagina A4 con filigrane antiradicali.', keywords: ['copia carta identita', 'fronte retro a4', 'copia passaporto', 'filigrana'] },
    'pt': { title: 'Compositor de Passaporte e Identidade', metaDescription: 'Combine a frente e o verso de identidades ou passaportes em uma página A4 com marca d\'água de segurança.', keywords: ['copia de identidade', 'frente verso a4', 'copia de passaporte', 'marca de agua'] },
    'vi': { title: 'Ghép mặt chứng minh thư & hộ chiếu', metaDescription: 'Sắp xếp hai mặt thẻ căn cước hoặc hộ chiếu lên một trang giấy A4 để in ấn, hỗ trợ đóng dấu nước chống lạm dụng.', keywords: ['ghép mặt căn cước', 'photo chứng minh thư', 'in hộ chiếu', 'đóng dấu nước'] },
    'ar': { title: 'ملحن ومجمع جوازات السفر وبطاقات الهوية', metaDescription: 'دمج الوجهين الأمامي والخلفي لبطاقات الهوية أو جواز السفر في صفحة A4 واحدة مع إضافة علامة مائية لحمايتها.', keywords: ['نسخ الهوية المزدوجة', 'ترتيب جواز السفر a4', 'علامة مائية للهوية'] }
  },
  'annotation-exporter': {
    'zh-TW': { title: '多維文獻批註與摘要提取艙', metaDescription: '深入讀取 PDF 批註字典，一鍵捕獲高亮、手寫備忘與文字批註並導出為結構化 Markdown。', keywords: ['pdf 導出批註', '文獻閱讀筆記', '提取高亮', 'markdown 導出'] },
    'ja': { title: '注釈・ハイライト抽出エクスポート', metaDescription: 'PDF内のハイライト、手書きメモ、コメント注釈を抽出し、見やすく整理されたMarkdownドキュメントとして書き出します。', keywords: ['注釈抽出', 'ハイライトエクスポート', '読書ノート', 'markdown書き出し'] },
    'ko': { title: '주석 및 하이라이트 내보내기', metaDescription: 'PDF 문서 내에 기록된 형광펜 하이라이트, 텍스트 주석, 필기 메모를 구조화된 마크다운(Markdown) 문서로 일괄 내보냅니다.', keywords: ['pdf 주석 추출', '하이라이트 수집', '독서 노트 생성', '마크다운 변환'] },
    'de': { title: 'Anmerkungs- & Highlight-Exporter', metaDescription: 'Exportieren Sie Hervorhebungen, Notizen und Kommentare aus Ihren PDFs in ein strukturiertes Markdown-Dokument.', keywords: ['anmerkungen exportieren', 'pdf highlights', 'lesenotizen', 'markdown export'] },
    'es': { title: 'Exportador de Anotaciones y Resaltados', metaDescription: 'Extraiga resaltados, notas y comentarios de PDFs en un documento Markdown organizado para su estudio.', keywords: ['exportar anotaciones pdf', 'extraer resaltados', 'notas de estudio', 'markdown'] },
    'fr': { title: 'Exportateur d\'Annotations et Surlignages', metaDescription: 'Extrayez les surlignages, commentaires et notes de vos PDFs vers un document Markdown structuré pour vos fiches.', keywords: ['exporter annotations pdf', 'extraire surlignage', 'notes de lecture', 'markdown'] },
    'id': { title: 'Eksporter Catatan & Sorotan', metaDescription: 'Ekstrak coretan stabilo, catatan kaki, dan komentar dari dokumen PDF Anda ke catatan ringkas berformat Markdown.', keywords: ['ekstrak anotasi pdf', 'ekspor highlight', 'catatan bacaan', 'file markdown'] },
    'it': { title: 'Esportatore di Annotazioni ed Evidenziature', metaDescription: 'Estrai evidenziature, note e commenti inseriti nei PDF in un comodo file di testo Markdown per lo studio.', keywords: ['esportare annotazioni', 'estrarre evidenziature', 'note lettura', 'markdown'] },
    'pt': { title: 'Exportador de Anotações e Destaques', metaDescription: 'Extraia destaques, notas e comentários de PDFs em um arquivo de notas estruturado em Markdown.', keywords: ['exportar anotacoes pdf', 'extrair destaques', 'notas de leitura', 'markdown'] },
    'vi': { title: 'Trích xuất chú thích & văn bản tô sáng', metaDescription: 'Quét và trích xuất các nét vẽ tay, văn bản tô sáng và nhận xét từ tài liệu PDF thành ghi chú Markdown.', keywords: ['trích xuất chú thích pdf', 'xuất văn bản tô sáng', 'ghi chú đọc sách'] },
    'ar': { title: 'مستخرج التعليقات التوضيحية والنصوص المظللة', metaDescription: 'تصدير النصوص المظللة والملاحظات والتعليقات من ملفات PDF إلى مستند Markdown مرتب لتلخيص الدراسات.', keywords: ['تصدير تعليقات pdf', 'استخراج التظليل', 'ملاحظات القراءة'] }
  },
  'batch-watermark-remover': {
    'zh-TW': { title: '內容流物理級去水印引擎', metaDescription: '深入 PDF 內容描述符，精確刪除特定 Tj/TJ 文本流與 XObject 圖像水印而不損害文案。', keywords: ['pdf 去水印', '批量刪除浮水印', '內容流優化', 'pdf 清潔'] },
    'ja': { title: 'ウォーターマーク一括削除', metaDescription: 'PDFの内部描画オペレーターを走査し、本文のレイアウトを崩さずにテキストや画像（XObject）の透かしを物理的に除去します。', keywords: ['pdf 透かし削除', 'ウォーターマーク削除', '描画命令編集', 'クリーンpdf'] },
    'ko': { title: '워터마크 일괄 제거기', metaDescription: 'PDF 바이너리 드로잉 명령어를 직접 파싱하여 텍스트 흐름이나 배경 이미지로 고정된 워터마크를 완벽히 제거합니다.', keywords: ['pdf 워터마크 삭제', '배경 로고 제거', '콘텐츠 스트림 편집'] },
    'de': { title: 'Wasserzeichen-Massenentferner', metaDescription: 'Analysieren Sie PDF-Inhaltsströme und löschen Sie Text- und Bild-Wasserzeichen (XObjects) rückstandslos.', keywords: ['wasserzeichen entfernen', 'pdf bereinigen', 'hintergrundlogo loeschen'] },
    'es': { title: 'Eliminador de Marcas de Agua en Lote', metaDescription: 'Analice el flujo de contenido de sus PDFs y elimine marcas de agua de texto e imagen (XObjects) sin alterar el formato.', keywords: ['eliminar marca de agua pdf', 'quitar logos pdf', 'limpieza de pdf'] },
    'fr': { title: 'Suppresseur de Filigranes en Lot', metaDescription: 'Analysez le flux de contenu de vos PDFs et supprimez les filigranes texte ou image (XObjects) sans altérer la mise en page.', keywords: ['supprimer filigrane pdf', 'retirer logo pdf', 'nettoyer pdf'] },
    'id': { title: 'Penghapus Tanda Air Massal', metaDescription: 'Analisis aliran instruksi PDF untuk menghapus tanda air berupa teks atau gambar (XObject) tanpa merusak tata letak tulisan.', keywords: ['hapus watermark pdf', 'bersihkan logo halaman', 'pengeditan dokumen'] },
    'it': { title: 'Rimozione Filigrana in Blocco', metaDescription: 'Analizza il flusso grafico del PDF e rimuovi in modo pulito filigrane di testo e immagini di sfondo (XObjects).', keywords: ['rimuovere filigrana', 'cancellare logo pdf', 'pulizia documento'] },
    'pt': { title: 'Removedor de Marcas d\'Água em Lote', metaDescription: 'Analise o fluxo de conteúdo de PDFs e elimine marcas d\'água de texto e imagem (XObjects) sem alterar o leiaute.', keywords: ['remover marca de agua pdf', 'quitar logos pdf', 'limpeza de arquivos'] },
    'vi': { title: 'Xóa hình mờ hàng loạt', metaDescription: 'Phân tích mã nguồn nội dung PDF, loại bỏ chính xác các luồng văn bản Tj/TJ và hình ảnh XObject chứa hình mờ.', keywords: ['xóa hình mờ pdf', 'xóa watermark hàng loạt', 'làm sạch nội dung pdf'] },
    'ar': { title: 'مزيل العلامات المائية دفعة واحدة', metaDescription: 'تحليل تدفق الأوامر الرسومية لملفات PDF وحذف العلامات المائية النصية والصورية (XObjects) دون إفساد المحتوى.', keywords: ['حذف العلامة المائية pdf', 'مزيل الشعارات المائية', 'تنقية ملفات pdf'] }
  },
  'smart-data-redactor': {
    'zh-TW': { title: '物理擦除式隱私數據遮罩艙', metaDescription: '智能檢索文檔中的郵箱、身份證、手機等隱私數據，強制物理填色遮罩並重置底層文本。', keywords: ['pdf 隱私遮罩', '安全脫敏', '物理擦除', '數據合規'] },
    'ja': { title: 'スマート機密情報黒塗り', metaDescription: '文書内のメールアドレス、個人番号、電話番号などの個人情報を検出し、物理的に黒塗り・テキスト破棄をして保護します。', keywords: ['機密情報黒塗り', '個人情報保護', 'pdf脱敏', 'テキスト抹消'] },
    'ko': { title: '스마트 민감 정보 비식별화', metaDescription: '이메일, 전화번호, 주민등록번호 등 핵심 개인정보를 자동 식별하여 물리적 블랙 마스킹을 하고 원본 텍스트를 삭제합니다.', keywords: ['개인정보 마스킹', '비식별화 조치', '민감 데이터 마스킹'] },
    'de': { title: 'Intelligente Daten-Schwärzung', metaDescription: 'Erkennen Sie E-Mails, Telefonnummern und Ausweisdaten in PDFs und schwärzen Sie diese physisch und unumkehrbar.', keywords: ['pdf schwaerzen', 'datenschutz pdf', 'zensieren', 'anonymisieren'] },
    'es': { title: 'Redactor Inteligente de Datos Sensibles', metaDescription: 'Detecte y censure de forma física e irreversible correos electrónicos, números de teléfono e identificaciones en PDFs.', keywords: ['censurar pdf', 'ocultar datos sensibles', 'redaccion de documentos'] },
    'fr': { title: 'Masquage Intelligent des Données Sensibles', metaDescription: 'Détectez et censurez de manière physique et irréversible les e-mails, numéros de téléphone et pièces d\'identité.', keywords: ['censure pdf', 'masquer donnee sensible', 'anonymisation pdf'] },
    'id': { title: 'Redaktur Data Sensitif Pintar', metaDescription: 'Deteksi otomatis email, nomor telepon, dan nomor kartu identitas lalu tutup dengan kotak hitam permanen dan hapus teksnya.', keywords: ['redaksi data pdf', 'masking data sensitif', 'keamanan informasi'] },
    'it': { title: 'Redattore Intelligente di Dati Sensibili', metaDescription: 'Rileva e censura in modo permanente e irreversibile email, numeri telefonici e codici fiscali all\'interno del PDF.', keywords: ['censurare pdf', 'mascheramento dati', 'anonymizzare pdf', 'dati sensibili'] },
    'pt': { title: 'Redator Inteligente de Dados Sensíveis', metaDescription: 'Detecte e censure de forma física e irreversível e-mails, números de telefone e documentos em arquivos PDF.', keywords: ['censurar pdf', 'ocultar dados sensiveis', 'redacao de documentos'] },
    'vi': { title: 'Che phủ dữ liệu nhạy cảm thông minh', metaDescription: 'Tự động quét các thông tin như email, số điện thoại, căn cước, sau đó vẽ đè hộp màu đen che phủ và hủy văn bản gốc.', keywords: ['che phủ dữ liệu nhạy cảm', 'mã hóa thông tin cá nhân', 'bảo mật thông tin'] },
    'ar': { title: 'طمس البيانات الحساسة الذكي', metaDescription: 'اكتشاف عناوين البريد الإلكتروني وأرقام الهواتف وبطاقات الهوية في ملفات PDF وتغطيتها باللون الأسود وحذف النص نهائيًا.', keywords: ['طمس البيانات pdf', 'حجب المعلومات الحساسة', 'إزالة البيانات الشخصية'] }
  },
  'bookmarks-auto-generator': {
    'zh-TW': { title: 'PDF 大綱目錄樹一鍵生成器', metaDescription: '智能分析文檔中的字體大小與層級，在底層對象中自動注入嵌套大綱 Outlines 書簽樹。', keywords: ['pdf 自動書籤', '大綱目錄樹', 'pdf 導航結構', '自動大綱'] },
    'ja': { title: 'しおり目次自動生成', metaDescription: '文書のフォントサイズやスタイルをスマートに解析し、入れ子構造のしおり（アウトラインツリー）を自動構築します。', keywords: ['pdf しおり作成', '目次自動生成', 'ドキュメント構造化'] },
    'ko': { title: '북마크 목차 자동 생성기', metaDescription: '문서 서체 크기와 상하 관계를 분석하여 PDF 내장 북마크 계층 트리(/Outlines)를 원클릭으로 주입 생성합니다.', keywords: ['pdf 북마크 만들기', '목차 구조화', '자동 아웃라인'] },
    'de': { title: 'Automatischer Lesezeichen-Generator', metaDescription: 'Analysieren Sie Schriftgrößen und Hierarchien, um automatisch eine verschachtelte Lesezeichen-Gliederung zu erstellen.', keywords: ['lesezeichen erstellen', 'pdf gliederung', 'inhaltsverzeichnis pdf'] },
    'es': { title: 'Generador Automático de Marcadores', metaDescription: 'Analice los tamaños de fuente y jerarquías para inyectar automáticamente un esquema de marcadores anidados en el PDF.', keywords: ['marcadores pdf', 'esquema de navegacion', 'crear marcadores automaticos'] },
    'fr': { title: 'Générateur Automatique de Signets', metaDescription: 'Analysez les tailles de police et hiérarchies pour injecter automatiquement une arborescence de signets dans vos PDFs.', keywords: ['signets pdf', 'arborescence navigation', 'creer table des matieres'] },
    'id': { title: 'Pembuat Buku Petunjuk Buku Otomatis', metaDescription: 'Analisis ukuran font dan tingkat hierarki tulisan untuk menyusun pohon navigasi buku petunjuk (bookmark) secara otomatis.', keywords: ['bookmark otomatis pdf', 'pohon navigasi', 'struktur dokumen'] },
    'it': { title: 'Generatore Automatico di Segnalibri', metaDescription: 'Analizza la dimensione del carattere e la gerarchia del testo per generare automaticamente un albero strutturato di segnalibri.', keywords: ['segnalibri pdf', 'albero navigazione', 'indice strutturato'] },
    'pt': { title: 'Gerador Automático de Favoritos', metaDescription: 'Analise o tamanho das fontes e hierarquias para criar automaticamente um índice de marcadores favoritos no PDF.', keywords: ['favoritos pdf', 'marcador de pagina', 'indice estruturado pdf'] },
    'vi': { title: 'Tự động tạo cây mục lục / bookmarks', metaDescription: 'Phân tích kích thước và thứ bậc phông chữ trong tài liệu để tạo và nhúng cây mục lục (/Outlines) tự động.', keywords: ['tạo bookmark tự động', 'mục lục thông minh pdf', 'cây mục lục'] },
    'ar': { title: 'منشئ الإشارات المرجعية والمخططات التلقائي', metaDescription: 'تحليل أحجام الخطوط ومستويات العناوين لإنشاء شجرة فهرسة وإشارات مرجعية متداخلة تلقائيًا داخل ملف PDF.', keywords: ['اشارات مرجعية تلقائية', 'فهرس العناوين pdf', 'هيكلية المستند'] }
  },
  'batch-barcode-injector': {
    'zh-TW': { title: '萬級高性能條碼/二維碼注入艙', metaDescription: '批量且高精度地向 PDF 各頁面指定坐標注入二維碼與 Code128 條形碼圖層。', keywords: ['pdf 注入條碼', '二維碼合埋', '批次二維碼', '條形碼嵌入'] },
    'ja': { title: 'バーコード・QRコード一括挿入', metaDescription: 'PDFの指定ページ・座標に、QRコードやバーコード（Code128）を高品質かつ一括でインプレース挿入します。', keywords: ['qrコード挿入', 'バーコード埋め込み', '伝票処理', '一括スタンプ'] },
    'ko': { title: '바코드 및 QR코드 일괄 주입기', metaDescription: '배송 서류, 세금 문서 등 PDF 각 페이지의 지정 좌표에 QR코드 및 Code128 바코드 스탬프를 일괄 삽입합니다.', keywords: ['qr코드 주입', '바코드 병합', '송장 일괄 스탬프'] },
    'de': { title: 'Barcode- & QR-Code-Masseninjektor', metaDescription: 'Fügen Sie ausgewählten Seiten Ihres PDFs an bestimmten Koordinaten Barcodes (Code 128) oder QR-Codes hinzu.', keywords: ['barcodes einfuegen', 'qr code pdf', 'rechnungsdokumente', 'code 128'] },
    'es': { title: 'Inyector de Código de Barras y QR en Lote', metaDescription: 'Inyecte códigos de barras (Code128) y códigos QR en coordenadas específicas de múltiples páginas PDF en lote.', keywords: ['insertar qr pdf', 'códigos de barras en lote', 'etiquetado pdf'] },
    'fr': { title: 'Injecteur de Codes-Barres et QR Codes en Lot', metaDescription: 'Intégrez des codes-barres (Code128) et des codes QR à des coordonnées précises sur plusieurs pages PDF en lot.', keywords: ['inserer qr code', 'codes-barres en lot', 'estampillage pdf'] },
    'id': { title: 'Penyuntik Barcode & QR Massal', metaDescription: 'Masukkan QR Code atau Barcode (Code128) pada koordinat spesifik di seluruh halaman file PDF secara massal.', keywords: ['suntik qr pdf', 'barcode massal', 'penomoran dokumen'] },
    'it': { title: 'Iniettore di Codici a Barre e QR in Blocco', metaDescription: 'Inserisci codici a barre (Code128) e codici QR in coordinate specifiche su più pagine del PDF contemporaneamente.', keywords: ['inserire qr code', 'codice a barre pdf', 'tracciabilità documenti'] },
    'pt': { title: 'Injetor de Código de Barras e QR em Lote', metaDescription: 'Insira códigos de barras (Code128) e códigos QR em coordenadas específicas em múltiplas páginas PDF em lote.', keywords: ['inserir qr pdf', 'codigo de barras em lote', 'etiquetagem pdf'] },
    'vi': { title: 'Nhúng mã vạch & mã QR hàng loạt', metaDescription: 'Tải lên danh sách mã vạch hoặc mã QR và nhúng chúng hàng loạt vào tọa độ định sẵn trên các trang PDF.', keywords: ['nhúng qr hàng loạt', 'chèn mã vạch pdf', 'in nhãn mã vạch'] },
    'ar': { title: 'حقن رموز الباركود والاستجابة السريعة (QR) دفعة واحدة', metaDescription: 'إضافة رموز QR أو رموز الباركود (Code128) في إحداثيات محددة عبر صفحات ملف PDF دفعة واحدة.', keywords: ['حقن باركود pdf', 'اضافة رموز qr', 'ختم الشحنات'] }
  },
  'signature-ink-optimizer': {
    'zh-TW': { title: '簽名與蓋印提取淨化艙', metaDescription: '提取簽名印章並純化 HSL 色彩空間，漂白雜色與紙張反光，還原高品質透明底透明簽名。', keywords: ['簽名提取', '印章透明化', '筆跡純化', '印章漂白'] },
    'ja': { title: '署名・スタンプ抽出純化', metaDescription: 'スキャン文書から手書き署名や印鑑スタンプの画像を抽出し、紙のシワや背景ノイズを消して透明な透過PNGに加工します。', keywords: ['署名切り出し', '印鑑透過', '背景白飛び', 'スタンプ透過png'] },
    'ko': { title: '서명 및 인장 배경 투명화', metaDescription: '스캔된 서류에서 필기 서명과 빨간색 인장을 자동 추출하고 HSL 보정으로 배경 얼룩을 제거하여 투명 PNG로 분리합니다.', keywords: ['서명 추출', '도장 투명화', '도장 누끼', '필적 정화'] },
    'de': { title: 'Unterschriften- & Stempel-Optimierer', metaDescription: 'Extrahieren Sie Unterschriften und Stempel aus Scans und entfernen Sie Hintergrundgeräusche für transparente PNGs.', keywords: ['unterschrift freistellen', 'stempel digitalisieren', 'transparentes png'] },
    'es': { title: 'Optimizador de Firmas y Sellos', metaDescription: 'Extraiga firmas y sellos de documentos escaneados, eliminando el fondo para generar PNGs transparentes de alta calidad.', keywords: ['extraer firma pdf', 'digitalizar sellos', 'fondo transparente png'] },
    'fr': { title: 'Optimiseur de Signatures et Tampons', metaDescription: 'Extrayez des signatures et tampons de documents scannés en éliminant l\'arrière-plan pour générer des PNGs transparents.', keywords: ['detourer signature', 'digitaliser tampon', 'png transparent'] },
    'id': { title: 'Pengoptimal Tanda Tangan & Stempel', metaDescription: 'Ekstrak tanda tangan dan cap stempel dari dokumen scan, hilangkan latar kertas menjadi gambar PNG transparan bersih.', keywords: ['ekstrak tanda tangan', 'stempel transparan', 'bersihkan coretan kertas'] },
    'it': { title: 'Ottimizzatore di Firme e Timbri', metaDescription: 'Estrai firme autografe e timbri da documenti scansionati, ripulendo lo sfondo per ottenere file PNG trasparenti.', keywords: ['estrarre firma', 'digitalizzare timbro', 'sfondo trasparente png'] },
    'pt': { title: 'Otimizador de Assinaturas e Carimbos', metaDescription: 'Extraia assinaturas e carimbos de digitalizações, removendo o fundo para gerar arquivos PNG transparentes.', keywords: ['extrair assinatura', 'digitalizar carimbo', 'png fundo transparente'] },
    'vi': { title: 'Tối ưu hóa chữ ký & con dấu', metaDescription: 'Trích xuất chữ ký và con dấu từ tài liệu quét, làm sạch nền và khử bóng để tạo tệp PNG nền trong suốt.', keywords: ['tách chữ ký', 'làm trong suốt con dấu', 'tách dấu đỏ png'] },
    'ar': { title: 'محسن ومستخلص التواقيع والأختام', metaDescription: 'استخلاص التواقيع اليدوية والأختام من المستندات الممسوحة ضوئيًا وجعل خلفيتها شفافة بجودة عالية (PNG).', keywords: ['استخلاص التوقيع', 'جعل الختم شفافًا', 'تصفية التواقيع'] }
  },
  'dead-link-debugger': {
    'zh-TW': { title: '死鏈診斷與重定向注入艙', metaDescription: '診斷 PDF 文檔中的 /URI 鏈接動作，提供無效鏈接標識與原地重定向修復。', keywords: ['pdf 死鏈診斷', '修改鏈接', 'pdf 鏈接修復', '網頁鏈接調試'] },
    'ja': { title: 'リンク切れ診断・修正', metaDescription: 'PDF内のすべての外部リンク（/URI）をスキャンして接続状態を診断し、切れたリンクの修正や差し替えを行います。', keywords: ['リンク診断', 'pdfリンク修正', 'リンク切れチェック', 'アドレス置換'] },
    'ko': { title: '깨진 링크 디버거 및 수정', metaDescription: 'PDF 내부의 모든 하이퍼링크(/URI) 연결 상태를 실시간 테스트하고, 끊어진 링크나 무효 주소를 손쉽게 수정 및 주입합니다.', keywords: ['pdf 링크 복구', 'url 디버깅', '하이퍼링크 수정'] },
    'de': { title: 'Fehlerhafte Links reparieren', metaDescription: 'Scannen Sie PDF-Dokumente auf ungültige Links (/URI) und korrigieren oder leiten Sie diese direkt um.', keywords: ['links reparieren pdf', 'tote links checken', 'url aendern pdf'] },
    'es': { title: 'Depurador de Enlaces Rotos', metaDescription: 'Escanee y diagnostique enlaces externos (/URI) en PDFs, permitiendo corregirlos o redirigirlos fácilmente.', keywords: ['enlaces rotos pdf', 'corregir url pdf', 'depurar hipervinculos'] },
    'fr': { title: 'Débogueur de Liens Morts', metaDescription: 'Analysez et diagnostiquez les liens externes (/URI) dans vos PDFs, et corrigez ou redirigez-les facilement.', keywords: ['liens morts pdf', 'corriger url pdf', 'deboguer hyperliens'] },
    'id': { title: 'Debugger Tautan Rusak', metaDescription: 'Pindai dokumen PDF untuk memeriksa tautan eksternal (/URI) yang mati dan perbaiki alamat URL-nya secara instan.', keywords: ['tautan rusak pdf', 'perbaiki link pdf', 'edit url dokumen'] },
    'it': { title: 'Debugger di Link Interrotti', metaDescription: 'Scansiona i collegamenti esterni (/URI) nel PDF per individuare link non funzionanti e correggerli al volo.', keywords: ['link rotti pdf', 'correggere url pdf', 'verifica collegamenti'] },
    'pt': { title: 'Depurador de Links Quebrados', metaDescription: 'Verifique links externos (/URI) inválidos em PDFs e corrija ou redirecione-os diretamente no documento.', keywords: ['links quebrados pdf', 'corrigir url pdf', 'verificar hiperlinks'] },
    'vi': { title: 'Chẩn đoán và sửa liên kết chết', metaDescription: 'Quét toàn bộ tài liệu PDF để tìm các liên kết (/URI) bị hỏng, cho phép sửa đổi hoặc chuyển hướng chúng.', keywords: ['sửa liên kết hỏng', 'kiểm tra link pdf', 'điều hướng url pdf'] },
    'ar': { title: 'مصحح الروابط التالفة والمعطلة', metaDescription: 'فحص وتشخيص الروابط الخارجية في ملفات PDF وتحديد الروابط التالفة وتعديلها أو إعادة توجيهها بسهولة.', keywords: ['روابط تالفة pdf', 'تصحيح الروابط معطلة', 'تعديل روابط المستند'] }
  },
  'interactive-toc-generator': {
    'zh-TW': { title: '互動目錄頁添加與雙向錨定器', metaDescription: '在頁首添加雙向 GoTo 動作 TOC 頁面，頁邊加蓋 TOC ↩ 回跳按鈕。', keywords: ['pdf 互動目錄', '自動目錄頁', '頁面錨定', '雙向導航'] },
    'ja': { title: 'インタラクティブ目次自動生成', metaDescription: 'PDFにしおり情報から自動リンク付きの目次ページを挿入し、各ページには目次へ戻るボタン（↩）を追加します。', keywords: ['目次作成 pdf', 'ジャンプ付き目次', 'しおりから目次'] },
    'ko': { title: '대화형 목차 생성 및 앵커', metaDescription: 'PDF에 각 챕터로 바로가는 하이퍼링크 목차 페이지를 앞단에 생성하고, 본문 페이지에는 목차 복귀 버튼(↩)을 앵커링합니다.', keywords: ['pdf 목차 만들기', '양방향 링크 목차', '북마크 목차화'] },
    'de': { title: 'Interaktives Inhaltsverzeichnis erstellen', metaDescription: 'Fügen Sie ein anklickbares Inhaltsverzeichnis ein, das mit Zielseiten verknüpft ist, inklusive Zurück-Schaltflächen (↩).', keywords: ['inhaltsverzeichnis erstellen', 'toc generator', 'pdf navigation'] },
    'es': { title: 'Generador de Índice Interactivo', metaDescription: 'Inserte una página de índice interactivo con enlaces a cada sección y agregue botones de retorno (↩) en las páginas.', keywords: ['indice interactivo pdf', 'tabla de contenido pdf', 'enlaces de navegacion'] },
    'fr': { title: 'Générateur de Sommaire Interactif', metaDescription: 'Ajoutez une page de sommaire cliquable liée à vos sections, avec des boutons de retour rapide (↩) sur chaque page.', keywords: ['sommaire interactif', 'table des matieres cliquable', 'navigation pdf'] },
    'id': { title: 'Pembuat Daftar Isi Interaktif', metaDescription: 'Sisipkan halaman daftar isi interaktif yang dapat diklik ke bab tujuan, lengkap dengan tombol kembali (↩) di setiap halaman.', keywords: ['daftar isi interaktif', 'toc generator', 'kembali ke daftar isi'] },
    'it': { title: 'Generatore di Indici Interattivi', metaDescription: 'Aggiungi una pagina di indice interattivo cliccabile collegata alle sezioni, con pulsanti di ritorno all\'indice (↩).', keywords: ['indice interattivo', 'creare sommario pdf', 'indice con link'] },
    'pt': { title: 'Gerador de Sumário Interativo', metaDescription: 'Insira um sumário interativo com links para as páginas e adicione botões de retorno ao sumário (↩) em cada página.', keywords: ['sumario interativo pdf', 'tabela de conteudo', 'links de retorno sumario'] },
    'vi': { title: 'Tạo mục lục liên kết tương tác', metaDescription: 'Chèn trang mục lục có thể nhấp để di chuyển đến các trang tương ứng, tự động thêm nút quay về mục lục (↩) ở lề trang.', keywords: ['tạo mục lục tương tác', 'mục lục nhấp chuột', 'nút quay lại mục lục'] },
    'ar': { title: 'منشئ جدول المحتويات التفاعلي', metaDescription: 'إضافة صفحة فهرس محتويات تفاعلية قابلة للنقر للانتقال للصفحات، مع إضافة زر عودة إلى الفهرس (↩) في الهوامش.', keywords: ['جدول محتويات تفاعلي pdf', 'منشئ الفهرس', 'روابط تنقل داخل الصفحة'] }
  },
  'pdf-deskew-aligner': {
    'zh-TW': { title: '掃描件傾斜自動校正與水平對齊', metaDescription: '智能檢測手機拍攝或掃描版 PDF 的傾斜角度，物理糾偏並重新水平對齊，恢復完美排版。', keywords: ['pdf 傾斜校正', '掃描糾偏', '水平對齊', '自動糾偏'] },
    'ja': { title: 'スキャン傾き補正・自動水平整合', metaDescription: 'スキャナーやスマホカメラで傾いて入力されたPDFを高度な画像解析で角度検出し、自動で真っ直ぐに水平補正します。', keywords: ['pdf 傾き補正', 'スキャン歪み', '水平対向', '自動デスキュー'] },
    'ko': { title: '스캔 정렬 및 기울기 자동 보정', metaDescription: '모바일 카메라 촬영이나 스캔 중 삐뚤어진 PDF 페이지들을 지능형 라인 픽셀 분석을 통해 수평 상태로 바로잡습니다.', keywords: ['pdf 수평 보정', '스캔 기울기 교정', '텍스트 라인 정렬'] },
    'de': { title: 'Automatische PDF-Geraderichtung', metaDescription: 'Erkennen Sie Neigungswinkel in gescannten PDFs automatisch und richten Sie schiefe Seiten exakt horizontal aus.', keywords: ['pdf gerade richten', 'deskew scan', 'seite ausrichten', 'schiefe scans'] },
    'es': { title: 'Alineación de Escaneos y Corrección de Inclinación', metaDescription: 'Detecte automáticamente ángulos de inclinación en PDFs escaneados y corríjalos físicamente para un diseño plano.', keywords: ['corregir inclinacion pdf', 'alinear escaneo pdf', 'deskew automatico'] },
    'fr': { title: 'Redressement Automatique de PDF Scanné', metaDescription: 'Détectez automatiquement l\'angle d\'inclinaison des pages scannées et redressez-les pour un alignement horizontal parfait.', keywords: ['redresser pdf scan', 'corriger inclinaison', 'alignement horizontal'] },
    'id': { title: 'Penyelaras Scan & Koreksi Kemiringan', metaDescription: 'Deteksi otomatis sudut kemiringan pada PDF hasil scan atau foto dan luruskan halamannya ke posisi horizontal sempurna.', keywords: ['luruskan scan pdf', 'koreksi miring dokumen', 'deskew otomatis'] },
    'it': { title: 'Allineamento e Correzione Inclinazione Scansioni', metaDescription: 'Rileva automaticamente gli angoli di inclinazione nelle scansioni PDF e raddrizza le pagine a livello orizzontale.', keywords: ['raddrizzare pdf', 'correzione storto scansione', 'allineamento fogli'] },
    'pt': { title: 'Alinhamento de Digitalização e Correção de Inclinação', metaDescription: 'Detete automaticamente o ângulo de inclinação em PDFs digitalizados e endireite as páginas horizontalmente.', keywords: ['endireitar pdf digitalizado', 'corrigir inclinacao', 'deskew automatico'] },
    'vi': { title: 'Tự động thẳng trang và căn chỉnh quét', metaDescription: 'Tự động phát hiện góc nghiêng trong tài liệu quét hoặc ảnh chụp PDF, xoay chỉnh về hướng thẳng ngang hoàn hảo.', keywords: ['chỉnh thẳng trang pdf', 'sửa nghiêng tài liệu quét', 'căn thẳng lề'] },
    'ar': { title: 'محاذاة المستندات الممسوحة وضبط الانحراف التلقائي', metaDescription: 'اكتشاف زاوية انحراف مستندات PDF الممسوحة ضوئيًا أو المصورة وتعديلها في وضع أفقي مستقيم تمامًا.', keywords: ['تعديل ميلان pdf', 'محاذاة الصفحات المائلة', 'ضبط انحراف سري'] }
  },
  'pdf-two-column-reflower': {
    'zh-TW': { title: '學術論文雙欄排版單欄重排器', metaDescription: '無損複製頁面並重新限制 CropBox 左/右視口，無損、100% 矢量級實現雙欄變單欄。', keywords: ['雙欄重排', '學術論文單欄', 'CropBox 裁剪', 'pdf 視口分裂'] },
    'ja': { title: '学術論文2段組リフロー', metaDescription: '2段組の学術論文や技術文書のレイアウトを自動認識し、テキストを1段（シングルカラム）の順序で再配置します。', keywords: ['2段組リフロー', '論文読みやすく', 'カラム分割', 'pdf変倍'] },
    'ko': { title: '학술 논문 2단 단일화 재배열', metaDescription: '논문이나 보고서의 2단 레이아웃을 파싱하여, 페이지 복제 후 CropBox 경계를 분할해 세로 스크롤만으로 읽기 좋은 1단으로 컴파일합니다.', keywords: ['2단 논문 1단 변환', '크롭박스 레이아웃 분할', '모바일 전용 재배열'] },
    'de': { title: 'Wissenschaftlicher Zweispalt-Textfluss', metaDescription: 'Teilen Sie zweispaltige PDF-Layouts wie wissenschaftliche Artikel verlustfrei in einen einspaltigen Lesefluss auf.', keywords: ['zweispaltig pdf', 'einspaltig anpassen', 'cropbox split', 'artikel reflow'] },
    'es': { title: 'Reorganizador de PDFs Académicos de Dos Columnas', metaDescription: 'Divida documentos de doble columna copiando páginas y redefiniendo el CropBox para una lectura fluida en una sola columna.', keywords: ['redistribuir columnas', 'pdf doble columna a una', 'ajustar cropbox'] },
    'fr': { title: 'Réorganisateur de PDFs Académiques Double Colonne', metaDescription: 'Divisez les PDFs en double colonne en dupliquant les pages et en ajustant le CropBox pour un flux de lecture à colonne unique.', keywords: ['double colonne en simple', 'reflow academique', 'decoupe cropbox'] },
    'id': { title: 'Aliran Ulang Dua Kolom Makalah Akademis', metaDescription: 'Ubah tata letak artikel dua kolom menjadi aliran satu kolom yang nyaman dibaca dengan membagi batas halaman secara presisi.', keywords: ['makalah dua kolom', 'pdf satu kolom', 'split cropbox halaman'] },
    'it': { title: 'Riorganizzatore di PDF Accademici a Due Colonne', metaDescription: 'Dividi layout a due colonne duplicando le pagine e restringendo il CropBox in un flusso di lettura a colonna singola.', keywords: ['due colonne a una', 'riflusso articoli', 'split cropbox'] },
    'pt': { title: 'Reorganizador de PDFs Académicos de Duas Colunas', metaDescription: 'Divida documentos de coluna dupla duplicando páginas e redefinindo a CropBox para leitura em uma única coluna.', keywords: ['coluna dupla para uma', 'refluxo de artigos', 'divisao de cropbox'] },
    'vi': { title: 'Chuyển đổi tài liệu hai cột sang một cột', metaDescription: 'Sao chép trang và giới hạn lại CropBox trái/phải để chuyển đổi tài liệu từ hai cột thành một cột thẳng đứng.', keywords: ['chuyển hai cột sang một cột', 'dàn trang luận văn', 'chia hộp cắt pdf'] },
    'ar': { title: 'إعادة ترتيب تدفق أوراق الأبحاث ذات العمودين', metaDescription: 'تجزئة مستندات الأبحاث ذات العمودين إلى تدفق قراءة بعمود واحد مريح عن طريق نسخ الصفحات وتعديل حدود CropBox.', keywords: ['تحويل عمودين لعمود واحد', 'تقسيم ورقة بحثية', 'تعديل حدود الصفحة'] }
  },
  'pdf-page-resizer-uniform': {
    'zh-TW': { title: '多規格 PDF 尺寸自動歸一器', metaDescription: '智能讀取多規格 PDF 頁面尺寸，將其等比縮放並完美居中平鋪至統一的目标規格。', keywords: ['pdf 頁面縮放', '頁面尺寸統一', 'a4 歸一', 'pdf 重塑尺寸'] },
    'ja': { title: '複数サイズPDF均一リサイズ', metaDescription: '異なる用紙サイズ（A3、A4、B5等）が混在するPDFを、アスペクト比を維持してA4などの均一サイズに自動縮小・拡大・配置します。', keywords: ['pdf サイズ統一', 'a4リサイズ', '用紙サイズ均一化', '余白センタリング'] },
    'ko': { title: '다중 크기 PDF A4 규격 단일화', metaDescription: '여러 규격(A3, A4, Letter 등)이 섞여 있는 PDF의 비율을 고정하여 대상 본국 규격(예: A4)의 정중앙에 맞춰 크기를 표준화합니다.', keywords: ['pdf 크기 동일화', 'A4 단일 변환', '여백 중앙 맞춤'] },
    'de': { title: 'PDF-Seitengrößen-Vereinheitlicher', metaDescription: 'Skalieren Sie PDF-Seiten mit unterschiedlichen Formaten automatisch auf ein einheitliches Zielformat (z. B. A4).', keywords: ['seitengroesse anpassen', 'pdf auf a4 skalieren', 'einheitliche seiten'] },
    'es': { title: 'Redimensionador Uniforme de Páginas PDF', metaDescription: 'Escale páginas PDF de diversos tamaños centrándolas y ajustándolas proporcionalmente a un tamaño uniforme de destino.', keywords: ['dimensionar paginas pdf', 'uniformar pdf a a4', 'centrar contenido paginas'] },
    'fr': { title: 'Redimensionneur Uniforme de Pages PDF', metaDescription: 'Redimensionnez les pages de différentes tailles de manière proportionnelle et centrez-les vers un format uniforme.', keywords: ['uniformiser taille page', 'pdf en a4', 'centrer contenu page'] },
    'id': { title: 'Penyelaras Ukuran Halaman PDF', metaDescription: 'Skala halaman PDF yang memiliki ukuran berbeda-beda (misal A3 & A4) agar seragam di atas ukuran target tertentu.', keywords: ['seragamkan ukuran pdf', 'skala halaman a4', 'pusatkan isi halaman'] },
    'it': { title: 'Uniformatore Dimensioni Pagine PDF', metaDescription: 'Scala le pagine del PDF di dimensioni diverse centrandole e adattandole in modo uniforme a un formato di destinazione.', keywords: ['uniformare pagine', 'ridimensionare pdf a4', 'centrare pagine pdf'] },
    'pt': { title: 'Redimensionador Uniforme de Páginas PDF', metaDescription: 'Redimensione páginas PDF de vários tamanhos proporcionalmente, centralizando-as em um formato uniforme.', keywords: ['uniformizar paginas pdf', 'ajustar tamanho para a4', 'centralizar folha pdf'] },
    'vi': { title: 'Đồng nhất kích thước trang PDF', metaDescription: 'Tự động phát hiện kích thước các trang khác nhau trong PDF, phóng to/thu nhỏ đồng bộ về kích thước đích.', keywords: ['đồng nhất khổ giấy pdf', 'co giãn trang về a4', 'căn giữa trang in'] },
    'ar': { title: 'موحد مقاسات صفحات PDF المختلفة', metaDescription: 'تغيير مقاسات صفحات PDF ذات الأبعاد المتعددة وتوسيطها تلقائيًا لتلائم مقاسًا موحدًا (مثل A4) بدقة.', keywords: ['توحيد مقاسات pdf', 'تعديل ابعاد الصفحات', 'توسيط محتوى pdf'] }
  },
  'handwriting-ink-contrast-booster': {
    'zh-TW': { title: '手寫簽字筆跡背景壓平增強艙', metaDescription: '漂白黃斑暗光影背景，對藍/黑手寫筆跡和紅印章進行高斯局部對比度拉伸。', keywords: ['筆跡增強', '去除背景雜色', '手寫優化', '合同筆跡增強'] },
    'ja': { title: '手書き文字・署名コントラスト強調', metaDescription: '署名書類の変色や影を除去して紙面を白くし、青・黒の署名や赤い印影のコントラストを大幅に強調します。', keywords: ['手書き文字クリア', '契約書署名強調', '印影くっきり', '影の除去'] },
    'ko': { title: '자필 서명 명암 및 대비 강화', metaDescription: '누렇게 변색되거나 그림자 진 서류 배경을 깨끗하게 날려버리고, 청색/검은색 서명 필적과 붉은 인장 명암을 극대화합니다.', keywords: ['자필 서명 보정', '배경 그림자 표백', '도장 선명하게'] },
    'de': { title: 'Handschrift- & Unterschrift-Verstärker', metaDescription: 'Entfernen Sie Schatten und Flecken aus Dokumenten und verstärken Sie blaue/schwarze Tinte sowie rote Stempel.', keywords: ['handschrift verstaerken', 'unterschrift klarer machen', 'scans aufbereiten'] },
    'es': { title: 'Optimizador de Contraste para Escritura a Mano', metaDescription: 'Blanquee fondos manchados u oscuros y aumente el contraste de firmas a mano (azul/negro) y sellos rojos.', keywords: ['resaltar escritura a mano', 'blanquear papel escaneado', 'contraste de firmas'] },
    'fr': { title: 'Sublimateur de Contraste d\'Écriture Manuelle', metaDescription: 'Blanchissez les arrière-plans tachés ou sombres et amplifiez le contraste des écritures manuelles (bleu/noir) et tampons rouges.', keywords: ['renforcer ecriture manuscrite', 'nettoyer fond scanne', 'contraste signature'] },
    'id': { title: 'Peningkat Kontras Tulisan Tangan & Tanda Tangan', metaDescription: 'Bersihkan noda kuning dan bayangan kertas, buat tulisan pena biru/hitam dan cap merah menjadi sangat tajam.', keywords: ['pertajam tanda tangan', 'hilangkan bayangan kertas', 'peningkat kontras tinta'] },
    'it': { title: 'Ottimizzatore Inchiostro Scansioni e Firme', metaDescription: 'Ripulisci sfondi ingialliti o in ombra ed evidenzia il tratto di penne blu/nere e timbri rossi autografi.', keywords: ['contrastare firme', 'sbiancare foglio scansione', 'inchiostro nitido'] },
    'pt': { title: 'Otimizador de Contraste para Escrita Manual', metaDescription: 'Branqueie fundos amarelados ou escuros e amplie o contraste de assinaturas manuais (azul/preto) e carimbos vermelhos.', keywords: ['melhorar escrita manual', 'limpar fundo escaneado', 'contraste de assinatura'] },
    'vi': { title: 'Tăng cường tương phản chữ viết tay', metaDescription: 'Tẩy trắng nền giấy ố vàng/tối màu, kéo giãn tương phản cục bộ cho nét viết mực xanh/đen và dấu đỏ.', keywords: ['tăng nét chữ viết tay', 'làm sạch nền giấy quét', 'làm rõ nét chữ ký'] },
    'ar': { title: 'معزز تباين الخطوط اليدوية والحبر', metaDescription: 'تبييض الخلفيات الصفراء والظلال الداكنة، وتعزيز تباين التواقيع المكتوبة باللون الأزرق/الأسود والأختام الحمراء.', keywords: ['تعزيز خط اليد pdf', 'تنقية ورق المسح', 'توضيح التوقيع الباهت'] }
  },
  'pdf-spine-bookbinder': {
    'zh-TW': { title: '物理書脊與膠裝厚度計算設計', metaDescription: '輸入頁數與 GSM 紙重，毫米級精准建模計算書脊寬度，並動態繪製帶有折壓印線的高清封套 PDF。', keywords: ['書脊厚度計算', '書籍裝訂', '封面排版', '膠裝書脊'] },
    'ja': { title: '背表紙・製本背幅計算デザイナー', metaDescription: 'ページ数と用紙の坪量（GSM）からミリ単位で背幅を自動計算し、折り線がついた背表紙付きカバーPDFを設計します。', keywords: ['背幅計算', '製本デザイン', 'カバーテンプレート', '背表紙デザイン'] },
    'ko': { title: '책등 등두께 계산 디자인', metaDescription: '페이지 번호와 용지 평량(GSM)을 활용해 밀리미터 단위로 책등(Spine) 두께를 정밀 산출하고, 오시선이 배치된 커버 PDF를 만듭니다.', keywords: ['책등 두께 계산', '도서 제본', 'Spine 디자인', '책표지 템플릿'] },
    'de': { title: 'Buchrücken- & Bindungsdesigner', metaDescription: 'Berechnen Sie die Rückenbreite basierend auf Seitenanzahl und Grammatur und erstellen Sie ein Cover-Layout mit Falzlinien.', keywords: ['buchruecken breite berechnen', 'bindung planen', 'cover layout pdf'] },
    'es': { title: 'Diseñador de Lomo de Libro y Encuadernación', metaDescription: 'Calcule el grosor del lomo en milímetros según las páginas y gramaje del papel, y genere una plantilla de portada con líneas de hendido.', keywords: ['calcular lomo libro', 'grosor de lomo', 'plantilla de portada pdf'] },
    'fr': { title: 'Concepteur de Dos de Livre et Reliure', metaDescription: 'Calculez la largeur du dos de livre en millimètres selon le grammage et le nombre de pages, et concevez une couverture PDF.', keywords: ['calculer dos de livre', 'epaisseur reliure', 'maquette couverture pdf'] },
    'id': { title: 'Desainer Punggung Buku & Ketebalan Jilid', metaDescription: 'Hitung tebal punggung (spine) buku dalam milimeter berdasarkan jumlah halaman dan berat kertas (GSM) untuk cetak cover.', keywords: ['hitung punggung buku', 'desain cover buku', 'ketebalan jilid lem'] },
    'it': { title: 'Progettista dello Spessore del Dorso e Rilegatura', metaDescription: 'Calcola lo spessore del dorso in millimetri in base alle pagine e alla grammatura della carta, e genera la copertina PDF.', keywords: ['calcolo dorso libro', 'rilegatura brossura', 'copertina con pieghe'] },
    'pt': { title: 'Designer de Lombada e Encadernação', metaDescription: 'Calcule a espessura da lombada em milímetros de acordo com as páginas e gramatura do papel, e crie um leiaute de capa.', keywords: ['calcular lombada livro', 'grosor de lombada', 'plantilha de capa pdf'] },
    'vi': { title: 'Tính gáy sách và độ dày đóng gáy', metaDescription: 'Nhập số trang và định lượng giấy GSM để tính độ dày gáy sách theo đơn vị mm, tạo bản vẽ thiết kế bìa PDF phẳng.', keywords: ['tính độ dày gáy sách', 'thiết kế bìa sách', 'khổ gáy sách brossure'] },
    'ar': { title: 'مصمم كعب الكتاب وحساب سماكة التجليد', metaDescription: 'حساب عرض كعب الكتاب بالمليمتر بناءً على عدد الصفحات ووزن الورق (GSM) ورسم قالب غلاف PDF متكامل.', keywords: ['حساب كعب الكتاب', 'سماكة التجليد الحراري', 'تصميم غلاف كتاب'] }
  },
  'pdf-signature-anchor-helper': {
    'zh-TW': { title: '合同簽署人位置指引圖層注入', metaDescription: '在 PDF 頁面中精確定位並物理合併手寫筆引導戳記和交互跳轉 Link 標記。', keywords: ['簽名引導', '簽字錨定', '跳轉連結', '合同引導圖層'] },
    'ja': { title: '署名位置案内・リンク埋め込み', metaDescription: '契約書の署名が必要な場所に、手書き指示スタンプや、その位置へワンクリックで飛ぶ誘導リンクをPDFに埋め込みます。', keywords: ['署名案内スタンプ', '署名箇所アンカー', 'クイックジャンプ'] },
    'ko': { title: '서명 위치 안내 레이더 주입', metaDescription: '서명이 요구되는 계약서 영역을 마우스로 지정하여 시각적인 펜 입력 안내 엠블럼과 북마크 이동 단축 링크를 삽입합니다.', keywords: ['서명 위치 지정', '사인 가이드', '이동 링크 매핑'] },
    'de': { title: 'Signatur-Positionierungshelfer', metaDescription: 'Bringen Sie Hinweismarkierungen und Navigationselemente an den Stellen auf, an denen Unterschriften benötigt werden.', keywords: ['signatur markierung', 'unterschrift platzieren', 'vertragsunterzeichnung'] },
    'es': { title: 'Asistente de Anclaje de Firma en Contratos', metaDescription: 'Inserte indicadores visuales de firma y enlaces de navegación rápida en las ubicaciones donde se requiere firmar.', keywords: ['anclaje de firma', 'marcador de firma pdf', 'guiar firmante'] },
    'fr': { title: 'Assistant d\'Ancrage de Signature', metaDescription: 'Insérez des indicateurs visuels et des liens de raccourci aux endroits précis du PDF où les signatures sont requises.', keywords: ['ancrage signature', 'repere signature pdf', 'guider signataire'] },
    'id': { title: 'Asisten Jangkar Lokasi Tanda Tangan', metaDescription: 'Suntikkan ikon petunjuk pena dan tautan navigasi langsung di tempat-tempat yang membutuhkan tanda tangan.', keywords: ['jangkar tanda tangan', 'petunjuk tanda tangan', 'link tanda tangan'] },
    'it': { title: 'Assistente di Ancoraggio Firme e Indicatori', metaDescription: 'Inserisci etichette visuali di invito alla firma e link di scorrimento rapido nei punti in cui è richiesta la firma.', keywords: ['ancoraggio firma', 'invito alla firma', 'navigazione contratti'] },
    'pt': { title: 'Assistente de Ancoragem de Assinatura', metaDescription: 'Insira sinalizadores visuais de assinatura e hiperlinks de navegação rápida nos locais onde os signatários devem assinar.', keywords: ['ancora de assinatura', 'marcador de assinatura pdf', 'guia de signatario'] },
    'vi': { title: 'Nhúng vị trí neo hướng dẫn ký tên', metaDescription: 'Định vị chính xác và nhúng con dấu chỉ dẫn ký tên kèm theo các liên kết nhảy tương tác trực tiếp tới vị trí ký.', keywords: ['hướng dẫn ký tên pdf', 'neo vị trí ký', 'ký tên liên kết'] },
    'ar': { title: 'مساعد تثبيت مواقع التوقيعات وإرشاد الموقعين', metaDescription: 'تحديد مواقع التوقيع بدقة وحقن رموز إرشادية وتدفق روابط انتقال سريعة في صفحات العقود لتسهيل التوقيع.', keywords: ['تثبيت التوقيع pdf', 'إرشاد الموقعين', 'مؤشر مكان التوقيع'] }
  },
  'pdf-lossless-slicer': {
    'zh-TW': { title: 'PDF 超大圖紙局部無損切片裁剪', metaDescription: '徹底重塑 MediaBox 與 CropBox 矩形空間，無損、100% 矢量級裁剪大圖紙。', keywords: ['pdf 無損裁剪', '圖紙切片', 'CropBox 重塑', 'pdf 矢量裁剪'] },
    'ja': { title: '超大図面無損失スライス切り出し', metaDescription: '設計図などの特大PDFから、MediaBoxとCropBoxの境界を再定義し、拡大しても画質が落ちないベクター形式のまま無損失スライスします。', keywords: ['図面スライス', '無損失トリミング', 'ベクタークロップ', '部分切り出し'] },
    'ko': { title: '대형 도면 무손실 분할 자르기', metaDescription: '초대형 도면 PDF 페이지에서 MediaBox와 CropBox 좌표계를 재지정하여, 화질 깨짐 없이 100% 벡터 포맷 상태로 영역을 무손실 절단합니다.', keywords: ['도면 크롭', '무손실 슬라이스', '벡터 자르기', '캐드도면 분할'] },
    'de': { title: 'Verlustfreier PDF-Planzuschneider', metaDescription: 'Zuschneiden von großformatigen Plänen und Vektorgrafiken ohne Qualitätsverlust durch präzise CropBox-Modifikation.', keywords: ['verlustfrei zuschneiden', 'plan zuschneiden', 'cropbox aendern', 'vektor crop'] },
    'es': { title: 'Recortador de Planos PDF sin Pérdidas', metaDescription: 'Recorte secciones de planos de gran tamaño modificando el CropBox a nivel vectorial, sin pérdida de resolución.', keywords: ['recortar planos pdf', 'recorte vectorial pdf', 'modificar mediabox'] },
    'fr': { title: 'Découpeur de Plans PDF sans Perte', metaDescription: 'Découpez des sections de plans grand format en réajustant le CropBox au niveau vectoriel, sans aucune dégradation.', keywords: ['decouper plan pdf', 'recadrage vectoriel', 'cropbox mediabox'] },
    'id': { title: 'Pemotong Gambar Cetak PDF Tanpa Rusak', metaDescription: 'Potong bagian gambar proyek atau peta besar dengan memodifikasi MediaBox & CropBox tanpa merusak data vektor.', keywords: ['potong gambar pdf', 'crop gambar cetak', 'vektor crop tanpa rusak'] },
    'it': { title: 'Ritagliatore di Grandi Planimetrie senza Perdite', metaDescription: 'Ritaglia porzioni di disegni CAD o grandi mappe modificando i confini di MediaBox e CropBox in modo vettoriale nativo.', keywords: ['ritagliare planimetrie', 'ritaglio vettoriale', 'cropbox disegni'] },
    'pt': { title: 'Cortador de Plantas PDF sem Perdas', metaDescription: 'Corte secções de desenhos técnicos de grande dimensão modificando a CropBox a nível vetorial, sem perda de resolução.', keywords: ['cortar plantas pdf', 'corte vetorial sem perdas', 'cropbox desenho'] },
    'vi': { title: 'Cắt bản vẽ khổ lớn không mất dữ liệu', metaDescription: 'Định hình lại không gian MediaBox và CropBox để cắt các phần bản vẽ CAD lớn mà không làm vỡ các đường nét vectơ.', keywords: ['cắt bản vẽ lớn pdf', 'cắt không mất dữ liệu', 'cropbox bản vẽ'] },
    'ar': { title: 'مقطع مخططات PDF الهندسية دون فقدان الجودة', metaDescription: 'قص أجزاء من المخططات الكبيرة والرسومات الهندسية بدقة عن طريق إعادة تشكيل إحداثيات MediaBox و CropBox.', keywords: ['قص مخططات pdf', 'قص رسومات هندسية', 'تعديل mediabox'] }
  },
  'pdf-scratchpad-canvas': {
    'zh-TW': { title: 'PDF 頁面網格草稿紙拼接畫布', metaDescription: '物理拓寬頁面尺寸，在右側或底部縫合出 200 pt 的草稿紙空間，並蓋印淺灰網格。', keywords: ['pdf 草稿紙', '頁面拼接', '網格背景', 'pdf 筆記畫布'] },
    'ja': { title: '方眼・メモ用キャンバス余白連結', metaDescription: 'PDFページの用紙サイズを拡張し、右側や下部にメモ書き用の方眼紙やノート罫線の余白領域を縫合連結します。', keywords: ['ノート余白追加', '方眼キャンバス', 'pdf余白拡張', '勉強ノート'] },
    'ko': { title: '메모장 모눈종이 캔버스 연결', metaDescription: 'PDF 본문 영역의 가로/세로 길이를 넓히고, 가장자리에 200 pt 크기의 격자 모눈종이 또는 줄노트 필기 연습장을 덧붙입니다.', keywords: ['필기장 연결', '노트 캔버스 병합', '모눈종이 여백 추가'] },
    'de': { title: 'PDF-Notizblock-Verlängerung', metaDescription: 'Erweitern Sie PDF-Seiten um einen Notizbereich am Rand mit Raster- oder Linienmuster für eigene Mitschriften.', keywords: ['notizrand hinzufuegen', 'rasterpapier pdf', 'pdf verlaengern'] },
    'es': { title: 'Lienzo de Notas y Cuadrícula PDF', metaDescription: 'Amplíe el lienzo de las páginas PDF agregando un margen de notas con patrón de cuadrícula o líneas para escribir.', keywords: ['margen para notas pdf', 'papel cuadriculado pdf', 'lienzo de escritura'] },
    'fr': { title: 'Canevas de Notes et Quadrillage PDF', metaDescription: 'Élargissez les pages PDF en cousant une marge latérale lignée ou quadrillée pour vos notes manuscrites.', keywords: ['marge de notes pdf', 'papier quadrille pdf', 'extension canevas'] },
    'id': { title: 'Kanvas Kertas Buram & Kotak Kotak PDF', metaDescription: 'Perlebar dimensi halaman PDF dan sambungkan area coretan kertas bergaris atau kotak-kotak di bagian samping berkas.', keywords: ['kertas buram pdf', 'tambah catatan samping', 'halaman kotak kotak'] },
    'it': { title: 'Estensione Pagina con Quaderno Appunti PDF', metaDescription: 'Estende la larghezza o l\'altezza del PDF ricucendo al bordo uno spazio di scrittura quadrettato o a righe.', keywords: ['estendere foglio pdf', 'bordo appunti', 'quaderno a quadretti'] },
    'pt': { title: 'Tela de Bloco de Notas e Quadrícula PDF', metaDescription: 'Amplie as margens de PDFs costurando uma área de anotações com padrão quadriculado ou pautado para anotações.', keywords: ['margem de notas pdf', 'papel quadriculado pdf', 'tela de escrita'] },
    'vi': { title: 'Mở rộng lề chèn nháp lưới ô vuông', metaDescription: 'Tăng chiều rộng hoặc chiều cao trang PDF, ghép thêm một dải lề nháp 200 pt mang họa tiết kẻ ngang hoặc ô lưới.', keywords: ['chèn lề nháp pdf', 'mở rộng lề viết ghi chú', 'lưới ô vuông nháp'] },
    'ar': { title: 'توسيع صفحات PDF ودمج لوحة مسودة شبكية', metaDescription: 'توسيع أبعاد صفحات PDF وإضافة مساحة مسودة بعرض 200 نقطة بالهوامش الجانبية بطباعة شبكية أو مسطرة.', keywords: ['توسيع هوامش pdf', 'اضافة مسودة كتابة', 'شبكة مربعات بالهامش'] }
  },
  'photo-tiling-prepress': {
    'zh-TW': { title: '證件照相紙排貼版艙', metaDescription: '智能將單張證件照以高精度矩陣排滿 5寸/6寸標準相紙，並貼心加蓋裁剪線。', keywords: ['證件照排版', '相紙貼版', '印前拼版', '證件照拼版'] },
    'ja': { title: '写真プリント割付・面付け', metaDescription: '1枚の証明写真を、5インチや6インチの標準フォト光沢紙にグリッド状に自動配列し、裁断マーク付きで面付けします。', keywords: ['証明写真印刷', '写真の面付け', 'フォト用紙割り付け', '裁断マーク'] },
    'ko': { title: '사진 인화 배치 증명사진 정렬', metaDescription: '증명사진 1장을 5인치 또는 6인치 인화지 규격에 꽉 차도록 바둑판 배열로 자동 임포지션하고 재단 가이드선을 삽입합니다.', keywords: ['증명사진 인화', '인화지 꽉 차게', '재단선 포함', '사진 그리드 배치'] },
    'de': { title: 'Foto-Bögen & Druckvorbereitung', metaDescription: 'Ordnen Sie Passfotos automatisch auf Fotopapier (5" oder 6") an, inklusive Schnittmarken für den Druck.', keywords: ['passbild bogen', 'fotodruck vorbereiten', 'schnittmarken', 'foto layout'] },
    'es': { title: 'Distribución y Preimpresión de Fotos de Identificación', metaDescription: 'Organice una foto de identificación en un plano de impresión de 5" o 6" en formato de matriz, con guías de corte.', keywords: ['imprimir fotos carnet', 'papel fotográfico matriz', 'guias de corte'] },
    'fr': { title: 'Plan de Planches Photos et Prépresse', metaDescription: 'Organisez une photo d\'identité sous forme de planche sur du papier photo 5" ou 6", avec repères de coupe.', keywords: ['planche photo identite', 'tirage photo grille', 'reperes de coupe'] },
    'id': { title: 'Layout Cetak Pas Foto & Prepress', metaDescription: 'Susun pas foto tunggal ke dalam matriks cetak ukuran kertas foto 5 atau 6 inci, lengkap dengan batas potong.', keywords: ['cetak pas foto', 'layout kertas foto', 'batas gunting foto'] },
    'it': { title: 'Pre-Stampa e Impaginazione Foto Tessera', metaDescription: 'Dispone una singola fototessera in una griglia ordinata su formati standard da 5" o 6", con crocini di taglio.', keywords: ['fototessera stampa', 'impaginazione foto', 'crocini di taglio'] },
    'pt': { title: 'Distribuição e Pré-Impressão de Fotos de Passe', metaDescription: 'Organize uma foto de passe em um plano de impressão de 5" ou 6" em formato de matriz, com marcas de corte.', keywords: ['imprimir fotos passe', 'papel fotografico matriz', 'marcas de corte'] },
    'vi': { title: 'Xếp lưới ảnh thẻ in ấn', metaDescription: 'Tự động sắp xếp ảnh thẻ thành ma trận khít trên các khổ giấy ảnh 5 inch hoặc 6 inch, hỗ trợ chèn đường cắt.', keywords: ['in ảnh thẻ', 'xếp ảnh thẻ in相纸', 'đường viền cắt ảnh'] },
    'ar': { title: 'تنسيق طباعة صور الهوية المكررة', metaDescription: 'تكرار صورة هوية واحدة وتنسيقها في مصفوفة مطبوعة على ورق صور مقاس 5 أو 6 بوصات مع علامات قص دقيقة.', keywords: ['طباعة صور شخصية', 'تنسيق صور الهوية', 'علامات قص الصور'] }
  }
};

const commonMessagesMap = {
  "Upload PDF File": {
    "zh-TW": "上傳 PDF 文件",
    "ja": "PDFファイルをアップロード",
    "ko": "PDF 파일 업로드",
    "de": "PDF-Datei hochladen",
    "es": "Subir archivo PDF",
    "fr": "Téléverser le fichier PDF",
    "id": "Unggah File PDF",
    "vi": "Tải lên tệp PDF",
    "it": "Carica file PDF",
    "pt": "Carregar arquivo PDF",
    "ro": "Încărcați fișierul PDF",
    "ar": "تحميل ملف PDF"
  },
  "Clear": {
    "zh-TW": "清空",
    "ja": "クリア",
    "ko": "초기화",
    "de": "Löschen",
    "es": "Limpiar",
    "fr": "Effacer",
    "id": "Bersihkan",
    "vi": "Xóa sạch",
    "it": "Cancella",
    "pt": "Limpar",
    "ro": "Curăță",
    "ar": "مسح"
  },
  "Drag and drop a PDF file here, or click to browse.": {
    "zh-TW": "拖放 PDF 文件到此處，或點擊瀏覽。",
    "ja": "PDFファイルをここにドラッグ＆ドロップするか、クリックして選択してください。",
    "ko": "PDF 파일을 여기에 드래그 앤 드롭하거나 클릭하여 선택하십시오.",
    "de": "Ziehen Sie eine PDF-Datei hierher oder klicken Sie zum Auswählen.",
    "es": "Arrastre y suelte un archivo PDF aquí, o haga clic para buscar.",
    "fr": "Glissez-déposez un fichier PDF ici, ou cliquez pour parcourir.",
    "id": "Seret dan letakkan file PDF di sini, atau klik untuk memilih.",
    "vi": "Kéo thả tệp PDF vào đây, hoặc nhấp để duyệt.",
    "it": "Trascina e rilascia un file PDF qui, o fai clic per sfogliare.",
    "pt": "Arraste e solte um arquivo PDF aqui, ou clique para navegar.",
    "ro": "Trageți și plasați un fișier PDF aici, sau faceți clic pentru a răsfoi.",
    "ar": "اسحب وأسقط ملف PDF هنا، أو انقر للتصفح."
  },
  "Convert to PDF": {
    "zh-TW": "轉換為 PDF",
    "ja": "PDFに変換",
    "ko": "PDF로 변환",
    "de": "In PDF konvertieren",
    "es": "Convertir a PDF",
    "fr": "Convertir en PDF",
    "id": "Konversi ke PDF",
    "vi": "Chuyển đổi sang PDF",
    "it": "Converti in PDF",
    "pt": "Converter para PDF",
    "ro": "Convertiți în PDF",
    "ar": "تحويل إلى PDF"
  },
  "Upload PDF Files": {
    "zh-TW": "上傳 PDF 文件",
    "ja": "PDFファイルをアップロード",
    "ko": "PDF 파일 업로드",
    "de": "PDF-Dateien hochladen",
    "es": "Subir archivos PDF",
    "fr": "Téléverser les fichiers PDF",
    "id": "Unggah File PDF",
    "vi": "Tải lên các tệp PDF",
    "it": "Carica file PDF",
    "pt": "Carregar arquivos PDF",
    "ro": "Încărcați fișierele PDF",
    "ar": "تحميل ملفات PDF"
  },
  "Orientation": {
    "zh-TW": "方向",
    "ja": "方向",
    "ko": "방향",
    "de": "Ausrichtung",
    "es": "Orientación",
    "fr": "Orientation",
    "id": "Orientasi",
    "vi": "Hướng giấy",
    "it": "Orientamento",
    "pt": "Orientação",
    "ro": "Orientare",
    "ar": "الاتجاه"
  },
  "Page Range": {
    "zh-TW": "頁面範圍",
    "ja": "ページ範囲",
    "ko": "페이지 범위",
    "de": "Seitenbereich",
    "es": "Rango de páginas",
    "fr": "Plage de pages",
    "id": "Rentang Halaman",
    "vi": "Phạm vi trang",
    "it": "Intervallo pagine",
    "pt": "Intervalo de páginas",
    "ro": "Interval pagini",
    "ar": "نطاق الصفحات"
  },
  "Preview": {
    "zh-TW": "預覽",
    "ja": "プレビュー",
    "ko": "미리보기",
    "de": "Vorschau",
    "es": "Vista previa",
    "fr": "Aperçu",
    "id": "Pratinjau",
    "vi": "Xem trước",
    "it": "Anteprima",
    "pt": "Visualizar",
    "ro": "Previzualizare",
    "ar": "معاينة"
  },
  "Conversion Options": {
    "zh-TW": "轉換選項",
    "ja": "変換オプション",
    "ko": "변환 옵션",
    "de": "Konvertierungsoptionen",
    "es": "Opciones de conversión",
    "fr": "Options de conversion",
    "id": "Opsi Konversi",
    "vi": "Tùy chọn chuyển đổi",
    "it": "Opzioni di conversione",
    "pt": "Opções de conversão",
    "ro": "Opțiuni de conversie",
    "ar": "خيارات التحويل"
  },
  "Page Size": {
    "zh-TW": "頁面大小",
    "ja": "ページサイズ",
    "ko": "페이지 크기",
    "de": "Seitenformat",
    "es": "Tamaño de página",
    "fr": "Taille de page",
    "id": "Ukuran Halaman",
    "vi": "Khổ giấy",
    "it": "Dimensioni pagina",
    "pt": "Tamanho da página",
    "ro": "Dimensiune pagină",
    "ar": "حجم الصفحة"
  },
  "Drag and drop a PDF file.": {
    "zh-TW": "拖放 PDF 文件到此處。",
    "ja": "PDFファイルをドラッグ＆ドロップしてください。",
    "ko": "PDF 파일을 드래그 앤 드롭하십시오.",
    "de": "Ziehen Sie eine PDF-Datei hierher.",
    "es": "Arrastre y suelte un archivo PDF.",
    "fr": "Glissez-déposez un fichier PDF.",
    "id": "Seret dan letakkan file PDF.",
    "vi": "Kéo thả tệp PDF.",
    "it": "Trascina e rilascia un file PDF.",
    "pt": "Arraste e solte um arquivo PDF.",
    "ro": "Trageți și plasați un fișier PDF.",
    "ar": "اسحب وأسقط ملف PDF."
  },
  "Download All as ZIP": {
    "zh-TW": "全部下載為 ZIP",
    "ja": "すべてZIPでダウンロード",
    "ko": "모두 ZIP으로 다운로드",
    "de": "Alle als ZIP herunterladen",
    "es": "Descargar todo como ZIP",
    "fr": "Tout télécharger en ZIP",
    "id": "Unduh Semua sebagai ZIP",
    "vi": "Tải xuống tất cả dạng ZIP",
    "it": "Scarica tutti come ZIP",
    "pt": "Baixar tudo como ZIP",
    "ro": "Descărcați tot ca ZIP",
    "ar": "تحميل الكل كملف ZIP"
  },
  "e.g., 1-3, 5, 7": {
    "zh-TW": "例如：1-3, 5, 7",
    "ja": "例：1-3, 5, 7",
    "ko": "예: 1-3, 5, 7",
    "de": "z.B. 1-3, 5, 7",
    "es": "ej., 1-3, 5, 7",
    "fr": "ex: 1-3, 5, 7",
    "id": "misal, 1-3, 5, 7",
    "vi": "Ví dụ: 1-3, 5, 7",
    "it": "es. 1-3, 5, 7",
    "pt": "ex., 1-3, 5, 7",
    "ro": "ex., 1-3, 5, 7",
    "ar": "مثال: 1-3، 5، 7"
  },
  "Leave empty for all pages": {
    "zh-TW": "留空表示所有頁面",
    "ja": "空欄の場合は全ページ",
    "ko": "모든 페이지를 선택하려면 공란으로 둡니다",
    "de": "Leer lassen für alle Seiten",
    "es": "Dejar vacío para todas las páginas",
    "fr": "Laisser vide pour toutes les pages",
    "id": "Biarkan kosong untuk semua halaman",
    "vi": "Để trống để áp dụng cho tất cả các trang",
    "it": "Lascia vuoto per tutte le pagine",
    "pt": "Deixe em branco para todas as páginas",
    "ro": "Lăsați gol pentru toate paginile",
    "ar": "اتركه فارغاً لجميع الصفحات"
  },
  "Landscape": {
    "zh-TW": "橫向",
    "ja": "横向き",
    "ko": "가로 방향",
    "de": "Querformat",
    "es": "Horizontal",
    "fr": "Paysage",
    "id": "Lanskap",
    "vi": "Ngang",
    "it": "Orizzontale",
    "pt": "Paisagem",
    "ro": "Peisaj",
    "ar": "أفقي"
  },
  "Portrait": {
    "zh-TW": "縱向",
    "ja": "縦向き",
    "ko": "세로 방향",
    "de": "Hochformat",
    "es": "Vertical",
    "fr": "Portrait",
    "id": "Potret",
    "vi": "Dọc",
    "it": "Verticale",
    "pt": "Retrato",
    "ro": "Portret",
    "ar": "عمودي"
  },
  "Delete": {
    "zh-TW": "刪除",
    "ja": "削除",
    "ko": "삭제",
    "de": "Löschen",
    "es": "Eliminar",
    "fr": "Supprimer",
    "id": "Hapus",
    "vi": "Xóa",
    "it": "Elimina",
    "pt": "Excluir",
    "ro": "Șterge",
    "ar": "حذف"
  },
  "Title": {
    "zh-TW": "標題",
    "ja": "タイトル",
    "ko": "제목",
    "de": "Titel",
    "es": "Título",
    "fr": "Titre",
    "id": "Judul",
    "vi": "Tiêu đề",
    "it": "Titolo",
    "pt": "Título",
    "ro": "Titlu",
    "ar": "العنوان"
  },
  "Position": {
    "zh-TW": "位置",
    "ja": "位置",
    "ko": "위치",
    "de": "Position",
    "es": "Posición",
    "fr": "Position",
    "id": "Posisi",
    "vi": "Vị trí",
    "it": "Posizione",
    "pt": "Posição",
    "ro": "Poziție",
    "ar": "الموقع"
  },
  "Quality": {
    "zh-TW": "質量",
    "ja": "品質",
    "ko": "화질",
    "de": "Qualität",
    "es": "Calidad",
    "fr": "Qualité",
    "id": "Kualitas",
    "vi": "Chất lượng",
    "it": "Qualità",
    "pt": "Qualidade",
    "ro": "Calitate",
    "ar": "الجودة"
  },
  "Style": {
    "zh-TW": "樣式",
    "ja": "スタイル",
    "ko": "스타일",
    "de": "Stil",
    "es": "Estilo",
    "fr": "Style",
    "id": "Gaya",
    "vi": "Kiểu dáng",
    "it": "Stile",
    "pt": "Estilo",
    "ro": "Stil",
    "ar": "النمط"
  },
  "Font Size": {
    "zh-TW": "字體大小",
    "ja": "フォントサイズ",
    "ko": "글꼴 크기",
    "de": "Schriftgröße",
    "es": "Tamaño de fuente",
    "fr": "Taille de la police",
    "id": "Ukuran Font",
    "vi": "Cỡ chữ",
    "it": "Dimensione carattere",
    "pt": "Tamanho da fonte",
    "ro": "Dimensiune font",
    "ar": "حجم الخط"
  },
  "Width": {
    "zh-TW": "寬度",
    "ja": "幅",
    "ko": "너비",
    "de": "Breite",
    "es": "Ancho",
    "fr": "Largeur",
    "id": "Lebar",
    "vi": "Chiều rộng",
    "it": "Larghezza",
    "pt": "Largura",
    "ro": "Lățime",
    "ar": "العرض"
  },
  "Height": {
    "zh-TW": "高度",
    "ja": "高さ",
    "ko": "높이",
    "de": "Höhe",
    "es": "Alto",
    "fr": "Hauteur",
    "id": "Tinggi",
    "vi": "Chiều cao",
    "it": "Altezza",
    "pt": "Altura",
    "ro": "Înălțime",
    "ar": "الارتفاع"
  },
  "Cancel": {
    "zh-TW": "取消",
    "ja": "キャンセル",
    "ko": "취소",
    "de": "Abbrechen",
    "es": "Cancelar",
    "fr": "Annuler",
    "id": "Batal",
    "vi": "Hủy bỏ",
    "it": "Annulla",
    "pt": "Cancelar",
    "ro": "Anulează",
    "ar": "إلغاء"
  }
};

console.log("=== INJECTING CORE METADATA FOR 30 TOOLS ===");

// 1. Inject tool content metadata
const languages = ['zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'vi', 'ar'];

languages.forEach(lang => {
  const filePath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  if (!fs.existsSync(filePath)) return;

  let fileContent = fs.readFileSync(filePath, 'utf8');
  let injectedCount = 0;

  Object.entries(metadataMap).forEach(([toolId, langObj]) => {
    // If toolId already exists in this file, skip
    if (fileContent.includes(`'${toolId}': {`) || fileContent.includes(`"${toolId}": {`)) {
      return;
    }

    const item = langObj[lang] || langObj['en'] || { title: toolId, metaDescription: '', keywords: [] };
    
    // We construct the minimal structure copying description/howToUse/useCases/faq from English dynamically
    // Wait, since we are doing this offline, we'll write a representation that references toolContentEn[toolId]
    // for description, howToUse, useCases, faq. This is extremely smart because it avoids copying large blocks of code!
    // Example:
    // 'pdf-to-cbz': {
    //   title: 'PDF 轉 CBZ',
    //   metaDescription: '...',
    //   keywords: [...],
    //   description: toolContentEn['pdf-to-cbz'].description,
    //   howToUse: toolContentEn['pdf-to-cbz'].howToUse,
    //   useCases: toolContentEn['pdf-to-cbz'].useCases,
    //   faq: toolContentEn['pdf-to-cbz'].faq,
    // }
    
    const keywordsStr = JSON.stringify(item.keywords);
    const titleEscaped = item.title.replace(/'/g, "\\'");
    const metaDescEscaped = item.metaDescription.replace(/'/g, "\\'");
    
    const tsRepresentation = `  '${toolId}': {
    title: '${titleEscaped}',
    metaDescription: '${metaDescEscaped}',
    keywords: ${keywordsStr},
    description: toolContentEn['${toolId}'].description,
    howToUse: toolContentEn['${toolId}'].howToUse,
    useCases: toolContentEn['${toolId}'].useCases,
    faq: toolContentEn['${toolId}'].faq,
  },\n\n`;

    const lastBraceIndex = fileContent.lastIndexOf('};');
    if (lastBraceIndex !== -1) {
      fileContent = fileContent.slice(0, lastBraceIndex) + tsRepresentation + fileContent.slice(lastBraceIndex);
      injectedCount++;
    }
  });

  // Ensure toolContentEn is imported at the top of the file if we injected anything!
  if (injectedCount > 0 && !fileContent.includes("import { toolContentEn } from './en';")) {
    // Insert import at the top (after import { ToolContent } or similar)
    const lines = fileContent.split('\n');
    let insertIdx = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes("import { ToolContent }")) {
        insertIdx = i + 1;
        break;
      }
    }
    lines.splice(insertIdx, 0, "import { toolContentEn } from './en';");
    fileContent = lines.join('\n');
  }

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`[${lang}] Injected metadata for ${injectedCount} tools.`);
});

// 2. Inject core messages translation
console.log("=== INJECTING HIGH-FREQUENCY CORE MESSAGES TRANSLATIONS ===");

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const messageFiles = fs.readdirSync(MESSAGES_DIR).filter(f => f.endsWith('.json'));

// Load untranslated JSON database to map keys
const commonUntranslatedDB = JSON.parse(fs.readFileSync('d:\\NextProject\\pdfcraft\\scratch\\common-untranslated.json', 'utf8'));

messageFiles.forEach(file => {
  const lang = file.replace('.json', '');
  if (lang === 'en' || lang === 'zh') return; // Skip base languages

  const filePath = path.join(MESSAGES_DIR, file);
  const langData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  let updatedCount = 0;

  commonUntranslatedDB.forEach(item => {
    const enVal = item.en;
    const translationDict = commonMessagesMap[enVal];
    if (!translationDict) return;

    const translatedVal = translationDict[lang] || translationDict['en'];
    if (!translatedVal) return;

    item.keys.forEach(keyPath => {
      // Helper function to set deep value
      function setDeep(obj, pathStr, val) {
        const parts = pathStr.split('.');
        let current = obj;
        for (let i = 0; i < parts.length - 1; i++) {
          const part = parts[i];
          if (!current[part]) {
            current[part] = {};
          }
          current = current[part];
        }
        current[parts[parts.length - 1]] = val;
      }
      
      // Let's set it
      setDeep(langData, keyPath, translatedVal);
      updatedCount++;
    });
  });

  fs.writeFileSync(filePath, JSON.stringify(langData, null, 2), 'utf8');
  console.log(`[${lang}] Injected and updated ${updatedCount} common message keys.`);
});

console.log("=== METADATA & MESSAGES INJECTION COMPLETE ===");
