const RecordModel = require('../models/recordModel');
const logger = require('../utils/logger');

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

module.exports = {
  getRecords,
  getPersonDetails,
  getDocuments,
  getPersonHistory,
  updatePersonDetails
};