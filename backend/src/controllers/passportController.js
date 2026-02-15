const { createPassportPhoto } = require("../services/imageService");
const { addFileRecord } = require("../services/fileStore");
const { getFileSize, safeUnlink } = require("../utils/fileUtils");

async function createPassport(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    let preset = req.body.preset || "passport";
    if (preset === "2x2" || preset === "2x2inch") {
      preset = "twoInch";
    }

    let quality = Number(req.body.quality || 80);
    if (Number.isNaN(quality)) {
      quality = 80;
    }
    quality = Math.min(90, Math.max(10, quality));
    const targetKB = req.body.targetKB ? Number(req.body.targetKB) : null;

    const { outputPath, mimeType } = await createPassportPhoto(req.file.path, {
      preset,
      quality,
      targetKB
    });

    await safeUnlink(req.file.path);

    const size = await getFileSize(outputPath);
    const record = addFileRecord({
      filePath: outputPath,
      originalName: `passport-${Date.now()}.jpg`,
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

module.exports = { createPassport };
