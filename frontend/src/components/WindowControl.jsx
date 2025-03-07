import React, { useEffect } from 'react';
import { Box, IconButton } from '@mui/material';
import MinimizeIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';

const WindowControl = () => {
  useEffect(() => {
    // Set initial background colors
    document.documentElement.style.backgroundColor = 'transparent';
    document.body.style.backgroundColor = 'transparent';
    
    return () => {
      // Cleanup
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);

  const handleMinimize = () => {
    const mainWindow = document.querySelector('#root');
    if (mainWindow) {
      // Ensure background is transparent before animation
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      mainWindow.style.backgroundColor = 'transparent';
      
      // Add transition
      mainWindow.style.transition = 'all 200ms ease-in-out';
      mainWindow.style.transform = 'translate3d(0, 100vh, 0) scale(0.6)';
      mainWindow.style.opacity = '0';
      
      // Minimize after short delay
      setTimeout(() => {
        window?.electron?.minimize();
        
        // Reset transform and opacity immediately
        mainWindow.style.transition = 'none';
        mainWindow.style.transform = 'none';
        mainWindow.style.opacity = '1';
      }, 150);
    }
  };

  const handleClose = () => {
    const mainWindow = document.querySelector('#root');
    if (mainWindow) {
      document.documentElement.style.backgroundColor = 'transparent';
      document.body.style.backgroundColor = 'transparent';
      mainWindow.style.backgroundColor = 'transparent';
      
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
        zIndex: 9999,
        '-webkit-app-region': 'no-drag'
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