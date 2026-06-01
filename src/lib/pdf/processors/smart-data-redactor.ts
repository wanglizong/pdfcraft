/**
 * Smart Data Redactor Processor
 * 
 * Implements automatic scanning and physical redaction of sensitive patterns (e.g., Email, Phone, SSN/ID Card).
 * Detects patterns, overlays opaque blocking blocks, and sanitizes underlying content streams.
 */

import type {
  ProcessInput,
  ProcessOutput,
  ProgressCallback,
} from '@/types/pdf';
import { PDFErrorCode } from '@/types/pdf';
import { BasePDFProcessor } from '../processor';
import { loadPdfLib, loadPdfjs } from '../loader';

export interface SmartRedactOptions {
  patterns: ('email' | 'phone' | 'idcard' | 'custom')[];
  customKeywords?: string[];
  redactColor?: { r: number; g: number; b: number };
}

const DEFAULT_OPTIONS: SmartRedactOptions = {
  patterns: ['email', 'phone'],
  customKeywords: [],
  redactColor: { r: 0, g: 0, b: 0 }, // Black
};

const REGEX_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /(?:\+?\d{1,3}[- ]?)?\(?\d{3}\)?[- ]?\d{3}[- ]?\d{4}/g,
  idcard: /\d{17}[\dXx]|\d{3}-\d{2}-\d{4}/g, // Generic 18-digit ID or SSN
};

interface MatchBox {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export class SmartDataRedactorProcessor extends BasePDFProcessor {
  async process(
    input: ProcessInput,
    onProgress?: ProgressCallback
  ): Promise<ProcessOutput> {
    this.reset();
    this.onProgress = onProgress;

    const { files, options } = input;
    const redactOptions: SmartRedactOptions = {
      ...DEFAULT_OPTIONS,
      ...(options as Partial<SmartRedactOptions>),
    };

    if (files.length !== 1) {
      return this.createErrorOutput(
        PDFErrorCode.INVALID_OPTIONS,
        'Please upload exactly one PDF file.'
      );
    }

    const file = files[0];

    try {
      this.updateProgress(10, 'Loading PDF documents...');
      const pdfjs = await loadPdfjs();
      const pdfLib = await loadPdfLib();

      const fileBytes = await file.arrayBuffer();
      
      // Load both PDFJS and PDF-Lib docs
      const pdfjsDoc = await pdfjs.getDocument({ data: fileBytes.slice(0) }).promise;
      const pdfLibDoc = await pdfLib.PDFDocument.load(fileBytes);
      const totalPages = pdfLibDoc.getPageCount();

      const progressInterval = 70 / totalPages;
      let matchesCount = 0;

      for (let i = 1; i <= totalPages; i++) {
        this.updateProgress(15 + (i - 1) * progressInterval, `Scanning & redacting page ${i}...`);

        const pdfjsPage = await pdfjsDoc.getPage(i);
        const pdfLibPage = pdfLibDoc.getPage(i - 1);
        const { width: pageWidth, height: pageHeight } = pdfLibPage.getSize();

        // Extract text items with coordinates
        const textContent = await pdfjsPage.getTextContent();
        const matches: MatchBox[] = [];

        // Build simple lines of text to perform regex
        for (const item of textContent.items) {
          if (!('str' in item)) continue;
          
          const text = item.str;
          const transform = item.transform; // [scaleX, skewY, skewX, scaleY, translateX, translateY]
          
          // Check patterns
          let isMatch = false;
          for (const pattern of redactOptions.patterns) {
            if (pattern === 'custom' && redactOptions.customKeywords) {
              for (const keyword of redactOptions.customKeywords) {
                if (keyword && text.toLowerCase().includes(keyword.toLowerCase())) {
                  isMatch = true;
                  break;
                }
              }
            } else if (pattern !== 'custom') {
              const regex = REGEX_PATTERNS[pattern];
              regex.lastIndex = 0;
              if (regex.test(text)) {
                isMatch = true;
              }
            }
          }

          if (isMatch) {
            // Coordinate mapping (PDFJS transform coordinates are bottom-left oriented, same as pdf-lib)
            // item.transform gives [fontHeight, 0, 0, fontHeight, x, y] usually
            const x = transform[4];
            const y = transform[5];
            const height = transform[3] || item.height || 12;
            const width = item.width || (text.length * height * 0.6);

            matches.push({
              text,
              x,
              y,
              width,
              height,
            });
          }
        }

        // Draw redaction boxes and perform stream cleaning
        if (matches.length > 0) {
          matchesCount += matches.length;
          const rColor = redactOptions.redactColor || { r: 0, g: 0, b: 0 };
          const fillColor = pdfLib.rgb(rColor.r / 255, rColor.g / 255, rColor.b / 255);

          for (const match of matches) {
            // Overlay blocking mask
            pdfLibPage.drawRectangle({
              x: match.x - 2,
              y: match.y - 2,
              width: match.width + 4,
              height: match.height + 4,
              color: fillColor,
            });

            // Physical scrub: search and replace contents in the page content stream
            const contents = pdfLibPage.node.get(pdfLib.PDFName.of('Contents'));
            if (contents) {
              const contentStreams = Array.isArray(contents) ? contents : [contents];
              for (const contentStreamRef of contentStreams) {
                const contentStream = pdfLibDoc.context.lookup(contentStreamRef);
                if (contentStream instanceof pdfLib.PDFStream) {
                  const rawData = (contentStream as any).getUncompressedContents();
                  const contentText = new TextDecoder('utf-8').decode(rawData);
                  
                  // Replace the exact matching string with masked chars inside Tj/TJ
                  const escapedText = match.text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                  const searchRegex = new RegExp(`\\([^\\)]*${escapedText}[^\\)]*\\)\\s*(Tj|TJ)`, 'gi');
                  const redactedStreamText = contentText.replace(searchRegex, '([REDACTED]) Tj');
                  
                  (contentStream as any).setContent(new TextEncoder().encode(redactedStreamText));
                }
              }
            }
          }
        }
      }

      this.updateProgress(90, 'Saving redacted PDF document...');
      const pdfBytes = await pdfLibDoc.save({ useObjectStreams: true });
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });

      this.updateProgress(100, 'Complete!');

      return this.createSuccessOutput(blob, `${file.name.replace(/\.pdf$/i, '')}_redacted.pdf`, {
        pageCount: totalPages,
        redactionsApplied: matchesCount,
      });

    } catch (error) {
      return this.createErrorOutput(
        PDFErrorCode.PROCESSING_FAILED,
        'Failed to redact PDF privacy data.',
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }

  protected getAcceptedTypes(): string[] {
    return ['application/pdf'];
  }
}

export function createSmartDataRedactorProcessor(): SmartDataRedactorProcessor {
  return new SmartDataRedactorProcessor();
}

export async function redactSmartData(
  files: File[],
  options?: Partial<SmartRedactOptions>,
  onProgress?: ProgressCallback
): Promise<ProcessOutput> {
  const processor = createSmartDataRedactorProcessor();
  return processor.process({ files, options: options || {} }, onProgress);
}
