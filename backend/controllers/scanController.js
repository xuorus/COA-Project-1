const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');
const pool = require('../config/db');

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
        status
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
        const file = req.file;

        if (!file || !documentType) {
            return res.status(400).json({
                success: false,
                message: 'Missing file or document type'
            });
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            
            const query = documentType === 'PDS' 
                ? 'INSERT INTO pds ("filePath") VALUES ($1) RETURNING "pdsID"'
                : 'INSERT INTO saln ("filePath") VALUES ($1) RETURNING "salnID"';

            const result = await client.query(query, [file.buffer]);
            const documentId = result.rows[0][documentType.toLowerCase() + 'ID'];

            await client.query('COMMIT');

            res.json({
                success: true,
                documentId,
                documentType
            });

        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }

    } catch (error) {
        console.error('Scan error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const addPerson = async (req, res) => {
    const client = await pool.connect();
    try {
        console.log('Received request body:', req.body); // Debug log

        const { documentType, formData } = req.body;

        // Validate all required fields
        const requiredFields = ['firstName', 'lastName', 'bloodType', 'profession'];
        const missingFields = requiredFields.filter(field => !formData?.[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        await client.query('BEGIN');

        // Insert into person table
        const insertQuery = `
            INSERT INTO person (
                "fName", "mName", "lName",
                "bloodType", profession, hobbies
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING "PID"
        `;

        const result = await client.query(insertQuery, [
            formData.firstName,
            formData.middleName || null,
            formData.lastName,
            formData.bloodType,
            formData.profession,
            formData.hobbies || null
        ]);

        await client.query('COMMIT');

        console.log('Person added successfully:', result.rows[0]);

        res.json({
            success: true,
            personId: result.rows[0].PID,
            message: 'Person added successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Person add error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add person'
        });
    } finally {
        client.release();
    }
};

const addPersonWithDocument = async (req, res) => {
    const client = await pool.connect();
    try {
        const file = req.file;
        const documentType = req.body.documentType;
        const formData = JSON.parse(req.body.formData); // Parse the JSON string

        console.log('Received data:', {
            file: file?.originalname,
            documentType,
            formData
        });

        if (!file || !documentType || !formData) {
            return res.status(400).json({
                success: false,
                message: 'Missing file, document type, or person data'
            });
        }

        await client.query('BEGIN');

        // First: Store document and get ID
        const docQuery = documentType === 'PDS' 
            ? 'INSERT INTO pds ("filePath") VALUES ($1) RETURNING "pdsID"'
            : 'INSERT INTO saln ("filePath") VALUES ($1) RETURNING "salnID"';

        const docResult = await client.query(docQuery, [file.buffer]);
        const documentId = docResult.rows[0][documentType.toLowerCase() + 'ID'];
        
        console.log(`${documentType} stored with ID:`, documentId);

        // Second: Store person data with document ID
        const personQuery = documentType === 'PDS'
            ? `INSERT INTO person (
                "fName", "mName", "lName",
                "bloodType", profession, hobbies,
                "pdsID"
               ) VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING "PID"`
            : `INSERT INTO person (
                "fName", "mName", "lName",
                "bloodType", profession, hobbies,
                "salnID"
               ) VALUES ($1, $2, $3, $4, $5, $6, $7)
               RETURNING "PID"`;

        const personResult = await client.query(personQuery, [
            formData.firstName,
            formData.middleName || null,
            formData.lastName,
            formData.bloodType,
            formData.profession,
            formData.hobbies,
            documentId
        ]);

        await client.query('COMMIT');
        console.log('Transaction completed successfully');

        res.json({
            success: true,
            documentId,
            personId: personResult.rows[0].PID,
            message: 'Document and person data added successfully'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to process request'
        });
    } finally {
        client.release();
    }
};

const updatePersonDocuments = async (req, res) => {
    const client = await pool.connect();
    try {
        const { PID } = req.params;
        const { documentType } = req.query; // Get from query params
        const file = req.file;

        console.log('Updating document:', { PID, documentType, hasFile: !!file });

        if (!file || !documentType || !PID) {
            return res.status(400).json({
                success: false,
                message: 'Missing required data'
            });
        }

        await client.query('BEGIN');

        // First, get the document ID if it exists
        const docIdQuery = `
            SELECT "${documentType.toLowerCase()}ID" 
            FROM person 
            WHERE "PID" = $1
        `;
        const docIdResult = await client.query(docIdQuery, [PID]);
        
        if (!docIdResult.rows[0]) {
            throw new Error('Person not found');
        }

        const docId = docIdResult.rows[0][`${documentType.toLowerCase()}ID`];

        // Update the document file
        const updateQuery = `
            UPDATE ${documentType.toLowerCase()}
            SET "filePath" = $1
            WHERE "${documentType.toLowerCase()}ID" = $2
            RETURNING "${documentType.toLowerCase()}ID"
        `;

        await client.query(updateQuery, [file.buffer, docId]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: `${documentType} updated successfully`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Update document error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        client.release();
    }
};

const addDocumentToExistingPerson = async (req, res) => {
    const client = await pool.connect();
    try {
        const { PID } = req.params;
        const file = req.file;
        const { documentType } = req.body;

        console.log('Adding document:', { PID, documentType }); // Debug log

        if (!file || !documentType || !PID) {
            return res.status(400).json({
                success: false,
                message: 'Missing file, document type, or person ID'
            });
        }

        await client.query('BEGIN');

        let documentId;
        let updateQuery;

        // Handle different document types
        if (documentType === 'PDS') {
            // Insert into PDS table
            const pdsResult = await client.query(
                'INSERT INTO pds ("filePath") VALUES ($1) RETURNING "pdsID"',
                [file.buffer]
            );
            documentId = pdsResult.rows[0].pdsID;
            updateQuery = 'UPDATE person SET "pdsID" = $1 WHERE "PID" = $2';
        } else if (documentType === 'SALN') {
            // Insert into SALN table
            const salnResult = await client.query(
                'INSERT INTO saln ("filePath") VALUES ($1) RETURNING "salnID"',
                [file.buffer]
            );
            documentId = salnResult.rows[0].salnID;
            updateQuery = 'UPDATE person SET "salnID" = $1 WHERE "PID" = $2';
        } else {
            throw new Error(`Invalid document type: ${documentType}`);
        }

        // Update person record with new document ID
        await client.query(updateQuery, [documentId, PID]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: `${documentType} added successfully`,
            documentId
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Add document error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add document'
        });
    } finally {
        client.release();
    }
};

const updateDocumentFile = async (req, res) => {
    const client = await pool.connect();
    try {
        const { docType, docId } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        await client.query('BEGIN');

        // Update file path in the specific document table
        const updateQuery = `
            UPDATE ${docType}
            SET "filePath" = $1,
                "updatedAt" = CURRENT_TIMESTAMP
            WHERE "${docType}ID" = $2
            RETURNING "${docType}ID"
        `;

        const result = await client.query(updateQuery, [file.buffer, docId]);

        if (result.rowCount === 0) {
            throw new Error(`${docType.toUpperCase()} document not found`);
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            message: `${docType.toUpperCase()} file updated successfully`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Update document error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        client.release();
    }
};

module.exports = {
    startScan,
    addPerson,
    getScanStatus,
    getPreview,
    addPersonWithDocument,
    updatePersonDocuments,
    addDocumentToExistingPerson,
    updateDocumentFile
};