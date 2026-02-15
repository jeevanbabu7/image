const express = require("express");
const { uploadSingle } = require("../middlewares/uploadMiddleware");
const { compress } = require("../controllers/compressController");

const router = express.Router();

router.post("/compress", uploadSingle, compress);

module.exports = router;
