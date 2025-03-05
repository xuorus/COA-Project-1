const RecordModel = require('../models/recordModel');
const logger = require('../utils/logger');
const pool = require('../config/db');

const getRecords = async (req, res) => {
  try {
    const records = await RecordModel.getRecords(req.query);
    res.json(records);
  } catch (error) {
    logger.error('Error fetching records:', error);
    res.status(500).json({ message: 'Error fetching records', error: error.message });
  }
};

const getPersonDetails = async (req, res) => {
  try {
    const { pid } = req.params;
    console.log('Fetching details for PID:', pid); // Debug log

    const personDetails = await RecordModel.getPersonDetails(pid);
    console.log('Query result:', personDetails); // Debug log

    if (personDetails) {
      res.json(personDetails);
    } else {
      res.status(404).json({ message: 'Person not found' });
    }
  } catch (error) {
    console.error('Error fetching person details:', error);
    res.status(500).json({ message: 'Error fetching person details' });
  }
};

const getDocuments = async (req, res) => {
  try {
    const { pid } = req.params;
    console.log('Fetching documents for PID:', pid);
    
    const documents = await RecordModel.getDocuments(pid);
    if (documents) {
      res.json(documents);
    } else {
      res.json({ pds: null, saln: null });
    }
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents' });
  }
};

const getPersonHistory = async (req, res) => {
  try {
    const { pid } = req.params;
    console.log('Fetching history for PID:', pid);
    
    const history = await RecordModel.getPersonHistory(pid);
    res.json(history || []);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ message: 'Error fetching history' });
  }
};

const updatePersonDetails = async (req, res) => {
  try {
    const { pid } = req.params;
    const updates = req.body;
    
    console.log('Updating person:', pid, 'with data:', updates);

    // Handle empty string blood type
    if (updates.bloodType === '') {
      updates.bloodType = null;
    }

    // Validate required fields
    if (!updates) {
      return res.status(400).json({ 
        success: false, 
        message: 'No update data provided' 
      });
    }

    const result = await RecordModel.updatePersonDetails(pid, updates);
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        message: result.message 
      });
    }

    res.json({ 
      success: true, 
      data: result.data 
    });

  } catch (error) {
    console.error('Controller error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating details' 
    });
  }
};

const addHistory = async (req, res) => {
  const { pid } = req.params;
  const { status } = req.body;
  const client = await pool.connect();

  try {
    await client.query(
      `INSERT INTO "logs" ("PID", "status", "timestamp") 
       VALUES ($1, $2, CURRENT_TIMESTAMP)`,
      [pid, status]
    );

    res.json({
      success: true,
      message: 'History added successfully'
    });
  } catch (error) {
    console.error('Add history error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    client.release();
  }
};

const deleteDocument = async (req, res) => {
  const { pid, type } = req.params;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Get document ID
    const docType = type.toLowerCase();
    const idColumn = `"${docType}ID"`;
    
    const docResult = await client.query(
      `SELECT ${idColumn} FROM "person" WHERE "PID" = $1`,
      [pid]
    );

    const docId = docResult.rows[0]?.[`${docType}ID`];
    if (!docId) {
      throw new Error(`No ${type} found for this person`);
    }

    // Update person table first
    await client.query(
      `UPDATE "person" SET ${idColumn} = NULL WHERE "PID" = $1`,
      [pid]
    );

    // Delete document
    await client.query(
      `DELETE FROM "${docType}" WHERE ${idColumn} = $1`,
      [docId]
    );

    await client.query('COMMIT');

    res.json({
      success: true,
      message: `${type.toUpperCase()} document deleted successfully`
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  } finally {
    client.release();
  }
};

module.exports = {
  getRecords,
  getPersonDetails,
  getDocuments,
  getPersonHistory,
  updatePersonDetails,
  deleteDocument,
  addHistory  // Add this export
};