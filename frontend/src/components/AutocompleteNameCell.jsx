import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, Box } from '@mui/material';
import PropTypes from 'prop-types';

const AutocompleteNameCell = ({ value, onSave, records, isEditing, onNameSelect }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);

  // Create a list of unique names from records
  useEffect(() => {
    if (records) {
      const names = records.map(record => ({
        fullName: `${record.lName || ''}, ${record.fName || ''} ${record.mName ? record.mName.charAt(0) + '.' : ''}`.trim(),
        ...record
      })).filter(record => record.fullName);
      setSuggestions(names);
    }
  }, [records]);

  const handleSelect = (event, selectedRecord) => {
    if (selectedRecord) {
      onNameSelect(selectedRecord); // Pass the entire record object
    }
  };

  if (!isEditing) {
    return value || '';
  }

  return (
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      paddingRight: '24px' // Add padding for edit icon
    }}>
      {/* Move edit icon box outside of the content flow */}
      <Box sx={{
        position: 'absolute',
        top: -8,  // Adjust to align with cell top
        right: -8, // Adjust to align with cell right
        zIndex: 2,
        width: '24px',
        height: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* Edit icon goes here */}
      </Box>
      
      <Autocomplete
        freeSolo
        value={inputValue}
        onChange={(event, newValue) => {
          if (typeof newValue === 'object' && newValue !== null) {
            setInputValue(newValue.fullName);
            onSave(newValue.fullName);
          } else {
            setInputValue(newValue);
            onSave(newValue);
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        options={suggestions}
        getOptionLabel={(option) => {
          if (typeof option === 'string') return option;
          return option.fullName;
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '&.Mui-focused': {
                  backgroundColor: 'white',
                },
                // Add text truncation for long values
                '& input': {
                  textOverflow: 'ellipsis',
                  overflow: 'hidden'
                }
              }
            }}
          />
        )}
        componentsProps={{
          popper: {
            sx: {
              width: 'fit-content !important',
              minWidth: '400px !important', // Wider dropdown
              '& .MuiAutocomplete-listbox': {
                '& .MuiAutocomplete-option': {
                  whiteSpace: 'nowrap',
                  paddingRight: '20px'
                }
              }
            }
          }
        }}
        sx={{
          width: '100%',
          '& .MuiAutocomplete-input': {
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          },
          '& .MuiAutocomplete-popper': {
            zIndex: 9999
          }
        }}
      />
    </Box>
  );
};

AutocompleteNameCell.propTypes = {
  value: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  records: PropTypes.array,
  isEditing: PropTypes.bool,
  onNameSelect: PropTypes.func.isRequired
};

AutocompleteNameCell.defaultProps = {
  value: '',
  records: [],
  isEditing: false
};

export default AutocompleteNameCell;