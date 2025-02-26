const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || 'coa_project_1'
});

// Test query to verify connection
const testConnection = async () => {
  try {
    const { rows } = await pool.query('SELECT NOW()');
    console.log('Database connected:', rows[0].now);
  } catch (err) {
    console.error('Database connection error:', err);
    throw err;
  }
};

testConnection();

module.exports = pool;