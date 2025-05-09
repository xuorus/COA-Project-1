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
        const requiredFields = ['firstName', 'lastName'];
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
            formData.bloodType || null,
            formData.profession || null,
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

// Helper function for activity logging
const addActivityLog = async (client, PID, activity) => {
    // Truncate activity message to fit varchar(50)
    const truncatedActivity = activity.length > 50 ? activity.substring(0, 47) + '...' : activity;
    const logQuery = `
        INSERT INTO logs ("PID", status, timestamp)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
    `;
    await client.query(logQuery, [PID, truncatedActivity]);
};

// Add this helper function after the addActivityLog function
const checkPersonExists = async (client, firstName, middleName, lastName) => {
    const query = `
        SELECT "PID" FROM person 
        WHERE LOWER("fName") = LOWER($1) 
        AND (
            CASE 
                WHEN $2::text IS NULL AND "mName" IS NULL THEN true
                WHEN $2::text IS NOT NULL AND "mName" IS NOT NULL AND LOWER("mName") = LOWER($2) THEN true
                ELSE false
            END
        )
        AND LOWER("lName") = LOWER($3)
    `;
    
    const values = [
        firstName.trim(),
        middleName?.trim() || null,
        lastName.trim()
    ];

    const result = await client.query(query, values);
    return result.rows.length > 0;
};

