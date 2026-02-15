const express = require("express");
const { uploadMultiple } = require("../middlewares/uploadMiddleware");
const { imageToPdf } = require("../controllers/pdfController");

const router = express.Router();

router.post("/image-to-pdf", uploadMultiple, imageToPdf);

module.exports = router;
