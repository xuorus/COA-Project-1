import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Box, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

const Sidebar = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose();
  };
  Sidebar.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired
  };
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: 300,
          boxSizing: 'border-box',
          backgroundColor: '#F5F5F4',
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
        },
      }}
    >
      <Box sx={{ 
        padding: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2 
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2 
        }}>
         <IconButton
            onClick={onClose}
            sx={{ 
              p: 0,
              mt: 1.5,
              '&:hover': {
                backgroundColor: 'transparent'
              }
            }}
          >
            <MenuRoundedIcon sx={{ 
              fontSize: 28,
              color: '#000'
            }} />
          </IconButton>
        </Box>
        
        {/* Rest of your buttons */}
        <Button
          fullWidth
          onClick={() => handleNavigation('/')}
          sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
        >
          Home
        </Button>
        
        <Button
          fullWidth
          onClick={() => handleNavigation('/scan')}
          sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
        >
          Scan Documents
        </Button>
        
        <Button
          fullWidth
          onClick={() => handleNavigation('/records')}
          sx={{ justifyContent: 'flex-start', textAlign: 'left' }}
        >
          View Records
        </Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;