const { exec } = require("child_process");
const path = require("path");
const fs = require('fs').promises;
const pool = require('../config/db');

// Constants
const VALID_DOCUMENT_TYPES = ['PDS', 'SALN'];
const SCAN_TIMEOUT = 30000; // 30 seconds

// Helper Functions
const sanitizeDocumentType = (docType) => {
    return docType.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
};

const createScanResponse = (success, message, documentType, output = null, error = null) => {
    return {
        success,
        ...(success ? { message, output } : { error: error.message }),
        documentType
    };
};

// Base scanning function
const performScan = async (documentType) => {
    if (!VALID_DOCUMENT_TYPES.includes(documentType)) {
        throw new Error(`Invalid document type: ${documentType}`);
    }

    const scriptPath = path.join(__dirname, "../scripts/scan.ps1");
    const sanitizedDocType = sanitizeDocumentType(documentType);
    
    try {
        // Check if script exists
        await fs.access(scriptPath);
    } catch (error) {
        throw new Error('Scanning script not found');
    }

    return new Promise((resolve, reject) => {
        const ps = exec(
            `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -DocumentType "${sanitizedDocType}"`,
            { timeout: SCAN_TIMEOUT },
            (error, stdout, stderr) => {
                if (error?.code === 'ETIMEDOUT') {
                    reject(new Error(`Scanner operation timed out after ${SCAN_TIMEOUT/1000} seconds`));
                    return;
                }
                if (error) {
                    console.error('Execution error:', error);
                    reject(new Error(`Scanner error: ${error.message}`));
                    return;
                }
                if (stderr) {
                    console.error('Scanner stderr:', stderr);
                    reject(new Error(stderr));
                    return;
                }
                resolve(stdout.trim());
            }
        );

        ps.on('error', (error) => {
            reject(new Error(`PowerShell execution failed: ${error.message}`));
        });
    });
};

exports.scanPDS = async (req, res) => {
    try {
        console.log('Starting PDS scan...');
        const scanResult = await performScan('PDS');
        
        if (!scanResult) {
            throw new Error('No scan result received');
        }

        console.log('PDS scan completed:', scanResult);
        return res.json(createScanResponse(
            true,
            "PDS scanned successfully",
            "PDS",
            scanResult
        ));
    } catch (error) {
        console.error('Error scanning PDS:', error);
        return res.status(500).json(createScanResponse(
            false,
            null,
            "PDS",
            null,
            error
        ));
    }
};

exports.scanSALN = async (req, res) => {
    try {
        console.log('Starting SALN scan...');
        const scanResult = await performScan('SALN');
        
        if (!scanResult) {
            throw new Error('No scan result received');
        }

        console.log('SALN scan completed:', scanResult);
        return res.json(createScanResponse(
            true,
            "SALN scanned successfully",
            "SALN",
            scanResult
        ));
    } catch (error) {
        console.error('Error scanning SALN:', error);
        return res.status(500).json(createScanResponse(
            false,
            null,
            "SALN",
            null,
            error
        ));
    }
};

const uploadScannedDocument = async (req, res) => {
  const client = await pool.connect();
  try {
    const { pid, type, data } = req.body;
    
    await client.query('BEGIN');

    // Insert into appropriate document table
    const docQuery = `
      INSERT INTO "${type.toLowerCase()}" ("${type}file")
      VALUES ($1)
      RETURNING "${type}ID"
    `;
    
    const docResult = await client.query(docQuery, [data]);
    const docId = docResult.rows[0][`${type.toLowerCase()}id`];

    // Update person table with document reference
    await client.query(
      `UPDATE "person" 
       SET "${type}ID" = $1 
       WHERE "PID" = $2`,
      [docId, pid]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `${type} document uploaded successfully`
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

// Make sure to export the controller function
module.exports = {
  uploadScannedDocument
};