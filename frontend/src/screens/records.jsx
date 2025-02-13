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
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';

const Records = () => {
  const navigate = useNavigate();

  // Sample data - replace with actual data later
  const sampleRecords = [
    { id: 1, name: 'Alexander Cruz', type: 'PDS: PDS-2025-001, SALN: SALN-2025-002', date: 'January 15, 2025' },
    { id: 2, name: 'Maria Gonzales', type: 'PDS: PDS-2025-003', date: 'February 10, 2025' },
    { id: 3, name: 'Joshua Ramirez', type: 'PDS: PDS-2025-004, SALN: SALN-2025-002', date: 'March 22, 2025' },
    { id: 4, name: 'Sofia Dela Cruz', type: 'PDS: PDS-2025-003, SALN: SALN-2025-005', date: 'April 5, 2025' },
    { id: 5, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/')} variant="contained" color="primary">
          Back
        </Button>
        <Typography variant="h4" component="h1" fontWeight="bold">Records</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton color="primary">
            <FilterListIcon />
          </IconButton>
          <TextField 
            variant="outlined" 
            size="small" 
            placeholder="Search" 
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              )
            }}
          />
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Type of Document</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sampleRecords.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>{record.name}</TableCell>
                <TableCell>{record.type}</TableCell>
                <TableCell>{record.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default Records;
