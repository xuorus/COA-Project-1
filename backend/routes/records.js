const express = require('express');
const router = express.Router();
const { getRecords, getPersonDetails, getDocuments, getPersonHistory, updatePersonDetails } = require('../controllers/recordsController');
const recordsController = require('../controllers/recordsController');

router.get('/', getRecords);
router.get('/:pid', getPersonDetails);
router.get('/:pid/documents', getDocuments);
router.get('/:pid/history', getPersonHistory);
router.put('/:pid', updatePersonDetails);
router.put('/records/:pid', updatePersonDetails);

module.exports = router;