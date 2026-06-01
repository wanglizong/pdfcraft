const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

// 模型自主生成的 150+ 个高频通用 UI 与 PDF 专业领域多语言大字典
const bulkDict = {
  "Upload PDF File": {
    "zh": "上传 PDF 文件", "zh-TW": "上傳 PDF 文件", "ja": "PDFファイルをアップロード", "ko": "PDF 파일 업로드", "de": "PDF-Datei hochladen", "es": "Subir archivo PDF", "fr": "Téléverser le fichier PDF", "id": "Unggah File PDF", "it": "Carica file PDF", "pt": "Carregar arquivo PDF", "ro": "Încărcați fișierul PDF", "vi": "Tải lên tệp PDF", "ar": "تحميل ملف PDF"
  },
  "Clear": {
    "zh": "清空", "zh-TW": "清空", "ja": "クリア", "ko": "초기화", "de": "Löschen", "es": "Limpiar", "fr": "Effacer", "id": "Bersihkan", "it": "Cancella", "pt": "Limpar", "ro": "Curăță", "vi": "Xóa sạch", "ar": "مسح"
  },
  "Drag and drop a PDF file here, or click to browse.": {
    "zh": "将 PDF 文件拖放到此处，或点击浏览。", "zh-TW": "將 PDF 文件拖放到此處，或點擊瀏覽。", "ja": "ここにPDFファイルをドラッグ＆ドロップするか、クリックして参照します。", "ko": "PDF 파일을 여기에 드래그 앤 드롭하거나 클릭하여 브라우징하십시오.", "de": "Ziehen Sie eine PDF-Datei hierher oder klicken Sie zum Durchsuchen.", "es": "Arrastre y suelte un archivo PDF aquí, o haga clic para buscar.", "fr": "Glissez-déposez un fichier PDF ici, ou cliquez pour parcourir.", "id": "Seret dan letakkan file PDF di sini, atau klik untuk menelusuri.", "it": "Trascina e rilascia un file PDF qui, o fai clic per sfogliare.", "pt": "Arraste e solte um arquivo PDF aqui, ou clique para navegar.", "ro": "Trageți și plasați un fișier PDF aici sau faceți clic pentru a răsfoi.", "vi": "Kéo và thả tệp PDF vào đây, hoặc nhấp để duyệt.", "ar": "قم بسحب وإسقاط ملف PDF هنا، أو انقر للتصفح."
  },
  "Convert to PDF": {
    "zh": "转换为 PDF", "zh-TW": "轉換為 PDF", "ja": "PDFに変換", "ko": "PDF로 변환", "de": "In PDF konvertieren", "es": "Convertir a PDF", "fr": "Convertir en PDF", "id": "Konversi ke PDF", "it": "Converti in PDF", "pt": "Converter para PDF", "ro": "Convertiți în PDF", "vi": "Chuyển đổi sang PDF", "ar": "تحويل إلى PDF"
  },
  "Upload PDF Files": {
    "zh": "上传多份 PDF 文件", "zh-TW": "上傳多份 PDF 文件", "ja": "多个のPDFファイルをアップロード", "ko": "여러 PDF 파일 업로드", "de": "PDF-Dateien hochladen", "es": "Subir archivos PDF", "fr": "Téléverser des fichiers PDF", "id": "Unggah File PDF", "it": "Carica file PDF", "pt": "Carregar arquivos PDF", "ro": "Încărcați fișierele PDF", "vi": "Tải lên các tệp PDF", "ar": "تحميل ملفات PDF"
  },
  "Conversion Options": {
    "zh": "转换参数设置", "zh-TW": "轉換參數設置", "ja": "変換オプション設定", "ko": "변환 옵션 설정", "de": "Konvertierungsoptionen", "es": "Opciones de conversión", "fr": "Options de conversion", "id": "Opsi Konversi", "it": "Opzioni di conversione", "pt": "Opcões de conversão", "ro": "Opțiuni de conversie", "vi": "Thiết lập chuyển đổi", "ar": "خيارات التحويل"
  },
  "Page Range": {
    "zh": "页面范围", "zh-TW": "頁面範圍", "ja": "ページ範囲", "ko": "페이지 범위", "de": "Seitenbereich", "es": "Intervalo de páginas", "fr": "Plage de pages", "id": "Rentang Halaman", "it": "Intervallo pagine", "pt": "Intervalo de páginas", "ro": "Interval pagini", "vi": "Phạm vi trang", "ar": "نطاق الصفحات"
  },
  "Font Size": {
    "zh": "字体大小", "zh-TW": "字體大小", "ja": "フォントサイズ", "ko": "글꼴 크기", "de": "Schriftgröße", "es": "Tamaño de fuente", "fr": "Taille de police", "id": "Ukuran Font", "it": "Dimensione carattere", "pt": "Tamanho da fonte", "ro": "Dimensiune font", "vi": "Kích thước phông", "ar": "حجم الخط"
  },
  "{count} page(s) • {size} MB": {
    "zh": "{count} 页 • {size} MB", "zh-TW": "{count} 頁 • {size} MB", "ja": "{count} ページ • {size} MB", "ko": "{count} 페이지 • {size} MB", "de": "{count} Seite(n) • {size} MB", "es": "{count} página(s) • {size} MB", "fr": "{count} page(s) • {size} Mo", "id": "{count} halaman • {size} MB", "it": "{count} pagina/e • {size} MB", "pt": "{count} página(s) • {size} MB", "ro": "{count} pagină(e) • {size} MB", "vi": "{count} trang • {size} MB", "ar": "{count} صفحة • {size} ميجابايت"
  },
  "Orientation": {
    "zh": "纸张方向", "zh-TW": "紙張方向", "ja": "用紙の向き", "ko": "용지 방향", "de": "Ausrichtung", "es": "Orientación", "fr": "Orientation", "id": "Orientasi", "it": "Orientamento", "pt": "Orientacão", "ro": "Orientare", "vi": "Hướng giấy", "ar": "اتجاه الورقة"
  },
  "Page Size": {
    "zh": "页面尺寸", "zh-TW": "頁面尺寸", "ja": "ページサイズ", "ko": "페이지 크기", "de": "Seitengröße", "es": "Tamaño de página", "fr": "Taille de page", "id": "Ukuran Halaman", "it": "Dimensione pagina", "pt": "Tamanho da página", "ro": "Dimensiune pagină", "vi": "Khổ trang", "ar": "حجم الصفحة"
  },
  "Preview": {
    "zh": "预览", "zh-TW": "預覽", "ja": "プレビュー", "ko": "미리보기", "de": "Vorschau", "es": "Vista previa", "fr": "Aperçu", "id": "Pratinjau", "it": "Anteprima", "pt": "Pré-visualizacão", "ro": "Previzualizare", "vi": "Xem trước", "ar": "معاينة"
  },
  "Drag and drop a PDF file.": {
    "zh": "拖放 PDF 文件于此。", "zh-TW": "拖放 PDF 文件於此。", "ja": "PDFファイルをドラッグ＆ドロップしてください。", "ko": "PDF 파일을 드래그 앤 드롭하십시오.", "de": "PDF-Datei hierher ziehen.", "es": "Arrastre y suelte un archivo PDF.", "fr": "Glissez-déposez un fichier PDF.", "id": "Seret dan letakkan file PDF.", "it": "Trascina e rilascia un file PDF.", "pt": "Arraste e solte um arquivo PDF.", "ro": "Trageți și plasați un fișier PDF.", "vi": "Kéo thả tệp PDF vào đây.", "ar": "قم بسحب وإسقاط ملف PDF."
  },
  "Page {page}": {
    "zh": "第 {page} 页", "zh-TW": "第 {page} 頁", "ja": "ページ {page}", "ko": "{page} 페이지", "de": "Seite {page}", "es": "Página {page}", "fr": "Page {page}", "id": "Halaman {page}", "it": "Pagina {page}", "pt": "Página {page}", "ro": "Pagina {page}", "vi": "Trang {page}", "ar": "صفحة {page}"
  },
  "Page": {
    "zh": "页面", "zh-TW": "頁面", "ja": "ページ", "ko": "페이지", "de": "Seite", "es": "Página", "fr": "Page", "id": "Halaman", "it": "Pagina", "pt": "Página", "ro": "Pagina", "vi": "Trang", "ar": "صفحة"
  },
  "Download All as ZIP": {
    "zh": "打包下载所有文件为 ZIP", "zh-TW": "打包下載所有文件為 ZIP", "ja": "ZIPとしてすべてダウンロード", "ko": "ZIP으로 모두 다운로드", "de": "Alle als ZIP herunterladen", "es": "Descargar todo como ZIP", "fr": "Tout télécharger en ZIP", "id": "Unduh Semua sebagai ZIP", "it": "Scarica tutto come ZIP", "pt": "Descarregar tudo como ZIP", "ro": "Descărcați tot ca ZIP", "vi": "Tải toàn bộ dưới dạng ZIP", "ar": "تحميل الكل كملف ZIP"
  },
  "e.g., 1-3, 5, 7": {
    "zh": "例如 1-3, 5, 7", "zh-TW": "例如 1-3, 5, 7", "ja": "例：1-3, 5, 7", "ko": "예: 1-3, 5, 7", "de": "z.B. 1-3, 5, 7", "es": "ej. 1-3, 5, 7", "fr": "ex. 1-3, 5, 7", "id": "misal, 1-3, 5, 7", "it": "es. 1-3, 5, 7", "pt": "ex. 1-3, 5, 7", "ro": "ex. 1-3, 5, 7", "vi": "Ví dụ: 1-3, 5, 7", "ar": "مثال: 1-3، 5، 7"
  },
  "Leave empty for all pages": {
    "zh": "留空则处理所有页面", "zh-TW": "留空則處理所有頁面", "ja": "空欄の場合はすべてのページを処理します", "ko": "모든 페이지를 선택하려면 공란으로 두십시오", "de": "Leer lassen für alle Seiten", "es": "Dejar vacío para todas las páginas", "fr": "Laisser vide pour toutes les pages", "id": "Biarkan kosong untuk semua halaman", "it": "Lascia vuoto per tutte le pagine", "pt": "Deixar em branco para todas as páginas", "ro": "Lăsați gol pentru toate paginile", "vi": "Để trống để chọn tất cả các trang", "ar": "اتركه فارغًا لجميع الصفحات"
  },
  "Select All": {
    "zh": "全选", "zh-TW": "全選", "ja": "すべて選択", "ko": "모두 선택", "de": "Alle auswählen", "es": "Seleccionar todo", "fr": "Tout sélectionner", "id": "Pilih Semua", "it": "Seleziona tutto", "pt": "Selecionar tudo", "ro": "Selectați tot", "vi": "Chọn tất cả", "ar": "تحديد الكل"
  },
  "Portrait": {
    "zh": "纵向", "zh-TW": "縱向", "ja": "縦向き", "ko": "세로 방향", "de": "Hochformat", "es": "Retrato", "fr": "Portrait", "id": "Potret", "it": "Verticale", "pt": "Retrato", "ro": "Portret", "vi": "Khổ dọc", "ar": "عمودي"
  },
  "Landscape": {
    "zh": "横向", "zh-TW": "橫向", "ja": "横向き", "ko": "가로 방향", "de": "Querformat", "es": "Paisaje", "fr": "Paysage", "id": "Lanskap", "it": "Orizzontale", "pt": "Paisagem", "ro": "Peisaj", "vi": "Khổ ngang", "ar": "أفقي"
  },
  "Delete": {
    "zh": "删除", "zh-TW": "刪除", "ja": "削除", "ko": "삭제", "de": "Löschen", "es": "Eliminar", "fr": "Supprimer", "id": "Hapus", "it": "Elimina", "pt": "Excluir", "ro": "Ștergeți", "vi": "Xóa", "ar": "حذف"
  },
  "Upload PDF": {
    "zh": "上传 PDF", "zh-TW": "上傳 PDF", "ja": "PDFをアップロード", "ko": "PDF 업로드", "de": "PDF hochladen", "es": "Subir PDF", "fr": "Téléverser le PDF", "id": "Unggah PDF", "it": "Carica PDF", "pt": "Carregar PDF", "ro": "Încărcați PDF", "vi": "Tải lên PDF", "ar": "تحميل PDF"
  },
  "Subject": {
    "zh": "主题", "zh-TW": "主題", "ja": "件名", "ko": "제목", "de": "Betreff", "es": "Asunto", "fr": "Sujet", "id": "Subjek", "it": "Oggetto", "pt": "Assunto", "ro": "Subiect", "vi": "Chủ đề", "ar": "الموضوع"
  },
  "All Pages": {
    "zh": "所有页面", "zh-TW": "所有頁面", "ja": "すべてのページ", "ko": "모든 페이지", "de": "Alle Seiten", "es": "Todas las páginas", "fr": "Toutes les pages", "id": "Semua Halaman", "it": "Tutte le pagine", "pt": "Todas as páginas", "ro": "Toate paginile", "vi": "Tất cả các trang", "ar": "جميع الصفحات"
  },
  "Text Color": {
    "zh": "文字颜色", "zh-TW": "文字顏色", "ja": "文字色", "ko": "글자 색상", "de": "Textfarbe", "es": "Color de texto", "fr": "Couleur du texte", "id": "Warna Teks", "it": "Colore del testo", "pt": "Cor do texto", "ro": "Culoare text", "vi": "Màu chữ", "ar": "لون النص"
  },
  "Title": {
    "zh": "标题", "zh-TW": "標題", "ja": "タイトル", "ko": "제목", "de": "Titel", "es": "Título", "fr": "Titre", "id": "Judul", "it": "Titolo", "pt": "Título", "ro": "Titlu", "vi": "Tiêu đề", "ar": "العنوان"
  },
  "pages": {
    "zh": "页", "zh-TW": "頁", "ja": "ページ", "ko": "페이지", "de": "Seiten", "es": "páginas", "fr": "pages", "id": "halaman", "it": "pagine", "pt": "páginas", "ro": "pagini", "vi": "trang", "ar": "صفحات"
  },
  "Position": {
    "zh": "位置", "zh-TW": "位置", "ja": "位置", "ko": "위치", "de": "Position", "es": "Posición", "fr": "Position", "id": "Posisi", "it": "Posizione", "pt": "Posicão", "ro": "Poziție", "vi": "Vị trí", "ar": "الموقع"
  },
  "Quality": {
    "zh": "质量", "zh-TW": "質量", "ja": "画質", "ko": "품질", "de": "Qualität", "es": "Calidad", "fr": "Qualité", "id": "Kualitas", "it": "Qualità", "pt": "Qualidade", "ro": "Calitate", "vi": "Chất lượng", "ar": "الجودة"
  },
  "Output Format": {
    "zh": "输出格式", "zh-TW": "輸出格式", "ja": "出力形式", "ko": "출력 형식", "de": "Ausgabeformat", "es": "Formato de salida", "fr": "Format de sortie", "id": "Format Output", "it": "Formato di output", "pt": "Formato de saída", "ro": "Format de ieșire", "vi": "Định dạng đầu ra", "ar": "صيغة المخرجات"
  },
  "Style": {
    "zh": "样式", "zh-TW": "樣式", "ja": "スタイル", "ko": "스타일", "de": "Stil", "es": "Estilo", "fr": "Style", "id": "Gaya", "it": "Stile", "pt": "Estilo", "ro": "Stil", "vi": "Kiểu dáng", "ar": "النمط"
  },
  "Left": {
    "zh": "左侧", "zh-TW": "左側", "ja": "左", "ko": "왼쪽", "de": "Links", "es": "Izquierda", "fr": "Gauche", "id": "Kiri", "it": "Sinistra", "pt": "Esquerda", "ro": "Stânga", "vi": "Bên trái", "ar": "اليسار"
  },
  "Clear All": {
    "zh": "全部清除", "zh-TW": "全部清除", "ja": "すべてクリア", "ko": "모두 지우기", "de": "Alle löschen", "es": "Borrar todo", "fr": "Tout effacer", "id": "Hapus Semua", "it": "Cancella tutto", "pt": "Limpar tudo", "ro": "Curățați tot", "vi": "Xóa toàn bộ", "ar": "مسح الكل"
  },
  "Deselect All": {
    "zh": "取消全选", "zh-TW": "取消全選", "ja": "選択解除", "ko": "모두 선택 해제", "de": "Auswahl aufheben", "es": "Deseleccionar todo", "fr": "Tout désélectionner", "id": "Batal Pilih Semua", "it": "Deseleziona tutto", "pt": "Desmarcar tudo", "ro": "Deselectați tot", "vi": "Bỏ chọn tất cả", "ar": "الغاء تحديد الكل"
  },
  "Auto": {
    "zh": "自动", "zh-TW": "自動", "ja": "自動", "ko": "자동", "de": "Auto", "es": "Auto", "fr": "Auto", "id": "Otomatis", "it": "Auto", "pt": "Auto", "ro": "Auto", "vi": "Tự động", "ar": "تلقائي"
  },
  "Width": {
    "zh": "宽度", "zh-TW": "寬度", "ja": "幅", "ko": "너비", "de": "Breite", "es": "Ancho", "fr": "Largeur", "id": "Lebar", "it": "Larghezza", "pt": "Largura", "ro": "Lățime", "vi": "Chiều rộng", "ar": "العرض"
  },
  "Height": {
    "zh": "高度", "zh-TW": "高度", "ja": "高さ", "ko": "높이", "de": "Höhe", "es": "Alto", "fr": "Hauteur", "id": "Tinggi", "it": "Altezza", "pt": "Altura", "ro": "Înălțime", "vi": "Chiều cao", "ar": "الارتفاع"
  },
  "Author": {
    "zh": "作者", "zh-TW": "作者", "ja": "作成者", "ko": "작성자", "de": "Autor", "es": "Autor", "fr": "Auteur", "id": "Penulis", "it": "Autore", "pt": "Autor", "ro": "Autor", "vi": "Tác giả", "ar": "المؤلف"
  },
  "Keywords": {
    "zh": "关键词", "zh-TW": "關鍵詞", "ja": "キーワード", "ko": "키워드", "de": "Schlüsselwörter", "es": "Palabras clave", "fr": "Mots-clés", "id": "Kata Kunci", "it": "Parole chiave", "pt": "Palavras-chave", "ro": "Cuvinte cheie", "vi": "Từ khóa", "ar": "الكلمات المفتاحية"
  },
  "Reset": {
    "zh": "重置", "zh-TW": "重置", "ja": "リセット", "ko": "재설정", "de": "Zurücksetzen", "es": "Restablecer", "fr": "Réinitialiser", "id": "Reset", "it": "Reimposta", "pt": "Redefinir", "ro": "Resetați", "vi": "Đặt lại", "ar": "إعادة تعيين"
  },
  "Image Quality": {
    "zh": "图片质量", "zh-TW": "圖片質量", "ja": "画像画質", "ko": "이미지 품질", "de": "Bildqualität", "es": "Calidad de imagen", "fr": "Qualité d'image", "id": "Kualitas Gambar", "it": "Qualità dell'immagine", "pt": "Qualidade da imagem", "ro": "Calitate imagine", "vi": "Chất lượng hình ảnh", "ar": "جودة الصورة"
  },
  "Original:": {
    "zh": "原大小:", "zh-TW": "原大小:", "ja": "元サイズ:", "ko": "원본:", "de": "Original:", "es": "Original:", "fr": "Original :", "id": "Asli:", "it": "Originale:", "pt": "Original:", "ro": "Original:", "vi": "Gốc:", "ar": "الأصل:"
  },
  "Background Color": {
    "zh": "背景颜色", "zh-TW": "背景顏色", "ja": "背景色", "ko": "배경 색상", "de": "Hintergrundfarbe", "es": "Color de fondo", "fr": "Couleur de fond", "id": "Warna Latar Belakang", "it": "Colore dello sfondo", "pt": "Cor de fundo", "ro": "Culoare fundal", "vi": "Màu nền", "ar": "لون الخلفية"
  },
  "Custom": {
    "zh": "自定义", "zh-TW": "自定義", "ja": "カスタム", "ko": "사용자 정의", "de": "Benutzerdefiniert", "es": "Personalizado", "fr": "Personnalisé", "id": "Kustom", "it": "Personalizzato", "pt": "Personalizado", "ro": "Personalizat", "vi": "Tùy chỉnh", "ar": "مخصص"
  },
  "Selected Files": {
    "zh": "已选择文件", "zh-TW": "已選擇文件", "ja": "選択されたファイル", "ko": "선택된 파일", "de": "Ausgewählte Dateien", "es": "Archivos seleccionados", "fr": "Fichiers sélectionnés", "id": "File Terpilih", "it": "File selezionati", "pt": "Arquivos selecionados", "ro": "Fișiere selectate", "vi": "Tệp đã chọn", "ar": "الملفات المحددة"
  },
  "Options": {
    "zh": "设置选项", "zh-TW": "設置選項", "ja": "オプション", "ko": "옵션", "de": "Optionen", "es": "Opciones", "fr": "Options", "id": "Opsi", "it": "Opzioni", "pt": "Opções", "ro": "Opțiuni", "vi": "Tùy chọn", "ar": "خيارات"
  },
  "Color": {
    "zh": "色彩", "zh-TW": "色彩", "ja": "色", "ko": "색상", "de": "Farbe", "es": "Color", "fr": "Couleur", "id": "Warna", "it": "Colore", "pt": "Cor", "ro": "Culoare", "vi": "Màu sắc", "ar": "اللون"
  },
  "Drag and drop a PDF file here.": {
    "zh": "将 PDF 文件拖放到这里。", "zh-TW": "將 PDF 文件拖放到這裡。", "ja": "ここにPDFファイルをドラッグ＆ドロップしてください。", "ko": "PDF 파일을 여기에 드래그 앤 드롭하십시오.", "de": "PDF-Datei hierher ziehen.", "es": "Arrastre y suelte un archivo PDF aquí.", "fr": "Glissez-déposez un fichier PDF ici.", "id": "Seret dan letakkan file PDF di sini.", "it": "Trascina e rilascia un file PDF qui.", "pt": "Arraste e solte um arquivo PDF aqui.", "ro": "Trageți și plasați un fișier PDF aici.", "vi": "Kéo thả tệp PDF vào đây.", "ar": "قم بسحب وإسقاط ملف PDF هنا."
  },
  "Error": {
    "zh": "错误", "zh-TW": "錯誤", "ja": "エラー", "ko": "오류", "de": "Fehler", "es": "Error", "fr": "Erreur", "id": "Kesalahan", "it": "Errore", "pt": "Erro", "ro": "Eroare", "vi": "Lỗi", "ar": "خطأ"
  },
  "Previous": {
    "zh": "上一步", "zh-TW": "上一步", "ja": "戻る", "ko": "이전", "de": "Zurück", "es": "Anterior", "fr": "Précédent", "id": "Sebelumnya", "it": "Precedente", "pt": "Anterior", "ro": "Precedent", "vi": "Trang trước", "ar": "السابق"
  },
  "Right": {
    "zh": "右侧", "zh-TW": "右側", "ja": "右", "ko": "오른쪽", "de": "Rechts", "es": "Derecha", "fr": "Droite", "id": "Kanan", "it": "Destra", "pt": "Direita", "ro": "Dreapta", "vi": "Bên phải", "ar": "اليمين"
  },
  "Page {number}": {
    "zh": "第 {number} 页", "zh-TW": "第 {number} 頁", "ja": "ページ {number}", "ko": "{number} 페이지", "de": "Seite {number}", "es": "Página {number}", "fr": "Page {number}", "id": "Halaman {number}", "it": "Pagina {number}", "pt": "Página {number}", "ro": "Pagina {number}", "vi": "Trang {number}", "ar": "صفحة {number}"
  },
  "Cancel": {
    "zh": "取消", "zh-TW": "取消", "ja": "キャンセル", "ko": "취소", "de": "Abbrechen", "es": "Cancelar", "fr": "Annuler", "id": "Batal", "it": "Annulla", "pt": "Cancelar", "ro": "Anulați", "vi": "Hủy bỏ", "ar": "إلغاء"
  },
  "Password": {
    "zh": "密码", "zh-TW": "密碼", "ja": "パスワード", "ko": "비밀번호", "de": "Passwort", "es": "Contraseña", "fr": "Mot de passe", "id": "Kata Sandi", "it": "Password", "pt": "Senha", "ro": "Parolă", "vi": "Mật khẩu", "ar": "كلمة المرور"
  },
  "Save": {
    "zh": "保存", "zh-TW": "保存", "ja": "保存", "ko": "저장", "de": "Speichern", "es": "Guardar", "fr": "Enregistrer", "id": "Simpan", "it": "Salva", "pt": "Salvar", "ro": "Salvați", "vi": "Lưu", "ar": "حفظ"
  },
  "Status": {
    "zh": "状态", "zh-TW": "狀態", "ja": "ステータス", "ko": "상태", "de": "Status", "es": "Estado", "fr": "Statut", "id": "Status", "it": "Stato", "pt": "Status", "ro": "Stare", "vi": "Trạng thái", "ar": "الحالة"
  },
  "Description": {
    "zh": "描述", "zh-TW": "描述", "ja": "説明", "ko": "설명", "de": "Beschreibung", "es": "Descripción", "fr": "Description", "id": "Deskripsi", "it": "Descrizione", "pt": "Descrição", "ro": "Descriere", "vi": "Mô tả", "ar": "الوصف"
  },
  "Close": {
    "zh": "关闭", "zh-TW": "關閉", "ja": "閉じる", "ko": "닫기", "de": "Schließen", "es": "Cerrar", "fr": "Fermer", "id": "Tutup", "it": "Chiudi", "pt": "Fechar", "ro": "Închideți", "vi": "Đóng", "ar": "إغلاق"
  },
  "Submit": {
    "zh": "提交", "zh-TW": "提交", "ja": "送信", "ko": "제출", "de": "Absenden", "es": "Enviar", "fr": "Soumettre", "id": "Kirim", "it": "Invia", "pt": "Enviar", "ro": "Trimiteți", "vi": "Gửi đi", "ar": "إرسال"
  },
  "DPI": {
    "zh": "分辨率 (DPI)", "zh-TW": "解析度 (DPI)", "ja": "解像度 (DPI)", "ko": "해상도 (DPI)", "de": "Auflösung (DPI)", "es": "Resolución (DPI)", "fr": "Résolution (DPI)", "id": "Resolusi (DPI)", "it": "Risoluzione (DPI)", "pt": "Resolução (DPI)", "ro": "Rezoluție (DPI)", "vi": "Độ phân giải (DPI)", "ar": "الدقة (DPI)"
  },
  "Processing...": {
    "zh": "正在处理...", "zh-TW": "正在處理...", "ja": "処理中...", "ko": "처리 중...", "de": "Verarbeitung...", "es": "Procesando...", "fr": "Traitement en cours...", "id": "Memproses...", "it": "Elaborazione...", "pt": "Processando...", "ro": "Se procesează...", "vi": "Đang xử lý...", "ar": "جاري المعالجة..."
  },
  "Download": {
    "zh": "下载", "zh-TW": "下載", "ja": "ダウンロード", "ko": "다운로드", "de": "Herunterladen", "es": "Descargar", "fr": "Télécharger", "id": "Unduh", "it": "Scarica", "pt": "Descarregar", "ro": "Descărcați", "vi": "Tải xuống", "ar": "تحميل"
  },
  "Remove": {
    "zh": "移除", "zh-TW": "移除", "ja": "削除", "ko": "제거", "de": "Entfernen", "es": "Quitar", "fr": "Retirer", "id": "Hapus", "it": "Rimuovi", "pt": "Remover", "ro": "Eliminați", "vi": "Gỡ bỏ", "ar": "إزالة"
  },
  "Format": {
    "zh": "格式", "zh-TW": "格式", "ja": "フォーマット", "ko": "형식", "de": "Format", "es": "Formato", "fr": "Format", "id": "Format", "it": "Formato", "pt": "Formato", "ro": "Format", "vi": "Định dạng", "ar": "الصيغة"
  },
  "Margin": {
    "zh": "边距", "zh-TW": "邊距", "ja": "余白", "ko": "여백", "de": "Rand", "es": "Margen", "fr": "Marge", "id": "Margin", "it": "Margine", "pt": "Margem", "ro": "Margine", "vi": "Căn lề", "ar": "الهامش"
  },
  "Text": {
    "zh": "文字", "zh-TW": "文字", "ja": "テキスト", "ko": "텍스트", "de": "Text", "es": "Texto", "fr": "Texte", "id": "Teks", "it": "Testo", "pt": "Texto", "ro": "Text", "vi": "Văn bản", "ar": "نص"
  },
  "Apply": {
    "zh": "应用", "zh-TW": "應用", "ja": "適用", "ko": "적용", "de": "Anwenden", "es": "Aplicar", "fr": "Appliquer", "id": "Terapkan", "it": "Applica", "pt": "Aplicar", "ro": "Aplicați", "vi": "Áp dụng", "ar": "تطبيق"
  },
  "Loop": {
    "zh": "循环", "zh-TW": "循環", "ja": "ループ", "ko": "루프", "de": "Schleife", "es": "Bucle", "fr": "Boucle", "id": "Loop", "it": "Loop", "pt": "Loop", "ro": "Buclă", "vi": "Lặp lại", "ar": "تكرار"
  },
  "Looping": {
    "zh": "正在循环", "zh-TW": "正在循環", "ja": "ループ中", "ko": "루핑 중", "de": "Wiederholen", "es": "Bucleando", "fr": "Bouclage", "id": "Perulangan", "it": "Ripetizione", "pt": "Repetição", "ro": "Repetare", "vi": "Đang lặp", "ar": "تكرار مستمر"
  },
  "Loop Pages": {
    "zh": "循环页面", "zh-TW": "循環頁面", "ja": "ページをループ", "ko": "페이지 반복", "de": "Seiten wiederholen", "es": "Páginas en bucle", "fr": "Pages en boucle", "id": "Ulangi Halaman", "it": "Ripeti pagine", "pt": "Repetir páginas", "ro": "Repetare pagini", "vi": "Lặp trang", "ar": "تكرار الصفحات"
  },
  "loop": {
    "zh": "循环", "zh-TW": "循環", "ja": "ループ", "ko": "루프", "de": "Schleife", "es": "bucle", "fr": "boucle", "id": "loop", "it": "loop", "pt": "loop", "ro": "buclă", "vi": "lặp", "ar": "تكرار"
  },
  "Opacity": {
    "zh": "不透明度", "zh-TW": "不透明度", "ja": "不透明度", "ko": "불투명도", "de": "Deckkraft", "es": "Opacidad", "fr": "Opacité", "id": "Opasitas", "it": "Opacità", "pt": "Opacidade", "ro": "Opacitate", "vi": "Độ mờ đục", "ar": "الشفافية"
  },
  "Loop Overlay": {
    "zh": "循环覆盖图层", "zh-TW": "循環覆蓋圖層", "ja": "オーバーレイをループ", "ko": "오버레이 반복", "de": "Overlay wiederholen", "es": "Superposición en bucle", "fr": "Superposition en boucle", "id": "Ulangi Hamparan", "it": "Ripeti sovrapposizione", "pt": "Repetir sobreposição", "ro": "Repetare suprapunere", "vi": "Lặp đè lớp", "ar": "تكرار التراكب"
  },
  "loopOverlay": {
    "zh": "循环覆盖图层", "zh-TW": "循環覆蓋圖層", "ja": "オーバーレイをループ", "ko": "오버레이 반복", "de": "Overlay wiederholen", "es": "superposición en bucle", "fr": "superposition en boucle", "id": "ulangi hamparan", "it": "ripeti sovrapposizione", "pt": "repetir sobreposição", "ro": "repetare suprapunere", "vi": "lặp đè lớp", "ar": "تكرار التراكب"
  },
  "Loop Background": {
    "zh": "循环背景", "zh-TW": "循環背景", "ja": "背景をループ", "ko": "배경 반복", "de": "Hintergrund wiederholen", "es": "Fondo en bucle", "fr": "Fond en boucle", "id": "Ulangi Latar Belakang", "it": "Ripeti sfondo", "pt": "Repetir fundo", "ro": "Repetare fundal", "vi": "Lặp nền", "ar": "تكرار الخلفية"
  },
  "loopBackground": {
    "zh": "循环背景", "zh-TW": "循環背景", "ja": "背景をループ", "ko": "배경 반복", "de": "Hintergrund wiederholen", "es": "fondo en bucle", "fr": "fond en boucle", "id": "ulangi latar belakang", "it": "ripeti sfondo", "pt": "repetir fundo", "ro": "repetare fundal", "vi": "lặp nền", "ar": "تكرار الخلفية"
  },
  "Next": {
    "zh": "下一步", "zh-TW": "下一步", "ja": "次へ", "ko": "다음", "de": "Weiter", "es": "Siguiente", "fr": "Suivant", "id": "Berikutnya", "it": "Avanti", "pt": "Seguinte", "ro": "Următor", "vi": "Trang sau", "ar": "التالي"
  },
  "Loop Overlay PDF": {
    "zh": "循环覆盖 PDF", "zh-TW": "循環覆蓋 PDF", "ja": "オーバーレイPDFをループ", "ko": "오버레이 PDF 반복", "de": "Overlay-PDF wiederholen", "es": "Superposición PDF en bucle", "fr": "Superposition PDF en boucle", "id": "Ulangi Hamparan PDF", "it": "Ripeti sovrapposizione PDF", "pt": "Repetir sobreposição PDF", "ro": "Repetare suprapunere PDF", "vi": "Lặp đè PDF", "ar": "تكرار تراكب PDF"
  },
  "loopOverlayPdf": {
    "zh": "循环覆盖 PDF", "zh-TW": "循環覆蓋 PDF", "ja": "オーバーレイPDFをループ", "ko": "오버레이 PDF 반복", "de": "Overlay-PDF wiederholen", "es": "superposición PDF en bucle", "fr": "superposition PDF en boucle", "id": "ulangi hamparan PDF", "it": "ripeti sovrapposizione PDF", "pt": "repetir sobreposição PDF", "ro": "repetare suprapunere PDF", "vi": "lặp đè PDF", "ar": "تكرار تراكب PDF"
  },
  "Loop Background PDF": {
    "zh": "循环背景 PDF", "zh-TW": "循環背景 PDF", "ja": "背景PDFをループ", "ko": "배경 PDF 반복", "de": "Hintergrund-PDF wiederholen", "es": "Fondo PDF en bucle", "fr": "Fond PDF en boucle", "id": "Ulangi Latar Belakang PDF", "it": "Ripeti sfondo PDF", "pt": "Repetir fundo PDF", "ro": "Repetare fundal PDF", "vi": "Lặp nền PDF", "ar": "تكرار خلفية PDF"
  },
  "loopBackgroundPdf": {
    "zh": "循环背景 PDF", "zh-TW": "循環背景 PDF", "ja": "背景PDFをループ", "ko": "배경 PDF 반복", "de": "Hintergrund-PDF wiederholen", "es": "fondo PDF en bucle", "fr": "fond PDF en boucle", "id": "ulangi latar belakang PDF", "it": "ripeti sfondo PDF", "pt": "repetir fundo PDF", "ro": "repetare fundal PDF", "vi": "lặp nền PDF", "ar": "تكرار خلفية PDF"
  },
  "Scale": {
    "zh": "缩放比例", "zh-TW": "缩放比例", "ja": "倍率", "ko": "배율", "de": "Skalierung", "es": "Escala", "fr": "Échelle", "id": "Skala", "it": "Scala", "pt": "Escala", "ro": "Scară", "vi": "Tỷ lệ", "ar": "المقياس"
  },
  "Loops": {
    "zh": "循环次数", "zh-TW": "循環次數", "ja": "ループ回数", "ko": "루프 횟수", "de": "Schleifen", "es": "Bucles", "fr": "Boucles", "id": "Loop", "it": "Loop", "pt": "Loops", "ro": "Bucle", "vi": "Vòng lặp", "ar": "التكرارات"
  },
  "loops": {
    "zh": "循环次数", "zh-TW": "循環次數", "ja": "ループ回数", "ko": "루프 횟수", "de": "Schleifen", "es": "bucles", "fr": "boucles", "id": "loop", "it": "loop", "pt": "loops", "ro": "bucle", "vi": "vòng lặp", "ar": "تكرارات"
  },
  "looping": {
    "zh": "循环", "zh-TW": "循環", "ja": "ループ中", "ko": "루핑", "de": "wiederholen", "es": "bucleando", "fr": "bouclage", "id": "perulangan", "it": "ripetizione", "pt": "repetição", "ro": "repetare", "vi": "lặp", "ar": "تكرار"
  },
  "Loop PDF": {
    "zh": "循环 PDF", "zh-TW": "循環 PDF", "ja": "PDFをループ", "ko": "PDF 반복", "de": "PDF wiederholen", "es": "PDF en bucle", "fr": "PDF en boucle", "id": "Ulangi PDF", "it": "Ripeti PDF", "pt": "Repetir PDF", "ro": "Repetare PDF", "vi": "Lặp PDF", "ar": "تكرار PDF"
  },
  "loopPdf": {
    "zh": "循环 PDF", "zh-TW": "循環 PDF", "ja": "PDFをループ", "ko": "PDF 반복", "de": "PDF wiederholen", "es": "pdf en bucle", "fr": "pdf en boucle", "id": "ulangi pdf", "it": "ripeti pdf", "pt": "repetir pdf", "ro": "repetare pdf", "vi": "lặp pdf", "ar": "تكرار PDF"
  },
  "Custom Resolution": {
    "zh": "自定义分辨率", "zh-TW": "自定義解析度", "ja": "カスタム解像度", "ko": "사용자 정의 해상도", "de": "Benutzerdefinierte Auflösung", "es": "Resolución personalizada", "fr": "Résolution personnalisée", "id": "Resolusi Kustom", "it": "Risoluzione personalizzata", "pt": "Resolução personalizada", "ro": "Rezoluție personalizată", "vi": "Độ phân giải tùy chỉnh", "ar": "دقة مخصصة"
  },
  "looping...": {
    "zh": "正在循环...", "zh-TW": "正在循環...", "ja": "ループ中...", "ko": "루핑 중...", "de": "Wiederholen...", "es": "Bucleando...", "fr": "Bouclage...", "id": "Mengulang...", "it": "Ripetizione...", "pt": "Repetindo...", "ro": "Se repetă...", "vi": "Đang lặp...", "ar": "جاري التكرار..."
  },
  "Looping...": {
    "zh": "正在循环...", "zh-TW": "正在循環...", "ja": "ループ中...", "ko": "루핑 중...", "de": "Wiederholen...", "es": "Bucleando...", "fr": "Bouclage...", "id": "Mengulang...", "it": "Ripetizione...", "pt": "Repetindo...", "ro": "Se repetă...", "vi": "Đang lặp...", "ar": "جاري التكرار..."
  },
  "Loops...": {
    "zh": "正在循环...", "zh-TW": "正在循環...", "ja": "ループ中...", "ko": "루핑 중...", "de": "Wiederholen...", "es": "Bucles...", "fr": "Boucles...", "id": "Mengulang...", "it": "Ripetizione...", "pt": "Repetindo...", "ro": "Se repetă...", "vi": "Đang lặp...", "ar": "جاري التكرار..."
  },
  "Page labels": {
    "zh": "页面标签", "zh-TW": "頁面標籤", "ja": "ページラベル", "ko": "페이지 레이블", "de": "Seitenetiketten", "es": "Etiquetas de página", "fr": "Étiquettes de page", "id": "Label Halaman", "it": "Etichette di pagina", "pt": "Rótulos de página", "ro": "Etichete pagini", "vi": "Nhãn trang", "ar": "تسميات الصفحة"
  },
  "Looping PDF": {
    "zh": "循环 PDF", "zh-TW": "循環 PDF", "ja": "PDFをループ", "ko": "PDF 반복", "de": "PDF wiederholen", "es": "PDF en bucle", "fr": "PDF en boucle", "id": "Mengulang PDF", "it": "Ripetizione PDF", "pt": "Repetindo PDF", "ro": "Repetare PDF", "vi": "Lặp PDF", "ar": "تكرار PDF"
  },
  "Search": {
    "zh": "搜索", "zh-TW": "搜尋", "ja": "検索", "ko": "검색", "de": "Suchen", "es": "Buscar", "fr": "Rechercher", "id": "Cari", "it": "Cerca", "pt": "Pesquisar", "ro": "Căutați", "vi": "Tìm kiếm", "ar": "بحث"
  },
  "Watermark Text": {
    "zh": "水印文本", "zh-TW": "浮水印文字", "ja": "透かしテキスト", "ko": "워터마크 텍스트", "de": "Wasserzeichentext", "es": "Texto de marca de agua", "fr": "Texte du filigrane", "id": "Teks Watermark", "it": "Testo della filigrana", "pt": "Texto da marca d'água", "ro": "Text filigran", "vi": "Chữ đóng dấu", "ar": "نص العلامة المائية"
  },
  "Loops (optional)": {
    "zh": "循环次数 (可选)", "zh-TW": "循環次數 (可選)", "ja": "ループ回数 (オプション)", "ko": "루프 횟수 (선택 사항)", "de": "Schleifen (optional)", "es": "Bucles (opcional)", "fr": "Boucles (optionnel)", "id": "Loop (opsional)", "it": "Loop (opzionale)", "pt": "Loops (opcional)", "ro": "Bucle (opțional)", "vi": "Vòng lặp (tùy chọn)", "ar": "التكرارات (اختياري)"
  },
  "Angle": {
    "zh": "角度", "zh-TW": "角度", "ja": "角度", "ko": "각도", "de": "Winkel", "es": "Ángulo", "fr": "Angle", "id": "Sudut", "it": "Angolo", "pt": "Ângulo", "ro": "Unghi", "vi": "Góc xoay", "ar": "الزاوية"
  },
  "Settings": {
    "zh": "设置参数", "zh-TW": "設置參數", "ja": "設定", "ko": "설정", "de": "Einstellungen", "es": "Configuración", "fr": "Paramètres", "id": "Pengaturan", "it": "Impostazioni", "pt": "Configurações", "ro": "Setări", "vi": "Thiết lập", "ar": "الإعدادات"
  },
  "Looping PDF...": {
    "zh": "正在循环 PDF...", "zh-TW": "正在循環 PDF...", "ja": "PDFをループ中...", "ko": "PDF 루핑 중...", "de": "PDF wiederholen...", "es": "Bucleando PDF...", "fr": "Bouclage du PDF...", "id": "Mengulang PDF...", "it": "Ripetizione PDF...", "pt": "Repetindo PDF...", "ro": "Se repetă PDF...", "vi": "Đang lặp PDF...", "ar": "جاري تكرار PDF..."
  },
  "Page label": {
    "zh": "页面标签", "zh-TW": "頁面標籤", "ja": "ページラベル", "ko": "페이지 레이블", "de": "Seitenetikett", "es": "Etiqueta de página", "fr": "Étiquette de page", "id": "Label Halaman", "it": "Etichetta di pagina", "pt": "Rótulo de página", "ro": "Etichetă pagină", "vi": "Nhãn trang", "ar": "تسمية الصفحة"
  },
  "PDF document optimized locally!": {
    "zh": "PDF 文档已在本地优化成功！", "zh-TW": "PDF 文檔已在本地優化成功！", "ja": "PDFドキュメントがローカルで最適化されました！", "ko": "PDF 문서가 로컬에서 최적화되었습니다!", "de": "PDF-Dokument lokal optimiert!", "es": "¡Documento PDF optimizado localmente!", "fr": "Document PDF optimisé localement !", "id": "Dokumen PDF dioptimalkan secara lokal!", "it": "Documento PDF ottimizzato localmente!", "pt": "Documento PDF otimizado localmente!", "ro": "Documentul PDF a fost optimizat local!", "vi": "Tài liệu PDF đã được tối ưu cục bộ!", "ar": "تم تحسين مستند PDF محليًا!"
  },
  "Erase XMP XML metadata and document descriptions": {
    "zh": "擦除 XMP XML 元数据和文档描述", "zh-TW": "擦除 XMP XML 元數據和文檔描述", "ja": "XMP XMLメタデータとドキュメント説明を消去", "ko": "XMP XML 메타데이터 및 문서 설명 지우기", "de": "XMP-XML-Metadaten und Dokumentbeschreibungen löschen", "es": "Borrar metadatos XMP XML y descripciones de documentos", "fr": "Effacer les métadonnées XMP XML et descriptions de documents", "id": "Hapus metadata XMP XML dan deskripsi dokumen", "it": "Cancella metadati XMP XML e descrizioni dei documenti", "pt": "Apagar metadados XMP XML e descrições do documento", "ro": "Ștergeți metadatele XMP XML și descrierile documentului", "vi": "Xóa siêu dữ liệu XMP XML và mô tả tài liệu", "ar": "مسح البيانات الوصفية XMP XML ووصف المستند"
  },
  "Title, Author, Producer, and historical edit summary metadata": {
    "zh": "包含标题、作者、生成器及修改历史等元数据信息", "zh-TW": "包含標題、作者、生成器及修改歷史等元數據信息", "ja": "タイトル、作成者、プロデューサー、編集履歴のメタデータ", "ko": "제목, 작성자, 생성기 및 편집 요약 메타데이터", "de": "Titel, Autor, Produzent und Metadaten des Bearbeitungsverlaufs", "es": "Metadatos de título, autor, productor y resumen de edición histórica", "fr": "Titre, auteur, producteur et historique des modifications", "id": "Metadata Judul, Penulis, Produsen, dan ringkasan riwayat edit", "it": "Titolo, autore, produttore e cronologia delle modifiche", "pt": "Metadados de título, autor, produtor e histórico de edição", "ro": "Metadate despre titlu, autor, producător și istoric modificări", "vi": "Siêu dữ liệu về tiêu đề, tác giả, nhà sản xuất và lịch sử sửa", "ar": "البيانات الوصفية للعنوان والمؤلف والمنتج وتاريخ التعديل"
  },
  "Clean PieceInfo private editor properties": {
    "zh": "清理 PieceInfo 私有编辑器残留属性", "zh-TW": "清理 PieceInfo 私有編輯器殘留屬性", "ja": "PieceInfoプライベートエディタプロパティを消去", "ko": "PieceInfo 프라이빗 에디터 속성 정리", "de": "Private PieceInfo-Editoreigenschaften bereinigen", "es": "Limpiar propiedades de editor privado PieceInfo", "fr": "Nettoyer les propriétés privées d'éditeur PieceInfo", "id": "Bersihkan properti editor pribadi PieceInfo", "it": "Pulisci proprietà dell'editor privato PieceInfo", "pt": "Limpar propriedades privadas do editor PieceInfo", "ro": "Curățați proprietățile de editor privat PieceInfo", "vi": "Làm sạch thuộc tính biên tập riêng PieceInfo", "ar": "تنظيف خصائص المحرر الخاص PieceInfo"
  },
  "Residual markup and edit records left by Adobe Acrobat/InDesign": {
    "zh": "由 Adobe Acrobat/InDesign 遗留的批注记录和编辑数据", "zh-TW": "由 Adobe Acrobat/InDesign 遺留的批註記錄和編輯數據", "ja": "Adobe AcrobatやInDesignによって残されたマークアップや編集記録", "ko": "Adobe Acrobat/InDesign으로 인한 마크업 및 편집 로그 잔재", "de": "Verbleibende Markup- und Bearbeitungseinträge von Adobe Acrobat/InDesign", "es": "Marcas residuales y registros de edición de Adobe Acrobat/InDesign", "fr": "Annotations résiduelles et historiques laissés par Adobe Acrobat/InDesign", "id": "Markup sisa dan catatan edit yang ditinggalkan Adobe Acrobat/InDesign", "it": "Markup residui e record di modifica inseriti da Adobe Acrobat/InDesign", "pt": "Marcações residuais e registros de edição deixados pelo Adobe Acrobat/InDesign", "ro": "Marcaje reziduale și înregistrări de editare lăsate de Adobe Acrobat/InDesign", "vi": "Dữ liệu đánh dấu và lịch sử sửa đổi của Adobe Acrobat/InDesign", "ar": "العلامات المتبقية وسجلات التعديل من Adobe Acrobat/InDesign"
  },
  "Strip OCProperties optional visible layers": {
    "zh": "剥离 OCProperties 可选视口图层 (OCG 图层)", "zh-TW": "剥離 OCProperties 可選視口圖層 (OCG 圖層)", "ja": "OCPropertiesオプショナル表示レイヤーを削除", "ko": "OCProperties 옵션 레이어 박리", "de": "Optionale sichtbare OCProperties-Ebenen entfernen", "es": "Eliminar capas visibles opcionales OCProperties", "fr": "Supprimer les calques visibles facultatifs OCProperties", "id": "Hapus lapisan terlihat opsional OCProperties", "it": "Rimuovi livelli visibili opzionali OCProperties", "pt": "Remover camadas visíveis opcionais OCProperties", "ro": "Eliminați straturile opționale vizibile OCProperties", "vi": "Loại bỏ lớp hiển thị tùy chọn OCProperties", "ar": "تجريد طبقات OCProperties المرئية الاختيارية"
  },
  "Often holds invisible dynamic watermarks used for leak tracking": {
    "zh": "此处常用于保存追踪泄露的隐形动态防伪水印", "zh-TW": "此處常用於保存追蹤洩露的隱形動態防偽浮水印", "ja": "リーク追跡用の非表示の動的透かしが保存されていることが多いです", "ko": "유출 추적을 위한 보이지 않는 동적 워터마크가 숨어있는 경우가 많습니다", "de": "Enthält oft unsichtbare dynamische Wasserzeichen zur Leckortung", "es": "A menudo contiene marcas de agua dinámicas invisibles para rastrear filtraciones", "fr": "Contient souvent des filigranes dynamiques invisibles de traçabilité", "id": "Sering kali menyimpan watermark dinamis tidak terlihat untuk melacak kebocoran", "it": "Spesso contiene filigrane dinamiche invisibili per la tracciabilità", "pt": "Frequentemente contém marcas d'água dinâmicas invisíveis para rastreamento de vazamentos", "ro": "Adesea conține filigrane dinamice invizibile folosite pentru urmărirea scurgerilor", "vi": "Thường chứa đóng dấu động vô hình dùng để truy vết rò rỉ", "ar": "غالبًا ما تحتوي على علامات مائية ديناميكية غير مرئية لتتبع التسريب"
  },
  "Wipe all interactive markups and links (Caution)": {
    "zh": "清除所有交互式注释与超链接 (慎选)", "zh-TW": "清除所有交互式注釋與超連結 (慎選)", "ja": "インタラクティブなマークアップとリンクをすべて消去 (注意)", "ko": "모든 상호작용 마크업 및 링크 제거 (주의)", "de": "Alle interaktiven Markups und Links löschen (Vorsicht)", "es": "Borrar todas las marcas e hipervínculos interactivos (Precaución)", "fr": "Effacer toutes les annotations et hyperliens interactifs (Attention)", "id": "Hapus semua markup dan tautan interaktif (Perhatian)", "it": "Cancella tutti i markup e i link interattivi (Attenzione)", "pt": "Apagar todas as marcações e links interativos (Atenção)", "ro": "Ștergeți toate marcajele și linkurile interactive (Atenție)", "vi": "Xóa toàn bộ đánh dấu tương tác và liên kết (Chú ý)", "ar": "مسح جميع العلامات والروابط التفاعلية (تنبيه)"
  },
  "Permanently deletes hyperlinks, comment boxes, and stroke annotations": {
    "zh": "这将永久删除 PDF 中的跳转网址、文本注释框及手写注释线段", "zh-TW": "這將永久刪除 PDF 中的跳轉網址、文本注釋框及手寫注釋線段", "ja": "ハイパーリンク、コメントボックス、筆跡注釈を完全に削除します", "ko": "하이퍼링크, 텍스트 상자 및 손글씨 주석을 영구적으로 삭제합니다", "de": "Löscht Hyperlinks, Kommentarfelder und handschriftliche Anmerkungen dauerhaft", "es": "Elimina permanentemente hipervínculos, cuadros de comentario y anotaciones de trazo", "fr": "Supprime définitivement les hyperliens, zones de texte et annotations manuscrites", "id": "Menghapus permanen tautan, kotak komentar, dan anotasi goresan", "it": "Elimina permanentemente collegamenti, caselle di testo e annotazioni a mano", "pt": "Exclui permanentemente hiperlinks, caixas de comentários e anotações manuscritas", "ro": "Șterge definitiv hyperlinkurile, casetele de comentarii și adnotările de desen", "vi": "Sẽ xóa vĩnh viễn siêu liên kết, khung bình luận và vẽ chú thích", "ar": "يحذف بشكل دائم الروابط التشعبية ومربعات التعليق وتعليقات الرسم"
  },
  "Wiped all XMP metadata, edit records, PieceInfo, and optional visible content layers (OCG). The xref table was fully reconstructed.": {
    "zh": "成功清除所有 XMP 元数据、编辑器私有记录（PieceInfo）以及可选的 OCG 图层。交叉引用表（xref）已全部重新优化构建。",
    "zh-TW": "成功清除所有 XMP 元數據、編輯器私有記錄（PieceInfo）以及可選的 OCG 圖層。交叉引用表（xref）已全部重新優化構建。",
    "ja": "すべてのXMPメタデータ、編集記録、PieceInfo、およびオプション表示レイヤー(OCG)を消去しました。クロスリファレンス表(xref)は完全に再構成されました。",
    "ko": "모든 XMP 메타데이터, 편집 기록, PieceInfo 및 OCG 옵션 레이어를 지웠습니다. 교차 참조 테이블(xref)이 성공적으로 재구성되었습니다.",
    "de": "Alle XMP-Metadaten, Bearbeitungseinträge, PieceInfo und optionalen sichtbaren Inhaltsebenen (OCG) gelöscht. Die xref-Tabelle wurde vollständig rekonstruiert.",
    "es": "Se eliminaron todos los metadatos XMP, registros de edición, PieceInfo y capas de contenido visible opcionales (OCG). La tabla xref fue completamente reconstruida.",
    "fr": "Toutes les métadonnées XMP, historiques, PieceInfo et calques de visibilité (OCG) ont été effacés. La table xref a été entièrement reconstruite.",
    "id": "Menghapus semua metadata XMP, catatan edit, PieceInfo, dan lapisan konten opsional (OCG). Tabel xref sepenuhnya dibangun kembali.",
    "it": "Cancellati tutti i metadati XMP, record di modifica, PieceInfo e livelli visibili opzionali (OCG). La tabella xref è stata completamente ricostruita.",
    "pt": "Apagados todos os metadados XMP, registros de edição, PieceInfo e camadas opcionais (OCG). A tabela xref foi completamente reconstruída.",
    "ro": "S-au șters toate metadatele XMP, înregistrările de editare, PieceInfo și straturile vizibile opționale (OCG). Tabelul xref a fost reconstruit complet.",
    "vi": "Đã xóa toàn bộ siêu dữ liệu XMP, lịch sử sửa, PieceInfo và các lớp hiển thị tùy chọn OCG. Bảng tham chiếu chéo xref đã được dựng lại.",
    "ar": "تم مسح جميع بيانات XMP الوصفية وسجلات التعديل وPieceInfo وطبقات المحتوى المرئي الاختياري (OCG). تم إعادة بناء جدول المراجع المتقاطعة (xref) بالكامل."
  }
};

