const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const pool = require('../config/db');
const pdfModel = require('../models/pdfModel');

const startScan = (req, res) => {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'scan.ps1');

  exec(`powershell -File "${scriptPath}"`, async (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing script: ${stderr}`);
      return res.json({ success: false, message: stderr });
    }

    console.log(`Script output: ${stdout}`);

    // Use the specified directory for scanned PDFs
    const pdfDirectory = 'C:\\Users\\ronan\\Documents\\ScannedDocuments';
    const pdfFiles = fs.readdirSync(pdfDirectory);

    if (pdfFiles.length === 0) {
      return res.json({ success: false, message: 'No PDF files found' });
    }

    const pdfFile = pdfFiles[0];
    const pdfPath = path.join(pdfDirectory, pdfFile);

    try {
      // Read the PDF file
      const pdfData = fs.readFileSync(pdfPath);

      // Save the PDF to the database
      await pdfModel.savePDF(pdfFile, pdfData);

      // Delete the PDF file from the directory
      fs.unlinkSync(pdfPath);

      res.json({ success: true, message: 'Scan completed and PDF saved successfully!' });
    } catch (err) {
      console.error('Error processing PDF:', err);
      res.json({ success: false, message: 'Error processing PDF' });
    }
  });
};

module.exports = {
  startScan,
};