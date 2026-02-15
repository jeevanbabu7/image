const path = require("path");
const { consumeToken, deleteToken } = require("../services/tokenService");
const { deleteFileRecord, getFileRecord } = require("../services/fileStore");
const { safeUnlink } = require("../utils/fileUtils");

async function download(req, res, next) {
  try {
    const token = req.params.token;
    const result = consumeToken(token);
    if (!result.ok) {
      return res.status(403).json({ error: result.error });
    }

    const entry = result.entry;
    const record = getFileRecord(entry.fileId);
    if (!record) {
      deleteToken(token);
      return res.status(404).json({ error: "File not found" });
    }

    const filename = record.originalName || path.basename(record.filePath);
    res.download(record.filePath, filename, async (err) => {
      deleteToken(token);
      deleteFileRecord(record.fileId);
      await safeUnlink(record.filePath);

      if (err) {
        return next(err);
      }
      return undefined;
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = { download };
