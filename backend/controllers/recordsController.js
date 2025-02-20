const pool = require('../config/db');
const logger = require('../utils/logger');

const getRecords = async (req, res) => {
  try {
    const { search, sortBy, sortOrder = 'asc', bloodType } = req.query;

    let query = `
      SELECT 
        a.PID,
        a.fName,
        a.mName,
        a.lName,
        a.profession,
        a.hobbies,
        a.bloodType,
        b.pdsID,
        c.salnID,
        (
          SELECT MAX(timestamp)
          FROM logs
          WHERE PID = a.PID
        ) as date
      FROM person AS a
      LEFT JOIN pds AS b ON a.pdsID = b.pdsID
      LEFT JOIN saln AS c ON a.salnID = c.salnID
      WHERE 1=1
    `;

    const params = [];

    // Add blood type filter
    if (bloodType && bloodType !== 'all') {
      query += ` AND a.bloodType = ?`;
      params.push(bloodType);
    }

    // Add search conditionsz
    if (search) {
      query += `
        AND (
          LOWER(CONCAT(a.fName, ' ', COALESCE(a.mName, ''), ' ', a.lName)) LIKE ?
          OR LOWER(a.profession) LIKE ?
          OR LOWER(a.hobbies) LIKE ?
        )
      `;
      const searchPattern = `%${search.toLowerCase()}%`;
      params.push(...Array(3).fill(searchPattern));
    }

    // Add sorting
    const sortField = {
      'az': 'a.lName',
      'za': 'a.lName',
      'newest': 'date',
      'oldest': 'date',
      'bloodtype': 'a.bloodType'
    }[sortBy] || 'a.lName';

    const order = {
      'az': 'ASC',
      'za': 'DESC',
      'newest': 'DESC',
      'oldest': 'ASC',
      'bloodtype': 'ASC'
    }[sortBy] || 'ASC';

    query += ` ORDER BY ${sortField} ${order}`;

    const [rows] = await pool.query(query, params);
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
        lName,
        profession,
        hobbies,
        bloodType
      FROM person 
      WHERE PID = ?
    `, [pid]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Person not found' });
    }

    res.json({
      firstName: rows[0].fName,
      middleName: rows[0].mName,
          lastName: rows[0].lName,
      profession: rows[0].profession,
      hobbies: rows[0].hobbies,
      bloodType: rows[0].bloodType
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