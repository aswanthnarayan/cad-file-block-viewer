const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter for DXF only
function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  if (file.mimetype === 'application/dxf' || ext === '.dxf') {
    cb(null, true);
  } else {
    cb(new Error('Only DXF files are allowed!'), false);
  }
}

const limits = { fileSize: 10 * 1024 * 1024 };

const upload = multer({
  storage,
  fileFilter,
  limits,
});

// Middleware to handle upload errors and clean up temp files
function uploadErrorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError || err) {
    // Attempt to clean up uploaded file if present
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => {});
    }
    return res.status(400).json({ success: false, message: err.message || 'Upload error' });
  }
  next();
}

module.exports = upload;
module.exports.uploadErrorHandler = uploadErrorHandler;