const { v4: uuidv4 } = require("uuid");

const TOKEN_TTL_MS = 2 * 60 * 1000;
const tokenStore = new Map();

function createDownloadToken(fileRecord) {
  const token = uuidv4();
  tokenStore.set(token, {
    token,
    fileId: fileRecord.fileId,
    filePath: fileRecord.filePath,
    mimeType: fileRecord.mimeType,
    filename: fileRecord.originalName,
    createdAt: Date.now(),
    used: false
  });

  return token;
}

function consumeToken(token) {
  const entry = tokenStore.get(token);
  if (!entry) {
    return { ok: false, error: "Invalid token" };
  }

  const now = Date.now();
  if (now - entry.createdAt > TOKEN_TTL_MS) {
    tokenStore.delete(token);
    return { ok: false, error: "Token expired" };
  }

  if (entry.used) {
    return { ok: false, error: "Token already used" };
  }

  entry.used = true;
  tokenStore.set(token, entry);
  return { ok: true, entry };
}

function deleteToken(token) {
  tokenStore.delete(token);
}

function cleanupTokens() {
  const now = Date.now();
  for (const [token, entry] of tokenStore.entries()) {
    if (now - entry.createdAt > TOKEN_TTL_MS) {
      tokenStore.delete(token);
    }
  }
}

setInterval(cleanupTokens, 60 * 1000);

module.exports = {
  createDownloadToken,
  consumeToken,
  deleteToken
};
