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
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
    DialogActions,
  DialogContentText,
  DialogTitle
} from '@mui/material';

import { Menu } from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import backgroundImage from '../assets/bldg.jpg';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import axios from 'axios';
import { Document, Page, pdfjs } from 'react-pdf';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Close';
import RecordFilters from '../components/records/RecordFilters';
import Pagination from '../components/records/Pagination';
import { recordsApi } from '../services/api';
import PersonalDetails from '../components/records/modal/PersonalDetails';
import WindowControl from '../components/WindowControl';
import DeleteIcon from '@mui/icons-material/Delete';
import PropTypes from 'prop-types';

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
StablePDFViewer.displayName = 'StablePDFViewer';

// Add prop types for StablePDFViewer component
StablePDFViewer.propTypes = {
  data: PropTypes.string,
  isPreview: PropTypes.bool
};

StablePDFViewer.defaultProps = {
  data: '',
  isPreview: false
};

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
DocumentViewerModal.displayName = 'DocumentViewerModal';

// Add prop types for DocumentViewerModal component
DocumentViewerModal.propTypes = {
  document: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string
};

DocumentViewerModal.defaultProps = {
  document: '',
  name: 'Document Viewer'
};

const Records = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [bloodTypeAnchorEl, setBloodTypeAnchorEl] = useState(null);
  const [selectedBloodType, setSelectedBloodType] = useState('all');
  const [records, setRecords] = useState([]);
  const [originalRecords, setOriginalRecords] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(20);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState(null);
  const [personDetails, setPersonDetails] = useState(null);
  const [documents, setDocuments] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isDocumentExpanded, setIsDocumentExpanded] = useState(false);
  const [history, setHistory] = useState(null);
  const [nameSort, setNameSort] = useState('az');
  const [dateSort, setDateSort] = useState('newest');
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState(null);
  const [editingField, setEditingField] = useState(null); // Keep only this one
  const [editMode, setEditMode] = useState(false);
  const bloodTypes = ['all', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create sort parameter based on current sort states
      let sortBy;
      if (nameSort === 'az') sortBy = 'name_asc';
      else if (nameSort === 'za') sortBy = 'name_desc';
      else if (dateSort === 'newest') sortBy = 'date_desc';
      else if (dateSort === 'oldest') sortBy = 'date_asc';
      
      const data = await recordsApi.getRecords({
        search: searchQuery,
        sortBy,
        bloodType: selectedBloodType
      });
      
      setRecords(data);
    } catch (err) {
      console.error('Error fetching records:', err);
      setError(err.message || 'Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, nameSort, dateSort, selectedBloodType]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  useEffect(() => {
    if (selectedRecord) {
      const fetchPersonDetails = async () => {
        try {
          console.log('Fetching details for PID:', selectedRecord.PID); // Debug log
          const response = await axios.get(`http://localhost:5000/api/records/${selectedRecord.PID}`);
          console.log('Fetched person details:', response.data); // Debug log
          setPersonDetails({
            fName: response.data.fName || 'N/A',
            mName: response.data.mName || 'N/A',
            lName: response.data.lName || 'N/A',
            bloodType: response.data.bloodType || 'N/A',
            profession: response.data.profession || 'N/A',
            hobbies: response.data.hobbies || 'N/A'
          });
        } catch (error) {
          console.error('Error fetching person details:', error);
          setPersonDetails({
            fName: 'N/A',
            mName: 'N/A',
            lName: 'N/A',
            bloodType: 'N/A',
            profession: 'N/A',
            hobbies: 'N/A'
          });
        }
      };

      fetchPersonDetails();
    }
  }, [selectedRecord]);

  useEffect(() => {
  if (selectedRecord?.PID && activeTab === 0) {
    const fetchPersonDetails = async () => {
      try {
        console.log('Fetching details for PID:', selectedRecord.PID);
        const response = await axios.get(`http://localhost:5000/api/records/${selectedRecord.PID}`);
        const data = response.data;
        console.log('Database result:', data);

        // Ensure all fields are present
        setPersonDetails({
          fName: data.fName || '',
          mName: data.mName || '',
          lName: data.lName || '',
          bloodType: data.bloodType || '',
          profession: data.profession || '',
          hobbies: data.hobbies || ''
        });
      } catch (error) {
        console.error('Error fetching person details:', error);
        setPersonDetails(null);
      }
    };

    fetchPersonDetails();
  }
}, [selectedRecord?.PID, activeTab]);

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

