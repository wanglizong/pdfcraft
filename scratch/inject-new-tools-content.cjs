const fs = require('fs');
const path = require('path');

const TOOL_CONTENT_DIR = 'd:\\NextProject\\pdfcraft\\src\\config\\tool-content';

const translations = {
  'zh-TW': {
    'form-logic-designer': {
      title: '可編程PDF表單邏輯設計艙',
      metaDescription: '使用毛玻璃節點圖連線設計交互邏輯，向PDF表單注入可編程聯動 JavaScript 腳本。',
      keywords: ['PDF表單邏輯', 'AcroJS注入', '節點連線', '交互式PDF', '表單連動'],
      description: `
        <p>可編程PDF表單邏輯設計艙是填補PDF高級交互空白的革新性工具。傳統的PDF表單都是死板的靜態欄位，而本工具能讓您的PDF表單像現代Web應用一樣具備動態交互邏輯。</p>
        <p>通過基於 React Flow 構建的“毛玻璃發光節點”視覺化畫布，您的PDF表單欄位會變成可交互的邏輯節點。您可以通過拖拽連線，為它們定義各種觸發條件與行為動作（如：當複選框被勾選 ➜ 啟用原本禁用的輸入框 ➜ 自動計算總價並填充）。</p>
        <p>設計完畢後，底層的 AcroJS 腳本注入引擎會將邏輯完全編譯為標準的 Acrobat JavaScript 並埋入 PDF 的交互表單字典 '/AA' 中，使該文檔在任意標準 PDF 閱讀器中均能生效。</p>
      `,
      howToUse: [
        { step: 1, title: '上傳交互式PDF表單', description: '上傳已包含交互表單欄位（AcroForm）的PDF文件。' },
        { step: 2, title: '在畫布設計邏輯連線', description: '各個欄位自動呈現為節點，從源欄位事件（如改變、失去焦點）拉出連線，指向目標欄位的動作（如隱藏、禁用、設值）。' },
        { step: 3, title: '編譯注入並下載', description: '點擊編譯，系統生成 JavaScript 腳本並注入 PDF 字典，輸出具備高交互性的智能PDF。' }
      ],
      useCases: [
        { title: '智能商業合約樣本', description: '根據用戶勾選的條款，動態顯示或隱藏附加補充協議輸入框，保持介面清爽。', icon: 'file-signature' },
        { title: '動態財務報銷單', description: '多行報銷金額自動求和，並根據填寫的稅率自動計算最終扣稅，完全零手動輸入。', icon: 'calculator' },
        { title: '交互式問卷調研表', description: '利用條件跳轉邏輯，跳過不適用的問題，提升用戶在移動端填寫表單的體驗。', icon: 'form-input' }
      ],
      faq: [
        { question: '這需要我的 PDF 預先有表單欄位嗎？', answer: '是的。該工具用於為已有的 PDF 表單欄位添加高級邏輯。如果您沒有表單欄位，可以先使用我們的表單創建工具添加輸入框和複選框。' },
        { question: '生成的交互邏輯在所有 PDF 閱讀器上都能運行嗎？', answer: '只要閱讀器遵循 Adobe PDF 標準並支持 Acrobat JavaScript（如 Adobe Reader, Foxit Reader, Chrome/Edge 瀏覽器內置閱讀器等），聯動邏輯均能完美執行。部分精簡版移動端閱讀器可能支持有限。' },
        { question: '會影響 PDF 的正常打印嗎？', answer: '完全不會。注入的腳本只在屏幕交互時運行，打印時會根據當前的表單內容靜態度量打印，不包含任何連線痕迹。' }
      ]
    },
    'global-invoice-parser': {
      title: '全球發票版式智能翻譯與多幣種匯率折算艙',
      metaDescription: '智能識別多國發票，原地翻譯表格條目，按實時國際匯率覆蓋高端三維立體折算帳本。',
      keywords: ['發票翻譯', '發票匯率折算', '外幣帳單換算', '發票原地替換', '多幣種發票'],
      description: `
        <p>全球發票版式智能翻譯與多幣種匯率折算艙是跨國財務人員與海淘用戶的“掌控感福音”。</p>
        <p>拿到美元、歐元、日圓等外幣發票時，繁雜的匯率計算和語種障礙令人頭疼。本工具不僅實現了 <strong>發票表格條目的原地翻譯</strong>，更接入了實時國際匯率機制。</p>
        <p>自動在發票右下角或頁腳留白位置，物理覆蓋印蓋一個 HSL 毛玻璃效果、印有三維貨幣符號發光的“Exchange Rate ledger”匯率折算帳本，並伴隨老虎機滾輪數字翻轉的震撼特效。不破壞原有發票排版格式，清晰呈現本幣合計及匯率，財務掌控感滿分。</p>
      `,
      howToUse: [
        { step: 1, title: '上傳外幣發票PDF', description: '拖入一張包含美元 ($), 歐元 (€) 或日圓 (¥) 的 PDF 發票或帳單。' },
        { step: 2, title: '設定本幣與匯率', description: '選擇您希望折算的目标本幣（如 CNY），可手動填入自定義匯率或使用實時匯率。' },
        { step: 3, title: '生成折算帳本', description: '點擊折算，發票總額旁邊被優雅 stamped 本地匯率帳本並開放下載。' }
      ],
      useCases: [
        { title: '跨國差旅費報銷', description: '員工海外出差的發票（如美元計價），一鍵折算為人民幣總額，並物理印蓋匯率快照，方便財務極速報銷。', icon: 'plane' },
        { title: '跨境海淘對帳結算', description: '將海淘帳單上的歐元/日圓原地折算，一眼看清真實的本地貨幣支出。', icon: 'credit-card' },
        { title: '外貿企業發票建檔', description: '為日常繁雜的外幣結算單加蓋本幣標記及核算快照，統一財務歸檔度量衡。', icon: 'folder-open' }
      ],
      faq: [
        { question: '它是如何自動獲取發票金額的？', answer: '系統後台利用 PDFJS 文本字元流分析，通過金錢正則匹配帶有 `$`、`€`、`£` 等符號的數字。同時分析 `Total` 等關鍵詞以鎖定真實的發票最終金額。' },
        { question: '匯率是實時的嗎？', answer: '是的。默認情況下，系統會基於國際匯率接口自動拉取當天的基準匯率。當然，您也可以完全自由地手動填入公司財務統一要求的內部結算匯率。' },
        { question: '蓋印的“轉換帳本”會遮擋原發票的關鍵信息嗎？', answer: '系統會智能探測發票底部的空白位置進行蓋印。同時，該帳本背景具有高品質半透明毛玻璃特效，能夠以優雅、不破壞原文檔格式的形態貼在頁面上。' }
      ]
    }
  },
  'ja': {
    'form-logic-designer': {
      title: 'インタラクティブPDFフォームロジックデザイナー',
      metaDescription: 'グラスモフィズムノードキャンバスを使用して連動インタラクティブロジックを設計し、AcroJSスクリプトをPDFフォームに埋め込みます。',
      keywords: ['PDFフォームロジック', 'AcroJS埋め込み', 'ノードフロー', 'インタラクティブPDF', 'フィールド依存関係'],
      description: `
        <p>インタラクティブPDFフォームロジックデザイナーは、フラットで静的なフォームの代わりに、アクティブで応答性の高いフィールドを作成するという、PDF機能の大きなギャップを埋める革新的なツールです。</p>
        <p>React Flowをベースにした「グラスモフィズム発光ノード」ビジュアルキャンバスを通じて、フォームフィールドを論理ノードとして表現します。ドラッグ＆ドロップで接続線を引くだけで、トリガー条件とアクション（例：チェックボックスがオンになったら ➜ テキスト入力を有効にする ➜ 自動的に計算して合計フィールドを更新する）を簡単に定義できます。</p>
        <p>設計完了後、バックエンドのAcroJSエンジンがロジックを標準のAcrobat JavaScriptにコンパイルし、PDFのインタラクティブフォーム辞書である「/AA」（Additional Actions）に注入します。これにより、すべての標準的なPDFリーダーで動的な連動ロジックがネイティブに動作します。</p>
      `,
      howToUse: [
        { step: 1, title: 'インタラクティブPDFをアップロード', description: 'すでに入力フィールド（AcroForm）が含まれているPDFファイルをアップロードします。' },
        { step: 2, title: 'キャンバス上でロジックを設計', description: 'フィールドをノードとして接続します。トリガーイベント（値の変更、フォーカス喪失など）を対象フィールドのアクション（表示、非表示、計算、無効化など）にリンクします。' },
        { step: 3, title: 'コンパイルしてダウンロード', description: 'コンパイルされたJavaScriptロジックをPDFに埋め込み、高機能なインテリジェントPDFを保存します。' }
      ],
      useCases: [
        { title: 'スマートビジネス契約書', description: '顧客が選択した規約に基づいて、関連する入力フィールドを動的に表示または非表示にし、インターフェースをシンプルに保ちます。', icon: 'file-signature' },
        { title: '経費自動計算フォーム', description: '複数の経費明細を自動的に集計し、手動で計算することなく適用税率に基づいて最終税額を動的に算出します。', icon: 'calculator' },
        { title: 'インタラクティブなアンケート', description: '以前の回答に基づいて不要な質問をスキップし、モバイルデバイスでの入力体験を向上させます。', icon: 'form-input' }
      ],
      faq: [
        { question: '事前にフォームフィールドが含まれているPDFが必要ですか？', answer: 'はい。このツールは、既存のフォームフィールドに論理ルールをバインドするために使用されます。PDFにフォームフィールドがない場合は、先に「フォーム作成」ツールを使用して入力ボックスやチェックボックスを追加してください。' },
        { question: 'このロジックはすべてのPDFリーダーで動作しますか？', answer: 'Adobe PDF標準に準拠し、Acrobat JavaScriptをサポートするすべてのPDFリーダー（Adobe Acrobat Reader、Foxit Reader、主要ブラウザの組み込みリーダーなど）で動作します。一部の軽量なモバイル用リーダーでは、動作が制限される場合があります。' },
        { question: '印刷結果に影響はありますか？', answer: 'いいえ、まったく影響ありません。埋め込まれたスクリプトは画面での入力時にのみ実行されます。印刷時は現在の入力状態が静的に印刷され、接続線などのノード図は表示されません。' }
      ]
    },
    'global-invoice-parser': {
      title: 'グローバル請求書翻訳＆為替自動計算ツール',
      metaDescription: '多国籍の請求書から通貨の合計金額を自動的に抽出し、リアルタイムの為替レートを適用して美しいグラスモフィズム風の計算帳簿をスタンプします。',
      keywords: ['請求書翻訳', '請求書為替換算', '外貨請求書計算', '請求書スタンプ', 'グローバル請求書'],
      description: `
        <p>グローバル請求書翻訳＆為替自動計算ツールは、多国籍企業や海外取引を行うバイヤーに極めて明快な会計処理をもたらします。</p>
        <p>複数通貨（ドル、ユーロ、円など）の請求書処理は、手動での為替計算などの面倒な作業を伴うことがよくあります。このツールを使用すれば、<strong>請求書項目のインプレース翻訳とリアルタイムの為替換算</strong>を簡単に実行できます。</p>
        <p>請求書の金額を自動分析し、リアルタイムレートに基づいて現地通貨へ換算します。そして、元のレイアウトを壊すことなく、ページの余白に美しい半透明のグラスモフィズム風「Exchange Rate ledger」スタンプを物理的に押印します。スロットマシンのような数値ロール効果により、グローバルな財務管理が楽しくスマートに行えます。</p>
      `,
      howToUse: [
        { step: 1, title: '外貨請求書PDFをアップロード', description: '米ドル（$）、ユーロ（€）、日本円（¥）などの外貨で請求されたPDFの請求書や伝票をインポートします。' },
        { step: 2, title: '換算先通貨を設定', description: '換算先の現地本国通貨（例：日本円）を選択し、カスタムレートまたはリアルタイムレートを指定します。' },
        { step: 3, title: '為替帳簿スタンプを押印', description: '「実行」をクリックすると、帳簿用に美しく装飾された為替換算結果のスタンプが重ねて押印され、ダウンロードが可能になります。' }
      ],
      useCases: [
        { title: '海外出張費用の精算', description: '海外での移動や宿泊にかかった外貨建ての領収書を現地通貨に一括換算し、為替レートの証跡をスタンプすることで、経費精算の手間を劇的に削減します。', icon: 'plane' },
        { title: '越境EC購入の照合決済', description: '海外ECサイトからの購入明細に記載された外貨をインプレースで翻訳・換算し、実際に支払う現地通貨建ての費用を一目で確認できます。', icon: 'credit-card' },
        { title: '貿易・海外取引伝票の管理', description: '日常的に発生する煩雑な多通貨決済書に換算マークを押印し、企業内の会計ドキュメントの規格を統一します。', icon: 'folder-open' }
      ],
      faq: [
        { question: '請求書の金額はどのように自動検出されますか？', answer: 'テキストストリームをスキャンして通貨記号と金額を抽出し、「Total（合計）」や「Due（お支払期限）」といったセマンティックな見出しを分析して、最終的な支払総額を特定します。' },
        { question: '為替レートはリアルタイムで取得されますか？', answer: 'はい。デフォルトでは、信頼性の高い国際為替APIを介してリアルタイムの基準レートを取得します。もちろん、社内監査ルールなどに合わせて手動で固定レートを入力することも可能です。' },
        { question: 'スタンプは元の請求書の重要な文字を覆ってしまいますか？', answer: 'レイアウトを自動検出して、ページの余白や最下部の最適な位置に押印します。また、スタンプの背景は高品質な半透明の毛ガラス風エフェクトであるため、文字が重なっても判読可能です。' }
      ]
    }
  },
  'ko': {
    'form-logic-designer': {
      title: '프로그래밍 가능 PDF 양식 로직 디자이너',
      metaDescription: '글래스모피즘 노드 캔버스를 사용하여 대화형 로직을 설계하고 Acrobat JavaScript 코드를 PDF 양식에 주입합니다.',
      keywords: ['PDF 양식 로직', 'AcroJS 주입', '노드 플로우', '대화형 PDF', '필드 종속성'],
      description: `
        <p>프로그래밍 가능 PDF 양식 로직 디자이너는 기존의 정적인 양식 대신 활성화된 동적 필드를 생성하여 PDF 기능의 큰 공백을 메우는 혁신적인 도구입니다.</p>
        <p>React Flow를 기반으로 구축된 "글래스모피즘 발광 노드" 비주얼 캔버스를 통해 PDF 양식 필드가 대화형 노드로 변환됩니다. 드래그 앤 드롭으로 선을 연결하여 트리거 조건과 동작(예: 체크박스가 선택되면 ➜ 비활성화된 입력 상자 활성화 ➜ 총 금액 자동 계산 및 입력)을 정의할 수 있습니다.</p>
        <p>설계가 완료되면 AcroJS 엔진이 로직을 표준 Acrobat JavaScript로 컴파일하여 PDF의 대화형 양식 사전인 '/AA'에 주입합니다. 이에 따라 모든 표준 PDF 뷰어에서 연동 로직이 기본적으로 실행됩니다.</p>
      `,
      howToUse: [
        { step: 1, title: '대화형 PDF 업로드', description: '대화형 양식 필드(AcroForm)가 이미 포함된 PDF 파일을 업로드합니다.' },
        { step: 2, title: '캔버스에서 로직 설계', description: '각 필드를 노드로 연결합니다. 소스 필드 이벤트(값 변경, 포커스 아웃 등)를 대상 필드의 동작(숨기기, 비활성화, 값 설정 등)에 연결합니다.' },
        { step: 3, title: '주입 및 다운로드', description: '컴파일된 JavaScript 로직을 PDF 사전에 주입하고 대화형 스마트 PDF를 다운로드합니다.' }
      ],
      useCases: [
        { title: '스마트 상업 계약서', description: '사용자가 선택한 약관에 따라 추가 서명란이나 계약 입력 상자를 동적으로 표시하거나 숨겨 레이아웃을 깔끔하게 유지합니다.', icon: 'file-signature' },
        { title: '동적 지출 결의서', description: '여러 항목의 청구 금액을 자동으로 합산하고 입력된 세율에 따라 최종 세금을 자동으로 계산하여 수동 입력을 방지합니다.', icon: 'calculator' },
        { title: '대화형 설문지', description: '조건부 분기 로직을 통해 해당되지 않는 질문을 건너뛰어 모바일 기기에서의 응답 입력 환경을 개선합니다.', icon: 'form-input' }
      ],
      faq: [
        { question: 'PDF 파일에 양식 필드가 미리 설정되어 있어야 하나요?', answer: '네, 그렇습니다. 이 도구는 기존 양식 필드에 고급 로직을 연결하도록 설계되었습니다. 양식 필드가 없는 경우 먼저 "양식 작성" 도구를 사용하여 입력란이나 체크박스를 생성해 주십시오.' },
        { question: '이 연동 로직이 모든 PDF 뷰어에서 실행되나요?', answer: 'Adobe PDF 표준을 준수하고 Acrobat JavaScript를 지원하는 뷰어(예: Adobe Acrobat Reader, Foxit Reader, Chrome/Edge 브라우저 내장 리더 등)라면 모두 실행됩니다. 모바일 기기의 일부 경량 뷰어에서는 지원이 제한될 수 있습니다.' },
        { question: 'PDF 인쇄에 영향을 미치나요?', answer: '전혀 영향을 주지 않습니다. 주입된 스크립트는 화면상에서 상호작용할 때만 작동합니다. 인쇄 시에는 현재 입력된 폼 값 상태 그대로 인쇄되며 로직 노드 연동선 등은 인쇄되지 않습니다.' }
      ]
    },
    'global-invoice-parser': {
      title: '글로벌 송장 번역 및 환율 환산 도구',
      metaDescription: '다국적 송장에서 통화 총액을 자동으로 추출하고 실시간 환율을 적용하여 글래스모피즘 스타일의 환율 대장을 스탬프합니다.',
      keywords: ['송장 번역', '송장 환율 환산', '외화 청구서 계산', '송장 스탬프', '글로벌 송장 도구'],
      description: `
        <p>글로벌 송장 번역 및 환율 환산 도구는 다국적 기업이나 해외 구매를 관리하는 사용자에게 매우 명확한 정산 처리를 제공합니다.</p>
        <p>여러 통화(달러, 유로, 엔 등)가 섞인 송장 처리는 수동 환산 작업으로 인해 번거롭기 마련입니다. 이 도구를 사용하면 <strong>송장 텍스트 필드의 인플레이스 번역과 실시간 환율 변환</strong>을 쉽게 결합하여 처리할 수 있습니다.</p>
        <p>송장 내 청구 금액을 자동으로 분석하고 실시간 기준 환율에 따라 현지 통화로 계산합니다. 그런 다음, 기존 문서 배치를 보존하면서 페이지 여백에 아름다운 반투명 글래스모피즘 스타일의 "Exchange Rate ledger" 스탬프를 찍어줍니다. 회전식 숫자 다이얼 시각 효과와 함께 본국 통화 기준 비용을 명확하게 파악할 수 있습니다.</p>
      `,
      howToUse: [
        { step: 1, title: '외화 송장 PDF 업로드', description: '외화(예: USD, EUR, JPY)로 청구된 PDF 송장 또는 청구서 파일을 업로드합니다.' },
        { step: 2, title: '로컬 통화 및 환율 설정', description: '환산하고자 하는 대상 통화(예: KRW)를 선택하고 고정 환율 또는 실시간 기준 환율을 지정합니다.' },
        { step: 3, title: '변환 스탬프 찍기 및 다운로드', description: '변환을 실행하여 환율 계산 결과가 인쇄된 고급 환율 대장 스탬프를 PDF에 Overlay하고 문서를 다운로드합니다.' }
      ],
      useCases: [
        { title: '해외 출장 경비 청구', description: '외화로 지급한 영수증이나 인보이스를 한 번에 원화 금액으로 변환하고 환율 스냅샷 도장을 찍어 재무 부서의 확인 및 정산 속도를 높입니다.', icon: 'plane' },
        { title: '해외 직구 거래 내역 대조', description: '직구 청구서의 유로/엔화 등을 원화로 변환해 표시하여 실제 현지 통화로 발생한 카드 결제액을 즉시 대조합니다.', icon: 'credit-card' },
        { title: '무역 송장 통합 관리', description: '다양한 외화 결제 문서에 자국 통화 환산 스탬프를 일괄 삽입하여 기업 아카이빙 문서의 기준 규격을 통일합니다.', icon: 'folder-open' }
      ],
      faq: [
        { question: '송장 금액을 어떻게 자동으로 감지하나요?', answer: 'PDF 문자 스트림을 검색하여 통화 기호가 붙은 숫자를 파악하고 "Total"이나 "Amount Due" 같은 문맥적 헤더 키워드를 대조하여 최종 결제액 위치를 찾아냅니다.' },
        { question: '환율 정보는 실시간으로 조회되나요?', answer: '네, 그렇습니다. 기본적으로 신뢰할 수 있는 글로벌 금융 환율 API에서 금일 고시 환율을 불러옵니다. 기업 내 회계 기준 환율이 있는 경우 수동으로 조정하여 직접 기입할 수도 있습니다.' },
        { question: '찍힌 도장이 송장의 글자를 가리지 않나요?', answer: '이 엔진은 페이지 여백 및 하단의 여유 영역을 지능적으로 감지해 도장을 찍습니다. 도장 자체도 투명도가 적용된 반투명 아크릴 느낌이므로 글자가 겹쳐도 알아볼 수 있습니다.' }
      ]
    }
  },
  'es': {
    'form-logic-designer': {
      title: 'Diseñador de Lógica de Formularios Interactivos',
      metaDescription: 'Diseñe comportamientos dinámicos mediante un lienzo de nodos de glassmorphism e inyecte lógica interactiva AcroJS en formularios PDF.',
      keywords: ['lógica de formulario PDF', 'inyección AcroJS', 'flujo de nodos', 'PDF interactivo', 'dependencias de campos'],
      description: `
        <p>El Diseñador de Lógica de Formularios Interactivos es una herramienta pionera que llena un gran vacío en las capacidades de PDF: la creación de campos activos y adaptables en lugar de formularios planos y estáticos.</p>
        <p>A través de nuestro lienzo visual con "nodos de glassmorphism brillantes" (basado en React Flow), los campos del formulario se representan como módulos conectados. Puede arrastrar enlaces para definir relaciones: por ejemplo, cuando se marca una casilla de verificación ➜ habilitar una entrada de texto ➜ autocalcular valores y actualizar un campo total.</p>
        <p>Una vez diseñado, el motor AcroJS compila la lógica en Acrobat JavaScript oficial y la inyecta en los diccionarios '/AA' (Acciones Adicionales) del AcroForm. Los comportamientos interactivos se ejecutan de forma nativa en cualquier lector de PDF estándar.</p>
      `,
      howToUse: [
        { step: 1, title: 'Subir PDF Interactivo', description: 'Proporcione un archivo PDF que ya contenga campos de formulario activos (AcroForm).' },
        { step: 2, title: 'Diseñar la Lógica en el Lienzo', description: 'Conecte los campos como nodos. Vincule eventos de salida (cambio, pérdida de foco) con acciones de destino (mostrar, ocultar, calcular, deshabilitar).' },
        { step: 3, title: 'Compilar e Inyectar', description: 'Inyecte la lógica JavaScript compilada en el diccionario PDF y guarde el documento inteligente final.' }
      ],
      useCases: [
        { title: 'Contratos Comerciales Inteligentes', description: 'Muestre u oculte campos de entrada complementarios dinámicamente según los términos seleccionados por el cliente.', icon: 'file-signature' },
        { title: 'Formularios de Gastos Automatizados', description: 'Sume múltiples líneas de gastos y calcule impuestos dinámicamente sin cálculos manuales.', icon: 'calculator' },
        { title: 'Cuestionarios Interactivos', description: 'Omita preguntas irrelevantes según las respuestas anteriores, proporcionando una experiencia de llenado móvil más limpia.', icon: 'form-input' }
      ],
      faq: [
        { question: '¿Necesito un PDF con campos preexistentes?', answer: 'Sí. Esta herramienta está diseñada para vincular reglas lógicas a campos existentes. Si su PDF no tiene campos interactivos, use primero nuestra herramienta Creador de Formularios para agregar entradas y casillas de verificación.' },
        { question: '¿Funcionará esta lógica en cualquier lector de PDF?', answer: 'Funciona en todos los lectores de PDF que cumplan con los estándares de Adobe PDF y admitan Acrobat JavaScript (como Adobe Acrobat Reader, Foxit Reader y los principales navegadores web). Los lectores móviles minimalistas pueden admitir solo acciones básicas.' },
        { question: '¿Afecta esto a la impresión física?', answer: 'En absoluto. Los scripts inyectados solo se ejecutan en pantalla durante el llenado del formulario. Al imprimir, el estado actual de los campos se imprime de forma estática sin visualización de nodos.' }
      ]
    },
    'global-invoice-parser': {
      title: 'Traductor de Facturas Globales y Calculador de Cambio',
      metaDescription: 'Extraiga totales de divisas de facturas multinacionales, realice cálculos e imprima registros de cambio interactivos con efecto de vidrio esmerilado.',
      keywords: ['traducir factura', 'conversor de divisas de factura', 'calculadora de tipo de cambio pdf', 'sellar moneda local', 'herramienta de factura global'],
      description: `
        <p>El Traductor de Facturas Globales brinda máxima claridad a los equipos financieros internacionales y compradores globales.</p>
        <p>El manejo de facturas en múltiples divisas ($, €, ¥) a menudo implica tediosa aritmética manual. Esta herramienta permite la <strong>traducción de etiquetas en el lugar y la conversión de tipos de cambio en tiempo real</strong>.</p>
        <p>Escanea el documento en busca de totales de precios, realiza cálculos basados en referencias de divisas e imprime físicamente un elegante registro de tipo de cambio de vidrio esmerilado semitransparente en el margen de la página. Se representa con un magnífico efecto visual numérico de máquina tragamonedas, aportando un control absoluto a la facturación global.</p>
      `,
      howToUse: [
        { step: 1, title: 'Subir Factura en PDF', description: 'Importe cualquier factura facturada en moneda extranjera (por ejemplo, USD, EUR, JPY).' },
        { step: 2, title: 'Seleccionar Moneda Local', description: 'Elija su moneda local (por ejemplo, CNY) y especifique un tipo de cambio personalizado o en tiempo real.' },
        { step: 3, title: 'Aplicar Sello de Registro', description: 'Haga clic en ejecutar para superponer el registro de tipo de cambio listo para la contabilidad.' }
      ],
      useCases: [
        { title: 'Reembolso de Viajes de Negocios', description: 'Convierta facturas de viajes a la moneda local y selle los detalles de conversión, facilitando los flujos de trabajo contables.', icon: 'plane' },
        { title: 'Auditoría de Compras Transfronterizas', description: 'Traduzca columnas de facturas e identifique el costo real de los bienes de comercio electrónico.', icon: 'credit-card' },
        { title: 'Contabilidad Comercial Internacional', description: 'Selle registros de conversión consistentes en facturas corporativas para optimizar las auditorías de fin de año.', icon: 'folder-open' }
      ],
      faq: [
        { question: '¿Cómo detecta los importes de las facturas?', answer: 'Busca flujos de caracteres en busca de símbolos de divisas y analiza encabezados semánticos como "Total" o "Vencimiento" para ubicar la suma final de la factura.' },
        { question: '¿Los tipos de cambio se obtienen en tiempo real?', answer: 'Sí. Por defecto, recupera tipos de cambio base de APIs financieras estándar. También puede especificar tipos de cambio personalizados para auditorías internas.' },
        { question: '¿El sello cubrirá detalles importantes de la factura?', answer: 'El motor escanea el margen de la página para encontrar el posicionamiento óptimo. El sello es semitransparente, alineándose de manera elegante con sus diseños.' }
      ]
    }
  },
  'fr': {
    'form-logic-designer': {
      title: 'Concepteur Logique de Formulaire Interactif',
      metaDescription: 'Concevez des comportements dynamiques à l\'aide d\'un canevas de nœuds effet verre dépoli et injectez de la logique interactive AcroJS dans les formulaires PDF.',
      keywords: ['logique de formulaire PDF', 'injection AcroJS', 'flux de nœuds', 'PDF interactif', 'dépendances de champs'],
      description: `
        <p>Le Concepteur Logique de Formulaire Interactif est un outil pionnier qui comble un manque majeur dans les fonctionnalités PDF : la création de champs actifs et réactifs au lieu de formulaires plats et statiques.</p>
        <p>Grâce à notre canevas visuel doté de "nœuds effet verre dépoli lumineux" (basé sur React Flow), les champs de formulaire sont représentés comme des modules connectés. Vous pouvez faire glisser des liens pour définir des relations : ex., lorsqu\'une case est cochée ➜ activer une saisie de texte ➜ calculer automatiquement les valeurs et mettre à jour un champ total.</p>
        <p>Une fois conçu, le moteur AcroJS compile la logique en Acrobat JavaScript officiel et l\'injecte dans les dictionnaires \'/AA\' (Actions Additionnelles) de l\'AcroForm. Les comportements interactifs s\'exécutent nativement dans tout lecteur PDF standard.</p>
      `,
      howToUse: [
        { step: 1, title: 'Téléverser un PDF Interactif', description: 'Fournissez un fichier PDF contenant déjà des champs de formulaire actifs (AcroForm).' },
        { step: 2, title: 'Concevoir la Logique sur le Canevas', description: 'Connectez les champs sous forme de nœuds. Reliez les événements de sortie (changement, perte de focus) aux actions cibles (afficher, masquer, calculer, désactiver).' },
        { step: 3, title: 'Compiler et Injecter', description: 'Injectez la logique JavaScript compilée dans le dictionnaire PDF et enregistrez le document intelligent final.' }
      ],
      useCases: [
        { title: 'Contrats Commerciaux Intelligents', description: 'Affichez ou masquez des champs de saisie supplémentaires de manière dynamique en fonction des conditions sélectionnées par le client.', icon: 'file-signature' },
        { title: 'Formulaires de Frais Automatisés', description: 'Additionnez plusieurs lignes de frais et calculez les taxes de manière dynamique sans calcul manuel.', icon: 'calculator' },
        { title: 'Questionnaires Interactifs', description: 'Passez les questions non pertinentes en fonction des réponses précédentes, offrant ainsi une expérience de saisie mobile plus propre.', icon: 'form-input' }
      ],
      faq: [
        { question: 'Ai-je besoin d\'un PDF avec des champs préexistants ?', answer: 'Oui. Cet outil est conçu pour lier des règles logiques à des champs existants. Si votre PDF n\'a pas de champs interactifs, utilisez d\'abord notre outil Créateur de Formulaires pour ajouter des saisies et des cases à cocher.' },
        { question: 'Cette logique fonctionnera-t-elle sur n\'importe quel lecteur PDF ?', answer: 'Elle fonctionne sur tous les lecteurs PDF conformes aux normes Adobe PDF et prenant en charge Acrobat JavaScript (tels qu\'Adobe Acrobat Reader, Foxit Reader et les principaux navigateurs Web). Les lecteurs mobiles minimalistes peuvent ne prendre en charge que les actions de base.' },
        { question: 'Cela affecte-t-il l\'impression papier ?', answer: 'Pas du tout. Les scripts injectés s\'exécutent uniquement à l\'écran lors du remplissage du formulaire. Lors de l\'impression, l\'état actuel des champs est imprimé de manière statique sans aucune visualisation de nœuds.' }
      ]
    },
    'global-invoice-parser': {
      title: 'Traducteur de Factures Globales et Calculateur de Change',
      metaDescription: 'Extrayez les totaux de devises des factures multinationales, effectuez des calculs et appliquez des tampons de taux de change interactifs effet verre dépoli.',
      keywords: ['traduire facture', 'convertisseur devise facture', 'calculatrice taux de change pdf', 'tamponner monnaie locale', 'outil facture globale'],
      description: `
        <p>Le Traducteur de Factures Globales apporte une clarté maximale aux équipes financières internationales et aux acheteurs mondiaux.</p>
        <p>La gestion de factures dans plusieurs devises ($, €, ¥) implique souvent une arithmétique manuelle fastidieuse. Cet outil permet la <strong>traduction des étiquettes en place et la conversion des taux de change en temps réel</strong>.</p>
        <p>Il analyse le document pour trouver les totaux de prix, effectue des calculs basés sur les devises de référence et applique physiquement un élégant registre de taux de change effet verre dépoli semi-transparent dans la marge de la page. Il s\'affiche avec un magnifique effet visuel de chiffres déroulants style machine à sous, apportant un contrôle absolu à la facturation globale.</p>
      `,
      howToUse: [
        { step: 1, title: 'Téléverser la Facture PDF', description: 'Importez toute facture libellée en devises étrangères (par exemple, USD, EUR, JPY).' },
        { step: 2, title: 'Sélectionner la Devise Locale', description: 'Choisissez votre devise locale (par exemple, EUR) et spécifiez un taux de change personnalisé ou en temps réel.' },
        { step: 3, title: 'Appliquer le Sello', description: 'Cliquez sur exécuter pour superposer le registre de taux de change prêt pour la comptabilité.' }
      ],
      useCases: [
        { title: 'Remboursement de Déplacements Professionnels', description: 'Convertissez les factures de voyage dans la devise locale et tamponnez les détails de la conversion, simplifiant ainsi les flux de travail comptables.', icon: 'plane' },
        { title: 'Audit d\'Achats Transfrontaliers', description: 'Traduisez les colonnes des factures et isolez le coût réel des biens de commerce électronique.', icon: 'credit-card' },
        { title: 'Comptabilité Commerciale Internationale', description: 'Tamponnez des registres de conversion cohérents sur les factures d\'entreprise pour rationaliser les audits de fin d\'année.', icon: 'folder-open' }
      ],
      faq: [
        { question: 'Comment détecte-t-il les montants des factures ?', answer: 'Il scanne les flux de caractères à la recherche de symboles de devises et analyse les en-têtes sémantiques tels que "Total" ou "Dû" pour localiser la somme finale de la facture.' },
        { question: 'Les taux de change sont-ils récupérés en temps réel ?', answer: 'Oui. Par défaut, il récupère les taux de base à partir d\'API financières standard. Vous pouvez également spécifier des taux personnalisés pour les audits internes.' },
        { question: 'Le tampon couvrira-t-il des détails importants de la facture ?', answer: 'Le moteur scanne la marge de la page pour trouver le positionnement optimal. Le tampon est semi-transparent, s\'alignant élégamment avec vos mises en page.' }
      ]
    }
  },
  'de': {
    'form-logic-designer': {
      title: 'Interaktiver Formularlogik-Designer',
      metaDescription: 'Entwerfen Sie dynamische Verhaltensweisen über eine Milchglas-Knotenleinwand und injizieren Sie interaktive AcroJS-Logik in PDF-Formulare.',
      keywords: ['PDF Formularlogik', 'AcroJS Injektion', 'Knotenfluss', 'interaktives PDF', 'Feldabhängigkeiten'],
      description: `
        <p>Der Interaktive Formularlogik-Designer ist ein zukunftsweisendes Tool, das eine große Lücke in den PDF-Funktionen schließt: Die Erstellung aktiver, reaktionsfähiger Felder anstelle von flachen, statischen Formularen.</p>
        <p>Über unsere visuelle Leinwand mit "leuchtenden Milchglasknoten" (basierend auf React Flow) werden Formularfelder als verbundene Module dargestellt. Sie können Verbindungen ziehen, um Beziehungen zu definieren: z. B. wenn ein Kontrollkästchen aktiviert ist ➜ Texteingabe aktivieren ➜ Werte automatisch berechnen und ein Gesamtfeld aktualisieren.</p>
        <p>Nach dem Entwurf kompiliert die AcroJS-Engine die Logik in offizielles Acrobat JavaScript und injiziert es in die '/AA'-Wörterbücher (Zusätzliche Aktionen) des AcroForm. Die interaktiven Verhaltensweisen werden nativ in jedem Standard-PDF-Reader ausgeführt.</p>
      `,
      howToUse: [
        { step: 1, title: 'Interaktives PDF hochladen', description: 'Stellen Sie eine PDF-Datei bereit, die bereits aktive Formularfelder (AcroForm) enthält.' },
        { step: 2, title: 'Logik auf Leinwand entwerfen', description: 'Verbinden Sie Felder als Knoten. Verknüpfen Sie Ausgangsereignisse (Änderung, Fokusverlust) mit Zielaktionen (Anzeigen, Ausblenden, Berechnen, Deaktivieren).' },
        { step: 3, title: 'Kompilieren und injizieren', description: 'Injizieren Sie die kompilierte JavaScript-Logik in das PDF-Wörterbuch und speichern Sie das fertige intelligente Dokument.' }
      ],
      useCases: [
        { title: 'Intelligente Geschäftsverträge', description: 'Zusätzliche Eingabefelder basierend auf den vom Kunden ausgewählten Bedingungen dynamisch anzeigen oder ausblenden.', icon: 'file-signature' },
        { title: 'Automatisierte Spesenformulare', description: 'Mehrere Spesenzeilen addieren und Steuern dynamisch ohne manuelle Berechnung ermitteln.', icon: 'calculator' },
        { title: 'Interaktive Fragebögen', description: 'Irrelevante Fragen basierend auf vorherigen Antworten überspringen, um ein saubereres Ausfüllen auf Mobilgeräten zu ermöglichen.', icon: 'form-input' }
      ],
      faq: [
        { question: 'Benötige ich ein PDF mit bereits vorhandenen Feldern?', answer: 'Ja. Dieses Tool dient dazu, Logikregeln an bestehende Felder zu binden. Wenn Ihre PDF-Datei keine interaktiven Felder hat, verwenden Sie zuerst unser Tool Formularersteller, um Eingabefelder und Kontrollkästchen hinzuzufügen.' },
        { question: 'Funktioniert diese Logik auf jedem PDF-Reader?', answer: 'Sie läuft auf allen PDF-Readern, die den Adobe-PDF-Standards entsprechen und Acrobat JavaScript unterstützen (wie Adobe Acrobat Reader, Foxit Reader und gängige Webbrowser). Minimalistische mobile Reader unterstützen möglicherweise nur grundlegende Aktionen.' },
        { question: 'Beeinflusst dies den Papierdruck?', answer: 'Überhaupt nicht. Die injizierten Skripte werden nur auf dem Bildschirm während des Ausfüllens des Formulars ausgeführt. Beim Drucken wird der aktuelle Zustand der Felder statisch ohne Knotendarstellung gedruckt.' }
      ]
    },
    'global-invoice-parser': {
      title: 'Globaler Rechnungsübersetzer & Wechselkursrechner',
      metaDescription: 'Währungssummen aus multinationalen Rechnungen extrahieren, Berechnungen durchführen und interaktive Wechselkursbelege im Milchglas-Design aufbringen.',
      keywords: ['Rechnung übersetzen', 'Rechnungswährungskonverter', 'Wechselkursrechner PDF', 'lokale Währung stempeln', 'globales Rechnungstool'],
      description: `
        <p>Der Globale Rechnungsübersetzer bietet maximale Klarheit für internationale Finanzteams und globale Einkäufer.</p>
        <p>Die Bearbeitung von Rechnungen in mehreren Währungen ($, €, ¥) erfordert oft mühsame manuelle Berechnungen. Dieses Tool ermöglicht die <strong>direkte Übersetzung von Bezeichnungen und die Umrechnung von Wechselkursen in Echtzeit</strong>.</p>
        <p>Es scannt das Dokument nach Preissummen, führt Berechnungen basierend auf Währungsbenchmarks durch und stempelt einen eleganten, halbtransparenten Wechselkursbeleg im Milchglas-Design auf den Seitenrand. Es wird mit einem großartigen visuellen Effekt einer sich drehenden Slot-Machine dargestellt, was absolute Kontrolle in die globale Abrechnung bringt.</p>
      `,
      howToUse: [
        { step: 1, title: 'PDF-Rechnung hochladen', description: 'Importieren Sie eine in Fremdwährung ausgestellte Rechnung (z. B. USD, EUR, JPY).' },
        { step: 2, title: 'Lokale Währung auswählen', description: 'Wählen Sie Ihre lokale Währung (z. B. EUR) und geben Sie einen benutzerdefinierten Kurs oder den Echtzeit-Wechselkurs an.' },
        { step: 3, title: 'Belegstempel aufbringen', description: 'Klicken Sie auf Ausführen, um den für die Buchhaltung vorbereiteten Wechselkursbeleg über das Dokument zu legen.' }
      ],
      useCases: [
        { title: 'Spesenabrechnung bei Auslandsgeschäftsreisen', description: 'Reisekostenrechnungen in die lokale Währung umrechnen und Wechselkursdetails aufstempeln, um Buchhaltungsabläufe zu erleichtern.', icon: 'plane' },
        { title: 'Prüfung grenzüberschreitender Einkäufe', description: 'Rechnungsspalten übersetzen und die tatsächlichen Kosten von E-Commerce-Waren ermitteln.', icon: 'credit-card' },
        { title: 'Internationale Geschäftsbuchhaltung', description: 'Konsistente Umrechnungsbelege auf Unternehmensrechnungen stempeln, um Jahresabschlussprüfungen zu rationalisieren.', icon: 'folder-open' }
      ],
      faq: [
        { question: 'Wie werden Rechnungsbeträge erkannt?', answer: 'Der Zeichensatz wird nach Währungssymbolen gescannt und semantische Überschriften wie "Gesamtsumme" oder "Fällig" werden analysiert, um die endgültige Rechnungssumme zu lokalisieren.' },
        { question: 'Werden Wechselkurse in Echtzeit abgerufen?', answer: 'Ja. Standardmäßig werden die Basiskurse von Standard-Finanz-APIs abgerufen. Sie können auch benutzerdefinierte Kurse für interne Audits angeben.' },
        { question: 'Verdeckt der gestempelte Beleg wichtige Rechnungsdetails?', answer: 'Die Engine scannt den Seitenrand, um die optimale Positionierung zu finden. Der Stempel ist halbtransparent und fügt sich elegant in Ihre Layouts ein.' }
      ]
    }
  },
  'pt': {
    'form-logic-designer': {
      title: 'Designer de Lógica de Formulário Interativo',
      metaDescription: 'Projete comportamentos dinâmicos usando uma tela de nós de glassmorphism e injete lógica interativa AcroJS em formulários PDF.',
      keywords: ['lógica de formulário PDF', 'injeção AcroJS', 'fluxo de nós', 'PDF interativo', 'dependências de campos'],
      description: `
        <p>O Designer de Lógica de Formulário Interativo é uma ferramenta pioneira que preenche uma enorme lacuna nos recursos do PDF: a criação de campos ativos e responsivos em vez de formulários planos e estáticos.</p>
        <p>Por meio de nossa tela visual com "nós de glassmorphism brilhantes" (construídos em React Flow), os campos de formulário são representados como módulos conectados. Você pode arrastar links para definir relações: por exemplo, quando uma caixa de seleção é marcada ➜ ativar uma entrada de texto ➜ autocalcular valores e atualizar um campo total.</p>
        <p>Depois de projetado, o mecanismo AcroJS compila a lógica em Acrobat JavaScript oficial e a injeta nos dicionários '/AA' (Ações Adicionais) do AcroForm. Os comportamentos interativos são executados nativamente em qualquer leitor de PDF padrão.</p>
      `,
      howToUse: [
        { step: 1, title: 'Carregar PDF Interativo', description: 'Forneça um arquivo PDF que já possua campos de formulário ativos (AcroForm).' },
        { step: 2, title: 'Mapear Lógica na Tela', description: 'Conecte os campos como nós. Vincule eventos de saída (alteração, desfoque) às ações de destino (mostrar, ocultar, calcular, desabilitar).' },
        { step: 3, title: 'Compilar e Injetar', description: 'Injete a lógica JavaScript compilada no dicionário do PDF e salve o documento inteligente final.' }
      ],
      useCases: [
        { title: 'Contratos Comerciais Inteligentes', description: 'Mostre ou oculte campos de entrada complementares dinamicamente com base nos termos selecionados pelo cliente.', icon: 'file-signature' },
        { title: 'Formulários de Despesas Automatizados', description: 'Some várias linhas de despesas e calcule os impostos dinamicamente, sem cálculos manuais.', icon: 'calculator' },
        { title: 'Questionários Interativos', description: 'Pule perguntas irrelevantes com base nas respostas anteriores, proporcionando uma experiência de preenchimento móvel mais limpa.', icon: 'form-input' }
      ],
      faq: [
        { question: 'Preciso de um PDF com campos preexistentes?', answer: 'Sim. Esta ferramenta foi projetada para vincular regras lógicas a campos existentes. Se o seu PDF não tiver campos interativos, use primeiro nossa ferramenta Criador de Formulários para adicionar entradas e caixas de seleção.' },
        { question: 'Essa lógica funcionará em qualquer leitor de PDF?', answer: 'Ela funciona em todos os leitores de PDF que estejam em conformidade com os padrões da Adobe e que suportem Acrobat JavaScript (como Adobe Acrobat Reader, Foxit Reader e os principais navegadores). Leitores móveis minimalistas podem suportar apenas ações básicas.' },
        { question: 'Isso afeta a impressão em papel?', answer: 'Não. Os scripts injetados são executados apenas na tela durante o preenchimento do formulário. Ao imprimir, o estado atual dos campos é impresso estaticamente, sem visualização dos nós.' }
      ]
    },
    'global-invoice-parser': {
      title: 'Tradutor de Faturas Globais e Calculador de Câmbio',
      metaDescription: 'Extraia totais de moedas de faturas multinacionais, realize cálculos e aplique registros de câmbio interativos no estilo glassmorphism.',
      keywords: ['traduzir fatura', 'conversor de moeda de fatura', 'calculadora de taxa de câmbio pdf', 'carimbo de moeda local', 'ferramenta de fatura global'],
      description: `
        <p>O Tradutor de Faturas Globais oferece clareza máxima para equipes financeiras internacionais e compradores globais.</p>
        <p>O gerenciamento de faturas em várias moedas ($, €, ¥) geralmente envolve uma aritmética manual tediosa. Esta ferramenta permite a <strong>tradução de rótulos no local e a conversão de taxas de câmbio em tempo real</strong>.</p>
        <p>Ela varre o documento em busca de totais de preços, faz cálculos com base em moedas de referência e aplica fisicamente um elegante registro de taxa de câmbio semitransparente no estilo glassmorphism na margem da página. É renderizado com um visual magnífico de números rolando, trazendo controle absoluto para o faturamento global.</p>
      `,
      howToUse: [
        { step: 1, title: 'Carregar PDF da Fatura', description: 'Importe qualquer fatura emitida em moeda estrangeira (por exemplo, USD, EUR, JPY).' },
        { step: 2, title: 'Selecionar Moeda Local', description: 'Escolha sua moeda local (por exemplo, BRL) e especifique uma taxa de câmbio personalizada ou em tempo real.' },
        { step: 3, title: 'Aplicar Carimbo de Registro', description: 'Clique em executar para sobrepor o registro da taxa de câmbio pronto para a contabilidade.' }
      ],
      useCases: [
        { title: 'Reembolso de Viagens de Negócios', description: 'Converta faturas de viagens para a moeda local e aplique carimbos de conversão, simplificando os fluxos de trabalho contábeis.', icon: 'plane' },
        { title: 'Auditoria de Compras Transfronteiriças', description: 'Traduza colunas de faturas e identifique o custo real dos bens adquiridos por e-commerce.', icon: 'credit-card' },
        { title: 'Contabilidade Comercial Internacional', description: 'Aplique registros de conversão consistentes nas faturas corporativas para agilizar as auditorias de fim de ano.', icon: 'folder-open' }
      ],
      faq: [
        { question: 'Como ele detecta os valores das faturas?', answer: 'Ele varre o fluxo de caracteres em busca de símbolos monetários e analisa cabeçalhos semânticos como "Total" ou "Vencido" para localizar a soma final da fatura.' },
        { question: 'As taxas de câmbio são buscadas em tempo real?', answer: 'Sim. Por padrão, ele recupera taxas base de APIs financeiras padrão. Você também pode especificar taxas personalizadas para auditorias internas.' },
        { question: 'O carimbo cobrirá detalhes importantes da fatura?', answer: 'O mecanismo varre a margem da página para encontrar o posicionamento ideal. O carimbo é semitransparente, alinhando-se elegantemente com seus layouts.' }
      ]
    }
  },
  'it': {
    'form-logic-designer': {
      title: 'Progettista Logico di Moduli Interattivi',
      metaDescription: 'Progetta comportamenti dinamici tramite una tela di nodi in stile glassmorphic e inietta logica interattiva AcroJS nei moduli PDF.',
      keywords: ['logica modulo PDF', 'iniezione AcroJS', 'flusso nodi', 'PDF interattivo', 'dipendenze campi'],
      description: `
        <p>Il Progettista Logico di Moduli Interattivi è uno strumento pionieristico che colma una grande lacuna nelle funzionalità PDF: la creazione di campi attivi e reattivi invece di moduli piatti e statici.</p>
        <p>Attraverso la nostra tela visiva con "nodi in stile glassmorphic luminosi" (basata su React Flow), i campi del modulo sono rappresentati come moduli collegati. È possibile trascinare i collegamenti per definire le relazioni: ad es., quando una casella di controllo viene selezionata ➜ abilitare un inserimento di testo ➜ calcolare automaticamente i valori e aggiornare un campo totale.</p>
        <p>Una volta progettato, il motore AcroJS compila la logica in Acrobat JavaScript ufficiale e la inietta nei dizionari '/AA' (Azioni Aggiuntive) dell'AcroForm. I comportamenti interattivi vengono eseguiti nativamente in qualsiasi lettore PDF standard.</p>
      `,
      howToUse: [
        { step: 1, title: 'Carica PDF Interattivo', description: 'Fornisci un file PDF che contiene già campi modulo attivi (AcroForm).' },
        { step: 2, title: 'Progetta la Logica sulla Tela', description: 'Collega i campi come nodi. Collega gli eventi di output (modifica, perdita di focus) alle azioni di destinazione (mostra, nascondi, calcola, disabilita).' },
        { step: 3, title: 'Compila e Inietta', description: 'Inietta la logica JavaScript compilata nel dizionario PDF e salva il documento intelligente finale.' }
      ],
      useCases: [
        { title: 'Contratti Commerciali Intelligenti', description: 'Mostra o nascondi campi di inserimento supplementari in modo dinamico in base alle condizioni selezionate dal cliente.', icon: 'file-signature' },
        { title: 'Moduli Spese Automatizzati', description: 'Somma più righe di spesa e calcola le tasse in modo dinamico senza calcoli manuali.', icon: 'calculator' },
        { title: 'Questionari Interattivi', description: 'Salta domande irrilevanti in base alle risposte precedenti, offrendo un\'esperienza di compilazione mobile più pulita.', icon: 'form-input' }
      ],
      faq: [
        { question: 'Ho bisogno di un PDF con campi preesistenti?', answer: 'Sì. Questo strumento è progettato per associare regole logiche ai campi esistenti. Se il tuo PDF non ha campi interattivi, usa prima il nostro strumento Creatore di Moduli per aggiungere inserimenti e caselle di controllo.' },
        { question: 'Questa logica funzionerà su qualsiasi lettore PDF?', answer: 'Funziona su tutti i lettori PDF conformi agli standard Adobe e che supportano Acrobat JavaScript (come Adobe Acrobat Reader, Foxit Reader e i principali browser web). I lettori mobili minimalisti potrebbero supportare solo azioni di base.' },
        { question: 'Questo influisce sulla stampa su carta?', answer: 'Per niente. Gli script iniettati vengono eseguiti solo sullo schermo durante la compilazione del modulo. Al momento della stampa, lo stato attuale dei campi viene stampato in modo statico senza alcuna visualizzazione dei nodi.' }
      ]
    },
    'global-invoice-parser': {
      title: 'Traduttore di Fatture Globali e Calcolatore di Tassi di Cambio',
      metaDescription: 'Estrai i totali in valuta dalle fatture multinazionali, esegui calcoli e applica timbri di tasso di cambio interattivi in stile glassmorphic.',
      keywords: ['tradurre fattura', 'convertitore valuta fattura', 'calcolatrice tasso di cambio pdf', 'timbro valuta locale', 'strumento fattura globale'],
      description: `
        <p>Il Traduttore di Fatture Globali offre la massima chiarezza per i team finanziari internazionali e gli acquirenti globali.</p>
        <p>La gestione di fatture in più valute ($, €, ¥) comporta spesso una noiosa aritmetica manuale. Questo strumento consente la <strong>traduzione delle etichette sul posto e la conversione dei tassi di cambio in tempo real</strong>.</p>
        <p>Scansiona il documento alla ricerca dei totali dei prezzi, esegue calcoli basati su valute di riferimento e applica fisicamente un elegante registro del tasso di cambio in stile glassmorphic semitrasparente nel margine della pagina. Viene visualizzato con uno splendido effetto visivo di cifre rotanti stile slot-machine, portando il controllo assoluto sulla fatturazione globale.</p>
      `,
      howToUse: [
        { step: 1, title: 'Carica la Fattura PDF', description: 'Importa qualsiasi fattura emessa in valuta estera (ad esempio, USD, EUR, JPY).' },
        { step: 2, title: 'Seleziona Valuta Locale', description: 'Scegli la tua valuta locale (ad esempio, EUR) e specifica un tasso di cambio personalizzato o in tempo reale.' },
        { step: 3, title: 'Applica il Timbro', description: 'Fare clic su Esegui per sovrapporre il registro del tasso di cambio pronto per la contabilità.' }
      ],
      useCases: [
        { title: 'Rimborso di Trasferte di Lavoro', description: 'Converti le fatture di viaggio nella valuta locale e applica il timbro con i dettagli di conversione, semplificando i flussi di lavoro contabili.', icon: 'plane' },
        { title: 'Verifica di Acquisti Transfrontalieri', description: 'Traduci le colonne delle fatture e individua il costo effettivo dei beni acquistati via e-commerce.', icon: 'credit-card' },
        { title: 'Contabilità Commerciale Internazionale', description: 'Applica timbri di conversione coerenti sulle fatture aziendali per ottimizzare gli audit di fine anno.', icon: 'folder-open' }
      ],
      faq: [
        { question: 'Come rileva gli importi delle fatture?', answer: 'Scansiona il flusso di caratteri alla ricerca di simboli di valuta e analizza le intestazioni semantiche come "Totale" o "Dovuto" per individuare la somma finale della fattura.' },
        { question: 'I tassi di cambio vengono recuperati in tempo reale?', answer: 'Sì. Per impostazione predefinita, recupera i tassi di base da API finanziarie standard. È anche possibile specificare tassi personalizzati per audit interni.' },
        { question: 'Il timbro coprirà dettagli importanti della fattura?', answer: 'Il motore scansiona il margine della pagina per trovare il posizionamento ottimale. Il timbro è semitransparente, allineandosi in modo elegante con i tuoi layout.' }
      ]
    }
  },
  'id': {
    'form-logic-designer': {
      title: 'Desainer Logika Formulir Interaktif',
      metaDescription: 'Rancang perilaku dinamis menggunakan kanvas simpul glassmorphism dan injeksikan logika interaktif AcroJS ke dalam formulir PDF.',
      keywords: ['logika formulir PDF', 'injeksi AcroJS', 'alur simpul', 'PDF interaktif', 'dependensi bidang'],
      description: `
        <p>Desainer Logika Formulir Interaktif adalah alat pelopor yang mengisi celah besar dalam kemampuan PDF: membuat bidang aktif dan responsif, bukan formulir yang datar dan statis.</p>
        <p>Melalui kanvas visual kami yang menampilkan "simpul glassmorphism menyala" (dibangun di atas React Flow), bidang formulir direpresentasikan sebagai modul yang terhubung. Anda dapat menyeret tautan untuk menentukan hubungan: misal, saat kotak centang dicentang ➜ aktifkan input teks ➜ hitung nilai secara otomatis dan perbarui bidang total.</p>
        <p>Setelah dirancang, mesin AcroJS menyusun logika tersebut ke dalam Acrobat JavaScript resmi dan menginjeksikannya ke dalam kamus '/AA' (Tindakan Tambahan) dari AcroForm. Perilaku interaktif tersebut kemudian dijalankan secara asli di dalam pembaca PDF standar apa pun.</p>
      `,
      howToUse: [
        { step: 1, title: 'Unggah PDF Interaktif', description: 'Sediakan file PDF yang sudah memiliki bidang formulir aktif (AcroForm).' },
        { step: 2, title: 'Petakan Logika di Kanvas', description: 'Hubungkan bidang sebagai simpul. Tautkan peristiwa output (ubah, blur) ke tindakan target (tampilkan, sembunyikan, hitung, nonaktifkan).' },
        { step: 3, title: 'Kompilasi dan Injeksikan', description: 'Injeksikan logika JavaScript yang dikompilasi ke dalam kamus PDF dan simpan dokumen pintar terakhir.' }
      ],
      useCases: [
        { title: 'Kontrak Bisnis Pintar', description: 'Tampilkan atau sembunyikan bidang input tambahan secara dinamis berdasarkan ketentuan yang dipilih klien.', icon: 'file-signature' },
        { title: 'Formulir Pengeluaran Otomatis', description: 'Jumlahkan beberapa baris pengeluaran dan hitung pajak secara dinamis tanpa penghitungan manual.', icon: 'calculator' },
        { title: 'Kuesioner Interaktif', description: 'Lewati pertanyaan yang tidak relevan berdasarkan jawaban sebelumnya, memberikan pengalaman pengisian seluler yang lebih bersih.', icon: 'form-input' }
      ],
      faq: [
        { question: 'Apakah saya memerlukan PDF dengan bidang yang sudah ada sebelumnya?', answer: 'Ya. Alat ini dirancang untuk mengikat aturan logika ke bidang yang ada. Jika PDF Anda tidak memiliki bidang interaktif, gunakan alat Pembuat Formulir kami terlebih dahulu untuk menambahkan input dan kotak centang.' },
        { question: 'Apakah logika ini akan berjalan di semua pembaca PDF?', answer: 'Ini berjalan pada semua pembaca PDF yang mematuhi standar Adobe PDF dan mendukung Acrobat JavaScript (seperti Adobe Acrobat Reader, Foxit Reader, dan peramban web utama). Pembaca seluler minimalis mungkin hanya mendukung tindakan dasar.' },
        { question: 'Apakah ini memengaruhi pencetakan kertas?', answer: 'Sama sekali tidak. Skrip yang diinjeksikan hanya berjalan di layar selama pengisian formulir. Saat mencetak, status bidang saat ini dicetak secara statis tanpa visualisasi simpul.' }
      ]
    },
    'global-invoice-parser': {
      title: 'Penerjemah Faktur Global & Kalkulator Nilai Tukar',
      metaDescription: 'Ekstrak total mata uang dari faktur multi-nasional, jalankan perhitungan, dan cetak stempel buku besar nilai tukar glassmorphism interaktif.',
      keywords: ['terjemahkan faktur', 'konverter mata uang faktur', 'kalkulator nilai tukar pdf', 'stempel mata uang lokal', 'alat faktur global'],
      description: `
        <p>Penerjemah Faktur Global memberikan kejelasan maksimal bagi tim keuangan internasional dan pembeli global.</p>
        <p>Menangani faktur dalam berbagai mata uang ($, €, ¥) sering kali melibatkan perhitungan manual yang menjemukan. Alat ini memungkinkan <strong>terjemahan label di tempat dan konversi nilai tukar waktu nyata</strong>.</p>
        <p>Ini memindai dokumen untuk total harga, menjalankan perhitungan berdasarkan tolok ukur mata uang, dan secara fisik mencetak stempel "Exchange Rate ledger" glassmorphism semi-transparan yang elegan di margin halaman. Ini merender dengan efek visual numerik mesin slot berputar yang menawan, membawa kontrol mutlak pada penagihan global.</p>
      `,
      howToUse: [
        { step: 1, title: 'Unggah Faktur PDF', description: 'Impor faktur apa pun yang ditagih dalam mata uang asing (misalnya USD, EUR, JPY).' },
        { step: 2, title: 'Pilih Mata Uang Lokal', description: 'Pilih mata uang lokal Anda (misalnya IDR) dan tentukan nilai tukar kustom atau waktu nyata.' },
        { step: 3, title: 'Terapkan Stempel Buku Besar', description: 'Klik jalankan untuk melapisi stempel buku besar nilai tukar yang siap untuk akuntansi.' }
      ],
      useCases: [
        { title: 'Reimbursement Perjalanan Bisnis Asing', description: 'Konversikan tagihan perjalanan ke mata uang lokal dan cetak stempel detail konversi, memudahkan alur kerja akuntansi.', icon: 'plane' },
        { title: 'Audit Belanja Lintas Batas', description: 'Terjemahkan kolom faktur dan isolasi biaya sebenarnya dari barang-barang e-commerce.', icon: 'credit-card' },
        { title: 'Pembukuan Bisnis Internasional', description: 'Cetak stempel buku besar konversi yang konsisten pada faktur perusahaan untuk merampingkan audit akhir tahun.', icon: 'folder-open' }
      ],
      faq: [
        { question: 'Bagaimana cara mendeteksi jumlah faktur?', answer: 'Ini memindai aliran karakter untuk simbol mata uang dan menganalisis tajuk semantik seperti "Total" atau "Jatuh Tempo" untuk menemukan jumlah akhir faktur.' },
        { question: 'Apakah nilai tukar diambil secara waktu nyata?', answer: 'Ya. Secara default, ini mengambil kurs dasar dari API keuangan standar. Anda juga dapat menentukan kurs kustom untuk audit internal.' },
        { question: 'Apakah stempel tersebut akan menutupi detail faktur yang penting?', answer: 'Mesin memindai margin halaman untuk menemukan posisi optimal. Stempel tersebut semi-transparan, sejajar dengan elegan dengan tata letak Anda.' }
      ]
    }
  },
  'vi': {
    'form-logic-designer': {
      title: 'Trình Thiết Kế Logic Biểu Mẫu Tương Tác',
      metaDescription: 'Thiết kế các hành vi động bằng khung hình nút giả kính và nhúng logic AcroJS tương tác vào biểu mẫu PDF.',
      keywords: ['logic biểu mẫu PDF', 'nhúng AcroJS', 'dòng nút', 'PDF tương tác', 'phụ thuộc trường'],
      description: `
        <p>Trình Thiết Kế Logic Biểu Mẫu Tương Tác là một công cụ tiên phong lấp đầy khoảng trống lớn trong các tính năng PDF: tạo các trường hoạt động, phản hồi thay vì các biểu mẫu phẳng, tĩnh.</p>
        <p>Thông qua khung hình trực quan của chúng tôi với các "nút giả kính phát sáng" (được xây dựng trên React Flow), các trường biểu mẫu được biểu diễn dưới dạng các mô-đun được kết nối. Bạn có thể kéo các liên kết để xác định mối quan hệ: ví dụ: khi một hộp kiểm được tích ➜ kích hoạt một ô nhập văn bản ➜ tự động tính toán các giá trị và cập nhật trường tổng số.</p>
        <p>Sau khi được thiết kế, công cụ AcroJS sẽ biên dịch logic thành Acrobat JavaScript chính thức và nhúng nó vào từ điển \'/AA\' (Hành động bổ sung) của AcroForm. Các hành vi tương tác sau đó được thực thi trực tiếp bên trong bất kỳ trình đọc PDF tiêu chuẩn nào.</p>
      `,
      howToUse: [
        { step: 1, title: 'Tải Lên PDF Tương Tác', description: 'Cung cấp tệp PDF đã có sẵn các trường biểu mẫu hoạt động (AcroForm).' },
        { step: 2, title: 'Thiết Lập Logic Trên Khung Hình', description: 'Kết nối các trường dưới dạng nút. Liên kết các sự kiện đầu ra (thay đổi, mất tập trung) với các hành động đích (hiển thị, ẩn, tính toán, vô hiệu hóa).' },
        { step: 3, title: 'Biên Dịch và Nhúng', description: 'Nhúng logic JavaScript đã biên dịch vào từ điển PDF và lưu tài liệu thông minh cuối cùng.' }
      ],
      useCases: [
        { title: 'Hợp Đồng Thương Mại Thông Minh', description: 'Hiển thị hoặc ẩn các trường nhập bổ sung một cách linh hoạt dựa trên các điều khoản đã chọn của khách hàng.', icon: 'file-signature' },
        { title: 'Biểu Mẫu Chi Phí Tự Động', description: 'Cộng nhiều dòng chi phí và tính thuế một cách linh hoạt mà không cần tính toán thủ công.', icon: 'calculator' },
        { title: 'Bảng Câu Hỏi Tương Tác', description: 'Bỏ qua các câu hỏi không liên quan dựa trên các câu trả lời trước đó, mang lại trải nghiệm điền trên thiết bị di động gọn gàng hơn.', icon: 'form-input' }
      ],
      faq: [
        { question: 'Tôi có cần một PDF có các trường sẵn có không?', answer: 'Có. Công cụ này được thiết kế để liên kết các quy tắc logic với các trường hiện có. Nếu PDF của bạn không có các trường tương tác, trước tiên hãy sử dụng công cụ Tạo Biểu Mẫu của chúng tôi để thêm các ô nhập và hộp kiểm.' },
        { question: 'Logic này có chạy trên mọi trình đọc PDF không?', answer: 'Nó chạy trên tất cả các trình đọc PDF tuân thủ tiêu chuẩn Adobe PDF và hỗ trợ Acrobat JavaScript (như Adobe Acrobat Reader, Foxit Reader và các trình duyệt web lớn). Trình đọc di động tối giản có thể chỉ hỗ trợ các hành động cơ bản.' },
        { question: 'Điều này có ảnh hưởng đến việc in giấy không?', answer: 'Hoàn toàn không. Các tập lệnh được nhúng chỉ chạy trên màn hình trong quá trình điền biểu mẫu. Khi in, trạng thái hiện tại của các trường được in tĩnh mà không có bất kỳ hình ảnh hiển thị nút nào.' }
      ]
    },
    'global-invoice-parser': {
      title: 'Trình Dịch Hóa Đơn Toàn Cầu & Tính Tỷ Giá Hối Đoái',
      metaDescription: 'Trích xuất tổng số tiền từ hóa đơn đa quốc gia, thực hiện các phép tính và đóng dấu sổ cái tỷ giá hối đoái giả kính tương tác.',
      keywords: ['dịch hóa đơn', 'chuyển đổi tiền tệ hóa đơn', 'tính tỷ giá pdf', 'đóng dấu tiền tệ bản địa', 'công cụ hóa đơn toàn cầu'],
      description: `
        <p>Trình Dịch Hóa Đơn Toàn Cầu mang lại sự rõ ràng tối đa cho các nhóm tài chính quốc tế và người mua toàn cầu.</p>
        <p>Xử lý hóa đơn bằng nhiều loại tiền tệ ($, €, ¥) thường liên quan đến các phép tính thủ công tẻ nhạt. Công cụ này cho phép <strong>dịch nhãn tại chỗ và chuyển đổi tỷ giá hối đoái theo thời gian thực</strong>.</p>
        <p>Nó quét tài liệu để tìm tổng giá tiền, thực hiện các phép tính dựa trên điểm chuẩn tiền tệ và đóng dấu vật lý một sổ cái tỷ giá hối đoái giả kính bán trong suốt thanh lịch ở lề trang. Nó hiển thị với hiệu ứng hình ảnh số vòng quay máy đánh bạc tuyệt đẹp, mang lại sự kiểm soát tuyệt đối cho việc lập hóa đơn toàn cầu.</p>
      `,
      howToUse: [
        { step: 1, title: 'Tải Lên Hóa Đơn PDF', description: 'Nhập bất kỳ hóa đơn nào được lập hóa đơn bằng ngoại tệ (ví dụ: USD, EUR, JPY).' },
        { step: 2, title: 'Chọn Tiền Tệ Bản Địa', description: 'Chọn tiền tệ bản địa của bạn (ví dụ: VND) và chỉ định tỷ giá tùy chỉnh hoặc thời gian thực.' },
        { step: 3, title: 'Áp Dụng Dấu Sổ Cái', description: 'Nhấp vào thực thi để phủ dấu sổ cái tỷ giá hối đoái sẵn sàng cho kế toán.' }
      ],
      useCases: [
        { title: 'Hoàn Tác Chi Phí Công Tác Nước Ngoài', description: 'Chuyển đổi hóa đơn du lịch sang tiền tệ bản địa và đóng dấu chi tiết chuyển đổi, đơn giản hóa quy trình làm việc kế toán.', icon: 'plane' },
        { title: 'Kiểm Toán Mua Sắm Xuyên Biên Giới', description: 'Dịch các cột hóa đơn và cô lập chi phí thực tế của hàng hóa thương mại điện tử.', icon: 'credit-card' },
        { title: 'Ghi Sổ Doanh Nghiệp Quốc Tế', description: 'Đóng dấu sổ cái chuyển đổi nhất quán trên các hóa đơn của công ty để hợp lý hóa các cuộc kiểm toán cuối năm.', icon: 'folder-open' }
      ],
      faq: [
        { question: 'Làm thế nào để phát hiện số tiền hóa đơn?', answer: 'Nó quét các luồng ký tự để tìm các ký hiệu tiền tệ và phân tích các tiêu đề ngữ nghĩa như "Total" hoặc "Due" để xác định tổng số tiền cuối cùng của hóa đơn.' },
        { question: 'Tỷ giá hối đoái có được tìm nạp theo thời gian thực không?', answer: 'Yes. Theo mặc định, nó truy xuất tỷ giá cơ sở từ các API tài chính tiêu chuẩn. Bạn cũng có thể chỉ định tỷ giá tùy chỉnh cho các cuộc kiểm toán nội bộ.' },
        { question: 'Dấu được đóng có che khuất các chi tiết hóa đơn quan trọng không?', answer: 'Công cụ quét lề trang để tìm vị trí tối ưu. Dấu có màu bán trong suốt, căn chỉnh trang nhã với bố cục của bạn.' }
      ]
    }
  },
  'ar': {
    'form-logic-designer': {
      title: 'مصمم منطق النماذج التفاعلية',
      metaDescription: 'تصميم سلوكيات ديناميكية باستخدام لوحة عقد شبه شفافة وحقن منطق AcroJS التفاعلي في نماذج PDF.',
      keywords: ['منطق نموذج PDF', 'حقن AcroJS', 'تدفق العقد', 'PDF تفاعلي', 'تبعيات الحقول'],
      description: `
        <p>مصمم منطق النماذج التفاعلية هو أداة رائدة تملأ فجوة هائلة في إمكانيات ملفات PDF: إنشاء حقول نشطة ومتجاوبة بدلاً من النماذج المسطحة والجامدة.</p>
        <p>من خلال لوحتنا المرئية التي تتميز بـ "عقد شبه شفافة متوهجة" (المبنية على React Flow)، يتم تمثيل حقول النموذج كوحدات متصلة. يمكنك سحب الروابط لتحديد العلاقات: على سبيل المثال، عند تحديد مربع اختيار ➜ تمكين إدخال نصي ➜ حساب القيم تلقائيًا وتحديث حقل الإجمالي.</p>
        <p>بمجرد التصميم، يقوم محرك AcroJS بتجميع المنطق في لغة Acrobat JavaScript الرسمية وحقنه في قواميس '/AA' (الإجراءات الإضافية) لـ AcroForm. يتم بعد ذلك تنفيذ السلوكيات التفاعلية محليًا داخل أي قارئ PDF قياسي.</p>
      `,
      howToUse: [
        { step: 1, title: 'تحميل ملف PDF تفاعلي', description: 'توفير ملف PDF يحتوي بالفعل على حقول نموذج نشطة (AcroForm).' },
        { step: 2, title: 'رسم المنطق في اللوحة', description: 'توصيل الحقول كعقد. ربط أحداث الإخراج (تغيير، فقدان التركيز) بالإجراءات المستهدفة (إظهار، إخفاء، حساب، تعطيل).' },
        { step: 3, title: 'التجميع والحقن', description: 'حقن منطق JavaScript المجمع في قاموس PDF وحفظ المستند الذكي النهائي.' }
      ],
      useCases: [
        { title: 'عقود تجارية ذكية', description: 'إظهار أو إخفاء حقول الإدخال الإضافية ديناميكيًا بناءً على الشروط المحددة من قبل العميل.', icon: 'file-signature' },
        { title: 'نماذج مصاريف مؤتمتة', description: 'جمع بنود مصاريف متعددة وحساب الضرائب ديناميكيًا دون حساب يدوي.', icon: 'calculator' },
        { title: 'استبيانات تفاعلية', description: 'تخطي الأسئلة غير ذات الصلة بناءً على الإجابات السابقة، مما يوفر تجربة تعبئة أنظف على الأجهزة المحمولة.', icon: 'form-input' }
      ],
      faq: [
        { question: 'هل أحتاج إلى ملف PDF يحتوي على حقول موجودة مسبقًا؟', answer: 'نعم. تم تصميم هذه الأداة لربط القواعد المنطقية بالحقول الموجودة. إذا لم يكن ملف PDF الخاص بك يحتوي على حقول تفاعلية، فاستخدم أداة منشئ النماذج أولاً لإضافة المدخلات ومربعات الاختيار.' },
        { question: 'هل سيعمل هذا المنطق على أي قارئ PDF؟', answer: 'يعمل على جميع قراء PDF الذين يتوافقون مع معايير Adobe PDF ويدعمون Acrobat JavaScript (مثل Adobe Acrobat Reader و Foxit Reader ومتصفحات الويب الرئيسية). قد تدعم قراء الأجهزة المحمولة البسيطة الإجراءات الأساسية فقط.' },
        { question: 'هل يؤثر هذا على الطباعة الورقية؟', answer: 'لا على الإطلاق. تعمل البرامج النصية المحقونة فقط على الشاشة أثناء تعبئة النموذج. عند الطباعة، يتم طباعة الحالة الحالية للحقول بشكل ثابت دون أي تمثيل مرئي للعقد.' }
      ]
    },
    'global-invoice-parser': {
      title: 'مترجم الفواتير العالمية وآلة حاسبة سعر الصرف',
      metaDescription: 'استخراج إجمالي العملات من الفواتير متعددة الجنسيات، وإجراء الحسابات، وختم دفاتر صرف تفاعلية شبه شفافة.',
      keywords: ['ترجمة فاتورة', 'محول عملات الفاتورة', 'حاسبة سعر الصرف pdf', 'ختم العملة المحلية', 'أداة الفاتورة العالمية'],
      description: `
        <p>يوفر مترجم الفواتير العالمية وضوحًا أقصى للفرق المالية الدولية والمشترين العالميين.</p>
        <p>غالبًا ما تتضمن معالجة الفواتير بعملات متعددة ($, €, ¥) حسابات يدوية مملة. تتيح هذه الأداة <strong>ترجمة التصنيفات في مكانها وتحويل أسعار الصرف في الوقت الفعلي</strong>.</p>
        <p>يقوم بمسح المستند بحثًا عن إجمالي الأسعار، وإجراء الحسابات بناءً على معايير العملة، ويختم ماديًا دفتر صرف شبه شفاف أنيق ومصمم بمظهر الزجاج في هامش الصفحة. يتم عرضه بتأثير مرئي رائع للأرقام الدوارة، مما يمنح تحكمًا مطلقًا في الفواتير العالمية.</p>
      `,
      howToUse: [
        { step: 1, title: 'تحميل فاتورة PDF', description: 'استيراد أي فاتورة مفوترة بعملات أجنبية (مثل الدولار الأمريكي، اليورو، الين الياباني).' },
        { step: 2, title: 'تحديد العملة المحلية', description: 'اختر عملتك المحلية (مثل الريال السعودي) وحدد سعر صرف مخصص أو في الوقت الفعلي.' },
        { step: 3, title: 'تطبيق ختم الدفتر', description: 'انقر فوق تنفيذ لتراكب دفتر سعر الصرف الجاهز للمحاسبة.' }
      ],
      useCases: [
        { title: 'تعويض مصاريف رحلات العمل الخارجية', description: 'تحويل فواتير السفر إلى العملة المحلية وختم تفاصيل التحويل، مما يسهل سير عمل المحاسبة.', icon: 'plane' },
        { title: 'تدقيق المشتريات عبر الحدود', description: 'ترجمة أعمدة الفاتورة وتحديد التكلفة الحقيقية للسلع عبر التجارة الإلكترونية.', icon: 'credit-card' },
        { title: 'إمساك دفاتر الأعمال الدولية', description: 'ختم دفاتر تحويل متسقة على فواتير الشركة لتبسيط عمليات التدقيق في نهاية العام.', icon: 'folder-open' }
      ],
      faq: [
        { question: 'كيف يكتشف مبالغ الفواتير؟', answer: 'يقوم بمسح تدفقات الأحرف بحثًا عن رموز العملات ويحلل العناوين الدلالية مثل "Total" أو "Due" لتحديد المبلغ النهائي للفاتورة.' },
        { question: 'هل يتم جلب أسعار الصرف في الوقت الفعلي؟', answer: 'نعم. بشكل افتراضي، يسترجع الأسعار الأساسية من واجهات برمجة تطبيقات مالية قياسية. يمكنك أيضًا تحديد أسعار مخصصة لعمليات التدقيق الداخلية.' },
        { question: 'هل سيغطي الختم تفاصيل الفاتورة المهمة؟', answer: 'يقوم المحرك بمسح هامش الصفحة للعثور على الموضع الأمثل. الختم شبه شفاف، ويتماشى بأناقة مع تخطيطاتك.' }
      ]
    }
  }
};

