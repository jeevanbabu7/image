const { imagesToPdfBuffer } = require("../services/pdfService");
const { safeUnlink } = require("../utils/fileUtils");

async function imageToPdf(req, res, next) {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "At least one image is required" });
    }

    const { buffer, mimeType } = await imagesToPdfBuffer(req.files);

    // Clean up uploaded files immediately
    for (const file of req.files) {
      await safeUnlink(file.path);
    }

    // Send PDF directly without storing
    const filename = `images-${Date.now()}.pdf`;
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (error) {
    // Cleanup on error
    if (req.files) {
      for (const file of req.files) {
        await safeUnlink(file.path);
      }
    }
    return next(error);
  }
}

module.exports = { imageToPdf };
