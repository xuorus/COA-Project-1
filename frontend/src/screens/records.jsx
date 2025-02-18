import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  CircularProgress,
} from '@mui/material';

import { Menu, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import backgroundImage from '../assets/bldg.jpg';
import Sidebar from '../components/sidebar';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PropTypes from 'prop-types';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';

// Add PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});
  
// Sample data - replace with actual data later
const sampleRecords = [
  
];

const HighlightedText = ({ text, highlight }) => {
  // Convert text to string to handle any type
  const stringText = String(text || '');
  const stringHighlight = String(highlight || '');

  if (!stringHighlight.trim()) {
    return <span>{stringText}</span>;
  }
  
  // Escape special characters in the highlight text
  const escapedHighlight = stringHighlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedHighlight})`, 'gi');
  const parts = stringText.split(regex);
  
  return (
    <span>
      {parts.map((part, index) => 
        regex.test(part) ? (
          <span key={index} style={{ backgroundColor: 'yellow', fontWeight: 'bold' }}>
            {part}
          </span>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </span>
  );
};

HighlightedText.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  highlight: PropTypes.string.isRequired
};

// Add default props
HighlightedText.defaultProps = {
  text: '',
  highlight: ''
};
// 1. Update the StablePDFViewer component
const StablePDFViewer = React.memo(({ data, isPreview }) => {
  const pdfUrl = useMemo(() => 
    data ? `data:application/pdf;base64,${data}` : '',
    [data]
  );

  if (!data) return null;

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <iframe
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 'none',
          pointerEvents: isPreview ? 'none' : 'auto' 
        }}
        title="PDF Preview"
      />
    </Box>
  );
}, (prev, next) => {
  return prev.data === next.data && prev.isPreview === next.isPreview;
});

const Records = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [records, setRecords] = useState(sampleRecords);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState(null);
  const [personDetails, setPersonDetails] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/records');
        setRecords(response.data);
      } catch (error) {
        console.error('Error fetching records:', error);
      }
    };

    fetchRecords();
  }, []);

  useEffect(() => {
    if (selectedRecord) {
      axios.get(`http://localhost:5000/api/records/${selectedRecord.PID}`)
        .then(response => {
          setPersonDetails(response.data);
        })
        .catch(error => {
          console.error('Error fetching person details:', error);
        });
    }
    return () => setPersonDetails(null);
  }, [selectedRecord]);

  const fetchDocuments = useCallback(async (pid) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/records/${pid}/documents`);
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    if (selectedRecord?.PID && activeTab === 1) {
      fetchDocuments(selectedRecord.PID);
    }

    return () => {
      isMounted = false;
    };
  }, [selectedRecord?.PID, activeTab, fetchDocuments]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setSelectedRecord(null);
    }, 100);
  };

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleSortClose = () => {
    setAnchorEl(null);
  };
  
  const handleSort = (type) => {
    setSortType(type);
    const sortedRecords = [...sampleRecords].sort((a, b) => {
      switch(type) {
        case 'az':
          return `${a.lname || ''}, ${a.fname || ''}`.localeCompare(
            `${b.lname || ''}, ${b.fname || ''}`
          );
        case 'za':
          return `${b.lname || ''}, ${b.fname || ''}`.localeCompare(
            `${a.lname || ''}, ${a.fname || ''}`
          );
        case 'newest':
          return new Date(b.dateCreated || 0) - new Date(a.dateCreated || 0);
        case 'oldest':
          return new Date(a.dateCreated || 0) - new Date(b.dateCreated || 0);
        default:
          return 0;
      }
    });
    setRecords(sortedRecords);
    handleSortClose();
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query);
    setPage(0); // Reset to first page (internally 0, displayed as 1)
  
    // Maintain current sort if one is active
    if (sortType) {
      filteredRecords.sort((a, b) => {
        switch(sortType) {
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
    }
    
  
    if (query === '') {
      axios.get('http://localhost:5000/api/records')
        .then(response => {
          setRecords(response.data);
        })
        .catch(error => {
          console.error('Error fetching records:', error);
        });
      return;
    }
  
    const filteredRecords = records.filter(record =>
      `${record.fname || ''} ${record.mname || ''} ${record.lname || ''}`.toLowerCase().includes(query) ||
      (record.pdsID || '').toString().toLowerCase().includes(query) ||
      (record.salnID || '').toString().toLowerCase().includes(query) ||
      (record.dateCreated ? new Date(record.dateCreated).toLocaleDateString() : '').toLowerCase().includes(query)
    );
  
    setRecords(filteredRecords);
  };

// 3. Update the click handler for documents
const handleDocumentClick = useCallback((documentData) => {
  if (!documentData) return;
  setSelectedDocument(prevDoc => prevDoc === documentData ? prevDoc : documentData);
}, []);

// 2. Update the DocumentViewerModal component
const DocumentViewerModal = React.memo(({ document, onClose }) => {
  const handleStopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  return (
    <Modal
      open={Boolean(document)}
      onClose={onClose}
      keepMounted={false}
      disableAutoFocus
      disableEnforceFocus
      disablePortal
      onClick={handleStopPropagation}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        onClick={handleStopPropagation}
        sx={{
          backgroundColor: 'white',
          borderRadius: 1,
          p: 2,
          width: '90vw',
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {document && <StablePDFViewer data={document} isPreview={false} />}
        </Box>
      </Box>
    </Modal>
  );
}, (prev, next) => prev.document === next.document);

  DocumentViewerModal.displayName = 'DocumentViewerModal';

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

      <Header onMenuClick={() => setSidebarOpen(true)} />

        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />

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
            overflow: 'hidden', // Changed from 'auto' to 'hidden'
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
                flexDirection: 'column',
                overflow: 'hidden' // Add this to prevent container scroll
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h4" component="h1" fontWeight="bold">Records</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1}}>
                <>
  <IconButton 
    color="#000"
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
    <ArrowUpwardIcon fontSize="small" sx={{ transform: 'rotate(0deg)' }} /> A to Z
  </MenuItem>
  <MenuItem 
    onClick={() => handleSort('za')}
    sx={{ 
      gap: 1,
      padding: '8px 16px',
      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
    }}
  >
    <ArrowDownwardIcon fontSize="small" sx={{ transform: 'rotate(0deg)' }} /> Z to A
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
    <ArrowDownwardIcon fontSize="small" sx={{ transform: 'rotate(0deg)' }} /> Newest to Oldest
  </MenuItem>
  <MenuItem 
    onClick={() => handleSort('oldest')}
    sx={{ 
      gap: 1,
      padding: '8px 16px',
      '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
    }}
  >
    <ArrowUpwardIcon fontSize="small" sx={{ transform: 'rotate(0deg)' }} /> Oldest to Newest
  </MenuItem>
</Menu>
</>
<TextField 
  variant="outlined" 
  size="small" 
  placeholder="Search" 
  value={searchQuery}
  onChange={handleSearch}
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
      '&.Mui-focused fieldset': {
        borderColor: 'black',
      },
      '&:hover fieldset': {
        borderColor: 'black',
      }
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
                  overflow: 'hidden',
                  boxShadow: 3,
                  flex: '1 1 auto', // Changed to flex grow and shrink
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
                <Table stickyHeader>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Type of Document</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                </Table>
                <TableContainer 
                  sx={{ 
                    maxHeight: 'calc(100vh - 240px)', // Adjust height to account for header and footer
                    overflow: 'auto',
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
                  <Table>
                  <TableBody>
  {records
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    .map((record) => (
      <TableRow 
        key={record.PID} 
        hover 
        onClick={() => {
          setSelectedRecord(record);
          setActiveTab(1);
        }}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell>
          {`${record.lName || ''}, ${record.fName || ''} ${record.mName ? record.mName.charAt(0) + '.' : ''}`.trim() || 'No name'}
        </TableCell>
        <TableCell>
          {[
            record.pdsID && `PDS: ${record.pdsID}`,
            record.salnID && `SALN: ${record.salnID}`
          ].filter(Boolean).join(' | ') || 'No documents'}
        </TableCell>
        <TableCell>
          {record.date ? new Date(record.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          }) : 'No date'}
        </TableCell>
      </TableRow>
    ))}
</TableBody>
                  </Table>
                </TableContainer>
              </TableContainer>

              {/* Add Pagination */}
              <Box sx={{ 
                mt: 2,
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                gap: 1, // Reduced gap for tighter spacing
              }}>
                <Box
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    width: '32px', // Fixed width for arrow box
                    height: '32px', // Fixed height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <IconButton 
                    disabled={page === 0}
                    onClick={(e) => handleChangePage(e, page - 1)}
                    disableRipple
                    sx={{
                      color: '#000',
                      padding: 0,
                      '&.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.26)'
                      },
                      '&:focus': {
                        outline: 'none'
                      },
                      '&.Mui-focusVisible': {
                        outline: 'none'
                      }
                    }}
                  >
                    &lt;
                  </IconButton>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#f5f5f5',
                    padding: '4px 16px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    width: '32px', // Fixed width for number box
                    height: '32px', // Fixed height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                  }}
                >
                  <Typography>
                    {page + 1}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    backgroundColor: '#f5f5f5',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <IconButton 
  disabled={page >= Math.ceil(records.length / rowsPerPage) - 1}
  onClick={(e) => handleChangePage(e, page + 1)}
                    disableRipple
                    sx={{
                      color: '#000',
                      padding: 0,
                      '&.Mui-disabled': {
                        color: 'rgba(0, 0, 0, 0.26)'
                      },
                      '&:focus': {
                        outline: 'none'
                      },
                      '&.Mui-focusVisible': {
                        outline: 'none'
                      }
                    }}
                  >
                    &gt;
                  </IconButton>
                </Box>
              </Box>

              {selectedRecord && (
  <Modal
    open={Boolean(selectedRecord)}
    onClose={handleClose}
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
        width: '800px',
        height: '600px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
      }}
    >

<Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 2 
      }}>
        <Typography variant="h5" fontWeight="bold">
          {selectedRecord.name}&apos;s Details
        </Typography>
        <IconButton
          onClick={handleClose}
          size="small"
          sx={{
            color: '#000',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
            '&:focus': { outline: 'none' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider sx={{ mb: 2 }} />

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
                      {activeTab === 0 && (
                        <Box sx={{ p: 2 }}>
                          <Typography variant="h6" gutterBottom>Personal Information</Typography>
                          {personDetails && (
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography><strong>First Name:</strong> {personDetails.firstName}</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography><strong>Middle Name:</strong> {personDetails.middleName || 'N/A'}</Typography>
                              </Grid>
                              <Grid item xs={12}>
                                <Typography><strong>Last Name:</strong> {personDetails.lastName}</Typography>
                              </Grid>
                            </Grid>
                          )}
                        </Box>
                      )}
                      {activeTab === 1 && (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" gutterBottom>Documents</Typography>
    {!documents ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ) : (
      <Grid container spacing={2}>
        {documents?.pds && (
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 2,
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
              onClick={() => handleDocumentClick(documents.pds.data)}
            >
              <Typography variant="subtitle1" gutterBottom>
                Personal Data Sheet
              </Typography>
              <Box 
                sx={{ 
                  flex: 1,
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {documents.pds.data ? (
                  <StablePDFViewer 
                    data={documents.pds.data} 
                    isPreview={true}
                  />
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <Typography color="text.secondary">No PDS available</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}
        
        {documents?.saln && (
          <Grid item xs={12} md={6}>
            <Paper 
              elevation={3}
              sx={{ 
                p: 2,
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
              onClick={() => handleDocumentClick(documents.saln.data)}
            >
              <Typography variant="subtitle1" gutterBottom>
                Statement of Assets, Liabilities and Net Worth
              </Typography>
              <Box 
                sx={{ 
                  flex: 1,
                  border: '1px solid rgba(0,0,0,0.1)',
                  borderRadius: 1,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {documents.saln.data ? (
                  <StablePDFViewer 
                    data={documents.saln.data} 
                    isPreview={true}
                  />
                ) : (
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center',
                    height: '100%'
                  }}>
                    <Typography color="text.secondary">No SALN available</Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        )}

        {(!documents.pds && !documents.saln) && (
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              p: 4 
            }}>
              <Typography color="text.secondary">No documents available</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    )}

    <DocumentViewerModal
      document={selectedDocument}
      onClose={() => {
        setSelectedDocument(null);
        setIsDocumentExpanded(false);
      }}
    />
  </Box>
)}
                    </Box>
                  </Box>
                </Modal>
              )}

</Box>
          </Container>
        </Box>
              
        {/* Footer */}
        <Footer currentTime={currentTime} />
      </Box>
    </ThemeProvider>
  );
};

export default Records;
