const express = require('express');
const router = express.Router();
const { getRecords, getPersonDetails, getDocuments } = require('../controllers/recordsController');

router.get('/', getRecords);
router.get('/:pid', getPersonDetails);
router.get('/:pid/documents', getDocuments);

module.exports = router;