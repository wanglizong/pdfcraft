/**
 * OCR PDF Processor
 * Requirements: 5.1
 * 
 * Performs Optical Character Recognition on PDF pages.
 * Uses Tesseract.js for client-side OCR processing.
 */

import type {
  ProcessInput,
  ProcessOutput,
  ProgressCallback,
} from '@/types/pdf';
import { PDFErrorCode } from '@/types/pdf';
import { BasePDFProcessor } from '../processor';
import { loadPdfjs, loadPdfLib } from '../loader';

/**
 * Supported OCR languages
 */
export type OCRLanguage = 'eng' | 'chi_sim' | 'chi_tra' | 'jpn' | 'kor' | 'spa' | 'fra' | 'deu' | 'por' | 'ara';

/**
 * OCR options
 */
export interface OCROptions {
  /** OCR language(s) */
  languages: OCRLanguage[];
  /** Scale factor for rendering (higher = better OCR but slower) */
  scale: number;
  /** Specific pages to OCR (empty = all pages) */
  pages: number[];
  /** Output format */
  outputFormat: 'text' | 'searchable-pdf';
  /** Preserve original layout in text output */
  preserveLayout: boolean;
}

/**
 * Default options
 */
const DEFAULT_OPTIONS: OCROptions = {
  languages: ['eng'],
  scale: 2,
  pages: [],
  outputFormat: 'text',
  preserveLayout: false,
};

/**
 * Language display names
 */
export const OCR_LANGUAGE_NAMES: Record<OCRLanguage, string> = {
  eng: 'English',
  chi_sim: 'Chinese (Simplified)',
  chi_tra: 'Chinese (Traditional)',
  jpn: 'Japanese',
  kor: 'Korean',
  spa: 'Spanish',
  fra: 'French',
  deu: 'German',
  por: 'Portuguese',
  ara: 'Arabic',
};

// Tesseract worker type
type TesseractWorker = {
  loadLanguage: (lang: string) => Promise<void>;
  initialize: (lang: string) => Promise<void>;
  recognize: (image: string | HTMLCanvasElement) => Promise<{ data: { text: string } }>;
  terminate: () => Promise<void>;
};


/**
 * OCR PDF Processor
 * Performs OCR on PDF pages using Tesseract.js.
 */
export class OCRProcessor extends BasePDFProcessor {
  private tesseractWorker: TesseractWorker | null = null;

  /**
   * Process PDF with OCR
   */
  async process(
    input: ProcessInput,
    onProgress?: ProgressCallback
  ): Promise<ProcessOutput> {
    this.reset();
    this.onProgress = onProgress;

    const { files, options } = input;
    const ocrOptions: OCROptions = {
      ...DEFAULT_OPTIONS,
      ...(options as Partial<OCROptions>),
    };

    // Validate we have exactly 1 PDF file
    if (files.length !== 1) {
      return this.createErrorOutput(
        PDFErrorCode.INVALID_OPTIONS,
        'Please provide exactly one PDF file.',
        `Received ${files.length} file(s).`
      );
    }

    const file = files[0];

    // Validate file type
    if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
      return this.createErrorOutput(
        PDFErrorCode.FILE_TYPE_INVALID,
        'Invalid file type. Please upload a PDF file.',
        `Received: ${file.type || 'unknown'}`
      );
    }

