const express = require('express');
const router = express.Router();
const { getRecords } = require('../controllers/recordsController');

router.get('/test', (req, res) => {
  res.json({ message: 'Records API is working' });
});

router.get('/', getRecords);

module.exports = router;