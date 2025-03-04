const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

router.post('/start-scan', scanController.startScan);

module.exports = router;