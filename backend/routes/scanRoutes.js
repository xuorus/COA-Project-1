const express = require('express');
const router = express.Router();
const scanController = require('../controllers/scanController');

router.post('/pds', scanController.scanPDS);
router.post('/saln', scanController.scanSALN);

module.exports = router;