import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  IconButton,
  TextField,
  MenuItem,
  Button,
  Paper,
  Divider,
  Chip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import WorkIcon from '@mui/icons-material/Work';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

const PersonalDetails = ({ personDetails, onUpdate }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState(null);

  const handleEdit = () => {
    setEditedDetails({ ...personDetails });
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditedDetails(null);
    setEditMode(false);
  };

  const handleSave = async () => {
    try {
      if (!editedDetails) {
        console.error('No changes to save');
        return;
      }

      console.log('Saving changes:', editedDetails); // Debug log
      const success = await onUpdate(editedDetails);
      
      if (success) {
        setEditMode(false);
        setEditedDetails(null);
      } else {
        // You might want to show an error message here
        console.error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving details:', error);
      // You might want to show an error message here
    }
  };

  const handleChange = (field) => (event) => {
    setEditedDetails(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const bloodTypeValue = editMode 
    ? (editedDetails.bloodType || '') 
    : (personDetails.bloodType || '');

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={0} sx={{ p: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PersonIcon sx={{ fontSize: 28, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight="500">Personal Information</Typography>
          </Box>
          {!editMode ? (
            <IconButton 
              onClick={handleEdit} 
              sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.15)'
                }
              }}
            >
              <EditIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startIcon={<SaveIcon />}
                onClick={handleSave}
                variant="contained"
                sx={{
                  backgroundColor: 'success.main',
                  '&:hover': { backgroundColor: 'success.dark' }
                }}
              >
                Save Changes
              </Button>
              <Button
                startIcon={<CancelIcon />}
                onClick={handleCancel}
                variant="outlined"
                color="error"
              >
                Cancel
              </Button>
            </Box>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Basic Information
            </Typography>
            <TextField
              fullWidth
              label="First Name"
              value={editMode ? editedDetails.fName : personDetails.fName}
              onChange={handleChange('fName')}
              disabled={!editMode}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Middle Name"
              value={editMode ? editedDetails.mName : personDetails.mName}
              onChange={handleChange('mName')}
              disabled={!editMode}
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Surname"
              value={editMode ? editedDetails.lName : personDetails.lName}
              onChange={handleChange('lName')}
              disabled={!editMode}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Medical Information
              </Typography>
              <TextField
                fullWidth
                select
                label="Blood Type"
                value={bloodTypeValue}
                onChange={handleChange('bloodType')}
                disabled={!editMode}
                variant="outlined"
                InputProps={{
                  startAdornment: <LocalHospitalIcon sx={{ mr: 1, color: 'error.main' }} />
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {bloodTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Professional Information
              </Typography>
              <TextField
                fullWidth
                label="Profession"
                value={editMode ? editedDetails.profession : personDetails.profession}
                onChange={handleChange('profession')}
                disabled={!editMode}
                variant="outlined"
                InputProps={{
                  startAdornment: <WorkIcon sx={{ mr: 1, color: 'primary.main' }} />
                }}
              />
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Personal Interests
              </Typography>
              <TextField
                fullWidth
                label="Hobbies"
                value={editMode ? editedDetails.hobbies : personDetails.hobbies}
                onChange={handleChange('hobbies')}
                disabled={!editMode}
                multiline
                rows={2}
                variant="outlined"
                InputProps={{
                  startAdornment: <SportsSoccerIcon sx={{ mr: 1, color: 'success.main' }} />
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PersonalDetails;