import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

async function main() {
  const scratchDir = 'd:/NextProject/pdfcraft/scratch';
  if (!fs.existsSync(scratchDir)) {
    fs.mkdirSync(scratchDir, { recursive: true });
  }

  // 1. Create Normal PDF
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (let i = 1; i <= 3; i++) {
    const page = pdfDoc.addPage([612, 792]);
    page.drawText(`PDFCraft Test Document - Page ${i}`, {
      x: 50,
      y: 700,
      size: 24,
      font,
      color: rgb(0.1, 0.5, 0.8),
    });
    
    page.drawText('This is a professional document generated automatically for unit and integration testing.', {
      x: 50,
      y: 650,
      size: 12,
    });
    
    page.drawText(`Generated on: ${new Date().toLocaleString()}`, {
      x: 50,
      y: 600,
      size: 10,
    });
  }

  const pdfBytes = await pdfDoc.save();
  const normalPath = path.join(scratchDir, 'test_normal.pdf');
  fs.writeFileSync(normalPath, pdfBytes);
  console.log(`Successfully generated normal PDF at: ${normalPath}`);
}

main().catch(err => {
  console.error('Error generating test PDFs:', err);
});
