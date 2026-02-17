const { createPassportPhotoBuffer } = require("../services/imageService");
const { safeUnlink } = require("../utils/fileUtils");

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

    const { buffer, mimeType } = await createPassportPhotoBuffer(req.file.path, {
      preset,
      quality,
      targetKB
    });

    // Clean up uploaded file immediately
    await safeUnlink(req.file.path);

    // Send file directly without storing
    const filename = `passport-${Date.now()}.jpg`;
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (error) {
    await safeUnlink(req.file?.path);
    return next(error);
  }
}

module.exports = { createPassport };
