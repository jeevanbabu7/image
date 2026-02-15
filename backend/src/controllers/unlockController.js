const { getFileRecord } = require("../services/fileStore");
const { createDownloadToken } = require("../services/tokenService");

async function unlock(req, res, next) {
  try {
    const { fileId } = req.body;
    if (!fileId) {
      return res.status(400).json({ error: "fileId is required" });
    }

    const record = getFileRecord(fileId);
    if (!record) {
      return res.status(404).json({ error: "File not found" });
    }

    const token = createDownloadToken(record);
    return res.json({ token, expiresInSeconds: 120 });
  } catch (error) {
    return next(error);
  }
}

module.exports = { unlock };
