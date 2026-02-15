const { compressImage } = require("../services/imageService");
const { addFileRecord } = require("../services/fileStore");
const { getFileSize, safeUnlink } = require("../utils/fileUtils");

async function compress(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    let quality = Number(req.body.quality || 70);
    if (Number.isNaN(quality)) {
      quality = 70;
    }
    quality = Math.min(90, Math.max(10, quality));
    const { outputPath, mimeType } = await compressImage(req.file.path, {
      quality,
      mimeType: req.file.mimetype
    });

    await safeUnlink(req.file.path);

    const size = await getFileSize(outputPath);
    const record = addFileRecord({
      filePath: outputPath,
      originalName: `compressed-${Date.now()}${mimeType === "image/png" ? ".png" : ".jpg"}`,
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

module.exports = { compress };
