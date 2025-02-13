import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Scanner from '@mui/icons-material/Scanner';

const Scan = () => {
  const navigate = useNavigate();
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
      // Navigate to records after scanning
      navigate('/records');
    }, 3000);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>

        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Scan Document
          </Typography>

          <Box sx={{ mt: 4, mb: 4 }}>
            {isScanning ? (
              <CircularProgress size={60} />
            ) : (
              <Button
                variant="contained"
                size="large"
                startIcon={<Scanner />}
                onClick={handleScan}
              >
                Start Scanning
              </Button>
            )}
          </Box>

          <Typography variant="body2" color="text.secondary">
            Place your document on the scanner and click the button above
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default Scan;