const sharp = require("sharp");
const path = require("path");
const { createOutputPath } = require("../utils/fileUtils");

const PRESETS = {
  passport: { width: 413, height: 531 },
  twoInch: { width: 600, height: 600 }
};

async function encodeJpegWithTarget(buffer, { quality, targetKB }) {
  let currentQuality = quality;
  let outputBuffer = await sharp(buffer).jpeg({ quality: currentQuality }).toBuffer();

  if (!targetKB) {
    return outputBuffer;
  }

  const targetBytes = targetKB * 1024;
  while (outputBuffer.length > targetBytes && currentQuality > 30) {
    currentQuality -= 5;
    outputBuffer = await sharp(buffer).jpeg({ quality: currentQuality }).toBuffer();
  }

  return outputBuffer;
}

async function createPassportPhoto(inputPath, { preset, quality, targetKB }) {
  const size = PRESETS[preset];
  if (!size) {
    const error = new Error("Invalid preset");
    error.statusCode = 400;
    throw error;
  }

  const baseBuffer = await sharp(inputPath)
    .resize({
      width: size.width,
      height: size.height,
      fit: "cover",
      position: "centre",
      background: "#ffffff"
    })
    .flatten({ background: "#ffffff" })
    .toBuffer();

  const outputBuffer = await encodeJpegWithTarget(baseBuffer, { quality, targetKB });
  const outputPath = createOutputPath(".jpg");
  await sharp(outputBuffer).toFile(outputPath);

  return { outputPath, mimeType: "image/jpeg", extension: ".jpg" };
}

async function compressImage(inputPath, { quality, mimeType }) {
  const extension = mimeType === "image/png" ? ".png" : ".jpg";
  const outputPath = createOutputPath(extension);

  if (mimeType === "image/png") {
    await sharp(inputPath).png({ quality }).toFile(outputPath);
  } else {
    await sharp(inputPath).jpeg({ quality }).toFile(outputPath);
  }

  return { outputPath, mimeType, extension };
}

async function resizeImage(inputPath, { width, height, keepAspect, targetKB, quality, mimeType }) {
  const resizeOptions = {
    width: width || null,
    height: height || null,
    fit: keepAspect ? "inside" : "fill"
  };

  const base = sharp(inputPath).resize(resizeOptions);

  if (targetKB) {
    const buffer = await base.toBuffer();
    const outputBuffer = await encodeJpegWithTarget(buffer, { quality, targetKB });
    const outputPath = createOutputPath(".jpg");
    await sharp(outputBuffer).toFile(outputPath);
    return { outputPath, mimeType: "image/jpeg", extension: ".jpg" };
  }

  const extension = mimeType === "image/png" ? ".png" : ".jpg";
  const outputPath = createOutputPath(extension);
  if (mimeType === "image/png") {
    await base.png({ quality }).toFile(outputPath);
  } else {
    await base.jpeg({ quality }).toFile(outputPath);
  }

  return { outputPath, mimeType, extension };
}

module.exports = {
  createPassportPhoto,
  compressImage,
  resizeImage
};
