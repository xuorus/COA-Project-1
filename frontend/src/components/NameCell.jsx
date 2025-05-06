import React, { useState} from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useManningContext } from '../context/ManningContext';
import { useNumbering } from '../context/NumberingContext';
import { useRecords } from '../context/RecordsContext';  // Add this import
import AutocompleteNameCell from './AutocompleteNameCell';
import PropTypes from 'prop-types';

const NameCell = ({ cellId, isEditable }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { manningData, updateManningData } = useManningContext();
  const { updateName } = useNumbering();
  const { records } = useRecords();  // Add this line
  
  const savedName = manningData[cellId] || '';

  const handleSave = (newName) => {
    updateManningData(cellId, newName);
    updateName(cellId, newName); // This will trigger number update
    setIsEditing(false);
  };

  const handleNameSelect = (record) => {
    if (record === null) {
      // Clear the name
      updateManningData(cellId, '');
      updateName(cellId, '', ''); // Clear both name and profession
    } else {
      const formattedName = `${record.lName}, ${record.fName} ${record.mName ? record.mName.charAt(0) + '.' : ''}`;
      updateManningData(cellId, formattedName);
      updateName(cellId, formattedName, record.profession);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isEditable) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        {savedName || '-'}
      </Box>
    );
  }

  return (
    <Box 
      sx={{ 
        position: 'relative', 
        width: '100%',
        minHeight: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      {isEditing ? (
        <Box
          onBlur={handleCancel} // Add this line
          tabIndex={0} // Make the box focusable
          sx={{ 
            width: '100%',
            outline: 'none' // Remove focus outline
          }}
        >
          <AutocompleteNameCell
            value={savedName}
            onSave={handleSave}
            records={records}
            onNameSelect={handleNameSelect}
            onCancel={handleCancel}
            isEditing={isEditing}
          />
        </Box>
      ) : (
        <Box sx={{ 
          width: '100%',
          height: '100%',
          position: 'relative',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {savedName ? (
            <>
              <span style={{ 
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {savedName}
              </span>
              <IconButton 
                onClick={() => setIsEditing(true)}
                size="small"
                sx={{ 
                  position: 'absolute',
                  top: -5,
                  right: -15,
                  transform: 'translateY(-50%)',
                  padding: 0,
                  width: '20px',
                  height: '20px',
                  minWidth: 'auto'
                }}
              >
                <EditIcon sx={{ fontSize: '0.875rem' }} />
              </IconButton>
            </>
          ) : (
            <IconButton 
              onClick={() => setIsEditing(true)}
              sx={{
                padding: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              }}
            >
              <EditIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

NameCell.propTypes = {
  cellId: PropTypes.string.isRequired,
  isEditable: PropTypes.bool
};

NameCell.defaultProps = {
  isEditable: false
};

export default NameCell;