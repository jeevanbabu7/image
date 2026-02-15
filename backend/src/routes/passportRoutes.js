const express = require("express");
const { uploadSingle } = require("../middlewares/uploadMiddleware");
const { createPassport } = require("../controllers/passportController");

const router = express.Router();

router.post("/passport", uploadSingle, createPassport);

module.exports = router;