const handleSearch = (value) => {
  const query = value.toLowerCase();
  setSearchQuery(value);
  setPage(0);
  
  if (query === '') {
    setRecords(originalRecords);
    return;
  }

  const filteredRecords = originalRecords.filter(record => {
    const fName = (record.fName || '').toLowerCase();
    const mName = (record.mName || '').toLowerCase();
    const lName = (record.lName || '').toLowerCase();
    const profession = (record.profession || '').toLowerCase();
    const hobbies = (record.hobbies || '').toLowerCase();

    const nameSearchStrings = [
      fName,
      `${fName}${mName}`,
      `${fName}${lName}`,
      `${fName}${mName}${lName}`,
      `${fName} ${mName}`,
      `${fName} ${lName}`,
      `${fName} ${mName} ${lName}`,
    ];

    const nameMatch = nameSearchStrings.some(str => str.includes(query));
    const professionMatch = profession.includes(query);
    const hobbiesMatch = hobbies.includes(query);
    const documentMatch = (
      (record.pdsID || '').toString().toLowerCase().includes(query) ||
      (record.salnID || '').toString().toLowerCase().includes(query)
    );
    const dateMatch = record.date ? 
      new Date(record.date).toLocaleDateString().toLowerCase().includes(query) : 
      false;

    const bloodTypeMatch = selectedBloodType === 'all' || record.bloodType === selectedBloodType;

    return (nameMatch || professionMatch || hobbiesMatch || documentMatch || dateMatch) && bloodTypeMatch;
  });

  setRecords(filteredRecords);
};

  const handleBloodTypeSelect = async (type) => {
    setSelectedBloodType(type);
    setBloodTypeAnchorEl(null);
    
    try {
      const response = await axios.get(`http://localhost:5000/api/records`, {
        params: {
          bloodType: type
        }
      });
      
      if (response.status === 200) {
        setRecords(response.data);
        setPage(0); // Reset to first page
      } else {
        throw new Error('Filter failed');
      }
    } catch (error) {
      console.error('Blood type filter error:', error);
    }
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

// In your records component where you handle "Add Document" click
const handleAddDocument = (record) => {
  console.log('Record data from database:', record); // Debug log
  
  // Get the data from personDetails if it exists, otherwise use record
  const dataToPass = {
    PID: record.PID,
    fName: record.fName || personDetails?.fName || '',
    mName: record.mName || personDetails?.mName || '',
    lName: record.lName || personDetails?.lName || '',
    bloodType: record.bloodType || personDetails?.bloodType || '',
    profession: record.profession || personDetails?.profession || '',
    hobbies: record.hobbies || personDetails?.hobbies || ''
  };

  console.log('Data being passed to scan:', dataToPass); // Debug log

  navigate('/scan', {
    state: {
      prefillData: dataToPass,
      isPrefilledDisabled: true
    }
  });
};

const handleEditClick = () => {
   setEditMode(true); 
  setEditedDetails({
    fName: personDetails.firstName || '',
    mName: personDetails.middleName || '',
    lName: personDetails.lastName || '',
    bloodType: personDetails.bloodType || '',
    profession: personDetails.profession || '',
    hobbies: personDetails.hobbies || ''
  });
};

const handleInputChange = (field) => (event) => {
  setEditedDetails({
    ...editedDetails,
    [field]: event.target.value
  });
};

const handleSave = async () => {
  try {
    const response = await axios.put(`http://localhost:5000/api/records/${selectedRecord.PID}`, editedDetails);
    
    if (response.status === 200) {
      // Update local state
      setPersonDetails({
        firstName: editedDetails.fName,
        middleName: editedDetails.mName,
        lastName: editedDetails.lName,
        bloodType: editedDetails.bloodType,
        profession: editedDetails.profession,
        hobbies: editedDetails.hobbies
      });
      
      // Refresh records list
      const updatedRecords = await axios.get('http://localhost:5000/api/records');
      setRecords(updatedRecords.data);
      setOriginalRecords(updatedRecords.data);
      
      setEditMode(false);
    }
  } catch (error) {
    console.error('Error updating details:', error);
  }
};

// Add this handler near your other handlers
const handleCancel = () => {
  setIsEditing(false);
  setEditedDetails(null);
};

// Add these handlers
const handleFieldEdit = (field) => {
  setEditingField(field);
  setEditedDetails({
    ...personDetails
  });
};

const handleFieldSave = async (field) => {
  try {
    const updatedDetails = {
      ...personDetails,
      [field]: editedDetails[field]
    };
    await axios.put(`http://localhost:5000/api/records/${selectedRecord.PID}`, updatedDetails);
    setPersonDetails(updatedDetails);
    setEditingField(null);

    // Add to history
    const historyEntry = {
      activity: `Updated ${field}`,
      date: new Date().toISOString()
    };
    await axios.post(`http://localhost:5000/api/records/${selectedRecord.PID}/history`, historyEntry);
  } catch (error) {
    console.error('Error updating field:', error);
  }
};

const handleFieldCancel = () => {
  setEditingField(null);
};

// Update the tab change handler
const handleTabChange = (event, newValue) => {
  // If there's an active edit, cancel it
  if (editingField) {
    setEditingField(null);
    setEditedDetails(null);
  }
  setActiveTab(newValue);
};

const handleUpdatePerson = async (updatedDetails) => {
  try {
    console.log('Sending update request:', updatedDetails); // Debug log

    const response = await axios.put(
      `http://localhost:5000/api/records/${selectedRecord.PID}`,
      updatedDetails,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Update response:', response.data); // Debug log

    if (response.data.success) {
      setPersonDetails(response.data.data);
      fetchRecords(); // Refresh the list
      return true;
    }
    
    console.error('Update failed:', response.data.message);
    return false;
  } catch (error) {
    console.error('Error updating person:', error);
    return false;
  }
};

const handleNameSort = useCallback((newSort) => {
  setNameSort(newSort);
  setDateSort(null); // Reset date sort when sorting by name
}, []);

const handleDateSort = useCallback((newSort) => {
  setDateSort(newSort);
  setNameSort(null); // Reset name sort when sorting by date
}, []);

// Add this function to handle edit document
const handleEditDocument = (record, documentType) => {
  console.log('Editing document:', { record, documentType });
  
  const dataToPass = {
    PID: record.PID,
    fName: record.fName || personDetails?.fName || '',
    mName: record.mName || personDetails?.mName || '',
    lName: record.lName || personDetails?.lName || '',
    bloodType: record.bloodType || personDetails?.bloodType || '',
    profession: record.profession || personDetails?.profession || '',
    hobbies: record.hobbies || personDetails?.hobbies || '',
    documentType: documentType // Pass the document type
  };

  console.log('Data being passed to scan:', dataToPass);

  navigate('/scan', {
    state: {
      prefillData: dataToPass,
      isPrefilledDisabled: true,
      fixedDocumentType: documentType // Add this to fix document type
    }
  });
};

// Add these handlers
const handleDeleteClick = (e, docType) => {
  e.stopPropagation();
  setDocumentToDelete(docType);
  setDeleteConfirmOpen(true);
};

const handleDeleteConfirm = async () => {
  if (!selectedRecord?.PID || !documentToDelete) return;

  try {
    setError(null);

    const response = await axios.delete(
      `http://localhost:5000/api/records/${selectedRecord.PID}/documents/${documentToDelete.toLowerCase()}`
    );

    if (response.data.success) {
      // Add to history with status instead of activity
      await axios.post(
        `http://localhost:5000/api/records/${selectedRecord.PID}/history`,
        {
          status: `Deleted ${documentToDelete} document`
        }
      );

      // Close dialog and refresh UI
      setDeleteConfirmOpen(false);
      setDocumentToDelete(null);
      setError(null);
      
      // Refresh documents and records
      await fetchDocuments(selectedRecord.PID);
      await fetchRecords();
    }
  } catch (error) {
    console.error('Error deleting document:', error);
    setError(
      error.response?.data?.message || 
      'Failed to delete document. Please try again.'
    );
  }
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
            opacity: 1,
            zIndex: -1,
          }
        }}
      >
        <WindowControl />
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
                <RecordFilters
        nameSort={nameSort}
        dateSort={dateSort}
        selectedBloodType={selectedBloodType}
        searchQuery={searchQuery}
        onNameSortChange={handleNameSort}
        onDateSortChange={handleDateSort}
        onBloodTypeSelect={handleBloodTypeSelect}
        onSearchChange={handleSearch}
        bloodTypes={bloodTypes}
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
              record.pdsID && `PDS`,
              record.salnID && `SALN`
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
              <Pagination 
  page={page}
  totalPages={Math.ceil(records.length / rowsPerPage)}
  onPageChange={setPage}
