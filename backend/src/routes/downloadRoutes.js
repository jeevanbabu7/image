const express = require("express");
const { download } = require("../controllers/downloadController");

const router = express.Router();

router.get("/download/:token", download);

module.exports = router;
