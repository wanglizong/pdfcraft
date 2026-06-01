const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

const invoiceDict = {
  "uploadLabel": {
    "zh": "上传外币发票 PDF",
    "zh-TW": "上傳外幣發票 PDF",
    "ja": "外貨請求書PDFをアップロード",
    "ko": "외화 송장 PDF 업로드",
    "de": "Fremdwährungsrechnung PDF hochladen",
    "es": "Subir PDF de factura en moneda extranjera",
    "fr": "Téléverser la facture PDF en devises étrangères",
    "id": "Unggah PDF Faktur Mata Uang Asing",
    "it": "Carica fattura PDF in valuta estera",
    "pt": "Carregar fatura PDF em moeda estreita",
    "ro": "Încărcați factura PDF în valută străină",
    "vi": "Tải lên hóa đơn ngoại tệ PDF",
    "ar": "تحميل فاتورة العملة الأجنبية PDF"
  },
  "uploadDescription": {
    "zh": "智能识别发票金额并在本地自动换算汇率，为您盖印一张精美的本地化汇率折算记账卡片。",
    "zh-TW": "智能識別發票金額並在本地自動換算匯率，為您蓋印一張精美的本地化匯率折算記帳卡片。",
    "ja": "請求書の金額を分析して現地通貨のレートを自動換算し、美しい為替レート記帳カードをローカルで生成します。",
    "ko": "송장 금액을 분석하고 현지 환율을 자동으로 계산하여 프리미ウム 현지화 환율 원장 카드를 로컬에서 렌더링합니다.",
    "de": "Analysiert den Rechnungsbetrag und berechnet den Wechselkurs automatisch lokal, um einen hochwertigen lokalisierten Wechselkursbeleg zu erstellen.",
    "es": "Analiza el importe de la factura y calcula automáticamente el tipo de cambio de forma local, generando una tarjeta de registro de tipo de cambio localizada premium.",
    "fr": "Analyse le montant de la facture et calcule automatiquement le taux de change localement, générant une fiche de comptabilisation de taux de change localisée.",
    "id": "Menganalisis jumlah faktur dan menghitung nilai tukar secara lokal, menghasilkan kartu buku besar nilai tukar lokal premium.",
    "it": "Analizza l'importo della fattura e calcola automaticamente il tasso di cambio localmente, generando una scheda di tasso di cambio localizzato premium.",
    "pt": "Analisa o valor da fatura e calcula automaticamente a taxa de câmbio localmente, gerando um cartão de livro-razão de taxa de câmbio localizado premium.",
    "ro": "Analizează valoarea facturii și calculează automat cursul de schimb local, generând o fișă de curs de schimb localizat premium.",
    "vi": "Phân tích số tiền trên hóa đơn và tự động tính toán tỷ giá hối đoái cục bộ, tạo lập thẻ sổ cái tỷ giá hóa đơn đẹp mắt.",
    "ar": "يحلل مبلغ الفاتورة ويحسب سعر الصرف تلقائيًا محليًا، مما يعرض بطاقة دفتر حسابات سعر صرف محلية متميزة."
  },
  "optionsTitle": {
    "zh": "外币发票换算设置",
    "zh-TW": "外幣發票換算設置",
    "ja": "グローバル請求書換算設定",
    "ko": "글로벌 송장 변환 설정",
    "de": "Globale Rechnungskonvertierungseinstellungen",
    "es": "Configuración de conversión de factura global",
    "fr": "Paramètres de conversion de factures mondiales",
    "id": "Pengaturan Konversi Faktur Global",
    "it": "Impostazioni conversione fattura globale",
    "pt": "Configurações de conversão de fatura global",
    "ro": "Setări de conversie a facturii globale",
    "vi": "Thiết lập chuyển đổi hóa đơn quốc tế",
    "ar": "إعدادات تحويل الفواتير العالمية"
  },
  "processButton": {
    "zh": "执行发票分析与换算",
    "zh-TW": "執行發票分析與換算",
    "ja": "請求書の分析と換算を実行",
    "ko": "송장 분석 및 변환 실행",
    "de": "Rechnungsanalyse & Konvertierung ausführen",
    "es": "Ejecutar análisis y conversión de factura",
    "fr": "Exécuter l'analyse et la conversion de la facture",
    "id": "Jalankan Analisis & Konversi Faktur",
    "it": "Esegui analisi e conversione fattura",
    "pt": "Executar análise e conversão de fatura",
    "ro": "Executați analiza și conversia facturii",
    "vi": "Thực hiện phân tích & chuyển đổi hóa đơn",
    "ar": "تنفيذ تحليل وتحويل الفاتورة"
  },
  "successMessage": {
    "zh": "汇率折算记账印章成功盖印在外币发票上！",
    "zh-TW": "匯率折算記帳印章成功蓋印在外幣發票上！",
    "ja": "為替レート記帳スタンプが外貨請求書に正常に押印されました！",
    "ko": "외화 송장에 환율 원장 도장이 성공적으로 찍혔습니다!",
    "de": "Wechselkurs-Belegstempel erfolgreich auf Fremdwährungsrechnung aufgebracht!",
    "es": "¡Sello de registro de tipo de cambio estampado con éxito en la factura extranjera!",
    "fr": "Tampon de taux de change appliqué avec succès sur la facture en devises !",
    "id": "Stempel buku besar nilai tukar berhasil dicetak pada faktur asing!",
    "it": "Timbro di tasso di cambio applicato con successo sulla fattura estera!",
    "pt": "Carimbo de taxa de câmbio aplicado com sucesso na fatura estrangeira!",
    "ro": "Stampila cursului de schimb a fost aplicată cu succes pe factura străină!",
    "vi": "Đã đóng dấu sổ cái tỷ giá hối đoái lên hóa đơn ngoại tệ thành công!",
    "ar": "تم ختم دفتر حسابات سعر الصرف على الفاتورة الأجنبية بنجاح!"
  },
  "previewTitle": {
    "zh": "发票换算记账沙盘",
    "zh-TW": "發票換算記帳沙盤",
    "ja": "請求書換算記帳サンドテーブル",
    "ko": "송장 변환 계정 샌드테이블",
    "de": "Konvertierter Rechnungsbeleg-Sandkasten",
    "es": "Mesa de arena de cuenta de factura convertida",
    "fr": "Simulateur de comptabilisation de factures converties",
    "id": "Meja Pasir Akun Faktur yang Dikonversi",
    "it": "Tavola interattiva conto fattura convertito",
    "pt": "Mesa de areia da conta da fatura convertida",
    "ro": "Machetă interactivă a facturii convertite",
    "vi": "Sa bàn sổ cái hóa đơn chuyển đổi",
    "ar": "منصة حساب الفاتورة المحولة الذكية"
  },
  "clearButton": {
    "zh": "清空",
    "zh-TW": "清空",
    "ja": "クリア",
    "ko": "초기화",
    "de": "Löschen",
    "es": "Limpiar",
    "fr": "Effacer",
    "id": "Bersihkan",
    "it": "Cancella",
    "pt": "Limpar",
    "ro": "Curăță",
    "vi": "Xóa sạch",
    "ar": "مسح"
  },
  "convertedSuccess": {
    "zh": "换算成功",
    "zh-TW": "換算成功",
    "ja": "換算に成功しました",
    "ko": "변환 성공",
    "de": "Erfolgreich konvertiert",
    "es": "Convertido con éxito",
    "fr": "Converti avec succès",
    "id": "Berhasil dikonversi",
    "it": "Convertito con successo",
    "pt": "Convertido com sucesso",
    "ro": "Convertit cu succes",
    "vi": "Chuyển đổi thành công",
    "ar": "تم التحويل بنجاح"
  },
  "convertRateApplied": {
    "zh": "已根据汇率 {rate} 在本地将原始总额 {original} {currency} 换算为目标货币。",
    "zh-TW": "已根據匯率 {rate} 在本地將原始總額 {original} {currency} 換算為目標貨幣。",
    "ja": "為替レート {rate} に基づき、元の総額 {original} {currency} を現地通貨にローカルで換算しました。",
    "ko": "환율 {rate}을(를) 적용하여 원래 총액 {original} {currency}을(를) 현지 통화로 변환했습니다.",
    "de": "Umgerechneter Originalbetrag von {original} {currency} lokal über den Wechselkurs {rate}.",
    "es": "Se convirtió el total original de {original} {currency} localmente a través del tipo de cambio {rate}.",
    "fr": "Montant initial de {original} {currency} converti localement via le taux de change {rate}.",
    "id": "Mengonversi total asli {original} {currency} secara lokal melalui nilai tukar {rate}.",
    "it": "Convertito il totale originale di {original} {currency} localmente tramite il tasso di cambio {rate}.",
    "pt": "Convertido o total original de {original} {currency} localmente através da taxa de câmbio {rate}.",
    "ro": "Valoarea totală originală de {original} {currency} a fost convertită local prin cursul de schimb {rate}.",
    "vi": "Đã chuyển đổi số tiền gốc {original} {currency} cục bộ theo tỷ giá {rate}.",
    "ar": "تم تحويل المبلغ الإجمالي الأصلي {original} {currency} محليًا عبر سعر الصرف {rate}."
  },
  "emptyStateDescription": {
    "zh": "一键自动提取发票中的币种与金额，在本地渲染一张精美的微光玻璃态汇率记账卡片。",
    "zh-TW": "一鍵自動提取發票中的幣種與金額，在本地渲染一張精美的微光玻璃態匯率記帳卡片。",
    "ja": "クリックひとつで請求書から通貨と金額の情報を抽出し、美しいグラスモフィズム風の為替レートカードをローカルでレンダリングします。",
    "ko": "클릭 한 번으로 송장에서 통화 및 금액 정보를 추출하고 글래스모피즘 스타일의 환율 카드를 로컬에서 렌더링합니다.",
    "de": "Extrahieren Sie Währungsinformationen aus der Rechnung mit einem Klick und erstellen Sie lokal einen Beleg im Glassmorphismus-Design.",
    "es": "Extraiga la información de la moneda de la factura con un solo clic y genere una tarjeta de tipo de cambio con estilo de glassmorphism localmente.",
    "fr": "Extrayez les informations de devise de la facture en un clic et générez une fiche de taux de change au style glassmorphism localement.",
    "id": "Ekstrak info mata uang dari faktur dalam satu klik dan buat kartu nilai tukar lokal dengan gaya glassmorphism.",
    "it": "Estrai le informazioni sulla valuta dalla fattura in un clic e genera una scheda di tasso di cambio in stile glassmorphic localmente.",
    "pt": "Extraia informações de moeda da fatura com um clique e renderize um cartão de taxa de câmbio local no estilo glassmorphism.",
    "ro": "Extrageți informațiile despre monedă din factură cu un singur clic și generați o fișă de curs de schimb localizat în stil glassmorphism.",
    "vi": "Trích xuất thông tin tiền tệ từ hóa đơn chỉ trong một cú nhấp chuột và tạo thẻ tỷ giá đẹp mắt theo phong cách giả kính cục bộ.",
    "ar": "استخرج معلومات العملة من الفاتورة بنقرة واحدة واعقد بطاقة سعر صرف محلية متميزة مصممة بمظهر الزجاج شبه الشفاف محليًا."
  },
  "targetCurrencyLabel": {
    "zh": "目标本币币种",
    "zh-TW": "目標本幣幣種",
    "ja": "換算先ターゲット通貨",
    "ko": "대상 로컬 통화",
    "de": "Ziel-Lokalwährung",
    "es": "Moneda local de destino",
    "fr": "Devise locale cible",
    "id": "Target Mata Uang Lokal",
    "it": "Valuta locale di destinazione",
    "pt": "Moeda local de destino",
    "ro": "Moneda locală țintă",
    "vi": "Ngoại tệ đích",
    "ar": "العملة المحلية المستهدفة"
  },
  "customRateLabel": {
    "zh": "自定义汇率 (可选)",
    "zh-TW": "自定義匯率 (可選)",
    "ja": "カスタム為替レート (オプション)",
    "ko": "사용자 정의 환율 (선택 사항)",
    "de": "Benutzerdefinierter Wechselkurs (Optional)",
    "es": "Tipo de cambio personalizado (Opcional)",
    "fr": "Taux de change personnalisé (Optionnel)",
    "id": "Nilai Tukar Kustom (Opsional)",
    "it": "Tasso di cambio personalizzato (Opzionale)",
    "pt": "Taxa de câmbio personalizada (Opcional)",
    "ro": "Curs de schimb personalizat (Opțional)",
    "vi": "Tỷ giá tùy chỉnh (Không bắt buộc)",
    "ar": "سعر صرف مخصص (اختياري)"
  },
  "customRatePlaceholder": {
    "zh": "例如 7.25 (留空则默认使用实时汇率)",
    "zh-TW": "例如 7.25 (留空則默認使用實時匯率)",
    "ja": "例 150.25 (空欄の場合はリアルタイムレートを使用)",
    "ko": "예: 1400.50 (공란인 경우 실시간 환율 사용)",
    "de": "z.B. 1,08 (Leer lassen, um den Live-Kurs zu verwenden)",
    "es": "ej. 1.15 (Dejar en blanco para usar el tipo de cambio en tiempo real)",
    "fr": "ex. 1.08 (Laisser vide pour utiliser le taux en temps réel)",
    "id": "misal 15000 (Biarkan kosong untuk menggunakan kurs waktu nyata)",
    "it": "es. 1.08 (Lascia vuoto per utilizzare il tasso in tempo reale)",
    "pt": "ex. 5.50 (Deixe em branco para usar a taxa em tempo real)",
    "ro": "ex. 4.95 (Lăsați gol pentru a folosi cursul în timp real)",
    "vi": "Ví dụ 25000 (Để trống để dùng tỷ giá thời gian thực)",
    "ar": "مثال: 3.75 (اتركه فارغًا لاستخدام السعر الحالي)"
  },
  "cnyLabel": {
    "zh": "CNY (人民币)",
    "zh-TW": "CNY (人民幣)",
    "ja": "CNY (人民元)",
    "ko": "CNY (중국 위안)",
    "de": "CNY (Chinesischer Yuan)",
    "es": "CNY (Yuan chino)",
    "fr": "CNY (Yuan chinois)",
    "id": "CNY (Yuan Tiongkok)",
    "it": "CNY (Yuan cinese)",
    "pt": "CNY (Yuan chinês)",
    "ro": "CNY (Yuan chinezesc)",
    "vi": "CNY (Nhân dân tệ)",
    "ar": "CNY (اليوان الصيني)"
  },
  "usdLabel": {
    "zh": "USD (美元)",
    "zh-TW": "USD (美元)",
    "ja": "USD (米国ドル)",
    "ko": "USD (미국 달러)",
    "de": "USD (US-Dollar)",
    "es": "USD (Dólar estadounidense)",
    "fr": "USD (Dollar américain)",
    "id": "USD (Dolar AS)",
    "it": "USD (Dollaro statunitense)",
    "pt": "USD (Dólar americano)",
    "ro": "USD (Dolar american)",
    "vi": "USD (Đô la Mỹ)",
    "ar": "USD (الدولار الأمريكي)"
  },
  "eurLabel": {
    "zh": "EUR (欧元)",
    "zh-TW": "EUR (歐元)",
    "ja": "EUR (ユーロ)",
    "ko": "EUR (유로)",
    "de": "EUR (Euro)",
    "es": "EUR (Euro)",
    "fr": "EUR (Euro)",
    "id": "EUR (Euro)",
    "it": "EUR (Euro)",
    "pt": "EUR (Euro)",
    "ro": "EUR (Euro)",
    "vi": "EUR (Euro)",
    "ar": "EUR (اليورو)"
  },
  "jpyLabel": {
    "zh": "JPY (日元)",
    "zh-TW": "JPY (日元)",
    "ja": "JPY (日本円)",
    "ko": "JPY (일본 엔)",
    "de": "JPY (Japanischer Yen)",
    "es": "JPY (Yen japonés)",
    "fr": "JPY (Yen japonais)",
    "id": "JPY (Yen Jepang)",
    "it": "JPY (Yen giapponese)",
    "pt": "JPY (Yen japonês)",
    "ro": "JPY (Yen japonez)",
    "vi": "JPY (Yên Nhật)",
    "ar": "JPY (الين الياباني)"
  }
};

console.log("=== INJECTING GLOBAL INVOICE PARSER TRANSLATIONS ===");

languages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  
  if (!langData.common) langData.common = {};
  if (!langData.common.globalInvoiceParser) langData.common.globalInvoiceParser = {};
  
  let count = 0;
  Object.entries(invoiceDict).forEach(([subKey, translations]) => {
    const val = translations[lang] || translations['en'];
    langData.common.globalInvoiceParser[subKey] = val;
    count++;
  });
  
  fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
  console.log(`Language [${lang}]: Injected ${count} keys for globalInvoiceParser.`);
});

console.log("=== INJECTION COMPLETE ===");
