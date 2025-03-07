const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// POST route for uploading scanned documents
router.post('/', scanController.uploadScannedDocument);

module.exports = router;