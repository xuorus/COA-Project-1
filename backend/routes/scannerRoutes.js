const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/scans', (req, res) => {
  db.query('SELECT * FROM scans', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

module.exports = router;
