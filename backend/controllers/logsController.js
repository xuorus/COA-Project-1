const pool = require('../config/db');
const logger = require('../utils/logger');

const getLogs = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM logs ORDER BY timestamp DESC');
    res.json(rows);
  } catch (error) {
    logger.error('Error fetching logs:', error);
    res.status(500).json({ 
      message: 'Error fetching logs', 
      error: error.message 
    });
  }
};

module.exports = {
  getLogs
};