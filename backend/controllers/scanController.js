const { exec } = require("child_process");
const path = require("path");

exports.scanDocument = (req, res) => {
    const scriptPath = path.join(__dirname, "../scripts/scan.ps1");
    exec(`powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            return res.status(500).json({ error: stderr });
        }
        return res.json({ message: "Scan successful", output: stdout });
    });
};
