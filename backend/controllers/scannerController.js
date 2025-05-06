const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

exports.executeScan = async (req, res) => {
  try {
    const { scriptPath } = req.body;
    const fullScriptPath = path.resolve(__dirname, '..', scriptPath);

    exec(`powershell.exe -ExecutionPolicy Bypass -File "${fullScriptPath}"`, async (error, stdout, stderr) => {
      if (error) {
        console.error('Execution error:', error);
        return res.status(500).json({ success: false, message: error.message });
      }

      if (stderr) {
        console.error('Script error:', stderr);
        return res.status(500).json({ success: false, message: stderr });
      }

      try {
        const pdfPath = stdout.trim();
        const pdfData = await fs.readFile(pdfPath);
        const pdfBase64 = pdfData.toString('base64');
        await fs.unlink(pdfPath);
        
        res.json({
          success: true,
          pdfData: pdfBase64
        });
      } catch (fileError) {
        console.error('File handling error:', fileError);
        res.status(500).json({ success: false, message: fileError.message });
      }
    });
  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};