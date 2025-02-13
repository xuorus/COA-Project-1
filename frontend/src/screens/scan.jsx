import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import backgroundImage from '../assets/bldg.jpg';
import logo from '../assets/logo.png';  // Add this import

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const Main = () => {
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          height: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
        }}
      >
        {/* Header Box */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '80px',
            backgroundColor: '#F5F5F4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between', // This will push the menu icon to the right
            padding: '0 24px',
            zIndex: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <img 
              src={logo} 
              alt="COA Logo" 
              style={{
                height: '70px',
                width: 'auto',
                objectFit: 'contain'
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#000',
                  fontSize: '0.9rem',
                  lineHeight: 1,
                }}
              >
                REPUBLIC OF THE PHILIPPINES
              </Typography>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#000',
                  lineHeight: 1,
                  fontWeight: 'bold',
                  textDecoration: 'overline'
                }}
              >
                COMMISSION ON AUDIT
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#000',
                  opacity: "0.9",
                  fontSize: '0.85rem',
                  lineHeight: 1
                }}
              >
                REGIONAL OFFICE X
              </Typography>
            </Box>
          </Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
            aria-label="menu"
            disableRipple  // Add this to remove ripple effect
            sx={{ 
              color: '#000',
              borderRadius: 0,  // Make button square
              '&:hover': {      // Optional: customize hover state
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Box>

        {/* Adjust main content box to account for header */}
        <Box
          sx={{
            position: 'absolute',
            top: '64px', // Add offset for header
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: 3,
            backgroundColor: 'rgba(21, 21, 21, 0.7)',
            color: 'white',
          }}
        >
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/scan')}
            sx={{ 
              marginBottom: 2,
              maxWidth: '400px'
            }}
          >
            Scan New Document
          </Button>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/records')}
            sx={{ 
              maxWidth: '400px'
            }}
          >
            View Recordssss
          </Button>
</Box>

{/* Footer Box */}
<Box
  sx={{
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50px',
    backgroundColor: '#F5F5F4',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0 24px',
    zIndex: 1,
    borderTop: '1px solid rgba(0, 0, 0, 0.12)'
  }}
>
  <Typography 
    variant="body2" 
    sx={{ 
      color: '#000',
      fontSize: '0.9rem'
    }}
  >
    © 2025 Commission on Audit - Regional Office X. All Rights Reserved.
  </Typography>
</Box>
      </Box>
    </ThemeProvider>
  );
};

export default Main;