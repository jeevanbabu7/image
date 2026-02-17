// Frontend API Service Update for Optimized Backend
// Replace your existing API methods with these optimized versions

/**
 * Compress an image - returns file directly (no fileId)
 */
export async function compressImage(file, quality = 70) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('quality', quality);

  const response = await fetch('/api/compress', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Compression failed');
  }

  // Get file blob directly
  const blob = await response.blob();
  const filename = getFilenameFromHeaders(response) || `compressed-${Date.now()}.jpg`;
  
  return { blob, filename };
}

/**
 * Resize an image - returns file directly
 */
export async function resizeImage(file, { width, height, keepAspect = true, quality = 80, targetKB = null }) {
  const formData = new FormData();
  formData.append('image', file);
  if (width) formData.append('width', width);
  if (height) formData.append('height', height);
  formData.append('keepAspect', keepAspect);
  formData.append('quality', quality);
  if (targetKB) formData.append('targetKB', targetKB);

  const response = await fetch('/api/resize', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Resize failed');
  }

  const blob = await response.blob();
  const filename = getFilenameFromHeaders(response) || `resized-${Date.now()}.jpg`;
  
  return { blob, filename };
}

/**
 * Create passport photo - returns file directly
 */
export async function createPassportPhoto(file, { preset = 'passport', quality = 80, targetKB = null }) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('preset', preset);
  formData.append('quality', quality);
  if (targetKB) formData.append('targetKB', targetKB);

  const response = await fetch('/api/passport', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Passport photo creation failed');
  }

  const blob = await response.blob();
  const filename = getFilenameFromHeaders(response) || `passport-${Date.now()}.jpg`;
  
  return { blob, filename };
}

/**
 * Convert images to PDF - returns file directly
 */
export async function imagesToPdf(files) {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('images', file);
  });

  const response = await fetch('/api/pdf', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'PDF conversion failed');
  }

  const blob = await response.blob();
  const filename = getFilenameFromHeaders(response) || `images-${Date.now()}.pdf`;
  
  return { blob, filename };
}

/**
 * Extract filename from Content-Disposition header
 */
function getFilenameFromHeaders(response) {
  const disposition = response.headers.get('Content-Disposition');
  if (disposition) {
    const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);
    if (matches && matches[1]) {
      return matches[1].replace(/['"]/g, '');
    }
  }
  return null;
}

/**
 * Download blob as file
 */
export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Display blob as image preview
 */
export function blobToImageUrl(blob) {
  return URL.createObjectURL(blob);
}

// Usage Example in React Component:
// 
// import { compressImage, downloadBlob } from './api';
// 
// async function handleCompress() {
//   try {
//     setLoading(true);
//     const { blob, filename } = await compressImage(selectedFile, 70);
//     
//     // Option 1: Download immediately
//     downloadBlob(blob, filename);
//     
//     // Option 2: Show preview first
//     const previewUrl = URL.createObjectURL(blob);
//     setPreviewUrl(previewUrl);
//     
//     // Option 3: Get file size
//     const sizeKB = (blob.size / 1024).toFixed(2);
//     console.log(`Compressed size: ${sizeKB} KB`);
//     
//   } catch (error) {
//     console.error('Compression failed:', error);
//     alert(error.message);
//   } finally {
//     setLoading(false);
//   }
// }
