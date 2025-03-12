const express = require('express');
const router = express.Router();
const { startScan } = require('../controllers/scanController');

router.post('/start-scan', startScan);

module.exports = router;