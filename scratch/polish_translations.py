import json

def main():
    input_path = r'd:/NextProject/pdfcraft/scratch/google-translated.json'
    output_path = r'd:/NextProject/pdfcraft/scratch/translated-messages-chunk4-partC.json'
    
    with open(input_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
        
    # Dictionary of specific professional improvements
    improvements = {
        "id": {
            "tools.deskewPdf.filesTitle": "Berkas untuk Dikoreksi Kemiringannya",
            "tools.deskewPdf.optionsTitle": "Opsi Koreksi Kemiringan",
            "tools.deskewPdf.processButton": "Koreksi Kemiringan PDF",
            "tools.deskewPdf.successMessage": "Kemiringan berkas PDF berhasil dikoreksi!",
            "tools.findAndRedact.uploadDescription": "Seret dan lepas berkas PDF untuk mencari dan menyensor teks.",
            "tools.findAndRedact.selectMatchesToRedact": "Silakan pilih setidaknya satu hasil yang cocok untuk disensor.",
            "tools.findAndRedact.redactionOptions": "Opsi Sensor Data",
            "tools.findAndRedact.redactionColor": "Warna Sensor",
            "tools.findAndRedact.replacementTextPlaceholder": "misalnya, [DISENSOR]",
            "tools.findAndRedact.addBorder": "Tambahkan bingkai di sekitar area yang disensor",
            "tools.findAndRedact.redactButton": "Sensor {count} Terpilih",
            "tools.findAndRedact.redactFailed": "Gagal menerapkan sensor data.",
            "tools.findAndRedact.successMessage": "Teks yang dipilih berhasil disensor! Klik unduh untuk menyimpan.",
            "tools.tableOfContents.tocTitlePlaceholder": "Masukkan judul Daftar Isi...",
            "tools.watermark.repeatEnable": "Terapkan tanda air berulang di seluruh halaman"
        },
        "ro": {
            "tools.deskewPdf.filesTitle": "Fișiere de corectare a înclinării",
            "tools.deskewPdf.optionsTitle": "Opțiuni de corectare a înclinării",
            "tools.deskewPdf.processButton": "Corectați înclinarea PDF-urilor",
            "tools.deskewPdf.successMessage": "Înclinarea fișierelor PDF a fost corectată cu succes!",
            "tools.findAndRedact.uploadDescription": "Trageți și plasați un fișier PDF pentru a căuta și a anonimiza/cenzura text.",
            "tools.findAndRedact.selectMatchesToRedact": "Vă rugăm să selectați cel puțin o potrivire pentru a o anonimiza.",
            "tools.findAndRedact.redactionOptions": "Opțiuni de anonimizare",
            "tools.findAndRedact.redactionColor": "Culoare de mascare",
            "tools.findAndRedact.replacementTextPlaceholder": "de ex., [ANONIMIZAT]",
            "tools.findAndRedact.addBorder": "Adăugați chenar în jurul zonelor anonimizate",
            "tools.findAndRedact.redactButton": "Anonimizați {count} elemente selectate",
            "tools.findAndRedact.redactFailed": "Aplicarea anonimizării a eșuat.",
            "tools.findAndRedact.successMessage": "Textul selectat a fost anonimizat cu succes! Faceți clic pe descărcare pentru a salva.",
            "tools.tableOfContents.tocTitlePlaceholder": "Introduceți titlul cuprinsului...",
            "tools.watermark.repeatEnable": "Aplicați filigranul în mozaic pe întreaga pagină"
        },
        "vi": {
            "tools.deskewPdf.filesTitle": "Tập tin cần khử nghiêng",
            "tools.deskewPdf.optionsTitle": "Tùy chọn khử nghiêng",
            "tools.deskewPdf.processButton": "Khử nghiêng PDF",
            "tools.deskewPdf.successMessage": "Đã khử nghiêng thành công (các) tệp PDF!",
            "tools.findAndRedact.uploadDescription": "Kéo và thả tệp PDF để tìm kiếm và che thông tin nhạy cảm.",
            "tools.findAndRedact.selectMatchesToRedact": "Vui lòng chọn ít nhất một kết quả phù hợp để che thông tin.",
            "tools.findAndRedact.redactionOptions": "Tùy chọn che thông tin nhạy cảm",
            "tools.findAndRedact.redactionColor": "Màu che thông tin nhạy cảm",
            "tools.findAndRedact.replacementTextPlaceholder": "ví dụ: [ĐÃ CHE]",
            "tools.findAndRedact.addBorder": "Thêm viền xung quanh các khu vực được che thông tin",
            "tools.findAndRedact.redactButton": "Che thông tin {count} mục đã chọn",
            "tools.findAndRedact.redactFailed": "Không thể áp dụng tính năng che thông tin nhạy cảm.",
            "tools.findAndRedact.successMessage": "Đã che thông tin thành công văn bản đã chọn! Bấm tải về để lưu.",
            "tools.tableOfContents.tocTitlePlaceholder": "Nhập tiêu đề mục lục...",
            "tools.watermark.repeatEnable": "Hiển thị hình mờ lặp lại trên toàn bộ trang"
        },
        "ar": {
            "tools.deskewPdf.filesTitle": "الملفات المطلوب تصحيح ميلها",
            "tools.deskewPdf.optionsTitle": "خيارات تصحيح ميل الصفحات",
            "tools.deskewPdf.processButton": "تصحيح ميل ملفات PDF",
            "tools.deskewPdf.successMessage": "تم تصحيح ميل ملف (ملفات) PDF بنجاح!",
            "tools.findAndRedact.uploadDescription": "قم بسحب وإسقاط ملف PDF للبحث عن النص وتعتيمه.",
            "tools.findAndRedact.selectMatchesToRedact": "يرجى تحديد تطابق واحد على الأقل لتعتيمه.",
            "tools.findAndRedact.redactionOptions": "خيارات تعتيم النص",
            "tools.findAndRedact.redactionColor": "لون التعتيم",
            "tools.findAndRedact.replacementTextPlaceholder": "على سبيل المثال، [تم التعتيم]",
            "tools.findAndRedact.addBorder": "أضف حدوداً حول المناطق المعتَّمة",
            "tools.findAndRedact.redactButton": "تعتيم {count} من العناصر المحددة",
            "tools.findAndRedact.redactFailed": "فشل تطبيق عمليات التعتيم.",
            "tools.findAndRedact.successMessage": "تم تعتيم النص المحدد بنجاح! انقر فوق تنزيل للحفظ.",
            "tools.tableOfContents.tocTitlePlaceholder": "أدخل عنوان جدول المحتويات...",
            "tools.watermark.repeatEnable": "تكرار العلامة المائية على كامل الصفحة"
        }
    }
    
    # Apply improvements
    for lang, keys_dict in improvements.items():
        if lang in data:
            for key, improved_val in keys_dict.items():
                if key in data[lang]:
                    data[lang][key] = improved_val
                    
    # Write optimized, strict JSON format output
    with open(output_path, 'w', encoding='utf-8') as out:
        json.dump(data, out, ensure_ascii=False, indent=2)
        
    print("Done polishing! Saved output to", output_path)

if __name__ == '__main__':
    main()
