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
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          overflow: 'hidden',
        }}
      >
        <Container 
          maxWidth={false}
          sx={{
            height: '100%',
            width: '100%',
            margin: 0,
            padding: 0,
          }}
        >
          <Box
            sx={{
              height: '100%',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              padding: 3,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
                maxWidth: '400px'  // Limit button width
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
                maxWidth: '400px'  // Limit button width
              }}
            >
              View Records
            </Button>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default Main;