    try {
      this.updateProgress(5, 'Loading libraries...');

      const pdfjs = await loadPdfjs();

      if (this.checkCancelled()) {
        return this.createErrorOutput(
          PDFErrorCode.PROCESSING_CANCELLED,
          'Processing was cancelled.'
        );
      }

      this.updateProgress(10, 'Initializing OCR engine...');

      // Initialize Tesseract
      await this.initializeTesseract(ocrOptions.languages);

      this.updateProgress(20, 'Loading PDF document...');

      // Load the PDF document
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const totalPages = pdf.numPages;

      // Determine which pages to OCR
      const pagesToOCR = ocrOptions.pages.length > 0
        ? ocrOptions.pages.filter(p => p >= 1 && p <= totalPages)
        : Array.from({ length: totalPages }, (_, i) => i + 1);

      if (pagesToOCR.length === 0) {
        await this.terminateTesseract();
        return this.createErrorOutput(
          PDFErrorCode.INVALID_PAGE_RANGE,
          'No valid pages to OCR.',
          `PDF has ${totalPages} pages.`
        );
      }

      this.updateProgress(25, `Processing ${pagesToOCR.length} page(s)...`);

      const textResults: string[] = [];
      const ocrPagesData: Array<{ pageNum: number; words: any[] }> = [];
      const progressPerPage = 70 / pagesToOCR.length;

      for (let i = 0; i < pagesToOCR.length; i++) {
        if (this.checkCancelled()) {
          await this.terminateTesseract();
          return this.createErrorOutput(
            PDFErrorCode.PROCESSING_CANCELLED,
            'Processing was cancelled.'
          );
        }

        const pageNum = pagesToOCR[i];
        const pageProgress = 25 + (i * progressPerPage);

        this.updateProgress(
          pageProgress,
          `OCR processing page ${pageNum} of ${totalPages}...`
        );

        try {
          const pageData = await this.ocrPage(pdf, pageNum, ocrOptions);
          textResults.push(`--- Page ${pageNum} ---\n${pageData.text}`);
          ocrPagesData.push({ pageNum, words: pageData.words });
        } catch (error) {
          textResults.push(`--- Page ${pageNum} ---\n[OCR Error: ${error instanceof Error ? error.message : 'Unknown error'}]`);
        }
      }

      await this.terminateTesseract();

      this.updateProgress(95, 'Generating output...');

      // Generate output based on format
      let blob: Blob;
      let outputFilename: string;
      const baseName = file.name.replace(/\.pdf$/i, '');

      if (ocrOptions.outputFormat === 'text') {
        const fullText = textResults.join('\n\n');
        blob = new Blob([fullText], { type: 'text/plain' });
        outputFilename = `${baseName}_ocr.txt`;
      } else {
        // For searchable PDF, we create a PDF with the extracted text layer
        blob = await this.createSearchablePDF(file, ocrPagesData, ocrOptions);
        outputFilename = `${baseName}_searchable.pdf`;
      }

      this.updateProgress(100, 'Complete!');

      return this.createSuccessOutput(blob, outputFilename, {
        pageCount: pagesToOCR.length,
        languages: ocrOptions.languages,
        outputFormat: ocrOptions.outputFormat,
      });

    } catch (error) {
      await this.terminateTesseract();
      return this.createErrorOutput(
        PDFErrorCode.PROCESSING_FAILED,
        'Failed to perform OCR on PDF.',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  /**
   * Initialize Tesseract worker
   */
  private async initializeTesseract(languages: OCRLanguage[]): Promise<void> {
    // Dynamically import Tesseract.js
    const Tesseract = await import('tesseract.js');

    const langString = languages.join('+');
    this.tesseractWorker = await Tesseract.createWorker(langString) as unknown as TesseractWorker;
  }

  /**
   * Terminate Tesseract worker
   */
  private async terminateTesseract(): Promise<void> {
    if (this.tesseractWorker) {
      await this.tesseractWorker.terminate();
      this.tesseractWorker = null;
    }
  }

  /**
   * Perform OCR on a single page and return text with word coordinates
   */
  private async ocrPage(
    pdf: any,
    pageNum: number,
    options: OCROptions
  ): Promise<{ text: string; words: any[] }> {
    if (!this.tesseractWorker) {
      throw new Error('Tesseract worker not initialized');
    }

    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale: options.scale });

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Render PDF page to canvas
    await page.render({
      canvasContext: ctx,
      viewport: viewport,
    }).promise;

    // Perform OCR
    const result = await (this.tesseractWorker as any).recognize(canvas);
    
    // Coordinate conversion from canvas space to PDF coordinate space (y-flipped)
    const pdfViewport = page.getViewport({ scale: 1.0 });
    const pageHeight = pdfViewport.height;

    const words = (result.data.words || []).map((w: any) => {
      const { x0, y0, x1, y1 } = w.bbox;
      const scale = options.scale;
      
      const pdfX = x0 / scale;
      const pdfY = pageHeight - (y1 / scale);
      const pdfWidth = (x1 - x0) / scale;
      const pdfHeight = (y1 - y0) / scale;

      return {
        text: w.text,
        x: pdfX,
        y: pdfY,
        width: pdfWidth,
        height: pdfHeight,
        fontSize: pdfHeight * 0.85,
      };
    });

    return {
      text: result.data.text,
      words,
    };
  }

  /**
   * Create a searchable PDF with OCR transparent text layer
   */
  private async createSearchablePDF(
    originalFile: File,
    ocrPagesData: Array<{ pageNum: number; words: any[] }>,
    options: OCROptions
  ): Promise<Blob> {
    const pdfLib = await loadPdfLib();

    // Load original PDF
    const arrayBuffer = await originalFile.arrayBuffer();
    const pdfDoc = await pdfLib.PDFDocument.load(arrayBuffer);

    // Embed standard fonts (Helvetica is safe and standard)
    const font = await pdfDoc.embedFont(pdfLib.StandardFonts.Helvetica);

    for (const pageData of ocrPagesData) {
      const pageIdx = pageData.pageNum - 1;
      if (pageIdx >= pdfDoc.getPageCount()) continue;

      const page = pdfDoc.getPage(pageIdx);

      // Draw invisible text items
      for (const w of pageData.words) {
        if (!w.text.trim()) continue;
        try {
          page.drawText(w.text, {
            x: w.x,
            y: w.y,
            size: Math.max(5, w.fontSize),
            font,
            color: pdfLib.rgb(0, 0, 0),
            opacity: 0.0, // Totally invisible text overlay
          });
        } catch (e) {
          console.error(`Failed to overlay invisible text: ${w.text}`, e);
        }
      }
    }

    // Add metadata to indicate OCR was performed
    pdfDoc.setTitle(`${originalFile.name} (OCR)`);
    pdfDoc.setSubject('OCR processed document with invisible text layer');
    pdfDoc.setKeywords(['OCR', 'searchable', ...options.languages]);

    const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
    return new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
  }
}

/**
 * Create a new instance of the OCR processor
 */
export function createOCRProcessor(): OCRProcessor {
  return new OCRProcessor();
}

/**
 * Perform OCR on PDF (convenience function)
 */
export async function ocrPDF(
  file: File,
  options?: Partial<OCROptions>,
  onProgress?: ProgressCallback
): Promise<ProcessOutput> {
  const processor = createOCRProcessor();
  return processor.process(
    {
      files: [file],
      options: options || {},
    },
    onProgress
  );
}
