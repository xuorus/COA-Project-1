const pool = require('../config/db');

const savePDF = async (fileName, fileData) => {
  const client = await pool.connect();
  try {
    const query = "INSERT INTO pds (PDSfile) VALUES ($1, $2)";
    const values = [PDSfile];
    await client.query(query, values);
  } finally {
    client.release();
  }
};

module.exports = {
  savePDF,
};