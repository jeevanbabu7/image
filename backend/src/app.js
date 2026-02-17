const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimit");
const { ensureUploadsDir } = require("./utils/fileUtils");
const { startAutomaticCleanup } = require("./utils/cleanupOrphanedFiles");

const app = express();

ensureUploadsDir();

// Start automatic cleanup of orphaned files
// Runs every 10 minutes, deletes files older than 15 minutes
console.log("🧹 Initializing automatic file cleanup system...");
startAutomaticCleanup(10, 15);
console.log("✅ Cleanup system active - files auto-delete after 15 minutes");

app.use(
  cors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*"
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", apiLimiter, routes);
app.use(errorHandler);

module.exports = app;
