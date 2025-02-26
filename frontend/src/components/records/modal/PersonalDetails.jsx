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
import { motion } from 'framer-motion';

const buttonContainerVariants = {
  hidden: { 
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 }
  },
  visible: { 
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const DisplayField = ({ label, value, icon }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
      {label}
    </Typography>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      p: 1,
      borderRadius: 1,
      bgcolor: 'rgba(0, 0, 0, 0.02)'
    }}>
      {icon}
      <Typography>{value || 'Not specified'}</Typography>
    </Box>
  </Box>
);

const StyledTextField = ({ label, value, onChange, icon, ...props }) => (
  <Box sx={{ mb: 2 }}>
    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
      {label}
    </Typography>
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1,
      p: 1,
      borderRadius: 1,
      bgcolor: 'rgba(0, 0, 0, 0.02)'
    }}>
      {icon}
      <TextField
        {...props}
        fullWidth
        value={value}
        onChange={onChange}
        variant="outlined"
        size="small"
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
          }
        }}
      />
    </Box>
  </Box>
);

const AnimatedIconButton = motion(IconButton);
const AnimatedButton = motion(Button);

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
            <AnimatedIconButton 
              onClick={handleEdit} 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              sx={{ 
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.15)'
                }
              }}
            >
              <EditIcon />
            </AnimatedIconButton>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={buttonContainerVariants}
            >
              <Box sx={{ display: 'flex', gap: 1 }}>
                <AnimatedButton
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  variant="contained"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  sx={{
                    backgroundColor: 'success.main',
                    '&:hover': { backgroundColor: 'success.dark' }
                  }}
                >
                  Save Changes
                </AnimatedButton>
                <AnimatedButton
                  startIcon={<CancelIcon />}
                  onClick={handleCancel}
                  variant="outlined"
                  color="error"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </AnimatedButton>
              </Box>
            </motion.div>
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Basic Information
            </Typography>
            {editMode ? (
              <>
                <StyledTextField
                  label="First Name"
                  value={editedDetails.fName}
                  onChange={handleChange('fName')}
                  icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                />
                <StyledTextField
                  label="Middle Name"
                  value={editedDetails.mName}
                  onChange={handleChange('mName')}
                  icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                />
                <StyledTextField
                  label="Surname"
                  value={editedDetails.lName}
                  onChange={handleChange('lName')}
                  icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                />
              </>
            ) : (
              <>
                <DisplayField 
                  label="First Name"
                  value={personDetails.fName}
                  icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                />
                <DisplayField 
                  label="Middle Name"
                  value={personDetails.mName}
                  icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                />
                <DisplayField 
                  label="Surname"
                  value={personDetails.lName}
                  icon={<PersonIcon sx={{ color: 'primary.main' }} />}
                />
              </>
            )}
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Medical Information
              </Typography>
              {editMode ? (
                <StyledTextField
                  select
                  label="Blood Type"
                  value={bloodTypeValue}
                  onChange={handleChange('bloodType')}
                  icon={<LocalHospitalIcon sx={{ color: 'error.main' }} />}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {bloodTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </StyledTextField>
              ) : (
                <DisplayField 
                  label="Blood Type"
                  value={personDetails.bloodType}
                  icon={<LocalHospitalIcon sx={{ color: 'error.main' }} />}
                />
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Professional Information
              </Typography>
              {editMode ? (
                <StyledTextField
                  label="Profession"
                  value={editedDetails.profession}
                  onChange={handleChange('profession')}
                  icon={<WorkIcon sx={{ color: 'primary.main' }} />}
                />
              ) : (
                <DisplayField 
                  label="Profession"
                  value={personDetails.profession}
                  icon={<WorkIcon sx={{ color: 'primary.main' }} />}
                />
              )}
            </Box>

            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Personal Interests
              </Typography>
              {editMode ? (
                <StyledTextField
                  label="Hobbies"
                  value={editedDetails.hobbies}
                  onChange={handleChange('hobbies')}
                  multiline
                  rows={2}
                  icon={<SportsSoccerIcon sx={{ color: 'success.main' }} />}
                />
              ) : (
                <DisplayField 
                  label="Hobbies"
                  value={personDetails.hobbies}
                  icon={<SportsSoccerIcon sx={{ color: 'success.main' }} />}
                />
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PersonalDetails;