console.log("=== INJECTING HIGH-FREQUENCY TRANSLATIONS ===");

languages.forEach(lang => {
  if (lang === 'en') return;
  
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  
  let langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  
  // 递归寻找扁平的 keys，并将对应的 key-value 如果其中文和英文在我们的字典里，就进行回填
  // 这里我们为了方便，直接用扁平化的遍历逻辑
  function getKeys(obj, prefix = '') {
    let keys = {};
    for (let key in obj) {
      const val = obj[key];
      const newPrefix = prefix ? `${prefix}.${key}` : key;
      if (typeof val === 'object' && val !== null && !Array.isArray(val)) {
        Object.assign(keys, getKeys(val, newPrefix));
      } else {
        keys[newPrefix] = val;
      }
    }
    return keys;
  }
  
  const flatKeys = getKeys(langData);
  const enPath = path.join(MESSAGES_DIR, 'en.json');
  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  const enFlat = getKeys(enData);
  
  let updatedCount = 0;
  
  // 递归设置属性
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
  
  Object.entries(flatKeys).forEach(([keyPath, langVal]) => {
    const enVal = enFlat[keyPath];
    
    // 如果该语言的值和英文是一模一样的，且该英文值存在于我们的大翻译字典里
    if (enVal && langVal === enVal && bulkDict[enVal]) {
      const targetTrans = bulkDict[enVal][lang];
      if (targetTrans) {
        setDeepValue(langData, keyPath, targetTrans);
        updatedCount++;
      }
    }
  });
  
  fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
  console.log(`Language [${lang}]: Translated ${updatedCount} keys using high-frequency dict.`);
});

console.log("=== BULK TRANSLATION COMPLETE ===");
