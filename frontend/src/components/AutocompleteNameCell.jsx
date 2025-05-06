import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PropTypes from 'prop-types';

const AutocompleteNameCell = ({ value, records, onNameSelect, onCancel }) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  // Remove handleBlur since it's now handled by parent
  const handleSelect = (event, selectedRecord) => {
    if (selectedRecord) {
      onNameSelect(selectedRecord);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      onCancel();
    }
  };

  const handleClear = (event) => {
    event.stopPropagation();
    onNameSelect(null); // Pass null to clear the name in parent component
    onCancel(); // Close the editing mode
  };

  // Remove duplicates by combining lastName, firstName, and middleName
  const uniqueRecords = records ? Array.from(new Map(
    records.map(record => [
      `${record.lName}-${record.fName}-${record.mName}`,
      record
    ])
  ).values()) : [];

  return (
    <Autocomplete
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      options={uniqueRecords}
      inputValue={inputValue}
      onInputChange={(event, newValue) => setInputValue(newValue)}
      getOptionLabel={(record) => 
        `${record.lName}, ${record.fName} ${record.mName ? record.mName.charAt(0) + '.' : ''}`
      }
      onChange={handleSelect}
      clearOnBlur={false}
      popupIcon={
        <Tooltip title="Clear">
          <IconButton 
            size="small" 
            onClick={handleClear}
            sx={{ 
              padding: '2px',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      }
      renderInput={(params) => (
        <TextField 
          {...params} 
          size="small"
          onKeyDown={handleKeyDown}
          autoFocus
          sx={{
            '& .MuiInputBase-root': {
              width: '250px',
              backgroundColor: '#fff',
              '& fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              },
              '&:hover fieldset': {
                borderColor: 'rgba(0, 0, 0, 0.23)',
              }
            }
          }}
        />
      )}
      sx={{
        width: '250px',
        zIndex: 1000
      }}
      autoFocus
    />
  );
};

AutocompleteNameCell.propTypes = {
  value: PropTypes.string,
  records: PropTypes.array,
  onNameSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default AutocompleteNameCell;