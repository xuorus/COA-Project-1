const RecordModel = require('../models/recordModel');
const logger = require('../utils/logger');

const getRecords = async (req, res) => {
  try {
    const records = await RecordModel.getRecords({
      search: req.query.search || '',
      sortBy: req.query.sortBy || 'az',
      bloodType: req.query.bloodType || 'all'
    });
    res.json(records);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching records', 
      error: error.message 
    });
  }
};

const getPersonDetails = async (req, res) => {
  try {
    const person = await RecordModel.getPersonDetails(req.params.pid);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    res.json(person);
  } catch (error) {
    logger.error('Error fetching person details:', error);
    res.status(500).json({ message: 'Error fetching person details', error: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const documents = await RecordModel.getDocuments(req.params.pid);
    if (!documents) {
      return res.status(404).json({ message: 'Documents not found' });
    }
    res.json(documents);
  } catch (error) {
    logger.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Error fetching documents', error: error.message });
  }
};

const getPersonHistory = async (req, res) => {
  try {
    const history = await RecordModel.getPersonHistory(req.params.pid);
    res.json(history);
  } catch (error) {
    logger.error('Error fetching person history:', error);
    res.status(500).json({ message: 'Error fetching history', error: error.message });
  }
};

const updatePersonDetails = async (req, res) => {
  try {
    const result = await RecordModel.updatePersonDetails(req.params.pid, req.body);
    if (!result) {
      return res.status(404).json({ message: 'Person not found' });
    }
    if (!result.success && result.message) {
      return res.json({ message: result.message });
    }
    if (!result.success) {
      return res.status(400).json({ message: 'Update failed' });
    }
    res.json({ 
      message: 'Person details updated successfully',
      updatedFields: result.updatedFields
    });
  } catch (error) {
    logger.error('Error updating person details:', error);
    res.status(500).json({ message: 'Error updating person details', error: error.message });
  }
};

module.exports = { 
  getRecords, 
  getPersonDetails, 
  getDocuments, 
  getPersonHistory, 
  updatePersonDetails 
};