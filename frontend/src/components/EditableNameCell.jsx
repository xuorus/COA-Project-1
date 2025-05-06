import React, { useState } from 'react';
import { TableCell, IconButton, TextField } from '@mui/material';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import AddIcon from '@mui/icons-material/Add';
import PropTypes from 'prop-types';

const EditableNameCell = ({ value, onChange, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value);

  const handleChange = (newValue) => {
    setCellValue(newValue);
    onChange?.(newValue);
  };

  if (!isEditable) {
    return <TableCell>{value}</TableCell>;
  }

  return (
    <TableCell
      sx={{
        position: 'relative',
        cursor: 'pointer',
        '&:hover .edit-icon': {
          opacity: 1
        }
      }}
    >
      {isEditing ? (
        <TextField
          autoFocus
          value={cellValue}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          size="small"
          fullWidth
          sx={{ 
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'primary.main',
              }
            }
          }}
        />
      ) : (
        <>
          {value ? (
            <>
              {value}
              <IconButton
                className="edit-icon"
                size="small"
                onClick={() => setIsEditing(true)}
                sx={{
                  position: 'absolute',
                  top: 2,
                  right: 2,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  padding: '2px',
                  '& svg': {
                    fontSize: '0.875rem'
                  }
                }}
              >
                <BorderColorRoundedIcon fontSize="inherit" />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={() => setIsEditing(true)}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '2px',
                '& svg': {
                  fontSize: '1.25rem'
                }
              }}
            >
              <AddIcon />
            </IconButton>
          )}
        </>
      )}
    </TableCell>
  );
};

EditableNameCell.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  isEditable: PropTypes.bool
};

EditableNameCell.defaultProps = {
  value: '',
  onChange: () => {},
  isEditable: false
};

export default EditableNameCell;