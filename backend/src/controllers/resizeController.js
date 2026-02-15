const { resizeImage } = require("../services/imageService");
const { addFileRecord } = require("../services/fileStore");
const { getFileSize, safeUnlink } = require("../utils/fileUtils");

async function resize(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const width = req.body.width ? Number(req.body.width) : null;
    const height = req.body.height ? Number(req.body.height) : null;
    const keepAspect = req.body.keepAspect === "true" || req.body.keepAspect === true;
    let quality = Number(req.body.quality || 80);
    if (Number.isNaN(quality)) {
      quality = 80;
    }
    quality = Math.min(90, Math.max(10, quality));
    const targetKB = req.body.targetKB ? Number(req.body.targetKB) : null;

    if (!width && !height && !targetKB) {
      return res.status(400).json({ error: "Width, height, or targetKB is required" });
    }

    const { outputPath, mimeType } = await resizeImage(req.file.path, {
      width,
      height,
      keepAspect,
      targetKB,
      quality,
      mimeType: req.file.mimetype
    });

    await safeUnlink(req.file.path);

    const size = await getFileSize(outputPath);
    const record = addFileRecord({
      filePath: outputPath,
      originalName: `resized-${Date.now()}${mimeType === "image/png" ? ".png" : ".jpg"}`,
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

module.exports = { resize };
