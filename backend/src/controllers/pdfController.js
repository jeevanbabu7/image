const { imagesToPdf } = require("../services/pdfService");
const { addFileRecord } = require("../services/fileStore");
const { getFileSize, safeUnlink } = require("../utils/fileUtils");

async function imageToPdf(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const { outputPath, mimeType } = await imagesToPdf(req.files);

    for (const file of req.files) {
      await safeUnlink(file.path);
    }

    const size = await getFileSize(outputPath);
    const record = addFileRecord({
      filePath: outputPath,
      originalName: `images-${Date.now()}.pdf`,
      mimeType,
      size
    });

    return res.json({
      fileId: record.fileId,
      size: record.size,
      mimeType: record.mimeType
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { imageToPdf };
