const express = require("express");

const uploadRoutes = require("./uploadRoutes");
const passportRoutes = require("./passportRoutes");
const compressRoutes = require("./compressRoutes");
const resizeRoutes = require("./resizeRoutes");
const pdfRoutes = require("./pdfRoutes");
const unlockRoutes = require("./unlockRoutes");
const downloadRoutes = require("./downloadRoutes");

const router = express.Router();

router.use(uploadRoutes);
router.use(passportRoutes);
router.use(compressRoutes);
router.use(resizeRoutes);
router.use(pdfRoutes);
router.use(unlockRoutes);
router.use(downloadRoutes);

module.exports = router;
