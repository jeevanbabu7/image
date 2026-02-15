const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const { ALLOWED_MIME_TYPES, ALLOWED_EXTENSIONS, MAX_FILE_SIZE, UPLOAD_DIR } = require("../utils/constants");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uuidv4()}${extension}`);
  }
});

function fileFilter(req, file, cb) {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowed = ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(extension);
  if (!allowed) {
    const error = new Error("Only JPG and PNG images are allowed");
    error.statusCode = 400;
    return cb(error);
  }
  return cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE }
});

const uploadSingle = upload.single("image");
const uploadMultiple = upload.array("images", 10);

module.exports = { uploadSingle, uploadMultiple };
