const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

router.post('/', scanController.startScan);

module.exports = router;