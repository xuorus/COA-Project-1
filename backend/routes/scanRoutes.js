const express = require('express');
const router = express.Router();
const multer = require('multer');
const scanController = require('../controllers/scanController');

// Configure multer
const upload = multer({ storage: multer.memoryStorage() });

// Define scan routes with proper middleware
router.post('/start-scan', upload.single('file'), scanController.startScan);
router.post('/person', scanController.addPerson);
router.get('/status/:scanId', scanController.getScanStatus);
router.get('/preview/:tempId', scanController.getPreview);

// Single endpoint to handle both document and person data
router.post('/submit', upload.single('file'), scanController.addPersonWithDocument);

// New route for updating person's documents
router.patch('/person/:PID/documents', upload.single('file'), scanController.updatePersonDocuments);

module.exports = router;