fn strip_bom_from_capabilities() {
    if let Ok(entries) = std::fs::read_dir("capabilities") {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().and_then(|e| e.to_str()) == Some("json") {
                if let Ok(bytes) = std::fs::read(&path) {
                    if bytes.starts_with(&[0xef, 0xbb, 0xbf]) {
                        let _ = std::fs::write(&path, &bytes[3..]);
                    }
                }
            }
        }
    }
}

fn main() {
    strip_bom_from_capabilities();
    if let Err(error) = tauri_build::try_build(tauri_build::Attributes::new()) {
        eprintln!("Error in tauri_build: {error:#}");
        std::process::exit(1);
    }
}
