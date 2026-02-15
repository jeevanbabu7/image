const express = require("express");
const { uploadSingle } = require("../middlewares/uploadMiddleware");
const { resize } = require("../controllers/resizeController");

const router = express.Router();

router.post("/resize", uploadSingle, resize);

module.exports = router;