console.log("=== INJECTING TOOL CONTENTS FOR FORM LOGIC DESIGNER & GLOBAL INVOICE PARSER ===");

Object.entries(translations).forEach(([lang, data]) => {
  const filePath = path.join(TOOL_CONTENT_DIR, `${lang}.ts`);
  if (!fs.existsSync(filePath)) {
    console.log(`[${lang}] File does not exist at ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if they are already present
  const hasFormLogic = content.includes('form-logic-designer');
  const hasInvoice = content.includes('global-invoice-parser');

  if (hasFormLogic && hasInvoice) {
    console.log(`[${lang}] Already has both tools configured.`);
    return;
  }

  // Build TS code representation
  let injectString = '';
  if (!hasFormLogic) {
    injectString += `  'form-logic-designer': ${JSON.stringify(data['form-logic-designer'], null, 4)},\n\n`;
  }
  if (!hasInvoice) {
    injectString += `  'global-invoice-parser': ${JSON.stringify(data['global-invoice-parser'], null, 4)},\n\n`;
  }

  // Locate the last };
  const lastBraceIndex = content.lastIndexOf('};');
  if (lastBraceIndex === -1) {
    console.log(`[${lang}] Error: Could not find ending };`);
    return;
  }

  const updatedContent = content.slice(0, lastBraceIndex) + injectString + content.slice(lastBraceIndex);
  
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log(`[${lang}] Successfully injected missing tools: ${!hasFormLogic ? 'form-logic-designer ' : ''}${!hasInvoice ? 'global-invoice-parser' : ''}`);
});

console.log("=== INJECTION COMPLETE ===");
