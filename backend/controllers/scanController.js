const { spawn } = require('child_process');
const path = require("path");
const fs = require('fs').promises;
const pool = require('../config/db');
const ScanModel = require('../models/scanModel');
const logger = require('../utils/logger');

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
        console.log('Found scan script at:', scriptPath);

        return new Promise((resolve, reject) => {
            console.log(`Executing scan script for ${documentType}...`);
            
            // Use spawn instead of exec for better process control
            const scanProcess = spawn('powershell.exe', [
                '-ExecutionPolicy',
                'Bypass',
                '-File',
                scriptPath,
                '-documentType',
                sanitizedDocType
            ]);

            let outputData = '';
            let errorData = '';

            scanProcess.stdout.on('data', (data) => {
                outputData += data.toString();
                console.log('Scan output:', data.toString());
            });

            scanProcess.stderr.on('data', (data) => {
                errorData += data.toString();
                console.error('Scan error:', data.toString());
            });

            scanProcess.on('close', (code) => {
                if (code === 0) {
                    resolve(outputData.trim());
                } else {
                    reject(new Error(`Scan failed with code ${code}: ${errorData}`));
                }
            });

            scanProcess.on('error', (error) => {
                reject(new Error(`Failed to start scan process: ${error.message}`));
            });

            // Set timeout
            setTimeout(() => {
                scanProcess.kill();
                reject(new Error('Scan operation timed out'));
            }, SCAN_TIMEOUT);
        });
    } catch (error) {
        console.error('Scan setup error:', error);
        throw new Error(`Failed to initialize scan: ${error.message}`);
    }
};

const startScan = async (req, res) => {
    try {
        const { documentType } = req.body;
        console.log('Received scan request for:', documentType);

        if (!documentType) {
            return res.status(400).json({
                success: false,
                message: 'Document type is required'
            });
        }

        const result = await performScan(documentType);
        return res.json({
            success: true,
            message: `Successfully scanned ${documentType}`,
            output: result
        });
    } catch (error) {
        console.error('Scan controller error:', error);
        return res.status(500).json({
            success: false,
            message: error.message
        });
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