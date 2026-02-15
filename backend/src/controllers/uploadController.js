const { addFileRecord } = require("../services/fileStore");
const { getFileSize } = require("../utils/fileUtils");

async function uploadImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Image file is required" });
    }

    const size = await getFileSize(req.file.path);
    const record = addFileRecord({
      filePath: req.file.path,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size
    });

    return res.json({
      fileId: record.fileId,
      originalName: record.originalName,
      size: record.size,
      mimeType: record.mimeType
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { uploadImage };
