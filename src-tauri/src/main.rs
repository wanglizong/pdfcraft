#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::Deserialize;
use std::env;
use std::fs;
use tauri_plugin_dialog::DialogExt;

#[derive(Debug, Deserialize)]
pub struct FileFilter {
    pub name: String,
    pub extensions: Vec<String>,
}

#[tauri::command]
async fn open_files(app: tauri::AppHandle, filters: Vec<FileFilter>) -> Result<Vec<String>, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    let mut builder = app.dialog().file();

    for filter in filters {
        let exts: Vec<&str> = filter.extensions.iter().map(|s| s.as_str()).collect();
        builder = builder.add_filter(filter.name, &exts);
    }

    builder.pick_files(move |paths| {
        let _ = tx.send(paths);
    });

    match rx.recv().map_err(|e| e.to_string())? {
        Some(paths) => {
            let mut result = Vec::new();
            for path in paths {
                let resolved_path = path.into_path().map_err(|e| e.to_string())?;
                result.push(resolved_path.display().to_string());
            }
            Ok(result)
        }
        None => Ok(vec![]),
    }
}

#[tauri::command]
async fn save_file(app: tauri::AppHandle, suggested_name: String, filters: Vec<FileFilter>) -> Result<String, String> {
    let (tx, rx) = std::sync::mpsc::channel();
    let mut builder = app.dialog().file().set_file_name(suggested_name);

    for filter in filters {
        let exts: Vec<&str> = filter.extensions.iter().map(|s| s.as_str()).collect();
        builder = builder.add_filter(filter.name, &exts);
    }

    builder.save_file(move |path| {
        let _ = tx.send(path);
    });

    match rx.recv().map_err(|e| e.to_string())? {
        Some(path) => {
            let resolved_path = path.into_path().map_err(|e| e.to_string())?;
            Ok(resolved_path.display().to_string())
        }
        None => Err("No file selected".to_string()),
    }
}

#[tauri::command]
fn read_file(path: String) -> Result<Vec<u8>, String> {
    fs::read(&path).map_err(|e| e.to_string())
}

#[tauri::command]
fn write_file(path: String, data: Vec<u8>) -> Result<(), String> {
    fs::write(&path, data).map_err(|e| e.to_string())
}

#[tauri::command]
fn get_temp_dir() -> String {
    env::temp_dir().display().to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            open_files,
            save_file,
            read_file,
            write_file,
            get_temp_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
