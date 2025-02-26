const { exec } = require("child_process");
const path = require("path");
const fs = require('fs').promises;

// Base scanning function
const performScan = (req, res) => {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, "../scripts/scan.ps1");
        exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(new Error(stderr));
                return;
            }
            resolve(stdout.trim());
        });
    });
};

exports.scanPDS = async (req, res) => {
    try {
        const scanResult = await performScan();
        
        // Here you can add your PDS-specific processing
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
        const scanResult = await performScan();
        
        // Here you can add your SALN-specific processing
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