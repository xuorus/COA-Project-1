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
      // Return null for all document types
      res.json({
        pds: null,
        saln: null,
        nosa: null,
        sr: null,
        ca: null,
        designation_order: null,
        noa: null,
        sat: null,
        coe: null,
        tor: null,
        mc: null,
        med_cert: null,
        nbi: null,
        ccaa: null,
        dad: null
      });
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

// Individual document handlers
const getPDS = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getPDS(pid);
    res.json({ pds: doc });
  } catch (error) {
    console.error('Error fetching PDS:', error);
    res.status(500).json({ message: 'Error fetching PDS' });
  }
};

const getSALN = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getSALN(pid);
    res.json({ saln: doc });
  } catch (error) {
    console.error('Error fetching SALN:', error);
    res.status(500).json({ message: 'Error fetching SALN' });
  }
};

const getNOSA = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getNOSA(pid);
    res.json({ nosa: doc });
  } catch (error) {
    console.error('Error fetching NOSA:', error);
    res.status(500).json({ message: 'Error fetching NOSA' });
  }
};

const getSR = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getSR(pid);
    res.json({ sr: doc });
  } catch (error) {
    console.error('Error fetching SR:', error);
    res.status(500).json({ message: 'Error fetching SR' });
  }
};

const getCA = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getCA(pid);
    res.json({ ca: doc });
  } catch (error) {
    console.error('Error fetching CA:', error);
    res.status(500).json({ message: 'Error fetching CA' });
  }
};

const getDesignationOrder = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getDesignationOrder(pid);
    res.json({ designation_order: doc });
  } catch (error) {
    console.error('Error fetching Designation Order:', error);
    res.status(500).json({ message: 'Error fetching Designation Order' });
  }
};

const getNOA = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getNOA(pid);
    res.json({ noa: doc });
  } catch (error) {
    console.error('Error fetching NOA:', error);
    res.status(500).json({ message: 'Error fetching NOA' });
  }
};

const getSAT = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getSAT(pid);
    res.json({ sat: doc });
  } catch (error) {
    console.error('Error fetching SAT:', error);
    res.status(500).json({ message: 'Error fetching SAT' });
  }
};

const getCOE = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getCOE(pid);
    res.json({ coe: doc });
  } catch (error) {
    console.error('Error fetching COE:', error);
    res.status(500).json({ message: 'Error fetching COE' });
  }
};

const getTOR = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getTOR(pid);
    res.json({ tor: doc });
  } catch (error) {
    console.error('Error fetching TOR:', error);
    res.status(500).json({ message: 'Error fetching TOR' });
  }
};

const getMC = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getMC(pid);
    res.json({ mc: doc });
  } catch (error) {
    console.error('Error fetching MC:', error);
    res.status(500).json({ message: 'Error fetching MC' });
  }
};

const getMedCert = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getMedCert(pid);
    res.json({ med_cert: doc });
  } catch (error) {
    console.error('Error fetching Medical Certificate:', error);
    res.status(500).json({ message: 'Error fetching Medical Certificate' });
  }
};

const getNBI = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getNBI(pid);
    res.json({ nbi: doc });
  } catch (error) {
    console.error('Error fetching NBI:', error);
    res.status(500).json({ message: 'Error fetching NBI' });
  }
};

const getCCAA = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getCCAA(pid);
    res.json({ ccaa: doc });
  } catch (error) {
    console.error('Error fetching CCAA:', error);
    res.status(500).json({ message: 'Error fetching CCAA' });
  }
};

const getDAD = async (req, res) => {
  try {
    const { pid } = req.params;
    const doc = await RecordModel.getDAD(pid);
    res.json({ dad: doc });
  } catch (error) {
    console.error('Error fetching DAD:', error);
    res.status(500).json({ message: 'Error fetching DAD' });
  }
};

module.exports = {
  getRecords,
  getPersonDetails,
  getDocuments,
  getPersonHistory,
  updatePersonDetails,
  deleteDocument,
  addHistory,
  getPDS,
  getSALN,
  getNOSA,
  getSR,
  getCA,
  getDesignationOrder,
  getNOA,
  getSAT,
  getCOE,
  getTOR,
  getMC,
  getMedCert,
  getNBI,
  getCCAA,
  getDAD
};