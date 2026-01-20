/**
 * Font to Outline Processor
 * 
 * Converts all fonts in a PDF to vector outlines/paths.
 * Useful for compatibility when fonts may not be available on the target system.
 */

import type {
    ProcessInput,
    ProcessOutput,
    ProgressCallback,
} from '@/types/pdf';
import { PDFErrorCode } from '@/types/pdf';
import { BasePDFProcessor } from '../processor';
import { loadPyMuPDF } from '../pymupdf-loader';

/**
 * Font to Outline options
 */
export interface FontToOutlineOptions {
    /** DPI for rasterization when needed (default: 300) */
    dpi: number;
    /** Whether to preserve text as selectable (default: false - converts to paths) */
    preserveSelectableText: boolean;
    /** Specific pages to process (empty for all) */
    pageRange?: string;
}

/**
 * Default font to outline options
 */
const DEFAULT_FONT_OUTLINE_OPTIONS: FontToOutlineOptions = {
    dpi: 300,
    preserveSelectableText: false,
    pageRange: '',
};

/**
 * Font to Outline Processor
 * Converts fonts to vector paths for better compatibility.
 */
export class FontToOutlineProcessor extends BasePDFProcessor {
    /**
     * Process PDF file and convert fonts to outlines
     */
    async process(
        input: ProcessInput,
        onProgress?: ProgressCallback
    ): Promise<ProcessOutput> {
        this.reset();
        this.onProgress = onProgress;

        const { files, options } = input;
        const outlineOptions: FontToOutlineOptions = {
            ...DEFAULT_FONT_OUTLINE_OPTIONS,
            ...(options as Partial<FontToOutlineOptions>),
        };

        // Validate single file
        if (files.length !== 1) {
            return this.createErrorOutput(
                PDFErrorCode.INVALID_OPTIONS,
                'Please provide exactly one PDF file.',
                `Received ${files.length} file(s).`
            );
        }

        const file = files[0];

        try {
            this.updateProgress(5, 'Loading PyMuPDF library...');

            // Load PyMuPDF
            const pymupdf = await loadPyMuPDF();

            if (this.checkCancelled()) {
                return this.createErrorOutput(
                    PDFErrorCode.PROCESSING_CANCELLED,
                    'Processing was cancelled.'
                );
            }

            this.updateProgress(15, 'Analyzing fonts in PDF...');

            // Convert fonts to outlines using PyMuPDF
            const result = await pymupdf.fontToOutline(file, {
                dpi: outlineOptions.dpi,
                preserveSelectableText: outlineOptions.preserveSelectableText,
                pageRange: outlineOptions.pageRange,
            });

            if (this.checkCancelled()) {
                return this.createErrorOutput(
                    PDFErrorCode.PROCESSING_CANCELLED,
                    'Processing was cancelled.'
                );
            }

            this.updateProgress(90, 'Finalizing document...');

            // Get result blob
            const blob = result.pdf || result;

            this.updateProgress(100, 'Complete!');

            // Generate output filename
            const outputFilename = generateOutlineFilename(file.name);

            return this.createSuccessOutput(blob, outputFilename, {
                dpi: outlineOptions.dpi,
                preserveSelectableText: outlineOptions.preserveSelectableText,
                fontsConverted: result.fontsConverted || 'unknown',
            });

        } catch (error) {
            if (error instanceof Error && error.message.includes('encrypt')) {
                return this.createErrorOutput(
                    PDFErrorCode.PDF_ENCRYPTED,
                    'The PDF file is encrypted.',
                    'Please decrypt the file first.'
                );
            }

            return this.createErrorOutput(
                PDFErrorCode.PROCESSING_FAILED,
                'Failed to convert fonts to outlines.',
                error instanceof Error ? error.message : 'Unknown error'
            );
        }
    }

    /**
     * Get accepted file types
     */
    protected getAcceptedTypes(): string[] {
        return ['application/pdf'];
    }
}

/**
 * Generate output filename
 */
function generateOutlineFilename(originalName: string): string {
    const lastDot = originalName.lastIndexOf('.');
    const baseName = lastDot === -1 ? originalName : originalName.slice(0, lastDot);
    return `${baseName}_outlined.pdf`;
}

/**
 * Create a new instance of the font to outline processor
 */
export function createFontToOutlineProcessor(): FontToOutlineProcessor {
    return new FontToOutlineProcessor();
}

/**
 * Convert fonts to outlines (convenience function)
 */
export async function fontToOutline(
    file: File,
    options?: Partial<FontToOutlineOptions>,
    onProgress?: ProgressCallback
): Promise<ProcessOutput> {
    const processor = createFontToOutlineProcessor();
    return processor.process(
        {
            files: [file],
            options: options || {},
        },
        onProgress
    );
}
