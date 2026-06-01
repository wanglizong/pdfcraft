'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FileUploader } from '../FileUploader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { withBasePath } from '@/lib/utils/path';

export interface SignPDFToolProps {
  className?: string;
}

interface SignState {
  file: File | null;
  viewerReady: boolean;
}

type PdfViewerWindow = Window & {
  PDFViewerApplication?: {
    initializedPromise: Promise<void>;
    open: (args: { data: Uint8Array }) => Promise<void>;
    pdfDocument?: {
      annotationStorage: { size: number };
      saveDocument: () => Promise<Uint8Array | ArrayBuffer>;
    };
    pdfViewer?: {
      annotationEditorUIManager?: { commitOrRemove: () => void };
      annotationEditorMode: { mode: number };
    };
    eventBus?: {
      _on: (
        event: string,
        listener: () => void,
        options?: { once?: boolean }
      ) => void;
    };
  };
  pdfjsLib?: {
    AnnotationEditorType?: { NONE: number };
  };
};

const VIEWER_HTML = withBasePath('/pdfjs-viewer/viewer.html');

/**
 * SignPDFTool Component
 * Uses PDF.js viewer with native signature editor for comprehensive signing support.
 * Supports: draw (handwritten), type, and image signatures.
 */
export function SignPDFTool({ className = '' }: SignPDFToolProps) {
  const t = useTranslations('common');
  const tTools = useTranslations('tools');

  const [signState, setSignState] = useState<SignState>({
    file: null,
    viewerReady: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const fileRef = useRef<File | null>(null);

  /**
   * Handle file selected
   */
  const handleFilesSelected = useCallback((files: File[]) => {
    if (files.length > 0) {
      const file = files[0];
      fileRef.current = file;

      // Configure PDF.js preferences for signature editor
      try {
        const existingPrefsRaw = localStorage.getItem('pdfjs.preferences');
        const existingPrefs = existingPrefsRaw ? JSON.parse(existingPrefsRaw) : {};
        delete existingPrefs.annotationEditorMode;
        const newPrefs = {
          ...existingPrefs,
          enableSignatureEditor: true,
          enablePermissions: false,
        };
        localStorage.setItem('pdfjs.preferences', JSON.stringify(newPrefs));
      } catch (e) {
        console.warn('Could not set PDF.js preferences:', e);
      }

      setSignState({
        file,
        viewerReady: false,
      });
      setError(null);
    }
  }, []);

  /**
   * Handle file upload error
   */
  const handleUploadError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  /**
   * Enable signature tools in the viewer UI
   */
  const enableSignatureTools = useCallback((viewerWindow: PdfViewerWindow) => {
    const app = viewerWindow.PDFViewerApplication;
    if (!app?.eventBus) return;

    const doc = viewerWindow.document;
    const { eventBus } = app;

    const enable = () => {
      const editorModeButtons = doc.getElementById('editorModeButtons');
      editorModeButtons?.classList.remove('hidden');

      const editorSignature = doc.getElementById('editorSignature');
      editorSignature?.removeAttribute('hidden');

      const editorSignatureButton = doc.getElementById('editorSignatureButton') as HTMLButtonElement | null;
      if (editorSignatureButton) {
        editorSignatureButton.disabled = false;
      }

      const editorStamp = doc.getElementById('editorStamp');
      editorStamp?.removeAttribute('hidden');

      const editorStampButton = doc.getElementById('editorStampButton') as HTMLButtonElement | null;
      if (editorStampButton) {
        editorStampButton.disabled = false;
      }
    };

    eventBus._on('annotationeditoruimanager', enable);
    enable();
  }, []);

  /**
   * Load PDF into viewer via ArrayBuffer (avoids blob: URL issues on HTTP)
   */
  const handleIframeLoad = useCallback(async () => {
    const file = fileRef.current;
    const iframe = iframeRef.current;
    if (!file || !iframe?.contentWindow) return;

    try {
      const viewerWindow = iframe.contentWindow as PdfViewerWindow;
      const app = viewerWindow.PDFViewerApplication;
      if (!app) return;

      await app.initializedPromise;

      let documentLoaded = false;
      const onDocumentLoaded = () => {
        if (documentLoaded) return;
        documentLoaded = true;
        setSignState(prev => ({ ...prev, viewerReady: true }));
        enableSignatureTools(viewerWindow);
      };

      app.eventBus?._on('documentloaded', onDocumentLoaded, { once: true });

      const pdfData = new Uint8Array(await file.arrayBuffer());
      await app.open({ data: pdfData });

      if (!documentLoaded && app.pdfDocument) {
        onDocumentLoaded();
      }
    } catch (e) {
      console.error('Could not load PDF in viewer:', e);
      setError('Failed to load PDF in the viewer. Please try again.');
    }
  }, [enableSignatureTools]);

  /**
   * Save signed PDF using PDF.js native save (embeds signatures into the file)
   */
  const handleSave = useCallback(async () => {
    if (!signState.viewerReady || !iframeRef.current) {
      setError('Viewer not ready. Please wait for the PDF to load.');
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const viewerWindow = iframeRef.current.contentWindow as PdfViewerWindow;
      const app = viewerWindow.PDFViewerApplication;

      if (!app?.pdfDocument) {
        setError('PDF viewer not initialized.');
        setIsProcessing(false);
        return;
      }

      const { pdfDocument, pdfViewer } = app;

      // Commit any signature still being placed/edited
      pdfViewer?.annotationEditorUIManager?.commitOrRemove();
      // Exit editor mode (PDF.js expects { mode }, not a raw number; DISABLE is invalid here)
      if (pdfViewer) {
        const editorNone =
          viewerWindow.pdfjsLib?.AnnotationEditorType?.NONE ?? 0;
        pdfViewer.annotationEditorMode = { mode: editorNone };
      }

      if (pdfDocument.annotationStorage.size === 0) {
        setError(
          'No signature found. Add a signature using the pen tool in the toolbar, then try again.'
        );
        setIsProcessing(false);
        return;
      }

      const rawPdfBytes = await pdfDocument.saveDocument();
      const pdfBytes = Uint8Array.from(
        rawPdfBytes instanceof Uint8Array ? rawPdfBytes : new Uint8Array(rawPdfBytes)
      );

      const blob = new Blob([pdfBytes.buffer], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `signed_${signState.file?.name || 'document.pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setIsProcessing(false);
    } catch (err) {
      console.error('Failed to save signed PDF:', err);
      setError('Failed to save signed PDF. Please try again.');
      setIsProcessing(false);
    }
  }, [signState.viewerReady, signState.file]);

  /**
   * Clear and start over
   */
  const handleClear = useCallback(() => {
    fileRef.current = null;
    setSignState({
      file: null,
      viewerReady: false,
    });
    setError(null);
  }, []);

  return (
    <div className={`space-y-6 ${className}`.trim()}>
      {/* File Upload Area - Only show when no file */}
      {!signState.file && (
        <FileUploader
          accept={['application/pdf', '.pdf']}
          multiple={false}
          maxFiles={1}
          onFilesSelected={handleFilesSelected}
          onError={handleUploadError}
          disabled={isProcessing}
          label={tTools('signPdf.uploadLabel') || 'Upload PDF File'}
          description={tTools('signPdf.uploadDescription') || 'Drag and drop a PDF file to sign.'}
        />
      )}

      {/* Error Message */}
      {error && (
        <div
          className="p-4 rounded-[var(--radius-md)] bg-red-50 border border-red-200 text-red-700"
          role="alert"
        >
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* PDF Viewer */}
      {signState.file && (
        <>
          {/* File Info & Clear Button */}
          <Card variant="outlined">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  <path d="M14 2v6h6" fill="white" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-[hsl(var(--color-foreground))]">
                    {signState.file.name}
                  </p>
                  <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                    {(signState.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={isProcessing}
              >
                {t('buttons.remove') || 'Remove'}
              </Button>
            </div>
          </Card>

          {/* Instructions */}
          <Card variant="outlined" className="bg-blue-50 border-blue-200">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium mb-1">{tTools('signPdf.instructionsTitle') || 'How to Sign'}</p>
                <ol className="list-decimal list-inside space-y-1 text-blue-600">
                  <li>{tTools('signPdf.instruction1') || 'Click the Signature tool (pen icon) in the toolbar'}</li>
                  <li>{tTools('signPdf.instruction2') || 'Draw, type, or upload your signature'}</li>
                  <li>{tTools('signPdf.instruction3') || 'Click where you want to place the signature'}</li>
                  <li>{tTools('signPdf.instruction4') || 'Click "Save Signed PDF" below when done'}</li>
                </ol>
              </div>
            </div>
          </Card>

          {/* PDF.js Viewer Iframe */}
          <div className="border border-[hsl(var(--color-border))] rounded-[var(--radius-lg)] overflow-hidden">
            <iframe
              key={signState.file.name + signState.file.lastModified}
              ref={iframeRef}
              src={VIEWER_HTML}
              onLoad={handleIframeLoad}
              className="w-full bg-gray-100"
              style={{ height: '600px', border: 'none' }}
              title="PDF Signature Editor"
            />
          </div>

          {/* Save Button */}
          <Card variant="outlined">
            <div className="flex gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleSave}
                disabled={!signState.viewerReady || isProcessing}
                loading={isProcessing}
              >
                {isProcessing
                  ? (t('status.processing') || 'Processing...')
                  : (tTools('signPdf.saveButton') || 'Save Signed PDF')
                }
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}

export default SignPDFTool;
