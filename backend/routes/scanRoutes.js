const express = require('express');
const router = express.Router();
const { startScan } = require('../controllers/scanController');

router.post('/start-scan', scanController.startScan);
router.post('/person', scanController.addPerson);
router.post('/upload', uploadScannedDocument);

module.exports = router;