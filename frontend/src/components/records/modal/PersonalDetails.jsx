import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Divider,
  IconButton,
  OutlinedInput,
  Select,
  MenuItem
} from '@mui/material';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';

const PersonalDetails = ({
  personDetails,
  editingField,
  editedDetails,
  handleFieldEdit,
  handleFieldSave,
  handleFieldCancel,
  setEditedDetails
}) => {
  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" gutterBottom>Personal Information</Typography>
      </Box>
      {personDetails && (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              Basic Information
            </Typography>
          </Grid>
          {[
            { label: 'First Name', field: 'firstName' },
            { label: 'Middle Name', field: 'middleName' },
            { label: 'Last Name', field: 'lastName' }
          ].map((item) => (
            <Grid item xs={12} key={item.field}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '32px' }}>
                <Box sx={{ minWidth: '120px' }}>
                  <Typography><strong>{item.label}:</strong></Typography>
                </Box>
                {editingField === item.field ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <OutlinedInput
                      value={editedDetails[item.field] || ''}
                      onChange={(e) => setEditedDetails({...editedDetails, [item.field]: e.target.value})}
                      size="small"
                      sx={{ 
                        width: '200px',
                        height: '32px',
                        '& input': {
                          padding: '4px 8px',
                        },
                      }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => handleFieldSave(item.field)}
                      sx={{ 
                        padding: '4px',
                        '&:focus': { outline: 'none' },
                        '&.Mui-focusVisible': { outline: 'none' }
                      }}
                    >
                      <SaveIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={handleFieldCancel}
                      sx={{ 
                        padding: '4px',
                        '&:focus': { outline: 'none' },
                        '&.Mui-focusVisible': { outline: 'none' }
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
                    <Typography>{personDetails[item.field] || 'N/A'}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleFieldEdit(item.field)}
                      sx={{ 
                        padding: '4px',
                        color: 'rgba(0, 0, 0, 0.38)',
                        '&:hover': { color: 'primary.main' },
                        '&:focus': { outline: 'none' },
                        '&.Mui-focusVisible': { outline: 'none' }
                      }}
                    >
                      <BorderColorRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
          
          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle2" color="primary.main" gutterBottom>
              Additional Information
            </Typography>
          </Grid>
          
          {[
            { 
              label: 'Blood Type', 
              field: 'bloodType',
              type: 'select',
              options: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
            },
            { label: 'Profession', field: 'profession' },
            { label: 'Hobbies', field: 'hobbies' }
          ].map((item) => (
            <Grid item xs={12} key={item.field}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, height: '32px' }}>
                <Box sx={{ minWidth: '120px' }}>
                  <Typography><strong>{item.label}:</strong></Typography>
                </Box>
                {editingField === item.field ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {item.type === 'select' ? (
                      <Select
                        value={editedDetails[item.field] || ''}
                        onChange={(e) => setEditedDetails({...editedDetails, [item.field]: e.target.value})}
                        size="small"
                        sx={{ 
                          width: '100px',
                          height: '32px',
                          '& .MuiSelect-select': {
                            padding: '4px 8px',
                          },
                        }}
                      >
                        {item.options.map(option => (
                          <MenuItem key={option} value={option}>{option}</MenuItem>
                        ))}
                      </Select>
                    ) : (
                      <OutlinedInput
                        value={editedDetails[item.field] || ''}
                        onChange={(e) => setEditedDetails({...editedDetails, [item.field]: e.target.value})}
                        size="small"
                        sx={{ 
                          width: '200px',
                          height: '32px',
                          '& input': {
                            padding: '4px 8px',
                          },
                        }}
                      />
                    )}
                    <IconButton 
                      size="small" 
                      onClick={() => handleFieldSave(item.field)}
                      sx={{ 
                        padding: '4px',
                        '&:focus': { outline: 'none' },
                        '&.Mui-focusVisible': { outline: 'none' }
                      }}
                    >
                      <SaveIcon sx={{ fontSize: 18, color: 'primary.main' }} />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={handleFieldCancel}
                      sx={{ 
                        padding: '4px',
                        '&:focus': { outline: 'none' },
                        '&.Mui-focusVisible': { outline: 'none' }
                      }}
                    >
                      <CloseIcon sx={{ fontSize: 18, color: 'error.main' }} />
                    </IconButton>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', alignItems: 'center', flex: 1, gap: 1 }}>
                    <Typography>{personDetails[item.field] || 'N/A'}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleFieldEdit(item.field)}
                      sx={{ 
                        padding: '4px',
                        color: 'rgba(0, 0, 0, 0.38)',
                        '&:hover': { color: 'primary.main' },
                        '&:focus': { outline: 'none' },
                        '&.Mui-focusVisible': { outline: 'none' }
                      }}
                    >
                      <BorderColorRoundedIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PersonalDetails;