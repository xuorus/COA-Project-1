const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/recordsController');

router.get('/test', (req, res) => {
  res.json({ message: 'Records API is working' });
});

router.get('/', recordsController.getRecords);

router.get('/:pid', recordsController.getPersonDetails);
router.get('/:pid/documents', recordsController.getDocuments);
router.get('/:pid/history', recordsController.getPersonHistory);

router.put('/:pid', recordsController.updatePersonDetails);

module.exports = router;