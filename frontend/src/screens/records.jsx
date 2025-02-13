import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Records = () => {
  const navigate = useNavigate();

  // Sample data - replace with actual data later
  const sampleRecords = [
    { id: 1, documentName: 'COA-001', dateScanned: '2024-02-13', status: 'Completed' },
    { id: 2, documentName: 'COA-002', dateScanned: '2024-02-13', status: 'Pending' },
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Home
        </Button>
        
        <Typography variant="h4" component="h1" gutterBottom>
          Scanned Records
        </Typography>

        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Document ID</TableCell>
                <TableCell>Document Name</TableCell>
                <TableCell>Date Scanned</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sampleRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.id}</TableCell>
                  <TableCell>{record.documentName}</TableCell>
                  <TableCell>{record.dateScanned}</TableCell>
                  <TableCell>{record.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default Records;