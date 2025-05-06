import React, { useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import PropTypes from 'prop-types';

const AutocompleteNameCell = ({ value, onSave, records, isEditing }) => {
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

  if (!isEditing) {
    return value || '';
  }

  return (
    <Autocomplete
      freeSolo
      value={inputValue}
      onChange={(event, newValue) => {
        if (typeof newValue === 'object' && newValue !== null) {
          // If a suggestion was selected, use the full name
          setInputValue(newValue.fullName);
          onSave(newValue.fullName);
        } else {
          // If manual input, use the raw value
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
              }
            }
          }}
        />
      )}
      sx={{
        width: '100%',
        '& .MuiAutocomplete-popper': {
          zIndex: 9999
        }
      }}
    />
  );
};

AutocompleteNameCell.propTypes = {
  value: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  records: PropTypes.array,
  isEditing: PropTypes.bool
};

AutocompleteNameCell.defaultProps = {
  value: '',
  records: [],
  isEditing: false
};

export default AutocompleteNameCell;