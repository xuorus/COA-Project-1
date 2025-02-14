const db = require('../database/db');

const saveDocument = (filename, path, callback) => {
    db.query("INSERT INTO documents (filename, path) VALUES (?, ?)", [filename, path], callback);
};

module.exports = { saveDocument };
