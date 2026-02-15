const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { UPLOAD_DIR } = require("./constants");

function ensureUploadsDir() {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

function createOutputPath(extension) {
  return path.join(UPLOAD_DIR, `${uuidv4()}${extension}`);
}

async function safeUnlink(filePath) {
  if (!filePath) {
    return;
  }

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Failed to delete file: ${filePath}`);
    }
  }
}

async function getFileSize(filePath) {
  const stat = await fs.promises.stat(filePath);
  return stat.size;
}

module.exports = {
  ensureUploadsDir,
  createOutputPath,
  safeUnlink,
  getFileSize
};
