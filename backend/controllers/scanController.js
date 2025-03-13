const { spawn } = require('child_process');
const path = require("path");
const fs = require('fs').promises;
const pool = require('../config/db');

// Constants
const VALID_DOCUMENT_TYPES = ['PDS', 'SALN'];
const SCAN_TIMEOUT = 30000; // 30 seconds
const SCAN_OUTPUT_DIR = path.join(__dirname, '../temp');
const SCANNED_DOCS_DIR = path.join(__dirname, '../scanned_documents');
const ARCHIVE_DIR = path.join(__dirname, '../archived_documents');

// Initialize directories
const initializeTempDir = async () => {
    try {
        await fs.access(SCAN_OUTPUT_DIR);
    } catch {
        await fs.mkdir(SCAN_OUTPUT_DIR, { recursive: true });
    }
};

const initializeDirectories = async () => {
    try {
        await Promise.all([
            fs.mkdir(SCANNED_DOCS_DIR, { recursive: true }),
            fs.mkdir(ARCHIVE_DIR, { recursive: true })
        ]);
    } catch (error) {
        console.error('Error creating directories:', error);
    }
};

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

const performScan = async (documentType) => {
    if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
        throw new Error(`Invalid document type: ${documentType}`);
    }

    await Promise.all([initializeTempDir(), initializeDirectories()]);
    const scriptPath = path.join(__dirname, "../scripts/scan.ps1");
    
    try {
        await fs.access(scriptPath);
        console.log('Found scan script at:', scriptPath);

        return new Promise((resolve, reject) => {
            let outputData = '';
            let errorData = '';

            const scanProcess = spawn('powershell.exe', [
                '-ExecutionPolicy',
                'Bypass',
                '-NoProfile',
                '-NonInteractive',
                '-File',
                scriptPath,
                '-documentType',
                documentType,
                '-outputDir',
                SCANNED_DOCS_DIR
            ]);

            scanProcess.stdout.on('data', (data) => {
                const output = data.toString().trim();
                console.log('Scanner output:', output);
                if (output && output.toLowerCase().endsWith('.pdf')) {
                    outputData = output;
                }
            });

            scanProcess.stderr.on('data', (data) => {
                errorData += data.toString();
                console.error('Scanner error:', data.toString());
            });

            scanProcess.on('close', async (code) => {
                console.log('Scan process finished with code:', code);
                console.log('Final output path:', outputData);

                if (code === 0 && outputData) {
                    try {
                        // Verify file exists
                        await fs.access(outputData);
                        const stats = await fs.stat(outputData);
                        
                        if (stats.size === 0) {
                            reject(new Error('Scanned file is empty'));
                            return;
                        }

                        // Read and convert to base64
                        const fileData = await fs.readFile(outputData);
                        const base64Data = fileData.toString('base64');

                        // Move to archive
                        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                        const archivePath = path.join(
                            ARCHIVE_DIR, 
                            `${documentType}_${timestamp}.pdf`
                        );

                        await fs.rename(outputData, archivePath);
                        console.log('File moved to archive:', archivePath);

                        resolve({
                            success: true,
                            output: base64Data,
                            message: `Successfully scanned ${documentType}`,
                            archivePath: archivePath
                        });
                    } catch (error) {
                        console.error('File processing error:', error);
                        reject(new Error(`Failed to process scanned file: ${error.message}`));
                    }
                } else {
                    const errorMsg = errorData || 'No output file path received from scanner';
                    console.error('Scan failed:', errorMsg);
                    reject(new Error(errorMsg));
                }
            });

            scanProcess.on('error', (error) => {
                console.error('Process spawn error:', error);
                reject(new Error(`Failed to start scan process: ${error.message}`));
            });

            // Add timeout
            const timeoutId = setTimeout(() => {
                scanProcess.kill();
                reject(new Error('Scan operation timed out'));
            }, SCAN_TIMEOUT);

            scanProcess.on('close', () => clearTimeout(timeoutId));
        });
    } catch (error) {
        console.error('Scan initialization error:', error);
        throw new Error(`Failed to initialize scan: ${error.message}`);
    }
};

const startScan = async (req, res) => {
    try {
        const { documentType } = req.body;
        console.log('Starting scan for document type:', documentType);

        if (!documentType) {
            return res.status(400).json(createScanResponse(
                false, null, null, null,
                new Error('Document type is required')
            ));
        }

        const result = await performScan(documentType);
        
        return res.json({
            success: true,
            message: result.message,
            output: result.data,
            documentType
        });
    } catch (error) {
        return res.status(500).json(createScanResponse(
            false, null, req.body.documentType, null, error
        ));
    }
};

const uploadScannedDocument = async (req, res) => {
    const client = await pool.connect();
    try {
        const { pid, type, data } = req.body;

        if (!pid || !type || !data) {
            throw new Error('Missing required fields');
        }

        await client.query('BEGIN');

        const docQuery = `
            INSERT INTO "${type.toLowerCase()}" ("${type}file")
            VALUES (decode($1, 'base64'))
            RETURNING "${type}ID"
        `;
        
        const docResult = await client.query(docQuery, [data]);
        const docId = docResult.rows[0][`${type.toLowerCase()}id`];

        await client.query(
            `UPDATE "person" SET "${type}ID" = $1 WHERE "PID" = $2`,
            [docId, pid]
        );

        await client.query('COMMIT');

        res.json({
            success: true,
            message: `${type} document uploaded successfully`,
            documentId: docId
        });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        client.release();
    }
};

const testDbConnection = async (req, res) => {
    const client = await pool.connect();
    try {
        const result = await client.query('SELECT NOW()');
        await client.query('SELECT COUNT(*) FROM pds');
        await client.query('SELECT COUNT(*) FROM saln');

        res.json({
            success: true,
            message: 'Database connection successful',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database connection failed',
            error: error.message
        });
    } finally {
        client.release();
    }
};

module.exports = {
    startScan,
    uploadScannedDocument,
    testDbConnection
};