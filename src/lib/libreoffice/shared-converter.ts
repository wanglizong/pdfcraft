/**
 * Shared LibreOffice converter loader for document-to-PDF processors.
 * Resets the init promise on failure so retries (e.g. workflow nodes) can recover.
 */

import type { LibreOfficeConverter, ProgressCallback } from './converter';
import { isCrossOriginIsolated } from '@/lib/utils/cross-origin-isolated';

let converterPromise: Promise<LibreOfficeConverter> | null = null;
let converterInstance: LibreOfficeConverter | null = null;

export async function getSharedLibreOfficeConverter(
  onProgress?: (percent: number, message: string) => void
): Promise<LibreOfficeConverter> {
  if (converterInstance?.isReady()) {
    return converterInstance;
  }

  if (!converterPromise) {
    converterPromise = (async () => {
      const { getLibreOfficeConverter } = await import('./converter');
      const instance = getLibreOfficeConverter();
      await instance.initialize((progress) => {
        onProgress?.(progress.percent, progress.message);
      });
      converterInstance = instance;
      return instance;
    })().catch((error) => {
      converterPromise = null;
      converterInstance = null;
      throw error;
    });
  }

  try {
    return await converterPromise;
  } catch (error) {
    converterPromise = null;
    converterInstance = null;
    throw error;
  }
}

/** Tool IDs that require LibreOffice WASM */
export const LIBREOFFICE_TOOL_IDS = new Set([
  'word-to-pdf',
  'excel-to-pdf',
  'pptx-to-pdf',
  'ppt-to-pdf',
  'rtf-to-pdf',
]);

export async function preloadLibreOfficeConverter(
  onProgress?: ProgressCallback
): Promise<void> {
  if (!isCrossOriginIsolated()) {
    return;
  }
  await getSharedLibreOfficeConverter((percent, message) => {
    onProgress?.({ phase: 'loading', percent, message });
  });
}
