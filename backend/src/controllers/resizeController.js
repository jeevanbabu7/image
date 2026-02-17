const { resizeImageBuffer } = require("../services/imageService");
const { safeUnlink } = require("../utils/fileUtils");

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

    const { buffer, mimeType } = await resizeImageBuffer(req.file.path, {
      width,
      height,
      keepAspect,
      targetKB,
      quality,
      mimeType: req.file.mimetype
    });

    // Clean up uploaded file immediately
    await safeUnlink(req.file.path);

    // Send file directly without storing
    const filename = `resized-${Date.now()}${mimeType === "image/png" ? ".png" : ".jpg"}`;
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (error) {
    await safeUnlink(req.file?.path);
    return next(error);
  }
}

module.exports = { resize };
