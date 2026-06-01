'use client';

import React, { useState, useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { FileUploader } from '../FileUploader';
import { ProcessingProgress, ProcessingStatus } from '../ProcessingProgress';
import { DownloadButton } from '../DownloadButton';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { addWatermark, WatermarkOptions } from '@/lib/pdf/processors/watermark';
import { parsePageSelection, extractPages } from '@/lib/pdf/processors/extract';
import { loadPdfLib } from '@/lib/pdf/loader';
import type { ProcessOutput } from '@/types/pdf';

export interface WatermarkToolProps {
  className?: string;
}

/**
 * Convert any image file to PNG format using Canvas
 * This ensures compatibility with pdf-lib which doesn't support
 * progressive JPEG, CMYK color space, and some other formats
 */
async function convertImageToPng(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      try {
        // Create canvas with image dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;

        // Draw image to canvas
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        ctx.drawImage(img, 0, 0);

        // Convert to PNG blob
        canvas.toBlob((blob) => {
          if (blob) {
            blob.arrayBuffer().then(resolve).catch(reject);
          } else {
            reject(new Error('Failed to convert image to PNG'));
          }
        }, 'image/png');
      } finally {
        URL.revokeObjectURL(url);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

type WatermarkType = 'text' | 'image';

export function WatermarkTool({ className = '' }: WatermarkToolProps) {
  const t = useTranslations('common');
  const tTools = useTranslations('tools.watermark');

  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  // Watermark type
  const [watermarkType, setWatermarkType] = useState<WatermarkType>('text');

  // Text watermark options
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(72);
  const [textColor, setTextColor] = useState('#888888');
  const [textOpacity, setTextOpacity] = useState(0.3);
  const [textAngle, setTextAngle] = useState(-45);

  // Image watermark options
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageOpacity, setImageOpacity] = useState(0.3);
  const [imageAngle, setImageAngle] = useState(0);

  // Repeat/tile watermark options
  const [repeatWatermark, setRepeatWatermark] = useState(false);
  const [staggerWatermark, setStaggerWatermark] = useState(true);
  const [repeatSpacingX, setRepeatSpacingX] = useState(200);
  const [repeatSpacingY, setRepeatSpacingY] = useState(150);

  // Page range options
  const [pageMode, setPageMode] = useState<'all' | 'odd' | 'even' | 'custom'>('all');
  const [customPageRange, setCustomPageRange] = useState('');

  const cancelledRef = useRef(false);

  const handleFilesSelected = useCallback(async (files: File[]) => {
    if (files.length > 0) {
      const selectedFile = files[0];
      setFile(selectedFile);
      setError(null);
      setResult(null);

      // Get total pages
      try {
        const pdfLib = await loadPdfLib();
        const arrayBuffer = await selectedFile.arrayBuffer();
        const pdf = await pdfLib.PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        setTotalPages(pdf.getPageCount());
      } catch (err) {
        console.error('Failed to load PDF to get page count:', err);
      }
    }
  }, []);

  const handleImageSelected = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === 'image/png' || selectedFile.type === 'image/jpeg') {
        setImageFile(selectedFile);
        setError(null);
      } else {
        setError(tTools('unsupportedImage'));
      }
    }
  }, [tTools]);

  const handleClearFile = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setStatus('idle');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  }, [previewUrl]);

  const handleProcess = useCallback(async () => {
    if (!file) return;
    if (watermarkType === 'text' && !watermarkText.trim()) {
      setError(tTools('enterText'));
      return;
    }
    if (watermarkType === 'image' && !imageFile) {
      setError(tTools('selectImage'));
      return;
    }

    if (pageMode === 'custom' && !customPageRange.trim()) {
      setError(tTools('rangePlaceholder'));
      return;
    }

    cancelledRef.current = false;
    setStatus('processing');
    setProgress(0);
    setError(null);
    setResult(null);

    try {
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
      };

      let options: WatermarkOptions;

      if (watermarkType === 'text') {
        options = {
          type: 'text',
          text: watermarkText,
          fontSize,
          color: hexToRgb(textColor),
          opacity: textOpacity,
          rotation: textAngle,
          pages: 'all',
          repeat: repeatWatermark,
          stagger: staggerWatermark,
          repeatSpacingX,
          repeatSpacingY,
        };
      } else {
        const imageData = await convertImageToPng(imageFile!);
        options = {
          type: 'image',
          imageData,
          imageType: 'png',
          opacity: imageOpacity,
          rotation: imageAngle,
          pages: 'all',
          repeat: repeatWatermark,
          stagger: staggerWatermark,
          repeatSpacingX,
          repeatSpacingY,
        };
      }

      // Prepare pages option
      let pages: WatermarkOptions['pages'] = 'all';
      if (pageMode === 'odd') pages = 'odd';
      else if (pageMode === 'even') pages = 'even';
      else if (pageMode === 'custom') {
        pages = parsePageSelection(customPageRange, totalPages);
      }
      options.pages = pages;

      const output: ProcessOutput = await addWatermark(file, options, (prog, message) => {
        if (!cancelledRef.current) {
          setProgress(prog);
          setProgressMessage(message || '');
        }
      });

      if (cancelledRef.current) {
        setStatus('idle');
        return;
      }

      if (output.success && output.result) {
        setResult(output.result as Blob);
        setStatus('complete');
      } else {
        setError(output.error?.message || tTools('failed'));
        setStatus('error');
      }
    } catch (err) {
      if (!cancelledRef.current) {
        setError(err instanceof Error ? err.message : tTools('failed'));
        setStatus('error');
      }
    }
  }, [file, watermarkType, watermarkText, fontSize, textColor, textOpacity, textAngle, imageFile, imageOpacity, imageAngle, repeatWatermark, staggerWatermark, repeatSpacingX, repeatSpacingY, pageMode, customPageRange, totalPages, tTools]);

  const handleGeneratePreview = useCallback(async () => {
    if (!file) return;
    if (watermarkType === 'text' && !watermarkText.trim()) return;
    if (watermarkType === 'image' && !imageFile) return;

    setIsPreviewing(true);
    try {
      const hexToRgb = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        return { r, g, b };
      };

      let options: WatermarkOptions;
      if (watermarkType === 'text') {
        options = {
          type: 'text',
          text: watermarkText,
          fontSize,
          color: hexToRgb(textColor),
          opacity: textOpacity,
          rotation: textAngle,
          pages: [1], // Only first page for preview
          repeat: repeatWatermark,
          stagger: staggerWatermark,
          repeatSpacingX,
          repeatSpacingY,
        };
      } else {
        const imageData = await convertImageToPng(imageFile!);
        options = {
          type: 'image',
          imageData,
          imageType: 'png',
          opacity: imageOpacity,
          rotation: imageAngle,
          pages: [1], // Only first page for preview
          repeat: repeatWatermark,
          stagger: staggerWatermark,
          repeatSpacingX,
          repeatSpacingY,
        };
      }

      // Determine which page to preview (first page of selection)
      let previewPage = 1;
      if (pageMode === 'odd') previewPage = 1;
      else if (pageMode === 'even') previewPage = totalPages >= 2 ? 2 : 1;
      else if (pageMode === 'custom') {
        const selectedPages = parsePageSelection(customPageRange, totalPages);
        if (selectedPages.length > 0) previewPage = selectedPages[0];
      }
      options.pages = [1]; // The extracted file will only have 1 page

      // Extract only the page we want to preview to keep the preview PDF small and clear
      const extractOutput = await extractPages(file, [previewPage]);
      if (!extractOutput.success || !extractOutput.result) return;

      const previewSinglePageFile = new File([extractOutput.result as Blob], 'preview.pdf', { type: 'application/pdf' });
      const output = await addWatermark(previewSinglePageFile, options);
      if (output.success && output.result) {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const url = URL.createObjectURL(output.result as Blob);
        setPreviewUrl(url);
      }
    } catch (err) {
      console.error('Preview failed:', err);
    } finally {
      setIsPreviewing(false);
    }
  }, [file, watermarkType, watermarkText, fontSize, textColor, textOpacity, textAngle, imageFile, imageOpacity, imageAngle, repeatWatermark, staggerWatermark, repeatSpacingX, repeatSpacingY, pageMode, customPageRange, totalPages, previewUrl]);

  // Debounced preview generation
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (file) {
        handleGeneratePreview();
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [file, watermarkType, watermarkText, fontSize, textColor, textOpacity, textAngle, imageFile, imageOpacity, imageAngle, repeatWatermark, staggerWatermark, repeatSpacingX, repeatSpacingY, pageMode, customPageRange, totalPages]);

  // Cleanup preview URL on unmount
  React.useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const isProcessing = status === 'processing';

  return (
    <div className={`space-y-6 ${className}`.trim()}>
      {!file && (
        <FileUploader
          accept={['application/pdf', '.pdf']}
          multiple={false}
          maxFiles={1}
          onFilesSelected={handleFilesSelected}
          onError={setError}
          disabled={isProcessing}
          label={tTools('uploadLabel')}
          description={tTools('uploadDescription')}
        />
      )}

      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {file && (
        <div className="grid grid-cols-1 lg:grid-cols-[570px_1fr] gap-6">
          <div className="space-y-6">
            <Card variant="outlined">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg className="w-10 h-10 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{file.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{formatSize(file.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={handleClearFile} disabled={isProcessing}>
                  {t('buttons.remove')}
                </Button>
              </div>
            </Card>

            <Card variant="outlined" size="lg">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                {tTools('optionsTitle')}
              </h3>

              {/* Watermark Type Selection */}
              <div className="flex gap-6 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="watermark-type"
                    value="text"
                    checked={watermarkType === 'text'}
                    onChange={() => setWatermarkType('text')}
                    className="w-4 h-4 text-blue-600"
                    disabled={isProcessing}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tTools('textWatermark')}
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="watermark-type"
                    value="image"
                    checked={watermarkType === 'image'}
                    onChange={() => setWatermarkType('image')}
                    className="w-4 h-4 text-blue-600"
                    disabled={isProcessing}
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tTools('imageWatermark')}
                  </span>
                </label>
              </div>

              {/* Text Watermark Options */}
              {watermarkType === 'text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      {tTools('watermarkText')}
                    </label>
                    <input
                      type="text"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                      placeholder="CONFIDENTIAL"
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                      disabled={isProcessing}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('fontSize')}
                      </label>
                      <input
                        type="number"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseInt(e.target.value) || 72)}
                        min={10}
                        max={200}
                        className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('color')}
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="w-10 h-10 p-1 cursor-pointer rounded border border-gray-300 dark:border-gray-600"
                          disabled={isProcessing}
                        />
                        <input
                          type="text"
                          value={textColor}
                          onChange={(e) => setTextColor(e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-sm"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('opacity')}: {Math.round(textOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        value={textOpacity}
                        onChange={(e) => setTextOpacity(parseFloat(e.target.value))}
                        min={0.1}
                        max={1}
                        step={0.1}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('angle')}: {textAngle}°
                      </label>
                      <input
                        type="range"
                        value={textAngle}
                        onChange={(e) => setTextAngle(parseInt(e.target.value))}
                        min={-90}
                        max={90}
                        step={5}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Image Watermark Options */}
              {watermarkType === 'image' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                      {tTools('watermarkImage')}
                    </label>
                    <input
                      type="file"
                      accept="image/png, image/jpeg"
                      onChange={handleImageSelected}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                      disabled={isProcessing}
                    />
                    {imageFile && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {imageFile.name} ({formatSize(imageFile.size)})
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('opacity')}: {Math.round(imageOpacity * 100)}%
                      </label>
                      <input
                        type="range"
                        value={imageOpacity}
                        onChange={(e) => setImageOpacity(parseFloat(e.target.value))}
                        min={0.1}
                        max={1}
                        step={0.1}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('angle')}: {imageAngle}°
                      </label>
                      <input
                        type="range"
                        value={imageAngle}
                        onChange={(e) => setImageAngle(parseInt(e.target.value))}
                        min={-90}
                        max={90}
                        step={5}
                        className="w-full"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Card>

            {/* Repeat Watermark Options */}
            <Card variant="outlined" size="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {tTools('repeatTitle')}
                </h3>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <div className="relative inline-flex">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={repeatWatermark}
                      onChange={(e) => setRepeatWatermark(e.target.checked)}
                      disabled={isProcessing}
                    />
                    <div className={`w-11 h-6 rounded-full transition-colors ${repeatWatermark ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                      }`} />
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${repeatWatermark ? 'translate-x-5' : 'translate-x-0'
                      }`} />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {tTools('repeatEnable')}
                  </span>
                </label>
              </div>

              {repeatWatermark && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('repeatSpacingX')}: {repeatSpacingX}pt
                      </label>
                      <input
                        type="range"
                        value={repeatSpacingX}
                        onChange={(e) => setRepeatSpacingX(parseInt(e.target.value))}
                        min={20}
                        max={600}
                        step={10}
                        className="w-full"
                        disabled={isProcessing}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                        <span>20pt</span>
                        <span>600pt</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                        {tTools('repeatSpacingY')}: {repeatSpacingY}pt
                      </label>
                      <input
                        type="range"
                        value={repeatSpacingY}
                        onChange={(e) => setRepeatSpacingY(parseInt(e.target.value))}
                        min={20}
                        max={600}
                        step={10}
                        className="w-full"
                        disabled={isProcessing}
                      />
                      <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                        <span>20pt</span>
                        <span>600pt</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {tTools('staggerTitle')}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {tTools('staggerDescription')}
                      </p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <div className="relative inline-flex">
                        <input
                          type="checkbox"
                          className="sr-only"
                          checked={staggerWatermark}
                          onChange={(e) => setStaggerWatermark(e.target.checked)}
                          disabled={isProcessing}
                        />
                        <div className={`w-11 h-6 rounded-full transition-colors ${staggerWatermark ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                          }`} />
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${staggerWatermark ? 'translate-x-5' : 'translate-x-0'
                          }`} />
                      </div>
                    </label>
                  </div>
                </div>
              )}
            </Card>

            {/* Page Range Selection */}
            <Card variant="outlined" size="lg">
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">
                {tTools('rangeTitle')}
              </h3>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="page-mode"
                      value="all"
                      checked={pageMode === 'all'}
                      onChange={() => setPageMode('all')}
                      className="w-4 h-4 text-blue-600"
                      disabled={isProcessing}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tTools('rangeAll')}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="page-mode"
                      value="odd"
                      checked={pageMode === 'odd'}
                      onChange={() => setPageMode('odd')}
                      className="w-4 h-4 text-blue-600"
                      disabled={isProcessing}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tTools('rangeOdd')}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="page-mode"
                      value="even"
                      checked={pageMode === 'even'}
                      onChange={() => setPageMode('even')}
                      className="w-4 h-4 text-blue-600"
                      disabled={isProcessing}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tTools('rangeEven')}
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="page-mode"
                      value="custom"
                      checked={pageMode === 'custom'}
                      onChange={() => setPageMode('custom')}
                      className="w-4 h-4 text-blue-600"
                      disabled={isProcessing}
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {tTools('rangeCustom')}
                    </span>
                  </label>
                </div>

                {pageMode === 'custom' && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    <input
                      type="text"
                      value={customPageRange}
                      onChange={(e) => setCustomPageRange(e.target.value)}
                      placeholder={tTools('rangePlaceholder')}
                      className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
                      disabled={isProcessing}
                    />
                  </div>
                )}
              </div>
            </Card>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleProcess}
                disabled={!file || isProcessing || (watermarkType === 'text' && !watermarkText.trim()) || (watermarkType === 'image' && !imageFile)}
                loading={isProcessing}
              >
                {isProcessing ? t('status.processing') : tTools('addButton')}
              </Button>
              {result && (
                <DownloadButton
                  file={result}
                  filename={file.name.replace('.pdf', '_watermarked.pdf')}
                  variant="secondary"
                  size="lg"
                  showFileSize
                />
              )}
            </div>

            {isProcessing && (
              <ProcessingProgress
                progress={progress}
                status={status}
                message={progressMessage}
                onCancel={() => { cancelledRef.current = true; setStatus('idle'); }}
                showPercentage
              />
            )}

            {status === 'complete' && result && (
              <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                <p className="text-sm font-medium">{tTools('successMessage')}</p>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-4 flex flex-col h-full">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-[hsl(var(--color-foreground))]">
                  {tTools('previewTitle')}
                </h3>
                <p className="text-xs text-[hsl(var(--color-muted-foreground))]">
                  {tTools('previewNote')}
                </p>
              </div>
              {isPreviewing && (
                <span className="text-sm text-[hsl(var(--color-muted-foreground))] flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {tTools('previewGenerating')}
                </span>
              )}
            </div>

            <Card className="flex-1 min-h-[600px] overflow-hidden relative border-dashed border-2 flex items-center justify-center bg-[hsl(var(--color-muted)/0.3)]">
              {previewUrl ? (
                <iframe
                  src={`${previewUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                  className="w-full h-full absolute inset-0 border-0"
                  title="Watermark Preview"
                />
              ) : (
                <div className="text-[hsl(var(--color-muted-foreground))] text-center p-8">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <p>{tTools('previewTitle')}</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};


export default WatermarkTool;