/>

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
      onChange={handleTabChange}
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
  <PersonalDetails
    personDetails={personDetails}
    onUpdate={handleUpdatePerson}
  />
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
                backgroundColor: 'rgba(27, 27, 27, 0.95)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: 'white',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 500
                  }}
                >
                  Personal Data Sheet
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDocument(selectedRecord, 'PDS');
                    }}
                    size="small"
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={(e) => handleDeleteClick(e, 'PDS')}
                    size="small"
                    sx={{
                      color: '#ff4444',
                      '&:hover': { backgroundColor: 'rgba(255, 68, 68, 0.1)' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer'
                }}
                onClick={() => handleDocumentClick(documents.pds.data)}
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
                  backgroundColor: 'rgba(27, 27, 27, 0.95)',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 2
              }}>
                <Typography 
                  variant="subtitle1" 
                  sx={{
                    color: 'white',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontWeight: 500
                  }}
                >
                  Statement of Assets, Liabilities and Net Worth
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditDocument(selectedRecord, 'SALN');
                    }}
                    size="small"
                    sx={{
                      color: 'white',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)'
                      }
                    }}
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    onClick={(e) => handleDeleteClick(e, 'SALN')}
                    size="small"
                    sx={{
                      color: '#ff4444',
                      '&:hover': { backgroundColor: 'rgba(255, 68, 68, 0.1)' }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
              <Box 
                sx={{ 
                  flex: 1,
                  overflow: 'hidden',
                  position: 'relative',
                  backgroundColor: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  cursor: 'pointer'
                }}
                onClick={() => handleDocumentClick(documents.saln.data)}
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
                backgroundColor: 'rgb(231, 231, 231)'
              },
              position: 'relative',
              overflow: 'hidden'
            }}
            onClick={() => handleAddDocument(selectedRecord)}
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
            </Typography>
            <Box 
              sx={{ 
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#fff',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2
                }}
              >
                <Box
                  sx={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(25, 118, 210, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AddIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                </Box>
                <Typography sx={{ color: 'text.secondary' }}>
                  Add New Document
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {(!documents.pds && !documents.saln) && (
          <Grid item xs={12}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              p: 4 
            }}>  
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

<Dialog
  open={deleteConfirmOpen}
  onClose={() => setDeleteConfirmOpen(false)}
  PaperProps={{
    sx: {
      borderRadius: 2,
      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    }
  }}
>
  <DialogTitle>Confirm Delete</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Are you sure you want to delete this {documentToDelete} document? 
      This action cannot be undone.
    </DialogContentText>
    {error && (
      <Box sx={{ mt: 2, color: 'error.main' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions sx={{ p: 2 }}>
    <Button
      onClick={() => {
        setDeleteConfirmOpen(false);
        setError(null);
      }}
      sx={{ color: 'text.secondary' }}
    >
      Cancel
    </Button>
    <Button
      onClick={handleDeleteConfirm}
      variant="contained"
      color="error"
      sx={{ borderRadius: 1 }}
    >
      Delete
    </Button>
  </DialogActions>
</Dialog>

</Box>
          </Container>
        </Box>
              
        {/* Footer */}
        <Footer currentTime={currentTime} />
      </Box>
    </ThemeProvider>
  );
};
Records.displayName = 'Records';

export default Records;