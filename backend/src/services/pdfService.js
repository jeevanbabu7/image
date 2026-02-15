const { PDFDocument } = require("pdf-lib");
const sharp = require("sharp");
const { createOutputPath } = require("../utils/fileUtils");

async function imagesToPdf(files) {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const imageBytes = await sharp(file.path).toBuffer();
    const metadata = await sharp(file.path).metadata();

    const page = pdfDoc.addPage([metadata.width, metadata.height]);

    if (file.mimetype === "image/png") {
      const pngImage = await pdfDoc.embedPng(imageBytes);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: metadata.width,
        height: metadata.height
      });
    } else {
      const jpgImage = await pdfDoc.embedJpg(imageBytes);
      page.drawImage(jpgImage, {
        x: 0,
        y: 0,
        width: metadata.width,
        height: metadata.height
      });
    }
  }

  const pdfBytes = await pdfDoc.save();
  const outputPath = createOutputPath(".pdf");
  await require("fs").promises.writeFile(outputPath, pdfBytes);

  return { outputPath, mimeType: "application/pdf", extension: ".pdf" };
}

module.exports = { imagesToPdf };
