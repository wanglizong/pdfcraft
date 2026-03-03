/**
 * Post-build script: Decompress LibreOffice WASM .gz files
 * 
 * Problem: soffice.wasm (~147MB) and soffice.data (~100MB) exceed GitHub's 
 * 100MB file size limit, so only .gz compressed versions are committed to Git.
 * However, browsers request the uncompressed filenames (soffice.wasm, soffice.data).
 * 
 * Solution: After `next build` generates the `out/` directory, this script
 * decompresses all .gz files in out/libreoffice-wasm/ so both versions exist.
 * This ensures compatibility across all deployment platforms:
 * - Docker/Nginx: Uses gzip_static to serve .gz efficiently
 * - Vercel/Netlify/Cloudflare Pages: Serves the decompressed originals
 * - GitHub Pages: Serves decompressed originals (but lacks COOP/COEP headers)
 */

import { createReadStream, createWriteStream, readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';
import { createGunzip } from 'zlib';
import { pipeline } from 'stream/promises';

const WASM_DIR = join(process.cwd(), 'out', 'libreoffice-wasm');

async function decompressFile(gzPath, outPath) {
    const gunzip = createGunzip();
    const source = createReadStream(gzPath);
    const destination = createWriteStream(outPath);
    await pipeline(source, gunzip, destination);
}

async function main() {
    if (!existsSync(WASM_DIR)) {
        console.log('[postbuild] No libreoffice-wasm directory found in out/, skipping.');
        return;
    }

    const files = readdirSync(WASM_DIR).filter(f => f.endsWith('.gz'));

    if (files.length === 0) {
        console.log('[postbuild] No .gz files found in out/libreoffice-wasm/, skipping.');
        return;
    }

    console.log(`[postbuild] Decompressing ${files.length} WASM .gz file(s)...`);

    for (const gzFile of files) {
        const gzPath = join(WASM_DIR, gzFile);
        const outFile = gzFile.replace(/\.gz$/, '');
        const outPath = join(WASM_DIR, outFile);

        // Skip if already decompressed
        if (existsSync(outPath)) {
            const gzStat = statSync(gzPath);
            const outStat = statSync(outPath);
            // If decompressed file is larger than gz, it's likely already good
            if (outStat.size > gzStat.size) {
                console.log(`[postbuild]   ${outFile} already exists (${(outStat.size / 1024 / 1024).toFixed(1)}MB), skipping.`);
                continue;
            }
        }

        try {
            const gzStat = statSync(gzPath);
            console.log(`[postbuild]   Decompressing ${gzFile} (${(gzStat.size / 1024 / 1024).toFixed(1)}MB)...`);
            await decompressFile(gzPath, outPath);
            const outStat = statSync(outPath);
            console.log(`[postbuild]   → ${outFile} (${(outStat.size / 1024 / 1024).toFixed(1)}MB)`);
        } catch (err) {
            console.error(`[postbuild]   Failed to decompress ${gzFile}:`, err.message);
        }
    }

    console.log('[postbuild] WASM decompression complete.');
}

main().catch(err => {
    console.error('[postbuild] Error:', err);
    // Don't fail the build if decompression fails
    process.exit(0);
});
