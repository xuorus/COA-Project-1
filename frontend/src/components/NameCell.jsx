import React, { useState, useContext } from 'react';
import { Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useManningContext } from '../context/ManningContext';
import { useNumbering } from '../context/NumberingContext';
import { useRecords } from '../context/RecordsContext';  // Add this import
import AutocompleteNameCell from './AutocompleteNameCell';

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
    const formattedName = `${record.lName}, ${record.fName} ${record.mName ? record.mName.charAt(0) + '.' : ''}`;
    updateManningData(cellId, formattedName);
    updateName(cellId, formattedName, record.profession);
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
    <Box sx={{ 
      position: 'relative', 
      width: '100%', 
      minHeight: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      {isEditing ? (
        <AutocompleteNameCell
          value={savedName}
          onSave={handleSave}
          records={records}
          onNameSelect={handleNameSelect} // Add this prop
          isEditing={isEditing}
        />
      ) : (
        <Box sx={{ 
          width: '100%',
          position: 'relative',
          textAlign: 'center',
          paddingRight: '24px' // Add padding for edit icon
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
                  top: '50%',
                  right: 2,
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
                padding: '2px'
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

export default NameCell;