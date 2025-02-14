import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  IconButton,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  Modal,
  Tabs,
  Tab,
  Grid,
  Divider,
  TablePagination,
} from '@mui/material';

import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import backgroundImage from '../assets/bldg.jpg';
import logo from '../assets/logo.png';
import Sidebar from '../components/sidebar';
import CloseIcon from '@mui/icons-material/Close';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

  // Sample data - replace with actual data later
  const sampleRecords = [
    { id: 1, name: 'Alexander Cruz', type: 'PDS: PDS-2025-001, SALN: SALN-2025-002', date: 'January 15, 2025' },
    { id: 2, name: 'Maria Gonzales', type: 'PDS: PDS-2025-003', date: 'February 10, 2025' },
    { id: 3, name: 'Joshua Ramirez', type: 'PDS: PDS-2025-004, SALN: SALN-2025-002', date: 'March 22, 2025' },
    { id: 4, name: 'Sofia Dela Cruz', type: 'PDS: PDS-2025-003, SALN: SALN-2025-005', date: 'April 5, 2025' },
    { id: 5, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' },
  ];
  
const Records = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [records, setRecords] = useState(sampleRecords);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(20);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Sample data - replace with actual data later
  const sampleRecords = [
    { id: 1, name: 'Alexander Cruz', type: 'PDS: PDS-2025-001, SALN: SALN-2025-002', date: 'January 15, 2025' },
    { id: 2, name: 'Maria Gonzales', type: 'PDS: PDS-2025-003', date: 'February 10, 2025' },
    { id: 3, name: 'Joshua Ramirez', type: 'PDS: PDS-2025-004, SALN: SALN-2025-002', date: 'March 22, 2025' },
    { id: 4, name: 'Sofia Dela Cruz', type: 'PDS: PDS-2025-003, SALN: SALN-2025-005', date: 'April 5, 2025' },
    { id: 5, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' },
    { id: 6, name: 'Alexander Cruz', type: 'PDS: PDS-2025-001, SALN: SALN-2025-002', date: 'January 15, 2025' },
    { id: 7, name: 'Maria Gonzales', type: 'PDS: PDS-2025-003', date: 'February 10, 2025' },
    { id: 8, name: 'Joshua Ramirez', type: 'PDS: PDS-2025-004, SALN: SALN-2025-002', date: 'March 22, 2025' },
    { id: 9, name: 'Sofia Dela Cruz', type: 'PDS: PDS-2025-003, SALN: SALN-2025-005', date: 'April 5, 2025' },
    { id: 10, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' },
    { id: 11, name: 'Alexander Cruz', type: 'PDS: PDS-2025-001, SALN: SALN-2025-002', date: 'January 15, 2025' },
    { id: 12, name: 'Maria Gonzales', type: 'PDS: PDS-2025-003', date: 'February 10, 2025' },
    { id: 13, name: 'Joshua Ramirez', type: 'PDS: PDS-2025-004, SALN: SALN-2025-002', date: 'March 22, 2025' },
    { id: 14, name: 'Sofia Dela Cruz', type: 'PDS: PDS-2025-003, SALN: SALN-2025-005', date: 'April 5, 2025' },
    { id: 15, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' },
    { id: 16, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' },
    { id: 17, name: 'Alexander Cruz', type: 'PDS: PDS-2025-001, SALN: SALN-2025-002', date: 'January 15, 2025' },
    { id: 18, name: 'Maria Gonzales', type: 'PDS: PDS-2025-003', date: 'February 10, 2025' },
    { id: 19, name: 'Joshua Ramirez', type: 'PDS: PDS-2025-004, SALN: SALN-2025-002', date: 'March 22, 2025' },
    { id: 20, name: 'Sofia Dela Cruz', type: 'PDS: PDS-2025-003, SALN: SALN-2025-005', date: 'April 5, 2025' },
    { id: 21, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' },
    { id: 22, name: 'Alexander Cruz', type: 'PDS: PDS-2025-001, SALN: SALN-2025-002', date: 'January 15, 2025' },
    { id: 23, name: 'Maria Gonzales', type: 'PDS: PDS-2025-003', date: 'February 10, 2025' },
    { id: 24, name: 'Joshua Ramirez', type: 'PDS: PDS-2025-004, SALN: SALN-2025-002', date: 'March 22, 2025' },
    { id: 25, name: 'Sofia Dela Cruz', type: 'PDS: PDS-2025-003, SALN: SALN-2025-005', date: 'April 5, 2025' },
    { id: 26, name: 'Daniel Santos', type: 'PDS: PDS-2025-003', date: 'May 18, 2025' }
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSelectedRecord(null);
    }, 100); // Match this with animation duration
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setAnchorEl(null);
  };
  
  const handleSort = (type) => {
    const sortedRecords = [...records].sort((a, b) => {
      switch(type) {
        case 'az':
          return a.name.localeCompare(b.name);
        case 'za':
          return b.name.localeCompare(a.name);
        case 'newest':
          return new Date(b.date) - new Date(a.date);
        case 'oldest':
          return new Date(a.date) - new Date(b.date);
        default:
          return 0;
      }
    });
    setRecords(sortedRecords);
    handleSortClose();
  };

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
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 0.4,
            zIndex: -1,
          }
        }}
      >
        {/* Header */}
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
            justifyContent: 'space-between',
            padding: '0 24px',
            zIndex: 1,
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
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
            disableRipple
            onClick={() => setSidebarOpen(true)}
            sx={{ 
              color: '#000',
              borderRadius: 0,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              },
              '&:focus': {
                outline: 'none'
              },
              // Remove focus visible outline
              '&.Mui-focusVisible': {
                outline: 'none'
              }
            }}
          >
            <MenuRoundedIcon />
          </IconButton>
        </Box>

        {/* Sidebar */}
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

        {/* Main Content */}
        <Box
          sx={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            bottom: '40px',
            overflow: 'auto',
            padding: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Container maxWidth="lg">
            <Box 
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                backdropFilter: 'blur(3px)',
                borderRadius: 2,
                padding: 4,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: 'calc(100vh - 160px)', // Adjust height to account for header and footer
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" component="h1" fontWeight="bold">Records</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                <>
  <IconButton 
    color="primary"
    onClick={handleSortClick}
    disableRipple
    sx={{ 
      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
      '&:focus': { outline: 'none' },
      '&.Mui-focusVisible': { outline: 'none' }
    }}
  >
    <FilterListIcon />
  </IconButton>

  <Menu
    anchorEl={anchorEl}
    open={Boolean(anchorEl)}
    onClose={handleSortClose}
    sx={{
      '& .MuiPaper-root': {
        borderRadius: 2,
        marginTop: 1,
        minWidth: 180,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
      }
    }}
  >
    <MenuItem 
      onClick={() => handleSort('az')}
      sx={{ 
        gap: 1,
        padding: '8px 16px',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
      }}
    >
      <ArrowUpwardIcon fontSize="small" /> A to Z
    </MenuItem>
    <MenuItem 
      onClick={() => handleSort('za')}
      sx={{ 
        gap: 1,
        padding: '8px 16px',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
      }}
    >
      <ArrowDownwardIcon fontSize="small" /> Z to A
    </MenuItem>
    <Divider sx={{ my: 1 }} />
    <MenuItem 
      onClick={() => handleSort('newest')}
      sx={{ 
        gap: 1,
        padding: '8px 16px',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
      }}
    >
      <ArrowUpwardIcon fontSize="small" /> Newest to Oldest
    </MenuItem>
    <MenuItem 
      onClick={() => handleSort('oldest')}
      sx={{ 
        gap: 1,
        padding: '8px 16px',
        '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
      }}
    >
      <ArrowDownwardIcon fontSize="small" /> Oldest to Newest
    </MenuItem>
  </Menu>
</>
                  <TextField 
                    variant="outlined" 
                    size="small" 
                    placeholder="Search" 
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      sx: {
                        borderRadius: '12px',
                        '& fieldset': {
                          borderRadius: '12px',
                        },
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                      }
                    }}
                  />
                </Box>
              </Box>

              {/* Table */}
              <TableContainer 
                component={Paper} 
                sx={{ 
                  borderRadius: 2, 
                  overflow: 'auto',
                  boxShadow: 3,
                  flex: '1 1 auto', // Changed to flex grow and shrink
                  minHeight: 'calc(100% - 120px)', // Account for header and pagination
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px'
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '4px'
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.25)'
                    }
                  }
                }}
              >
                <Table stickyHeader> {/* Add stickyHeader prop */}
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Type of Document</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sampleRecords
                      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                      .map((record) => (
                        <TableRow 
                          key={record.id} 
                          hover 
                          onClick={() => {
                            setSelectedRecord(record);
                            setActiveTab(1); // Set to Documents tab
                          }}
                          sx={{ cursor: 'pointer' }}
                        >
                          <TableCell>{record.name}</TableCell>
                          <TableCell>{record.type}</TableCell>
                          <TableCell>{record.date}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Add Pagination */}
              <Box sx={{ 
                mt: 2,
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
              }}>
                <IconButton 
                  disabled={page === 0}
                  onClick={(e) => handleChangePage(e, page - 1)}
                  sx={{
                    color: '#1976d2',
                    '&.Mui-disabled': {
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                >
                  &lt;
                </IconButton>
                <Box
                  sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '4px 16px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    minWidth: '80px',
                    display: 'flex',
                    justifyContent: 'center'
                  }}
                >
                  <Typography>
                    {page + 1} of {Math.ceil(sampleRecords.length / rowsPerPage)}
                  </Typography>
                </Box>
                <IconButton 
                  disabled={page >= Math.ceil(sampleRecords.length / rowsPerPage) - 1}
                  onClick={(e) => handleChangePage(e, page + 1)}
                  sx={{
                    color: '#1976d2',
                    '&.Mui-disabled': {
                      color: 'rgba(0, 0, 0, 0.26)'
                    }
                  }}
                >
                  &gt;
                </IconButton>
              </Box>

              {selectedRecord && (
                <Modal
                  open={Boolean(selectedRecord)}
                  onClose={() => setSelectedRecord(null)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2
                  }}
                >
                  <Box
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(8px)',
                      borderRadius: 2,
                      padding: 4,
                      width: '800px', // Fixed width
                      height: '600px', // Fixed height
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                  >
                    {/* Fixed header */}
                    <Box sx={{ mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h5" component="h2" fontWeight="bold">
                          {selectedRecord.name}&apos;s Details
                        </Typography>
                        <IconButton 
                          onClick={() => setSelectedRecord(null)}
                          size="medium"
                          disableRipple  // Add this to disable the ripple effect
                          sx={{ 
                            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
                            '& .MuiSvgIcon-root': {
                              fontSize: '1.5rem'
                            },
                            // Remove focus outline
                            '&:focus': {
                              outline: 'none'
                            },
                            // Remove focus visible outline
                            '&.Mui-focusVisible': {
                              outline: 'none'
                            }
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </Box>
                      <Divider />
                    </Box>

                    {/* Fixed tabs */}
                    <Tabs 
                      value={activeTab} 
                      onChange={(e, newValue) => setActiveTab(newValue)}
                      sx={{ 
                        borderBottom: 1, 
                        borderColor: 'divider', 
                        mb: 2,
                        // Remove focus outline from tabs
                        '& .MuiTab-root': {
                          '&:focus': {
                            outline: 'none'
                          },
                          '&.Mui-selected': {
                            color: '#1976d2',
                          },
                          '&.Mui-focusVisible': {
                            backgroundColor: 'rgba(0, 0, 0, 0.04)',
                          }
                        },
                        // Remove focus outline from tab indicator
                        '& .MuiTabs-indicator': {
                          backgroundColor: '#1976d2',
                        }
                      }}
                    >
                      <Tab 
                        label="Personal Details" 
                        sx={{
                          '&.Mui-selected': {
                            color: '#1976d2',
                          }
                        }}
                      />
                      <Tab 
                        label="Documents" 
                        sx={{
                          '&.Mui-selected': {
                            color: '#1976d2',
                          }
                        }}
                      />
                      <Tab 
                        label="History" 
                        sx={{
                          '&.Mui-selected': {
                            color: '#1976d2',
                          }
                        }}
                      />
                    </Tabs>

                    {/* Scrollable content area */}
                    <Box 
                      sx={{ 
                        flex: 1,
                        overflow: 'auto',
                        // Custom scrollbar styling
                        '&::-webkit-scrollbar': {
                          width: '8px'
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: 'rgba(0, 0, 0, 0.05)',
                          borderRadius: '4px'
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: 'rgba(0, 0, 0, 0.15)',
                          borderRadius: '4px',
                          '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.25)'
                          }
                        }
                      }}
                    >
                      {/* ... existing tab content ... */}
                    </Box>
                  </Box>
                </Modal>
              )}
  {records.map((record) => (
    <TableRow 
      key={record.id} 
      hover 
      onClick={() => {
        setSelectedRecord(record);
        setActiveTab(1);
      }}
      sx={{ cursor: 'pointer' }}
    >
      <TableCell>{record.name}</TableCell>
      <TableCell>{record.type}</TableCell>
      <TableCell>{record.date}</TableCell>
    </TableRow>
  ))}
</TableBody>
</Table>
</TableContainer>

{selectedRecord && (
  <Modal
  open={Boolean(selectedRecord)}
  onClose={handleClose}
  closeAfterTransition
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      backdropFilter: 'none'
    }
  }}
>
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: 2,
        padding: 4,
        width: '800px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        opacity: isClosing ? 0 : 1,
        transition: 'opacity 100ms ease-in-out',
      }}
    >
      {/* Fixed header */}
      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2" fontWeight="bold">
            {selectedRecord.name}&apos;s Details
          </Typography>
          <IconButton 
  onClick={handleClose}
  size="medium"
  disableRipple
  sx={{ 
    '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
    '& .MuiSvgIcon-root': {
      fontSize: '1.5rem'
    },
    // Remove focus outline
    '&:focus': {
      outline: 'none'
    },
    // Remove focus visible outline
    '&.Mui-focusVisible': {
      outline: 'none'
    }
  }}
>
  <CloseIcon />
</IconButton>
        </Box>
        <Divider />
      </Box>

      {/* Fixed tabs */}
      <Tabs 
  value={activeTab} 
  onChange={(e, newValue) => setActiveTab(newValue)}
  sx={{ 
    borderBottom: 1, 
    borderColor: 'divider', 
    mb: 2,
    // Remove focus outline from tabs
    '& .MuiTab-root': {
      '&:focus': {
        outline: 'none'
      },
      '&.Mui-selected': {
        color: '#1976d2',
      },
      '&.Mui-focusVisible': {
        backgroundColor: 'rgba(0, 0, 0, 0.04)',
      }
    },
    // Remove focus outline from tab indicator
    '& .MuiTabs-indicator': {
      backgroundColor: '#1976d2',
    }
  }}
>
  <Tab 
    label="Personal Details" 
    sx={{
      '&.Mui-selected': {
        color: '#1976d2',
      }
    }}
  />
  <Tab 
    label="Documents" 
    sx={{
      '&.Mui-selected': {
        color: '#1976d2',
      }
    }}
  />
  <Tab 
    label="History" 
    sx={{
      '&.Mui-selected': {
        color: '#1976d2',
      }
    }}
  />
</Tabs>

      {/* Scrollable content area */}
      <Box 
        sx={{ 
          flex: 1,
          overflow: 'auto',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '8px'
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: 'rgba(0, 0, 0, 0.05)',
            borderRadius: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0, 0, 0, 0.15)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.25)'
            }
          }
        }}
      >
        {/* ... existing tab content ... */}
      </Box>
    </Box>
  </Modal>
)}
            </Box>
          </Container>
        </Box>

        {/* Footer */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '40px',
            backgroundColor: '#F5F5F4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: '0 24px',
            zIndex: 1,
            boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#000',
              fontSize: '0.9rem',
              fontFamily: 'monospace'
            }}
          >
            {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Records;
