const pool = require('../config/db');
const logger = require('../utils/logger');

const getRecords = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT * 
      FROM person AS a  
      LEFT JOIN pds AS b ON a.pdsID = b.pdsID
      LEFT JOIN saln AS c ON a.salnID = c.salnID
    `);
    res.json(rows);
  } catch (error) {
    logger.error('Error fetching records:', error);
    res.status(500).json({ 
      message: 'Error fetching records', 
      error: error.message 
    });
  }
};

const getPersonDetails = async (req, res) => {
  try {
    const { pid } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        fName,
        mName,
        lName
      FROM person 
      WHERE PID = ?
    `, [pid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.json({
      firstName: rows[0].fName,
      middleName: rows[0].mName,
      lastName: rows[0].lName
    });
  } catch (error) {
    logger.error('Error fetching person details:', error);
    res.status(500).json({ 
      message: 'Error fetching person details', 
      error: error.message 
    });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { pid } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        b.PDSfile,
        c.SALNfile,
        b.pdsID,
        c.salnID
      FROM person AS a
      LEFT JOIN pds AS b ON a.pdsID = b.pdsID
      LEFT JOIN saln AS c ON a.salnID = c.salnID
      WHERE a.PID = ?
    `, [pid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Documents not found' });
    }

    // Include document IDs along with the files
    const documents = {
      pds: rows[0].PDSfile ? {
        id: rows[0].pdsID,
        data: rows[0].PDSfile.toString('base64')
      } : null,
      saln: rows[0].SALNfile ? {
        id: rows[0].salnID,
        data: rows[0].SALNfile.toString('base64')
      } : null
    };

    res.json(documents);
  } catch (error) {
    logger.error('Error fetching documents:', error);
    res.status(500).json({ 
      message: 'Error fetching documents', 
      error: error.message 
    });
  }
};

const getPersonHistory = async (req, res) => {
  try {
    const { pid } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        status AS activity,
        timestamp AS date
      FROM logs 
      WHERE PID = ?
      ORDER BY timestamp DESC
    `, [pid]);

    res.json(rows);
  } catch (error) {
    logger.error('Error fetching person history:', error);
    res.status(500).json({ 
      message: 'Error fetching history', 
      error: error.message 
    });
  }
};

module.exports = {
  getRecords,
  getPersonDetails,
  getDocuments,
  getPersonHistory
};