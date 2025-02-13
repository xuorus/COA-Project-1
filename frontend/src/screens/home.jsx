import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme } from '@mui/material';
import backgroundImage from '../assets/bldg.jpg';

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
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: 3,
            backgroundColor: 'rgba(52, 52, 52, 0.9)',
            color: 'white',
          }}
        >
          <Typography variant="h3" component="h1" gutterBottom>
            COA Scanner Project 1
          </Typography>

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
            View Records
          </Button>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Main;