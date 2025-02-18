const express = require('express');
const router = express.Router();
const { getRecords, getPersonDetails, getDocuments, getPersonHistory } = require('../controllers/recordsController');

router.get('/', getRecords);
router.get('/:pid', getPersonDetails);
router.get('/:pid/documents', getDocuments);
router.get('/:pid/history', getPersonHistory);

module.exports = router;