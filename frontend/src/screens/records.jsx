import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
  Dialog,
  DialogContent,
  AppBar,
  Toolbar,
} from '@mui/material';

import { Menu, MenuItem } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import backgroundImage from '../assets/bldg.jpg';
import logo from '../assets/logo.png';
import Sidebar from '../components/sidebar';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';

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

// 1. Update the StablePDFViewer component for preview mode
const StablePDFViewer = React.memo(({ data, isPreview }) => {
  const iframeRef = useRef(null);
  const pdfUrl = useMemo(() => {
    if (!data) return '';
    return `data:application/pdf;base64,${data}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
  }, [data]);

  return (
    <Box 
      sx={{ 
        width: '100%', 
        height: '100%', 
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: isPreview ? 'transparent' : 'grey.100',
        borderRadius: isPreview ? 1 : 0,
      }}
    >
      <iframe
        ref={iframeRef}
        src={pdfUrl}
        width="100%"
        height="100%"
        style={{ 
          border: 'none',
          pointerEvents: isPreview ? 'none' : 'auto',
          transform: isPreview ? 'scale(1.45)' : 'none',
          transformOrigin: 'center center',
        }}
        title="PDF Viewer"
        frameBorder="0"
        scrolling="no"
      />
    </Box>
  );
}, (prev, next) => prev.data === next.data && prev.isPreview === next.isPreview);

// 2. Create a new DocumentViewerModal component
const DocumentViewerModal = React.memo(({ document, onClose }) => {
  const handleStopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const handlePrint = useCallback(() => {
    const pdfUrl = `data:application/pdf;base64,${document}`;
    const printWindow = window.open(pdfUrl);
    printWindow.print();
  }, [document]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([Buffer.from(document, 'base64')], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'document.pdf';
    link.click();
    window.URL.revokeObjectURL(url);
  }, [document]);

  return (
    <Dialog
      open={Boolean(document)}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      onClick={handleStopPropagation}
      PaperProps={{
        sx: {
          width: '74vw',
          height: '95vh',
          maxWidth: '95vw',
          maxHeight: '95vh',
          m: 0,
          bgcolor: '#202124',
          position: 'relative',
          borderRadius: 0
        }
      }}
    >
      <AppBar 
        position="relative" 
        color="default" 
        elevation={0}
        sx={{
          bgcolor: '#303134',
          color: '#fff',
          height: '48px',
          minHeight: '48px'
        }}
      >
        <Toolbar 
          variant="dense"
          sx={{
            minHeight: '48px',
            height: '48px',
            px: 2,
            gap: 1
          }}
        >
          <Typography 
            sx={{ 
              flex: 1,
              fontSize: '1rem',
              color: '#fff'
            }} 
          >
            Document Viewer
          </Typography>
          
          <IconButton
            onClick={handlePrint}
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <PrintIcon />
          </IconButton>

          <IconButton
            onClick={handleDownload}
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <DownloadIcon />
          </IconButton>

          <IconButton
            onClick={handleStopPropagation}
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <MoreVertIcon />
          </IconButton>

          <IconButton
            edge="end"
            onClick={onClose}
            aria-label="close"
            sx={{
              color: '#fff',
              '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      
      <DialogContent 
        sx={{ 
          p: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: '#202124'
        }}
      >
        {document && (
          <Box sx={{ 
            flex: 1, 
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2
          }}>
            <StablePDFViewer 
              data={document} 
              isPreview={false} 
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}, (prev, next) => prev.document === next.document);

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

// 3. Update the document click handler
const handleDocumentClick = useCallback((documentData) => {
  if (!documentData) return;
  setSelectedDocument(documentData);
}, []);

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
                    width: '32px', // Fixed width for arrow box
                    height: '32px', // Fixed height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <IconButton 
                    disabled={page >= Math.ceil(sampleRecords.length / rowsPerPage) - 1}
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
                backgroundColor: 'rgba(27, 27, 27, 0.95)', // Updated to consistent dark color
                '&:hover': {
                  backgroundColor: 'rgba(27, 27, 27, 0.85)' // Slightly lighter on hover
                },
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => handleDocumentClick(documents.pds.data)}
            >
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: 2,
                  fontWeight: 500
                }}
              >
                Personal Data Sheet
              </Typography>
              <Box 
                sx={{ 
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)' // Updated border color
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
                backgroundColor: 'rgba(27, 27, 27, 0.95)', // Same dark color
                '&:hover': {
                  backgroundColor: 'rgba(27, 27, 27, 0.85)' // Same hover effect
                },
                position: 'relative',
                overflow: 'hidden'
              }}
              onClick={() => handleDocumentClick(documents.saln.data)}
            >
              <Typography 
                variant="subtitle1" 
                gutterBottom
                sx={{
                  color: 'white',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  mb: 2,
                  fontWeight: 500
                }}
              >
                Statement of Assets, Liabilities and Net Worth
              </Typography>
              <Box 
                sx={{ 
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)' // Updated border color
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
            variant="body"
            sx={{
              mr: 112,
              color: '#000',
              fontSize: '0.7rem',
              fontFamily: 'roboto',
              fontWeight: 'bold'
            }}
          >
            All Rights Reserved 2025 © COA Region X
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#000',
              fontSize: '0.7rem',
              fontFamily: 'roboto',
              fontWeight: 'bold'
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
