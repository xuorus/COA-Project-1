import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const Main = () => {
  const navigate = useNavigate();
  console.log('Main component rendered'); // Add this for debugging

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            padding: 3
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
            sx={{ marginBottom: 2 }}
          >
            Scan New Document
          </Button>

          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate('/records')}
          >
            View Records
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Main;