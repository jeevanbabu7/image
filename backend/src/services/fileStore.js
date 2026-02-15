const { v4: uuidv4 } = require("uuid");

const FILE_TTL_MS = 10 * 60 * 1000;
const fileStore = new Map();

function addFileRecord({ filePath, originalName, mimeType, size }) {
  const fileId = uuidv4();
  const record = {
    fileId,
    filePath,
    originalName,
    mimeType,
    size,
    createdAt: Date.now()
  };

  fileStore.set(fileId, record);
  return record;
}

function getFileRecord(fileId) {
  return fileStore.get(fileId);
}

function deleteFileRecord(fileId) {
  fileStore.delete(fileId);
}

function cleanupFileStore() {
  const now = Date.now();
  for (const [fileId, record] of fileStore.entries()) {
    if (now - record.createdAt > FILE_TTL_MS) {
      fileStore.delete(fileId);
    }
  }
}

setInterval(cleanupFileStore, 5 * 60 * 1000);

module.exports = {
  addFileRecord,
  getFileRecord,
  deleteFileRecord
};
