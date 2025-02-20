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
const DocumentViewerModal = React.memo(({ document, onClose, name }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleMenuClick = useCallback((event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handlePrint = useCallback(() => {
    try {
      const pdfWindow = window.open('', '_blank');
      pdfWindow.document.write(`
        <html>
          <head>
            <title>${name} - Print</title>
          </head>
          <body style="margin:0;padding:0;">
            <embed 
              width="100%" 
              height="100%" 
              src="data:application/pdf;base64,${document}" 
              type="application/pdf"
            />
          </body>
        </html>
      `);
      pdfWindow.document.close();
      pdfWindow.print();
    } catch (error) {
      console.error('Error printing document:', error);
    }
  }, [document, name]);

  const handleDownload = useCallback(() => {
    try {
      const byteCharacters = atob(document);
      const byteNumbers = new Array(byteCharacters.length);
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  }, [document, name]);

  return (
    <Dialog
      open={Boolean(document)}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: '80vw',
          height: '90vh',
          maxWidth: '1400px',
          maxHeight: '90vh',
          m: 0,
          bgcolor: '#202124',
          borderRadius: 1
        }
      }}
    >
      <AppBar 
        position="relative" 
        elevation={0}
        sx={{
          bgcolor: '#303134',
          color: '#fff',
          height: '56px',
        }}
      >
        <Toolbar sx={{ height: '56px', gap: 0.5 }}>
          <IconButton
            edge="start"
            onClick={onClose}
            sx={{ color: '#fff' }}
          >
            <CloseIcon />
          </IconButton>
          
          <Typography 
            sx={{ 
              ml: 1,
              flex: 1,
              fontSize: '1rem',
              color: '#fff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }} 
          >
            {name || 'Document Viewer'}
          </Typography>

          <IconButton
            onClick={handlePrint}
            sx={{ color: '#fff' }}
            title="Print"
          >
            <PrintIcon />
          </IconButton>

          <IconButton
            onClick={handleDownload}
            sx={{ color: '#fff' }}
            title="Download"
          >
            <DownloadIcon />
          </IconButton>

          <IconButton
            onClick={handleMenuClick}
            sx={{ color: '#fff' }}
          >
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              '& .MuiPaper-root': {
                bgcolor: '#303134',
                color: '#fff',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.3)',
                minWidth: 200,
              }
            }}
          >
            <MenuItem 
              onClick={handlePrint}
              sx={{ 
                color: '#fff',
                gap: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <PrintIcon fontSize="small" />
              Print
            </MenuItem>
            <MenuItem 
              onClick={handleDownload}
              sx={{ 
                color: '#fff',
                gap: 2,
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <DownloadIcon fontSize="small" />
              Download
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      
      <DialogContent 
        sx={{ 
          p: 0,
          bgcolor: '#202124',
          display: 'flex',
          flexDirection: 'column',
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
}, (prev, next) => prev.document === next.document && prev.name === next.name);

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
  const [history, setHistory] = useState(null);

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

  useEffect(() => {
    if (selectedRecord?.PID && activeTab === 2) {
      axios.get(`http://localhost:5000/api/records/${selectedRecord.PID}/history`)
        .then(response => {
          setHistory(response.data);
        })
        .catch(error => {
          console.error('Error fetching history:', error);
        });
    }
  }, [selectedRecord?.PID, activeTab]);

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
    const sortedRecords = [...records].sort((a, b) => {
      // Create full names for comparison
      const nameA = `${a.lName || ''}, ${a.fName || ''} ${a.mName || ''}`.trim().toLowerCase();
      const nameB = `${b.lName || ''}, ${b.fName || ''} ${b.mName || ''}`.trim().toLowerCase();

      switch(type) {
        case 'az':
          return nameA.localeCompare(nameB);
        case 'za':
          return nameB.localeCompare(nameA);
        case 'newest':
          return new Date(b.date || 0) - new Date(a.date || 0);
        case 'oldest':
          return new Date(a.date || 0) - new Date(b.date || 0);
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
  
    const filteredRecords = records.filter(record => {
      // Get individual name parts and ensure they exist
      const fName = (record.fName || '').toLowerCase();
      const mName = (record.mName || '').toLowerCase();
      const lName = (record.lName || '').toLowerCase();
  
      // Progressive string matching
      const searchStrings = [
        fName,                              // First name
        `${fName}${mName}`,                // First + Middle (no space)
        `${fName}${lName}`,                // First + Last (no space)
        `${fName}${mName}${lName}`,        // Full name (no space)
        // With spaces for natural typing
        `${fName} ${mName}`,               // First + Middle
        `${fName} ${lName}`,               // First + Last
        `${fName} ${mName} ${lName}`,      // Full name
      ];
  
      // Progressive character matching
      return searchStrings.some(str => {
        let searchIndex = 0;
        for (let char of query) {
          searchIndex = str.indexOf(char, searchIndex);
          if (searchIndex === -1) return false;
          searchIndex++;
        }
        return true;
      }) ||
      // Keep existing document ID and date filters
      (record.pdsID || '').toString().toLowerCase().includes(query) ||
      (record.salnID || '').toString().toLowerCase().includes(query) ||
      (record.date ? new Date(record.date)
        .toLocaleDateString()
        .toLowerCase()
        .includes(query) : false);
    });
  
    setRecords(filteredRecords);
  };

// 3. Update the document click handler
const handleDocumentClick = useCallback((documentData) => {
  if (!documentData) return;
  
  // Create blob URL from base64 data
  const byteCharacters = atob(documentData);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  const blobUrl = URL.createObjectURL(blob);
  
  // Open PDF in new tab
  window.open(blobUrl, '_blank');
  
  // Clean up blob URL after a short delay
  setTimeout(() => {
    URL.revokeObjectURL(blobUrl);
  }, 100);
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
            opacity: 1,
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
                      <TableCell 
                        sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f5f5f5', 
                          width: '33%', // Equal width for all columns
                          pl: 2 // Add left padding
                        }}
                      >
                        Name
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f5f5f5',
                          width: '33%', // Equal width for all columns
                          pl: 2 // Add left padding
                        }}
                      >
                        Type of Document
                      </TableCell>
                      <TableCell 
                        sx={{ 
                          fontWeight: 'bold', 
                          backgroundColor: '#f5f5f5', 
                          width: '33%', // Equal width for all columns
                          pl: 2 // Add left padding
                        }}
                      >
                        Date
                      </TableCell>
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
        <TableCell 
          sx={{
            pl: 2, // Add left padding to match header
            width: '33%' // Match header width
          }}
        >
          {`${record.lName || ''}, ${record.fName || ''} ${record.mName ? record.mName.charAt(0) + '.' : ''}`.trim() || 'No name'}
        </TableCell>
        <TableCell 
          sx={{
            pl: 2, // Add left padding to match header
            width: '33%', // Match header width
            '& > span': {
              display: 'inline-block',
              width: '100%', // Full width of cell
              textAlign: 'left' // Align text to left
            }
          }}
        >
          <span>
            {[
              record.pdsID && `PDS: ${record.pdsID}`,
              record.salnID && `SALN: ${record.salnID}`
            ].filter(Boolean).join(' | ') || 'No documents'}
          </span>
        </TableCell>
        <TableCell 
          sx={{
            pl: 2, // Add left padding to match header
            width: '33%', // Match header width
            '& > span': {
              display: 'inline-block',
              width: '100%', // Full width of cell
              textAlign: 'left' // Align text to left
            }
          }}
        >
          <span>
            {record.date ? new Date(record.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'No date'}
          </span>
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
  gap: 1
}}>
  {/* Previous Page Button */}
  <Box
    sx={{
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      width: '32px',
      height: '32px',
      overflow: 'hidden' // Add this to contain hover effect
    }}
  >
    <IconButton 
      disabled={page === 0}
      onClick={() => setPage(prev => Math.max(0, prev - 1))}
      disableRipple
      sx={{
        color: page === 0 ? 'rgba(0, 0, 0, 0.26)' : '#000',
        padding: 0,
        width: '100%',
        height: '100%',
        borderRadius: 0, // Remove circular shape
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
        },
        '&.Mui-focusVisible': {
          outline: 'none'
        }
      }}
    >
      &lt;
    </IconButton>
  </Box>

  {/* Page Counter */}
  <Box
    sx={{
      backgroundColor: '#f5f5f5',
      padding: '4px 16px',
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      minWidth: '64px',
      height: '32px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Typography>
      {`${page + 1} of ${Math.max(1, Math.ceil(records.length / rowsPerPage))}`}
    </Typography>
  </Box>

  {/* Next Page Button */}
  <Box
    sx={{
      backgroundColor: '#f5f5f5',
      borderRadius: '4px',
      border: '1px solid rgba(0, 0, 0, 0.12)',
      width: '32px',
      height: '32px',
      overflow: 'hidden' // Add this to contain hover effect
    }}
  >
    <IconButton 
      disabled={page >= Math.ceil(records.length / rowsPerPage) - 1}
      onClick={() => setPage(prev => Math.min(Math.ceil(records.length / rowsPerPage) - 1, prev + 1))}
      disableRipple
      sx={{
        color: page >= Math.ceil(records.length / rowsPerPage) - 1 ? 'rgba(0, 0, 0, 0.26)' : '#000',
        padding: 0,
        width: '100%',
        height: '100%',
        borderRadius: 0, // Remove circular shape
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)'
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
                    <Box 
    sx={{ 
      display: 'flex',
      alignItems: 'center',
      borderBottom: 1,
      borderColor: 'divider',
      mb: 2,
    }}
  >
    <Tabs 
      value={activeTab} 
      onChange={(e, newValue) => setActiveTab(newValue)}
      sx={{ 
        flex: 1,
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
    <IconButton
      edge="end"
      onClick={handleClose}
      sx={{
        ml: 2,
        '&:hover': { 
          backgroundColor: 'rgba(0, 0, 0, 0.04)' 
        }
      }}
    >
      <CloseIcon />
    </IconButton>
  </Box>

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
                          <Typography variant="h6" mb={2} gutterBottom>Personal Information</Typography>
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
    <Typography variant="h6" mb={2} gutterBottom>List of Documents</Typography>
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
  </Box>
)}
{activeTab === 2 && (
  <Box sx={{ p: 2 }}>
    <Typography variant="h6" mb={2} gutterBottom>Activity History</Typography>
    {!history ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    ) : history.length === 0 ? (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <Typography color="text.secondary">No history available</Typography>
      </Box>
    ) : (
      <Box
        sx={{
          '& > :not(:last-child)': {
            mb: 2
          }
        }}
      >
        {history.map((entry, index) => (
          <Paper
            key={index}
            elevation={1}
            sx={{
              p: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.8)',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: 1
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                  {entry.activity}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {new Date(entry.date).toLocaleString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
    )}
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

//partial for commit