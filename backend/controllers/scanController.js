const { spawn } = require('child_process');
const path = require("path");
const fs = require('fs').promises;
const pool = require('../config/db');

// Constants
const VALID_DOCUMENT_TYPES = ['PDS', 'SALN'];
const SCAN_TIMEOUT = 30000; // 30 seconds
const SCAN_OUTPUT_DIR = path.join(__dirname, '../temp');

// Initialize temp directory
const initializeTempDir = async () => {
    try {
        await fs.access(SCAN_OUTPUT_DIR);
    } catch {
        await fs.mkdir(SCAN_OUTPUT_DIR, { recursive: true });
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

    await initializeTempDir();
    const scriptPath = path.join(__dirname, "../scripts/scan.ps1");
    const sanitizedDocType = sanitizeDocumentType(documentType);
    
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
                sanitizedDocType,
                '-outputDir',
                SCAN_OUTPUT_DIR
            ]);

            scanProcess.stdout.on('data', (data) => {
                const output = data.toString().trim();
                console.log('Raw scan output:', output);
                
                // Only capture the PDF file path
                if (output.toLowerCase().endsWith('.pdf')) {
                    outputData = output;
                    console.log('Captured PDF path:', outputData);
                }
            });

            scanProcess.stderr.on('data', (data) => {
                errorData += data.toString();
                console.error('Scan error:', data.toString());
            });

            scanProcess.on('close', async (code) => {
                console.log('Scan process exit code:', code);
                console.log('Final output data:', outputData);
                console.log('Error data if any:', errorData);

                if (code === 0 && outputData) {
                    try {
                        // Verify file exists
                        await fs.access(outputData);
                        console.log('PDF file verified at:', outputData);

                        const fileData = await fs.readFile(outputData);
                        const base64Data = fileData.toString('base64');
                        
                        // Clean up temp file
                        await fs.unlink(outputData).catch(err => 
                            console.error('Cleanup error:', err)
                        );
                        
                        resolve({
                            success: true,
                            data: base64Data,
                            message: `Successfully scanned ${documentType}`
                        });
                    } catch (error) {
                        console.error('File processing error:', error);
                        reject(new Error(`Failed to process scanned file: ${error.message}`));
                    }
                } else {
                    const errorMsg = errorData || 'No output file path received from scanner';
                    console.error('Scan process failed:', errorMsg);
                    reject(new Error(errorMsg));
                }
            });

            scanProcess.on('error', (error) => {
                console.error('Process spawn error:', error);
                reject(new Error(`Failed to start scan process: ${error.message}`));
            });

            const timeoutId = setTimeout(() => {
                scanProcess.kill();
                reject(new Error('Scan operation timed out'));
            }, SCAN_TIMEOUT);

            scanProcess.on('close', () => clearTimeout(timeoutId));
        });
    } catch (error) {
        console.error('Scan setup error:', error);
        throw new Error(`Failed to initialize scan: ${error.message}`);
    }
};

const startScan = async (req, res) => {
    try {
        const { documentType } = req.body;
        console.log('Starting scan for document type:', documentType);

        if (!documentType) {
            return res.status(400).json(createScanResponse(
                false,
                null,
                null,
                null,
                new Error('Document type is required')
            ));
        }

        const result = await performScan(documentType);
        console.log('Scan completed successfully');
        
        return res.json({
            success: true,
            message: result.message,
            output: result.data,
            documentType
        });

    } catch (error) {
        console.error('Scan failed:', error);
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
    const client = await pool.connect();
    try {
        const { pid, type, data } = req.body;

        if (!pid || !type || !data) {
            throw new Error('Missing required fields');
        }

        if (!VALID_DOCUMENT_TYPES.includes(type)) {
            throw new Error(`Invalid document type: ${type}`);
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
        await client.query('ROLLBACK');
        console.error('Upload error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        client.release();
    }
};

// TEST DATABASE CONNECTION
// Add this function to your existing controller
const testDbConnection = async (req, res) => {
    const client = await pool.connect();
    try {
        // Test basic connection
        const result = await client.query('SELECT NOW()');
        
        // Test PDS table
        await client.query('SELECT COUNT(*) FROM pds');
        
        // Test SALN table
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
// TEST DATABASE CONNECTION


module.exports = {
    performScan,
    startScan,
    uploadScannedDocument,
    testDbConnection
};