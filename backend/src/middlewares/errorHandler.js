const { MulterError } = require("multer");

function errorHandler(err, req, res, next) {
  if (err instanceof MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err && err.statusCode) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  console.error(err);
  return res.status(500).json({ error: "Unexpected server error" });
}

module.exports = { errorHandler };
