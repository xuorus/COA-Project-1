const express = require('express');
const router = express.Router();
const recordsController = require('../controllers/recordsController');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Records API is working' });
});

// General routes
router.get('/', recordsController.getRecords);
router.get('/:pid', recordsController.getPersonDetails);
router.get('/:pid/history', recordsController.getPersonHistory);
router.put('/:pid', recordsController.updatePersonDetails);
router.post('/:pid/history', recordsController.addHistory);

// Individual document routes
router.get('/:pid/documents/pds', recordsController.getPDS);
router.get('/:pid/documents/saln', recordsController.getSALN);
router.get('/:pid/documents/nosa', recordsController.getNOSA);
router.get('/:pid/documents/sr', recordsController.getSR);
router.get('/:pid/documents/ca', recordsController.getCA);
router.get('/:pid/documents/designation-order', recordsController.getDesignationOrder); // Changed to use hyphen
router.get('/:pid/documents/noa', recordsController.getNOA);
router.get('/:pid/documents/sat', recordsController.getSAT);
router.get('/:pid/documents/coe', recordsController.getCOE);
router.get('/:pid/documents/tor', recordsController.getTOR);
router.get('/:pid/documents/mc', recordsController.getMC);
router.get('/:pid/documents/med-cert', recordsController.getMedCert);
router.get('/:pid/documents/nbi', recordsController.getNBI);
router.get('/:pid/documents/ccaa', recordsController.getCCAA);
router.get('/:pid/documents/dad', recordsController.getDAD);

// Keep general documents route for backward compatibility
router.get('/:pid/documents', recordsController.getDocuments);

// Delete document routes
router.delete('/:pid/documents/:type', recordsController.deleteDocument);

module.exports = router;
