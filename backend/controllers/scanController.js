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
        const { documentType } = req.body;
        const file = req.file;

        console.log('Updating documents for PID:', PID); // Debug log

        if (!file || !documentType || !PID) {
            return res.status(400).json({
                success: false,
                message: 'Missing file, document type, or PID'
            });
        }

        await client.query('BEGIN');

        // First insert into SALN table and get the ID
        const insertQuery = 'INSERT INTO saln ("filePath") VALUES ($1) RETURNING "salnID"';
        const insertResult = await client.query(insertQuery, [file.buffer]);
        const salnID = insertResult.rows[0].salnID;

        console.log('Inserted SALN with ID:', salnID); // Debug log

        // Then update the person's record with the new SALN ID
        const updateQuery = 'UPDATE person SET "salnID" = $1 WHERE "PID" = $2';
        await client.query(updateQuery, [salnID, PID]);

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'SALN document added successfully',
            salnID,
            PID
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
    updatePersonDocuments
};