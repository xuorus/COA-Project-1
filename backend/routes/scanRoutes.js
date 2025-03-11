const express = require('express');
const router = express.Router();
const { startScan, uploadScannedDocument, testDbConnection } = require('../controllers/scanController');

router.post('/start-scan', startScan);
router.post('/upload', uploadScannedDocument);
router.get('/test-db', testDbConnection);

module.exports = router;