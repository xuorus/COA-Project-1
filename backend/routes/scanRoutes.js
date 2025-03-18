const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

// Define scan routes
router.post('/start-scan', scanController.startScan);
router.post('/person', scanController.addPerson);
router.get('/status/:scanId', scanController.getScanStatus);
router.get('/preview/:tempId', scanController.getPreview);

module.exports = router;