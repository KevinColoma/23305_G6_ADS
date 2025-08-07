// src/config/multer.js
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const UPLOAD_DIR = 'uploads/';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);
const storage = multer.diskStorage({
  destination: (_,__,cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
module.exports = multer({ storage });
