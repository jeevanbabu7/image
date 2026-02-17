const { compressImageBuffer } = require("../services/imageService");
const { safeUnlink } = require("../utils/fileUtils");

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
    
    const { buffer, mimeType } = await compressImageBuffer(req.file.path, {
      quality,
      mimeType: req.file.mimetype
    });

    // Clean up uploaded file immediately
    await safeUnlink(req.file.path);

    // Send file directly without storing
    const filename = `compressed-${Date.now()}${mimeType === "image/png" ? ".png" : ".jpg"}`;
    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", buffer.length);
    return res.send(buffer);
  } catch (error) {
    await safeUnlink(req.file?.path);
    return next(error);
  }
}

module.exports = { compress };
