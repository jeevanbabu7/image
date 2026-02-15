const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000/api";

async function parseError(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const data = await response.json();
    return data.error || "Request failed";
  }
  const text = await response.text();
  return text || "Request failed";
}

async function postForm(endpoint, formData) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

async function postJson(endpoint, payload) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return response.json();
}

function parseFilename(headerValue) {
  if (!headerValue) {
    return null;
  }

  const match = /filename\*?=([^;]+)/i.exec(headerValue);
  if (!match) {
    return null;
  }

  return match[1].replace(/UTF-8''/i, "").replace(/"/g, "").trim();
}

export async function createPassport(formData) {
  return postForm("/passport", formData);
}

export async function compressImage(formData) {
  return postForm("/compress", formData);
}

export async function resizeImage(formData) {
  return postForm("/resize", formData);
}

export async function imageToPdf(formData) {
  return postForm("/image-to-pdf", formData);
}

export async function unlockFile(fileId) {
  return postJson("/unlock", { fileId });
}

export async function downloadFile(token) {
  const response = await fetch(`${API_BASE}/download/${token}`);
  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  const blob = await response.blob();
  const filename = parseFilename(response.headers.get("content-disposition"));
  return { blob, filename };
}
