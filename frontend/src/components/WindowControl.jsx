import React from 'react';
import { Box, IconButton } from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

const WindowControl = () => {
  const handleMinimize = () => {
    const mainWindow = document.querySelector('#root');
    const body = document.body;
    if (mainWindow) {
      document.documentElement.style.backgroundColor = 'transparent';
      body.style.backgroundColor = 'transparent';
      // Prevent scroll during animation
      document.documentElement.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
      
      mainWindow.style.transition = 'all 300ms ease-in-out';
      mainWindow.style.transform = 'translate3d(0, 100vh, 0) scale(0.6)';
      mainWindow.style.transformOrigin = 'bottom';
      mainWindow.style.opacity = '0.6';
      
      setTimeout(() => {
        window?.electron?.minimize();
        // Reset styles after minimize
        setTimeout(() => {
          mainWindow.style.transform = 'none';
          mainWindow.style.opacity = '1';
          // Don't reset background colors to maintain transparency
        }, 300);
      }, 300);
    }
  };

  const handleClose = () => {
    const mainWindow = document.querySelector('#root');
    if (mainWindow) {
      mainWindow.style.transition = 'opacity 150ms ease-out';
      mainWindow.style.opacity = '0';
      
      setTimeout(() => {
        window?.electron?.close();
      }, 150);
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '1px',
        right: '1px',
        display: 'flex',
        zIndex: 9999
      }}
    >
      <IconButton
        size="small"
        onClick={handleMinimize}
        disableRipple
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '1px',
          padding: '2px',
          '&:hover': {
            backgroundColor: 'rgba(67, 55, 55, 0.4)',
          },
          '&:focus': {
            outline: 'none'
          },
        }}
      >
        <MinimizeIcon sx={{ fontSize: 16, color: '#fff' }} />
      </IconButton>
      <IconButton
        size="small"
        onClick={handleClose}
        disableRipple
        sx={{
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          borderRadius: '1px',
          padding: '2px',
          '&:hover': {
            backgroundColor: 'rgba(255, 0, 0, 0.4)',
          },
          '&:focus': {
            outline: 'none'
          },
        }}
      >
        <CloseIcon sx={{ fontSize: 16, color: '#fff' }} />
      </IconButton>
    </Box>
  );
};

export default WindowControl;