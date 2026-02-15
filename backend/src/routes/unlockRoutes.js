const express = require("express");
const { unlock } = require("../controllers/unlockController");

const router = express.Router();

router.post("/unlock", unlock);

module.exports = router;
