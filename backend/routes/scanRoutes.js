const express = require('express');
const multer = require('multer');
const { processScan } = require('../controllers/scanController');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/scan', upload.single('file'), processScan);

module.exports = router;
