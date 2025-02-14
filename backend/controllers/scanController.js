const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const { saveDocument } = require('../models/documentModel');

exports.processScan = async (req, res) => {
    try {
        const filePath = `uploads/${req.file.filename}.pdf`;
        const pdfDoc = await PDFDocument.create();
        const imageBytes = fs.readFileSync(req.file.path);
        const image = await pdfDoc.embedJpg(imageBytes);
        const page = pdfDoc.addPage([image.width, image.height]);
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });

        fs.writeFileSync(filePath, await pdfDoc.save());

        saveDocument(req.file.filename, filePath, (err) => {
            if (err) throw err;
            res.json({ message: 'File saved!', path: filePath });
        });

    } catch (error) {
        res.status(500).json({ error: 'Error processing file' });
    }
};
