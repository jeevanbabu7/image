const express = require("express");
const cors = require("cors");

const routes = require("./routes");
const { errorHandler } = require("./middlewares/errorHandler");
const { apiLimiter } = require("./middlewares/rateLimit");
const { ensureUploadsDir } = require("./utils/fileUtils");

const app = express();

ensureUploadsDir();

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
