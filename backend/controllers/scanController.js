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
        logger.info('Received scan request for:', documentType);

        if (!documentType) {
            return res.status(400).json(createScanResponse(
                false,
                null,
                null,
                null,
                new Error('Document type is required')
            ));
        }

        if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
            return res.status(400).json(createScanResponse(
                false,
                null,
                documentType,
                null,
                new Error(`Invalid document type: ${documentType}`)
            ));
        }

        const result = await performScan(documentType);
        return res.json(createScanResponse(
            true,
            `Successfully scanned ${documentType}`,
            documentType,
            result
        ));
    } catch (error) {
        logger.error('Scan controller error:', error);
        return res.status(500).json(createScanResponse(
            false,
            null,
            req.body.documentType,
            null,
            error
        ));
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

const addPerson = async (req, res) => {
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

// Make sure to export the controller functions
module.exports = {
  performScan,
  startScan,
  uploadScannedDocument,
  addPerson
};