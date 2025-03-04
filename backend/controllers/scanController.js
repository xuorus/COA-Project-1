const { exec } = require('child_process');
const path = require('path');

exports.startScan = (req, res) => {
    const { documentType } = req.body;

    if (!documentType) {
        return res.status(400).json({ success: false, message: 'Document type is required' });
    }

    const scriptPath = path.join(__dirname, '../scan-prompt.ps1');
    const command = `powershell -ExecutionPolicy Bypass -File "${scriptPath}"`;

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${stderr}`);
            return res.status(500).json({ success: false, message: 'Error executing scan script' });
        }

        console.log(`Script output: ${stdout}`);
        res.json({ success: true, message: 'Scan completed successfully', output: stdout });
    });
};