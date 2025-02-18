const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post('/upload', upload.single('file'), (req, res) => {
  const tempPath = req.file.path;
  const targetPath = path.join(__dirname, 'uploads', 'scannedDocument.pdf');

  fs.rename(tempPath, targetPath, err => {
    if (err) return res.status(500).send('Error saving file');
    res.sendFile(targetPath);
  });
});

module.exports = router;