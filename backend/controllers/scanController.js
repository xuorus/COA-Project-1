const { spawn } = require('child_process');
const path = require("path");
const fs = require('fs').promises;
const pool = require('../config/db');
const ScanModel = require('../models/scanModel');
const logger = require('../utils/logger');

// Constants
const VALID_DOCUMENT_TYPES = ['PDS', 'SALN'];
const SCAN_TIMEOUT = 30000; // 30 seconds
const SCAN_OUTPUT_DIR = path.join(__dirname, '../temp');
const SCANNED_DOCS_DIR = path.join(__dirname, '../scanned_documents');
const ARCHIVE_DIR = path.join(__dirname, '../archived_documents');

// Helper Functions
const sanitizeDocumentType = (docType) => {
    return docType.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
};

const createScanResponse = (success, message, documentType, output = null, error = null) => {
    return {
        success,
        message: success ? message : error?.message || 'Unknown error',
        ...(output && { output }),
        documentType
    };
};

const initializeDirs = async () => {
    try {
        await fs.access(SCAN_OUTPUT_DIR);
    } catch {
        await fs.mkdir(SCAN_OUTPUT_DIR, { recursive: true });
    }
    try {
        await fs.access(SCANNED_DOCS_DIR);
    } catch {
        await fs.mkdir(SCANNED_DOCS_DIR, { recursive: true });
    }
    try {
        await fs.access(ARCHIVE_DIR);
    } catch {
        await fs.mkdir(ARCHIVE_DIR, { recursive: true });
    }
};

const performScan = async (documentType) => {
    if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
        throw new Error(`Invalid document type: ${documentType}`);
    }

    await initializeDirs();
    const scriptPath = path.join(__dirname, "../scripts/scan.ps1");
    const scanOutputPath = path.join(SCAN_OUTPUT_DIR, `${Date.now()}_${documentType}`);
    
    try {
        await fs.access(scriptPath);
        logger.info('Found scan script at:', scriptPath);
        await fs.mkdir(scanOutputPath, { recursive: true });

        return new Promise((resolve, reject) => {
            let outputData = '';
            let errorData = '';
            let timeoutId = null;
            
            logger.info(`Executing scan script for ${documentType}...`);
            
            const sanitizedDocType = sanitizeDocumentType(documentType);
            const scanProcess = spawn('powershell.exe', [
                '-ExecutionPolicy',
                'Bypass',
                '-NoProfile',
                '-NonInteractive',
                '-File',
                scriptPath,
                '-documentType',
                sanitizedDocType,
                '-outputDir',
                scanOutputPath  // Add the required outputDir parameter
            ]);

            scanProcess.stdout.on('data', (data) => {
                outputData += data.toString();
                logger.debug('Scan output:', data.toString());
            });

            scanProcess.stderr.on('data', (data) => {
                errorData += data.toString();
                logger.error('Scan error:', data.toString());
            });

            scanProcess.on('close', (code) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                if (code === 0) {
                    resolve(outputData.trim());
                } else {
                    reject(new Error(`Scan failed with code ${code}: ${errorData}`));
                }
            });

            scanProcess.on('error', (error) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                reject(new Error(`Failed to start scan process: ${error.message}`));
            });

            timeoutId = setTimeout(() => {
                scanProcess.kill();
                reject(new Error('Scan operation timed out'));
            }, SCAN_TIMEOUT);
        });
    } catch (error) {
        logger.error('Scan setup error:', error);
        throw new Error(`Failed to initialize scan: ${error.message}`);
    }
};

const startScan = async (req, res) => {
    try {
        const { documentType } = req.body;
        logger.info('Received document storage request for:', documentType);

        if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid document type'
            });
        }

        try {
            const samplePdfPath = path.join(__dirname, '../sample/sample.pdf');
            const fileData = await fs.readFile(samplePdfPath);
            const base64Data = fileData.toString('base64');

            const client = await pool.connect();
            try {
                await client.query('BEGIN');

                const tableName = documentType.toLowerCase();
                const idColumn = `${tableName}ID`;

                // Find next available ID
                const findNextIdQuery = `
                    WITH RECURSIVE sequence_numbers AS (
                        SELECT 1 as num
                        UNION ALL
                        SELECT num + 1
                        FROM sequence_numbers
                        WHERE num < (SELECT max("${idColumn}") FROM "${tableName}")
                    )
                    SELECT num
                    FROM sequence_numbers s
                    WHERE NOT EXISTS (
                        SELECT 1 FROM "${tableName}" t WHERE t."${idColumn}" = s.num
                    )
                    ORDER BY num
                    LIMIT 1
                `;

                const nextIdResult = await client.query(findNextIdQuery);
                const nextId = nextIdResult.rows.length > 0 
                    ? nextIdResult.rows[0].num 
                    : await client.query(`SELECT coalesce(max("${idColumn}") + 1, 1) as next_id FROM "${tableName}"`).then(r => r.rows[0].next_id);

                // Insert document with found ID
                const docQuery = `
                    INSERT INTO "${tableName}" ("${idColumn}", "filePath")
                    VALUES ($1, decode($2, 'base64'))
                    RETURNING "${idColumn}"
                `;
                
                const result = await client.query(docQuery, [nextId, base64Data]);
                const docId = result.rows[0][idColumn.toLowerCase()];

                await client.query('COMMIT');

                return res.json({
                    success: true,
                    message: `${documentType} document stored successfully`,
                    documentId: docId
                });

            } catch (error) {
                await client.query('ROLLBACK');
                throw error;
            } finally {
                client.release();
            }

        } catch (error) {
            throw new Error(`Failed to read or store file: ${error.message}`);
        }

    } catch (error) {
        logger.error('Storage error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const uploadScannedDocument = async (req, res) => {
    let client;
    try {
        const { pid, type, data } = req.body;

        if (!pid || !type || !data) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        if (!VALID_DOCUMENT_TYPES.includes(type)) {
            return res.status(400).json({
                success: false,
                message: `Invalid document type: ${type}`
            });
        }
        
        client = await pool.connect();
        await client.query('BEGIN');

        const docQuery = `
            INSERT INTO "${type.toLowerCase()}" ("${type}file")
            VALUES (decode($1, 'base64'))
            RETURNING "${type}ID"
        `;
        
        const docResult = await client.query(docQuery, [data]);
        const docId = docResult.rows[0][`${type.toLowerCase()}id`];

        await client.query(
            `UPDATE "person" 
             SET "${type}ID" = $1 
             WHERE "PID" = $2`,
            [docId, pid]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: `${type} document uploaded successfully`,
            documentId: docId
        });
    } catch (error) {
        if (client) {
            await client.query('ROLLBACK');
        }
        logger.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        if (client) {
            client.release();
        }
    }
};

const addPerson = async (req, res) => { //Add New Person in Scan Input
    try {
        const {
            fName,
            mName,
            lName,
            bloodType,
            profession,
            hobbies
        } = req.body;

        // Validate required fields
        if (!fName || !lName) {
            return res.status(400).json({
                success: false,
                message: 'First name and last name are required'
            });
        }

        const result = await ScanModel.addPerson({
            fName,
            mName,
            lName,
            bloodType,
            profession,
            hobbies
        });

        res.json({
            success: true,
            message: 'Record added successfully',
            pid: result.pid
        });

    } catch (error) {
        logger.error('Add person error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    startScan,
    uploadScannedDocument,
    addPerson
};