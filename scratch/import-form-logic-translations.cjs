const fs = require('fs');
const path = require('path');

const MESSAGES_DIR = 'd:\\NextProject\\pdfcraft\\messages';
const languages = ['zh', 'zh-TW', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'it', 'pt', 'ro', 'vi', 'ar'];

const formLogicDict = {
  // common.formLogicDesigner
  "common.formLogicDesigner.triggerLink": {
    "zh": "触发链接", "zh-TW": "觸發連結", "ja": "トリガーリンク", "ko": "트리거 링크", "de": "Auslöser-Link", "es": "Enlace de activación", "fr": "Lien déclencheur", "id": "Tautan Pemicu", "it": "Link di attivazione", "pt": "Link de gatilho", "ro": "Link declanșator", "vi": "Liên kết kích hoạt", "ar": "رابط تفعيل"
  },
  "common.formLogicDesigner.fieldsReady": {
    "zh": "{count} 个交互式表单字段已就绪", "zh-TW": "{count} 個互動式表單欄位已就緒", "ja": "{count} 個のインタラクティブフィールドが準備完了", "ko": "{count}개의 대화형 필드 준비 완료", "de": "{count} interaktive(s) Feld(er) bereit", "es": "{count} campo(s) interactivo(s) listo(s)", "fr": "{count} champ(s) interactif(s) prêt(s)", "id": "{count} bidang interaktif siap", "it": "{count} campo/i interattivo/i pronto/i", "pt": "{count} campo(s) interativo(s) pronto(s)", "ro": "{count} câmp(uri) interactive gata", "vi": "{count} trường tương tác đã sẵn sàng", "ar": "تم تجهيز {count} حقل تفاعلي"
  },
  "common.formLogicDesigner.logicIntroTitle": {
    "zh": "表单逻辑连接设计指南", "zh-TW": "表單邏輯連接設計指南", "ja": "フォーム接続ロジックガイド", "ko": "폼 연결 로직 가이드", "de": "Formular-Verbindungslogik-Leitfaden", "es": "Guía de lógica de conexión de formularios", "fr": "Guide logique de connexion de formulaires", "id": "Panduan Logika Koneksi Formulir", "it": "Guida logica di connessione moduli", "pt": "Guia de lógica de conexão de formulários", "ro": "Ghid de conexiune logică a formularelor", "vi": "Hướng dẫn kết nối logic biểu mẫu", "ar": "دليل منطق ربط النماذج"
  },
  "common.formLogicDesigner.logicIntro1": {
    "zh": "在毛玻璃画布上定位控制节点（如复选框）。", "zh-TW": "在毛玻璃畫布上定位控制節點（如複選框）。", "ja": "グラスモフィズムキャンバス上でコントロールノード（例：チェックボックス）を見つけます。", "ko": "글래스모피즘 캔버스에서 제어 노드(예: 체크박스)를 찾습니다.", "de": "Lokalisieren Sie Steuerungsknoten (z. B. Kontrollkästchen) auf der Milchglas-Leinwand.", "es": "Ubique los nodos de control (p. ej., casilla de verificación) en el lienzo de glassmorphism.", "fr": "Repérez les nœuds de contrôle (ex. case à cocher) sur le canevas effet verre dépoli.", "id": "Temukan simpul kontrol (misal, kotak centang) di kanvas glassmorphism.", "it": "Individua i nodi di controllo (es. casella di controllo) sulla tela in stile glassmorphic.", "pt": "Localize os nós de controle (por exemplo, caixa de seleção) na tela de glassmorphism.", "ro": "Localizați nodurile de control (de exemplu, caseta de bifare) pe macheta transparentă.", "vi": "Xác định các nút điều khiển (ví dụ: hộp kiểm) trên khung hình giả kính.", "ar": "حدد موقع العقد التحكمية (مثل مربع الاختيار) على اللوحة شبه الشفافة."
  },
  "common.formLogicDesigner.logicIntro2": {
    "zh": "从圆点拖动一条连接线到目标依赖字段。", "zh-TW": "從圓點拖動一條連接線到目標依賴欄位。", "ja": "ドットからターゲットの依存フィールドまで接続線をドラッグします。", "ko": "점으로부터 대상 의존 필드까지 연결선을 드래그합니다.", "de": "Ziehen Sie eine Verbindungslinie vom Punkt zum abhängigen Zielfeld.", "es": "Arrastre una línea de conexión desde el punto hasta el campo dependiente de destino.", "fr": "Glissez une ligne de connexion depuis le point vers le champ dépendant cible.", "id": "Seret garis penghubung dari titik ke bidang dependen target.", "it": "Trascina una linea di connessione dal punto al campo dipendente di destinazione.", "pt": "Arraste uma linha de conexão do ponto até o campo dependente de destino.", "ro": "Trageți o linie de conexiune de la punct la câmpul dependent țintă.", "vi": "Kéo một đường kết nối từ dấu chấm đến trường phụ thuộc đích.", "ar": "اسحب خط الاتصال من النقطة إلى الحقل التابع المستهدف."
  },
  "common.formLogicDesigner.logicIntro3": {
    "zh": "对于复选框，这将生成一段处于激活状态的 AcrobatJS 验证脚本。", "zh-TW": "對於複選框，這將生成一段處於激活狀態的 AcrobatJS 驗證腳本。", "ja": "チェックボックスの場合、これにより実行可能なAcrobatJS検証スクリプトが生成されます。", "ko": "체크박스의 경우 활성화된 AcrobatJS 유효성 검사 스크립트가 생성됩니다.", "de": "Für Kontrollkästchen generiert dies ein aktives AcrobatJS-Validierungsskript.", "es": "Para las casillas de verificación, esto genera un script de validación AcrobatJS activo.", "fr": "Pour les cases à cocher, cela génère un script de validation AcrobatJS actif.", "id": "Untuk kotak centang, ini menghasilkan skrip validasi AcrobatJS yang aktif.", "it": "Per le caselle di controllo, questo genera uno script di convalida AcrobatJS attivo.", "pt": "Para caixas de seleção, isso gera um script de validação AcrobatJS ativo.", "ro": "Pentru casetele de bifare, aceasta generează un script de validare AcrobatJS activ.", "vi": "Đối với các hộp kiểm, tính năng này sẽ tạo tập lệnh xác thực AcrobatJS hoạt động.", "ar": "بالنسبة لمربعات الاختيار，يؤدي هذا إلى إنشاء نص برمجيات تحقق AcrobatJS نشط."
  },
  "common.formLogicDesigner.logicIntro4": {
    "zh": "成功连接后，连接线上将产生紫色的脉冲光流。", "zh-TW": "成功連接後，連接線上將產生紫色的脈衝光流。", "ja": "接続が成功すると、接続線上に紫色のパルス光が流れます。", "ko": "성공적으로 연결되면 연결선 위에 보라색 맥박 표시광이 깜빡입니다.", "de": "Nach erfolgreicher Verbindung blinkt ein lila Licht auf der Verbindungslinie.", "es": "Destellos de luz púrpura se propagan por la línea una vez vinculada con éxito.", "fr": "Des impulsions lumineuses violettes s'affichent sur la ligne une fois connectée avec succès.", "id": "Denyut cahaya ungu pada garis penghubung setelah berhasil ditautkan.", "it": "Impulsi luminosi viola scorrono sulla linea di connessione una volta collegata.", "pt": "Pulsos de luz roxa piscam na linha de conexão uma vez vinculada com sucesso.", "ro": "Impulsuri de lumină violetă vor pulsa pe linia de conexiune după ce a fost legată cu succes.", "vi": "Tia sáng tím sẽ chạy dọc đường kết nối sau khi liên kết thành công.", "ar": "تنبض أضواء بنفسجية على خط الاتصال بمجرد نجاح الربط."
  },

  // tools.formLogicDesigner
  "tools.formLogicDesigner.uploadLabel": {
    "zh": "上传交互式 PDF 表单", "zh-TW": "上傳互動式 PDF 表單", "ja": "インタラクティブPDFフォームをアップロード", "ko": "대화형 PDF 양식 업로드", "de": "Interaktives PDF-Formular hochladen", "es": "Subir formulario PDF interactivo", "fr": "Téléverser le formulaire PDF interactif", "id": "Unggah Formulir PDF Interaktif", "it": "Carica modulo PDF interattivo", "pt": "Carregar formulário PDF interativo", "ro": "Încărcați formularul PDF interactiv", "vi": "Tải lên biểu mẫu PDF tương tác", "ar": "تحميل نموذج PDF تفاعلي"
  },
  "tools.formLogicDesigner.uploadDescription": {
    "zh": "拖放含有 AcroForm 表单的 PDF，在这里设计表单字段的条件依赖逻辑。", "zh-TW": "拖放含有 AcroForm 表單的 PDF，在這裡設計表單欄位的條件依賴邏輯。", "ja": "AcroFormフォームを含むPDFをドラッグ＆ドロップして、フィールドの依存ロジックを設計します。", "ko": "AcroForm이 포함된 PDF를 드래그 앤 드롭하여 필드 종속성 규칙을 설계하십시오.", "de": "Ziehen Sie eine PDF-Datei mit AcroForm hierher, um Feldabhängigkeitsregeln zu entwerfen.", "es": "Arrastre y suelte un PDF con AcroForm aquí para diseñar reglas de dependencia de campos.", "fr": "Glissez-deposez un PDF avec AcroForm ici pour concevoir les règles de dépendance des champs.", "id": "Seret dan letakkan PDF AcroForm di sini untuk merancang aturan dependen bidang.", "it": "Trascina e rilascia un PDF AcroForm qui per progettare regole di dipendenza dei campi.", "pt": "Arraste e solte um PDF AcroForm aqui para projetar regras de dependência de campos.", "ro": "Trageți și plasați un PDF AcroForm aici pentru a crea reguli de dependență a câmpurilor.", "vi": "Kéo thả PDF AcroForm vào đây để thiết lập các quy tắc phụ thuộc giữa các trường.", "ar": "قم بسحب وإسقاط نموذج AcroForm PDF هنا لتصميم قواعد تبعية الحقول."
  },
  "tools.formLogicDesigner.optionsTitle": {
    "zh": "表单逻辑配置", "zh-TW": "表單邏輯配置", "ja": "フォームロジック設定", "ko": "폼 로직 구성", "de": "Formularlogik-Konfiguration", "es": "Configuración de lógica de formulario", "fr": "Configuration logique du formulaire", "id": "Konfigurasi Logika Formulir", "it": "Configurazione logica del modulo", "pt": "Configuração lógica do formulário", "ro": "Configurația logicii formularului", "vi": "Cấu hình logic biểu mẫu", "ar": "تكوين منطق النموذج"
  },
  "tools.formLogicDesigner.processButton": {
    "zh": "注入逻辑并保存", "zh-TW": "注入邏輯並保存", "ja": "ロジックを注入して保存", "ko": "로직 주입 및 저장", "de": "Logik injizieren & speichern", "es": "Inyectar lógica y guardar", "fr": "Injecter la logique et enregistrer", "id": "Injeksi Logika & Simpan", "it": "Inietta logica e salva", "pt": "Injetar lógica e salvar", "ro": "Injectați logica și salvați", "vi": "Nhúng logic & Lưu", "ar": "حقن المنطق وحفظه"
  },
  "tools.formLogicDesigner.successMessage": {
    "zh": "AcroJS 逻辑注入成功！已生成智能联动表单。", "zh-TW": "AcroJS 邏輯注入成功！已生成智能連動表單。", "ja": "AcroJSロジックの注入に成功しました！スマートフォームが生成されました。", "ko": "AcroJS 로직 주입 성공! 스마트 폼이 생성되었습니다.", "de": "AcroJS-Logik erfolgreich injiziert! Intelligentes Formular erstellt.", "es": "¡Lógica AcroJS inyectada con éxito! Formulario inteligente generado.", "fr": "Logique AcroJS injectée avec succès ! Formulaire intelligent généré.", "id": "Logika AcroJS berhasil diinjeksi! Formulir pintar dibuat.", "it": "Logica AcroJS iniettata con successo! Modulo intelligente generato.", "pt": "Lógica AcroJS injetada com sucesso! Formulário inteligente gerado.", "ro": "Logica AcroJS a fost injectată cu succes! S-a generat formularul inteligent.", "vi": "Nhúng logic AcroJS thành công! Đã tạo biểu mẫu thông minh.", "ar": "تم حقن منطق AcroJS بنجاح! تم إنشاء نموذج ذكي."
  },
  "tools.formLogicDesigner.canvasTitle": {
    "zh": "毛玻璃节点逻辑设计器", "zh-TW": "毛玻璃節點邏輯設計器", "ja": "グラスモフィズムノードロジックデザイナー", "ko": "글래스모피즘 노드 로직 디자이너", "de": "Milchglas-Knotenlogik-Designer", "es": "Diseñador lógico de nodos de glassmorphism", "fr": "Concepteur logique de nœuds effet verre dépoli", "id": "Desainer Logika Simpul Glassmorphism", "it": "Progettista logico dei nodi in stile glassmorphic", "pt": "Designer lógico de nós de glassmorphism", "ro": "Designer de noduri logice transparente", "vi": "Trình thiết kế logic nút giả kính", "ar": "مصمم منطق عقد شبه شفاف"
  },
  "tools.formLogicDesigner.compileError": {
    "zh": "未能编译 AcroJS 逻辑，请检查连接流节点。", "zh-TW": "未能編譯 AcroJS 邏輯，請檢查連接流節點。", "ja": "AcroJSロジックのコンパイルに失敗しました。接続されたフローを確認してください。", "ko": "AcroJS 로직 컴파일 실패. 연결 흐름 노드를 검사하십시오.", "de": "AcroJS-Logik konnte nicht kompiliert werden. Bitte prüfen Sie den verbundenen Ablauf.", "es": "Error al compilar la lógica AcroJS. Revise el flujo conectado.", "fr": "Échec de compilation de la logique AcroJS. Veuillez inspecter les nœuds reliés.", "id": "Gagal mengompilasi logika AcroJS. Silakan periksa simpul alur yang terhubung.", "it": "Impossibile compilare la logica AcroJS. Si prega di controllare il flusso connesso.", "pt": "Falha ao compilar a lógica AcroJS. Verifique o fluxo conectado.", "ro": "Nu s-a putut compila logica AcroJS. Vă rugăm să verificați fluxul conectat.", "vi": "Biên dịch logic AcroJS thất bại. Hãy kiểm tra các nút kết nối dòng chảy.", "ar": "فشل تجميع منطق AcroJS. يرجى فحص تدفق العقد المتصلة."
  }
};

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

console.log("=== INJECTING FORM LOGIC DESIGNER TRANSLATIONS ===");

languages.forEach(lang => {
  const langPath = path.join(MESSAGES_DIR, `${lang}.json`);
  if (!fs.existsSync(langPath)) return;
  
  const langData = JSON.parse(fs.readFileSync(langPath, 'utf8'));
  let updatedCount = 0;
  
  Object.entries(formLogicDict).forEach(([keyPath, translations]) => {
    const val = translations[lang] || translations['en'];
    setDeepValue(langData, keyPath, val);
    updatedCount++;
  });
  
  fs.writeFileSync(langPath, JSON.stringify(langData, null, 2), 'utf8');
  console.log(`Language [${lang}]: Injected ${updatedCount} keys for FormLogicDesigner.`);
});

console.log("=== INJECTION COMPLETE ===");
