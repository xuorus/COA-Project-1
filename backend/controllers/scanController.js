const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

// Track scanning status
const scanStatus = new Map();

// Constants
const TEMP_DIR = path.join(__dirname, '../temp');
const VALID_DOCUMENT_TYPES = ['PDS', 'SALN'];

// Initialize temp directory
(async () => {
    try {
        await fs.mkdir(TEMP_DIR, { recursive: true });
        logger.info('Temp directory initialized:', TEMP_DIR);
    } catch (error) {
        logger.error('Failed to create temp directory:', error);
    }
})();

const getScanStatus = async (req, res) => {
    const { scanId } = req.params;
    const status = scanStatus.get(scanId);

    if (!status) {
        return res.status(404).json({
            success: false,
            message: 'Scan not found'
        });
    }

    res.json({
        success: true,
        completed: status.completed,
        tempId: status.tempId,
        error: status.error
    });
};

const getPreview = async (req, res) => {
    try {
        const { tempId } = req.params;
        const tempFile = path.join(TEMP_DIR, `${tempId}.pdf`);

        try {
            await fs.access(tempFile);
        } catch {
            return res.status(404).json({
                success: false,
                message: 'Preview not found'
            });
        }

        res.sendFile(tempFile);

    } catch (error) {
        logger.error('Preview error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const startScan = async (req, res) => {
    try {
        const { documentType } = req.body;
        if (!documentType || !VALID_DOCUMENT_TYPES.includes(documentType.toUpperCase())) {
            return res.status(400).json({
                success: false,
                message: `Invalid document type. Must be one of: ${VALID_DOCUMENT_TYPES.join(', ')}`
            });
        }

        const scanId = uuidv4();
        const outputFile = path.join(TEMP_DIR, `${documentType}.pdf`);

        // For testing, create a sample PDF
        const samplePdf = `%PDF-1.7
1 0 obj
<</Type/Catalog/Pages 2 0 R>>
endobj
2 0 obj
<</Type/Pages/Kids[3 0 R]/Count 1>>
endobj
3 0 obj
<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]>>
endobj
xref
0 4
0000000000 65535 f
0000000009 00000 n
0000000052 00000 n
0000000101 00000 n
trailer
<</Size 4/Root 1 0 R>>
startxref
164
%%EOF`;

        await fs.writeFile(outputFile, samplePdf);

        scanStatus.set(scanId, {
            completed: true,
            tempId: documentType,
            filePath: outputFile
        });

        res.json({
            success: true,
            message: `Document scanned successfully`,
            scanId,
            tempId: documentType
        });

    } catch (error) {
        logger.error('Scan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    startScan,
    getScanStatus,
    getPreview
};