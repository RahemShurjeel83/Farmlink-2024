const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_FILE_SIZE_MB = 5;

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "public/Images");
  },
  filename: (req, file, callback) => {
    const randomName = crypto.randomBytes(16).toString("hex");
    callback(null, randomName + path.extname(file.originalname).toLowerCase());
  },
});

const fileFilter = (req, file, callback) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    callback(null, true);
  } else {
    callback(new Error("Only JPEG, PNG, and WebP images are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_MB * 1024 * 1024 },
});

const handleUploadError = (err, res) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: `File too large. Max size is ${MAX_FILE_SIZE_MB}MB.` });
    }
    return res.status(400).json({ message: "File upload error." });
  }
  if (err) {
    return res.status(400).json({ message: err.message });
  }
};

const buildSingleUploadMiddleware = (fieldName, { required, label }) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (err) return handleUploadError(err, res);
    if (required && !req.file) return res.status(400).json({ message: `${label} is required.` });
    next();
  });
};

const categoryUploadMiddleware = buildSingleUploadMiddleware("categoryImage", { required: true, label: "Category image" });
const productUploadMiddleware = buildSingleUploadMiddleware("productImage", { required: true, label: "Product image" });

// Edit/update flows shouldn't force re-uploading an image — the existing one is kept if omitted.
const categoryUpdateUploadMiddleware = buildSingleUploadMiddleware("categoryImage", { required: false });
const productUpdateUploadMiddleware = buildSingleUploadMiddleware("productImage", { required: false });

module.exports = {
  categoryUploadMiddleware,
  productUploadMiddleware,
  categoryUpdateUploadMiddleware,
  productUpdateUploadMiddleware,
};
