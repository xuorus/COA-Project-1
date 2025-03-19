const express = require('express');
const router = express.Router();
const { executeScan } = require('../controllers/scannerController');

router.post('/execute-scan', executeScan);

module.exports = router;