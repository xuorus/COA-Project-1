import React from 'react';
import PropTypes from 'prop-types';
import { Drawer, Box, Button, IconButton, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DocumentScannerRoundedIcon from '@mui/icons-material/DocumentScannerRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

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
  sx={{ 
    justifyContent: 'flex-start', 
    textAlign: 'left',
    pl: 2,
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    color: '#000', 
    fontSize: '1rem',
    '&:hover': {
      transform: 'translateX(8px)',
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  }}
>
  <HomeRoundedIcon sx={{ mr: 1, fontSize: 40 }} /> Home
</Button>

<Divider 
  sx={{ 
    borderColor: 'rgb(154, 145, 145)',
    borderWidth: '1.5px',
    width: '100%'
  }} 
/>

<Button
  fullWidth
  onClick={() => handleNavigation('/scan')}
  sx={{ 
    justifyContent: 'flex-start', 
    textAlign: 'left',
    pl: 2,
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    color: '#000', 
    fontSize: '1rem',
    '&:hover': {
      transform: 'translateX(8px)',
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  }}
>
<DocumentScannerRoundedIcon sx={{ mr: 1, fontSize: 40 }} />Scan Documents
</Button>

<Divider 
  sx={{ 
    borderColor: 'rgb(154, 145, 145)',
    borderWidth: '1.5px',
    width: '100%'
  }} 
/>

<Button
  fullWidth
  onClick={() => handleNavigation('/records')}
  sx={{ 
    justifyContent: 'flex-start', 
    textAlign: 'left',
    pl: 2,
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    color: '#000', 
    fontSize: '1rem',
    '&:hover': {
      transform: 'translateX(8px)',
      backgroundColor: 'rgba(0, 0, 0, 0.04)'
    }
  }}
>
<AssignmentRoundedIcon sx={{ mr: 1, fontSize: 40 }} /> View Records
</Button>
      </Box>
    </Drawer>
  );
};

export default Sidebar;