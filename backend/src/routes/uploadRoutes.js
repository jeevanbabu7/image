const express = require("express");
const { uploadSingle } = require("../middlewares/uploadMiddleware");
const { uploadImage } = require("../controllers/uploadController");

const router = express.Router();

router.post("/upload", uploadSingle, uploadImage);

module.exports = router;
