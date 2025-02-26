const { exec } = require("child_process");
const path = require("path");
const fs = require('fs').promises;

// Base scanning function
const performScan = async (documentType) => {
    const scriptPath = path.join(__dirname, "../scripts/scan.ps1");
    
    try {
        // Check if script exists
        await fs.access(scriptPath);
    } catch (error) {
        throw new Error('Scanning script not found');
    }

    return new Promise((resolve, reject) => {
        const ps = exec(
            `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -DocumentType "${documentType}"`,
            { timeout: 30000 }, // 30 second timeout
            (error, stdout, stderr) => {
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
        return res.json({ 
            success: true, 
            message: "PDS scanned successfully", 
            documentType: "PDS",
            output: scanResult 
        });
    } catch (error) {
        console.error('Error scanning PDS:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message,
            documentType: "PDS"
        });
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
        return res.json({ 
            success: true, 
            message: "SALN scanned successfully", 
            documentType: "SALN",
            output: scanResult 
        });
    } catch (error) {
        console.error('Error scanning SALN:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message,
            documentType: "SALN"
        });
    }
};