// Update addPersonWithDocument
const addPersonWithDocument = async (req, res) => {
    const client = await pool.connect();
    try {
        const file = req.file;
        const formData = JSON.parse(req.body.formData);
        const { documentType } = req.body;

        // Check for duplicate person
        const personExists = await checkPersonExists(
            client,
            formData.firstName,
            formData.middleName,
            formData.lastName
        );

        if (personExists) {
            return res.status(400).json({
                success: false,
                message: 'Person already exists'
            });
        }

        // Store document first
        const docQuery = documentType === 'PDS' 
            ? 'INSERT INTO pds ("filePath") VALUES ($1) RETURNING "pdsID"'
            : 'INSERT INTO saln ("filePath") VALUES ($1) RETURNING "salnID"';

        const docResult = await client.query(docQuery, [file.buffer]);
        const documentId = docResult.rows[0][documentType.toLowerCase() + 'ID'];

        // Create person with document reference
        const personQuery = `
            INSERT INTO person (
                "fName", "mName", "lName",
                "bloodType", profession, hobbies,
                ${documentType === 'PDS' ? '"pdsID"' : '"salnID"'}
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING "PID"
        `;

        const personResult = await client.query(personQuery, [
            formData.firstName,
            formData.middleName || null,
            formData.lastName,
            formData.bloodType || null,
            formData.profession || null,
            formData.hobbies || null,
            documentId
        ]);

        // Add activity log with proper document type text
        await addActivityLog(
            client, 
            personResult.rows[0].PID, 
            `Created Person Details with ${documentType} Document` // Using PDS or SALN directly
        );

        await client.query('COMMIT');
        res.json({ success: true, PID: personResult.rows[0].PID });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Add person error:', error);
        res.status(500).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
};

// Update addDocumentToExistingPerson
const addDocumentToExistingPerson = async (req, res) => {
    const client = await pool.connect();
    try {
        const { PID } = req.params;
        const file = req.file;
        const { documentType } = req.body;

        console.log('Adding document:', { PID, documentType });

        if (!file || !documentType || !PID) {
            return res.status(400).json({
                success: false,
                message: 'Missing required data'
            });
        }

        await client.query('BEGIN');

        // Check if document already exists
        const checkQuery = `
            SELECT "${documentType.toLowerCase()}ID" 
            FROM person 
            WHERE "PID" = $1
        `;
        const checkResult = await client.query(checkQuery, [PID]);
        
        if (checkResult.rows[0]?.[`${documentType.toLowerCase()}ID`]) {
            throw new Error(`Person already has a ${documentType}`);
        }

        // Insert document
        const docQuery = `
            INSERT INTO ${documentType.toLowerCase()} ("filePath")
            VALUES ($1)
            RETURNING "${documentType.toLowerCase()}ID"
        `;
        
        const docResult = await client.query(docQuery, [file.buffer]);
        const docId = docResult.rows[0][`${documentType.toLowerCase()}ID`];

        // Update person record
        const updateQuery = `
            UPDATE person
            SET "${documentType.toLowerCase()}ID" = $1
            WHERE "PID" = $2
        `;
        
        await client.query(updateQuery, [docId, PID]);

        // Add activity log with proper document type text
        await addActivityLog(
            client, 
            PID, 
            `Added ${documentType} Document` // Using PDS or SALN directly
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: `${documentType} added successfully`
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Add document error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        client.release();
    }
};

// Update updatePersonDocuments
const updatePersonDocuments = async (req, res) => {
    const client = await pool.connect();
    try {
        const { PID } = req.params;
        const { documentType } = req.query;
        const file = req.file;

        console.log('Updating document:', { PID, documentType, hasFile: !!file });

        if (!file || !documentType || !PID) {
            return res.status(400).json({
                success: false,
                message: 'Missing required data'
            });
        }

        await client.query('BEGIN');

        // Get document ID from person
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

        // Update document file
        const updateQuery = `
            UPDATE ${documentType.toLowerCase()}
            SET "filePath" = $1
            WHERE "${documentType.toLowerCase()}ID" = $2
            RETURNING "${documentType.toLowerCase()}ID"
        `;

        await client.query(updateQuery, [file.buffer, docId]);

        // Add activity log with proper document type text
        await addActivityLog(
            client, 
            PID, 
            `Updated ${documentType} Document` // Using PDS or SALN directly
        );

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

// Update existing document
const updateDocument = async (req, res) => {
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

        const updateQuery = `
            UPDATE ${docType}
            SET "filePath" = $1
            WHERE "${docType}ID" = $2
        `;

        await client.query(updateQuery, [file.buffer, docId]);
        await client.query('COMMIT');

        res.json({
            success: true,
            message: `${docType.toUpperCase()} updated successfully`
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

// Update updateDocument and updateDocumentFile
const updateDocumentFile = async (req, res) => {
    const client = await pool.connect();
    try {
        const { documentType, docId } = req.params;
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'No file provided'
            });
        }

        await client.query('BEGIN');

        // Update only the file path in the specific document table
        const updateQuery = `
            UPDATE ${documentType.toLowerCase()}
            SET "filePath" = $1
            WHERE "${documentType.toLowerCase()}ID" = $2
        `;

        const result = await client.query(updateQuery, [file.buffer, docId]);

        if (result.rowCount === 0) {
            throw new Error('Document not found');
        }

        // Get PID from document reference
        const getPIDQuery = `
            SELECT "PID" 
            FROM person 
            WHERE "${documentType.toLowerCase()}ID" = $1
        `;
        const pidResult = await client.query(getPIDQuery, [docId]);
        
        if (pidResult.rows[0]) {
            await addActivityLog(
                client,
                pidResult.rows[0].PID,
                `Updated ${documentType} Document` // Using PDS or SALN directly
            );
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            message: 'Document updated successfully'
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

// Add this new function for multiple documents
const addPersonWithMultipleDocuments = async (req, res) => {
    const client = await pool.connect();
    try {
        const files = req.files;
        const formData = JSON.parse(req.body.formData);
        const documentTypes = JSON.parse(req.body.documentTypes);

        // Check for duplicate person
        const personExists = await checkPersonExists(
            client,
            formData.firstName,
            formData.middleName,
            formData.lastName
        );

        if (personExists) {
            return res.status(400).json({
                success: false,
                message: 'Person already exists'
            });
        }

        // Validate required fields (keep same validation as addPerson)
        const requiredFields = ['firstName', 'lastName'];
        const missingFields = requiredFields.filter(field => !formData[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }

        await client.query('BEGIN');

        const personQuery = `
            INSERT INTO person (
                "fName", "mName", "lName",
                "bloodType", profession, hobbies
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING "PID"
        `;

        const personResult = await client.query(personQuery, [
            formData.firstName,
            formData.middleName || null,
            formData.lastName,
            formData.bloodType || null,
            formData.profession || null,
            formData.hobbies || null
        ]);

        const PID = personResult.rows[0].PID;

        // Add initial log for person creation with multiple documents
        await addActivityLog(
            client,
            PID,
            'Created Personal Details with Multiple Documents'
        );

        // Process each document
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const documentType = documentTypes[i];

            // Insert document
            const docQuery = `
                INSERT INTO ${documentType.toLowerCase()} ("filePath")
                VALUES ($1)
                RETURNING "${documentType.toLowerCase()}ID"
            `;
            
            const docResult = await client.query(docQuery, [file.buffer]);
            const docId = docResult.rows[0][`${documentType.toLowerCase()}ID`];

            // Update person with document reference
            const updateQuery = `
                UPDATE person
                SET "${documentType.toLowerCase()}ID" = $1
                WHERE "PID" = $2
            `;
            
            await client.query(updateQuery, [docId, PID]);

            // Add individual document logs
            await addActivityLog(
                client,
                PID,
                `Added ${documentType} Document`
            );
        }

        await client.query('COMMIT');

        res.json({
            success: true,
            PID: PID,
            message: 'Person created with multiple documents'
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Add person with multiple documents error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to create person with documents'
        });
    } finally {
        client.release();
    }
};

// Update the records fetch route to handle array of blood types
const getRecords = async (req, res) => {
  const client = await pool.connect();
  try {
    let query = `SELECT * FROM person`;
    const params = [];
    
    if (req.query.bloodType) {
      // Handle array of blood types
      if (Array.isArray(req.query.bloodType)) {
        query += ` WHERE "bloodType" = ANY($1)`;
        params.push(req.query.bloodType);
      } else if (req.query.bloodType !== 'all') {
        query += ` WHERE "bloodType" = $1`;
        params.push(req.query.bloodType);
      }
    }
    
    const result = await client.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  } finally {
    client.release();
  }
};

// Add to module.exports
module.exports = {
    startScan,
    addPerson,
    getScanStatus,
    getPreview,
    addPersonWithDocument,
    updatePersonDocuments,
    addDocumentToExistingPerson,
    updateDocumentFile,
    updateDocument,
    addPersonWithMultipleDocuments,
    getRecords
};