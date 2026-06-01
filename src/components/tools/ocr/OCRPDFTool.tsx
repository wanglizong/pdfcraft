'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { FileUploader } from '../FileUploader';
import { ProcessingProgress, ProcessingStatus } from '../ProcessingProgress';
import { DownloadButton } from '../DownloadButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ocrPDF, type OCROptions, type OCRLanguage, OCR_LANGUAGE_NAMES } from '@/lib/pdf/processors/ocr';
import { Select } from '@/components/ui/FormField';
import type { UploadedFile, ProcessOutput } from '@/types/pdf';
import { 
  Scan, 
  Settings2, 
  Trash2, 
  Check, 
  Sparkles, 
  HelpCircle,
  ShieldCheck,
  Languages
} from 'lucide-react';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export interface OCRPDFToolProps {
  className?: string;
}

export function OCRPDFTool({ className = '' }: OCRPDFToolProps) {
  const t = useTranslations('common');
  const tTools = useTranslations('tools');
  
  // State
  const [file, setFile] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState<Blob | null>(null);
  const [textPreview, setTextPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Options state
  const [languages, setLanguages] = useState<OCRLanguage[]>(['eng']);
  const [outputFormat, setOutputFormat] = useState<OCROptions['outputFormat']>('searchable-pdf'); // Default to searchable PDF
  const [scale, setScale] = useState(2);
  const [pageRange, setPageRange] = useState('');
  
  // Canvas Ref for 3D Laser Mesh Scan animation
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const cancelledRef = useRef(false);

  // Render 3D wavy scanner grid in Canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 200;

    let time = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (status === 'processing') {
        time += 0.05;
        
        ctx.strokeStyle = 'rgba(168, 85, 247, 0.25)'; // Purple mesh
        ctx.lineWidth = 1;

        const cols = 15;
        const rows = 10;
        const colWidth = canvas.width / cols;
        const rowHeight = canvas.height / rows;

        // Draw 3D projected perspective wireframe grid
        for (let r = 0; r <= rows; r++) {
          ctx.beginPath();
          for (let c = 0; c <= cols; c++) {
            // Apply 3D wavy distortion using sin/cos
            const z = Math.sin(c * 0.5 + time) * Math.cos(r * 0.4 + time) * 15;
            
            // 3D perspective projection formula
            const px = c * colWidth;
            const py = r * rowHeight + z;

            if (c === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
        }

        for (let c = 0; c <= cols; c++) {
          ctx.beginPath();
          for (let r = 0; r <= rows; r++) {
            const z = Math.sin(c * 0.5 + time) * Math.cos(r * 0.4 + time) * 15;
            const px = c * colWidth;
            const py = r * rowHeight + z;

            if (r === 0) {
              ctx.moveTo(px, py);
            } else {
              ctx.lineTo(px, py);
            }
          }
          ctx.stroke();
        }

        // Purple scanner laser line sliding top-to-bottom
        const laserY = (canvas.height / 2) + (canvas.height / 2.3) * Math.sin(time * 0.7);
        const gradient = ctx.createLinearGradient(0, laserY, canvas.width, laserY);
        gradient.addColorStop(0, 'rgba(168, 85, 247, 0)');
        gradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.95)');
        gradient.addColorStop(1, 'rgba(168, 85, 247, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.shadowColor = 'rgba(168, 85, 247, 0.8)';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        ctx.moveTo(10, laserY);
        ctx.lineTo(canvas.width - 10, laserY);
        ctx.stroke();
        ctx.shadowBlur = 0; // Reset
      } else {
        // Flat static tech grids in idle state
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 0.5;
        for (let x = 0; x < canvas.width; x += 20) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 20) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [status]);

  /**
   * Handle file selection
   */
  const handleFilesSelected = useCallback((newFiles: File[]) => {
    if (newFiles.length > 0) {
      const uploadedFile: UploadedFile = {
        id: generateId(),
        file: newFiles[0],
        status: 'pending' as const,
      };
      setFile(uploadedFile);
      setError(null);
      setResult(null);
      setTextPreview(null);
    }
  }, []);

  const handleUploadError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    setResult(null);
    setTextPreview(null);
    setError(null);
    setStatus('idle');
    setProgress(0);
  }, []);

  const toggleLanguage = useCallback((lang: OCRLanguage) => {
    setLanguages(prev => {
      if (prev.includes(lang)) {
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== lang);
      }
      return [...prev, lang];
    });
  }, []);

  const parsePageRange = (rangeStr: string): number[] => {
    if (!rangeStr.trim()) return [];
    
    const pages: number[] = [];
    const parts = rangeStr.split(',');
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (trimmed.includes('-')) {
        const [start, end] = trimmed.split('-').map(s => parseInt(s.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) pages.push(i);
          }
        }
      } else {
        const num = parseInt(trimmed, 10);
        if (!isNaN(num) && !pages.includes(num)) {
          pages.push(num);
        }
      }
    }
    
    return pages.sort((a, b) => a - b);
  };

  /**
   * Run OCR Parser
   */
  const handleOCR = useCallback(async () => {
    if (!file) {
      setError('Please upload a PDF file.');
      return;
    }

    cancelledRef.current = false;
    setStatus('processing');
    setProgress(0);
    setError(null);
    setResult(null);
    setTextPreview(null);

    const options: Partial<OCROptions> = {
      languages,
      outputFormat,
      scale,
      pages: parsePageRange(pageRange),
    };

    try {
      const output: ProcessOutput = await ocrPDF(
        file.file,
        options,
        (prog, message) => {
          if (!cancelledRef.current) {
            setProgress(prog);
            setProgressMessage(message || 'Initializing model workers...');
          }
        }
      );

      if (cancelledRef.current) {
        setStatus('idle');
        return;
      }

      if (output.success && output.result) {
        const blob = output.result as Blob;
        setResult(blob);
        
        if (outputFormat === 'text') {
          const text = await blob.text();
          setTextPreview(text.length > 5000 ? text.substring(0, 5000) + '\n...(truncated)' : text);
        }
        
        setStatus('complete');
      } else {
        setError(output.error?.message || 'Failed to perform OCR on PDF.');
        setStatus('error');
      }
    } catch (err) {
      if (!cancelledRef.current) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        setStatus('error');
      }
    }
  }, [file, languages, outputFormat, scale, pageRange]);

  const handleCancel = useCallback(() => {
    cancelledRef.current = true;
    setStatus('idle');
    setProgress(0);
  }, []);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isProcessing = status === 'processing' || status === 'uploading';
  const canProcess = file && !isProcessing;

  const availableLanguages: OCRLanguage[] = ['eng', 'chi_sim', 'chi_tra', 'jpn', 'kor', 'spa', 'fra', 'deu', 'por', 'ara'];

  return (
    <div className={`space-y-6 ${className}`.trim()}>
      
      {/* File Upload Zone */}
      {!file && (
        <FileUploader
          accept={['application/pdf', '.pdf']}
          multiple={false}
          maxFiles={1}
          onFilesSelected={handleFilesSelected}
          onError={handleUploadError}
          disabled={isProcessing}
          label={tTools('ocrPdf.uploadLabel') || 'Upload PDF'}
          description={tTools('ocrPdf.uploadDescription') || 'Drag and drop a scanned PDF file here, or click to browse.'}
        />
      )}

      {/* Error Block */}
      {error && (
        <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400">
          <p className="text-sm font-semibold">{error}</p>
        </div>
      )}

      {/* File metadata bar */}
      {file && (
        <Card variant="outlined" className="p-4 flex items-center justify-between border-2 border-[hsl(var(--color-primary)/0.25)] rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[hsl(var(--color-primary)/0.1)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[hsl(var(--color-primary))]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-sm text-[hsl(var(--color-foreground))]">{file.file.name}</p>
              <p className="text-xs text-[hsl(var(--color-muted-foreground))]">{formatSize(file.file.size)}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleRemoveFile} disabled={isProcessing}>
            {t('buttons.remove') || 'Remove'}
          </Button>
        </Card>
      )}

      {/* Primary Workspace */}
      {file && status !== 'complete' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: OCR Options */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <Card variant="default" className="flex-1 p-6 rounded-[2rem] border border-white/20 dark:border-zinc-800/40 bg-white/40 dark:bg-black/30 backdrop-blur-md flex flex-col justify-between shadow-xl space-y-6">
              
              <div className="space-y-4 flex-1">
                <div className="border-b border-[hsl(var(--color-border))] pb-3">
                  <h3 className="text-base font-bold text-[hsl(var(--color-foreground))] flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-[hsl(var(--color-primary))]" />
                    {t('ocr.optionsTitle')}
                  </h3>
                </div>

                {/* Multi language choice */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider flex items-center gap-1.5">
                    <Languages className="w-4 h-4" /> {t('ocr.selectLang')}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {availableLanguages.map(lang => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => toggleLanguage(lang)}
                        disabled={isProcessing}
                        className={`
                          px-3 py-1.5 rounded-xl text-xs font-bold transition-all border
                          ${languages.includes(lang)
                            ? 'bg-[hsl(var(--color-primary))] text-white border-[hsl(var(--color-primary))]'
                            : 'bg-white/50 dark:bg-zinc-800/50 text-zinc-600 border-[hsl(var(--color-border))]'
                          }
                        `}
                      >
                        {OCR_LANGUAGE_NAMES[lang]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Format Output */}
                  <div>
                    <label className="block text-[11px] font-bold text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider mb-2">
                      {t('ocr.outputFormat')}
                    </label>
                    <Select
                      value={outputFormat}
                      onChange={(e) => setOutputFormat(e.target.value as OCROptions['outputFormat'])}
                      disabled={isProcessing}
                    >
                      <option value="searchable-pdf">{t('ocr.formatSearchablePdf')}</option>
                      <option value="text">{t('ocr.formatText')}</option>
                    </Select>
                  </div>

                  {/* Resolution scale */}
                  <div>
                    <label className="block text-[11px] font-bold text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider mb-2">
                      {t('ocr.accuracyTitle')}
                    </label>
                    <Select
                      value={scale}
                      onChange={(e) => setScale(parseFloat(e.target.value))}
                      disabled={isProcessing}
                    >
                      <option value="1">{t('ocr.accuracySd')}</option>
                      <option value="2">{t('ocr.accuracyHd')}</option>
                      <option value="3">{t('ocr.accuracyUd')}</option>
                    </Select>
                  </div>

                  {/* Range */}
                  <div>
                    <label className="block text-[11px] font-bold text-[hsl(var(--color-muted-foreground))] uppercase tracking-wider mb-2">
                      {t('ocr.specifyPages')}
                    </label>
                    <input
                      type="text"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                      placeholder={t('ocr.pagesPlaceholder')}
                      disabled={isProcessing}
                      className="w-full px-3 py-2 rounded-xl border border-[hsl(var(--color-border))] bg-white dark:bg-zinc-800 text-xs focus:ring-1 focus:ring-[hsl(var(--color-primary))]"
                    />
                  </div>
                </div>
              </div>

              {/* Start Trigger */}
              <div className="pt-4 border-t border-[hsl(var(--color-border))] mt-6">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full py-4 font-bold shadow-lg flex items-center justify-center gap-2"
                  onClick={handleOCR}
                  disabled={!canProcess}
                >
                  <Scan className="w-5 h-5" />
                  {t('ocr.startOcr')}
                </Button>
              </div>

            </Card>
          </div>

          {/* RIGHT: 3D Holographic Wireframe Scan visualizer */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <Card variant="outlined" className="flex-1 p-6 bg-zinc-950 border-2 border-dashed border-[hsl(var(--color-border))] rounded-[2rem] flex flex-col items-center justify-center relative overflow-hidden shadow-inner h-full min-h-[380px]">
              
              {/* Scan grid canvas */}
              <div className="relative w-full aspect-video flex items-center justify-center z-10">
                <canvas ref={canvasRef} className="w-full max-w-[280px] h-full" />
                {/* Floating alert */}
                {status === 'processing' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <div className="px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-bold text-[10px] tracking-widest uppercase animate-pulse">
                      Analyzing Pixels
                    </div>
                  </div>
                )}
              </div>

              {/* Info text box */}
              <div className="w-full mt-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 z-20 space-y-1.5">
                <h4 className="text-[10px] font-black tracking-widest text-purple-400 uppercase flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  {t('ocr.advantageTitle')}
                </h4>
                <p className="text-[10px] text-zinc-400 leading-relaxed pl-1">
                  {t.rich('ocr.advantageDesc', {
                    b: (chunks) => <b>{chunks}</b>
                  })}
                </p>
              </div>

            </Card>
          </div>

        </div>
      )}

      {/* Progress Block */}
      {isProcessing && progress > 5 && (
        <ProcessingProgress
          progress={progress}
          status={status}
          message={progressMessage}
          onCancel={handleCancel}
          showPercentage
        />
      )}

      {/* Complete Outcomes screen */}
      {status === 'complete' && result && (
        <Card variant="default" className="p-8 rounded-[2.5rem] bg-white/40 dark:bg-black/30 backdrop-blur-md border border-white/20 dark:border-zinc-800/40 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-sm mx-auto">
            <h3 className="text-base font-extrabold text-[hsl(var(--color-foreground))]">{t('ocr.successTitle')}</h3>
            <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
              {outputFormat === 'searchable-pdf' 
                ? t('ocr.successSearchable') 
                : t('ocr.successText')
              }
            </p>
          </div>

          <div className="flex gap-3 justify-center max-w-xs mx-auto">
            <DownloadButton
              file={result}
              filename={`${file?.file.name.replace(/\.pdf$/i, '')}_ocr.${outputFormat === 'text' ? 'txt' : 'pdf'}`}
              variant="primary"
              size="lg"
              className="flex-1 font-bold shadow-lg"
              showFileSize
            />
          </div>
        </Card>
      )}

      {/* Pure text preview box */}
      {textPreview && (
        <Card variant="outlined" size="lg" className="rounded-3xl shadow-sm">
          <h3 className="text-sm font-bold text-[hsl(var(--color-foreground))] mb-4">
            {t('ocr.previewTitle')}
          </h3>
          <pre className="p-4 bg-[hsl(var(--color-muted)/0.35)] border border-[hsl(var(--color-border))] rounded-2xl overflow-auto max-h-64 text-xs font-mono text-[hsl(var(--color-foreground))] whitespace-pre-wrap leading-normal">
            {textPreview}
          </pre>
        </Card>
      )}

    </div>
  );
}

export default OCRPDFTool;
