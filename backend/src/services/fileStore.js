const { v4: uuidv4 } = require("uuid");
const { safeUnlink } = require("../utils/fileUtils");

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

async function cleanupFileStore() {
  const now = Date.now();
  const deletionPromises = [];
  
  for (const [fileId, record] of fileStore.entries()) {
    if (now - record.createdAt > FILE_TTL_MS) {
      fileStore.delete(fileId);
      // Also delete the physical file
      deletionPromises.push(safeUnlink(record.filePath));
    }
  }
  
  // Delete all expired files in parallel
  if (deletionPromises.length > 0) {
    await Promise.all(deletionPromises);
    console.log(`Cleaned up ${deletionPromises.length} expired file(s)`);
  }
}

// Run cleanup every 5 minutes
setInterval(() => {
  cleanupFileStore().catch(err => {
    console.error("Error during file cleanup:", err);
  });
}, 5 * 60 * 1000);

module.exports = {
  addFileRecord,
  getFileRecord,
  deleteFileRecord
};
