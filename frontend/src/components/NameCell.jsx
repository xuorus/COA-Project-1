import React, { useState, useContext } from 'react';
import { Box, IconButton, TextField } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { useManningContext } from '../context/ManningContext';
import { NumberingContext } from '../context/NumberingContext';

const NameCell = ({ isEditable = false, cellId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');
  const { manningData, updateManningData } = useManningContext();
  const { updateName } = useContext(NumberingContext);

  const savedName = manningData[cellId] || '';

  const handleSave = () => {
    const trimmedName = tempName.trim();
    updateManningData(cellId, trimmedName);
    updateName(cellId, trimmedName);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setTempName(savedName);
    setIsEditing(true);
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
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1,
          width: '100%'
        }}>
          <TextField
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            size="small"
            autoFocus
            fullWidth
            sx={{ 
              flex: 1,
              '& input': {
                textAlign: 'center'
              }
            }}
          />
          <IconButton 
            onClick={handleSave}
            size="small"
            sx={{ padding: '2px', '&:focus': {
                    outline: 'none'
                  } }}
          >
            <CheckIcon sx={{ fontSize: '1rem' }} />
          </IconButton>
        </Box>
      ) : (
        <Box sx={{ 
          width: '100%',
          position: 'relative',
          textAlign: 'center'
        }}>
          {savedName ? (
            <>
              <span>{savedName}</span>
              <IconButton 
                onClick={handleEdit}
                size="small"
                sx={{ 
                  padding: 0,
                  minWidth: '16px',
                  minHeight: '16px',
                  width: '16px',
                  height: '16px',
                  position: 'absolute',
                  right: -15,
                  top: -15,
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.04)'
                  },
                  '&:focus': {
                    outline: 'none'
                  }
                }}
              >
                <EditIcon sx={{ fontSize: '0.75rem' }} />
              </IconButton>
            </>
          ) : (
            <IconButton 
              onClick={() => {
                setTempName('');
                setIsEditing(true);
              }}
              size="small"
              sx={{ padding: '2px', '&:focus': {
                    outline: 'none'
                  }}}
            >
              <AddIcon sx={{ fontSize: '1rem' }} />
            </IconButton>
          )}
        </Box>
      )}
    </Box>
  );
};

export default NameCell;