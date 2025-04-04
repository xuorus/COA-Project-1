import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, OutlinedInput, Paper } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
import PrintIcon from '@mui/icons-material/Print';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import backgroundImage from '../assets/bldg.jpg';
import Sidebar from '../components/sidebar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Header from '../components/header';
import Footer from '../components/footer';
import { Modal, Fade } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { keyframes } from '@mui/material/styles';
import WindowControl from '../components/WindowControl';
import axios from 'axios';
import CircularProgress from '@mui/material/CircularProgress';
import ScanIcon from '@mui/icons-material/DocumentScanner';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
  
// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const checkmarkAnimation = keyframes`
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 500,
      fontFamily: 'Roboto',
    },
    h6: {
      fontWeight: 500,
      fontFamily: 'Roboto',
    },
    body2: {
      fontFamily: 'Roboto',
    },
    // Add these for form components
    allVariants: {
      fontFamily: 'Roboto',
    }
  },
  components: {
    MuiInputBase: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontFamily: 'Roboto',
        },
      },
    },
  },
});

const Main = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillData = location.state?.prefillData;
  
  // Add this state declaration
  const [isPrefilledDisabled, setIsPrefilledDisabled] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documentType, setDocumentType] = useState(() => {
    // If fixedDocumentType is provided in location state, use it
    return location.state?.fixedDocumentType || '';
  });
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const fileInputRef = useRef(null);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scannedDocument, setScannedDocument] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const [savedDocuments, setSavedDocuments] = useState([]);
  const [scanningStatus, setScanningStatus] = useState(''); 

  // Initialize form state with empty strings instead of undefined
  const [formValues, setFormValues] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    bloodType: '',
    profession: '',
    hobbies: ''
  });

  const bloodTypes = ['Unknown', 'A', 'A+', 'A-', 'B', 'B+', 'B-', 'AB', 'AB+', 'AB-', 'O', 'O+', 'O-'];

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    profession: false, // Add this if required
    hobbies: false // Add this if required
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDocumentTypeChange = (event) => {
    setDocumentType(event.target.value);
  };

const handleFileUpload = (file) => {
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        return;
    }

    try {
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
            setScannedDocument({
                id: Date.now(),
                type: documentType,
                scanDate: new Date().toISOString(),
                fileName: file.name
            });
        };
        reader.readAsDataURL(file);
    } catch (error) {
        console.error('File processing error:', error);
        setError('Failed to process PDF file');
    }
};

const handleScanButtonClick = () => {
  if (!documentType) {
      setError('Please select a document type');
      return;
  }
  fileInputRef.current?.click();
};

const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
};

const handleDragLeave = () => {
    setIsDragging(false);
};

const handleDrop = (e) => {
  e.preventDefault();
  setIsDragging(false);
  
  const file = e.dataTransfer.files[0];
  if (file) {
      setError(null); // Clear any existing error
      handleFileUpload(file);
  }
};

const handleSubmit = async (event) => {
  try {
    event.preventDefault();
    setIsLoading(true);
    let response;

    // Create FormData
    const formData = new FormData();

    // Collect documents
    const allDocuments = [...savedDocuments];
    if (previewUrl && documentType) {
      allDocuments.push({
        type: documentType,
        preview: previewUrl,
        file: pdfFile
      });
    }

    // Check if we have any documents
    if (allDocuments.length === 0) {
      setError('Please add at least one document');
      return;
    }

    // Handle update document case
    if (location.state?.prefillData?.PID && location.state.fixedDocumentType) {
      // For updating specific document type, use only the current document
      const pdfBlob = await fetch(previewUrl).then(res => res.blob());
      formData.append('file', pdfBlob);
      
      response = await axios.patch(
        `http://localhost:5000/api/scan/person/${location.state.prefillData.PID}/documents`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          params: { documentType: location.state.fixedDocumentType }
        }
      );
    } 
    // Handle add document to existing person case
    else if (location.state?.selectedRecord?.PID) {
      // For adding single document to existing person
      const pdfBlob = await fetch(previewUrl).then(res => res.blob());
      formData.append('file', pdfBlob);
      formData.append('documentType', documentType);

      response = await axios.patch(
        `http://localhost:5000/api/scan/person/${location.state.selectedRecord.PID}/document`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    } 
    // Handle new person with multiple documents case
    else if (location.state?.from === 'sidebar') {
      // Add all documents and their types
      formData.append('documentTypes', JSON.stringify(allDocuments.map(doc => doc.type)));

      // Add all files
      for (const doc of allDocuments) {
        const pdfBlob = await fetch(doc.preview).then(res => res.blob());
        formData.append('files', pdfBlob);
      }

      // Add person data
      formData.append('formData', JSON.stringify({
        firstName: formValues.firstName.trim(),
        middleName: formValues.middleName?.trim() || null,
        lastName: formValues.lastName.trim(),
        bloodType: formValues.bloodType === 'Unknown' ? null : formValues.bloodType || null,
        profession: formValues.profession?.trim() || null,
        hobbies: formValues.hobbies?.trim() || null
      }));

      response = await axios.post(
        'http://localhost:5000/api/scan/submit-multiple',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
    }

    if (response?.data?.success) {
      setSuccessModalOpen(true);
      setTimeout(() => navigate('/records'), 2000);
    }

  } catch (error) {
    console.error('Submit error:', error);
    setError(error.response?.data?.message || 'Failed to process request');
  } finally {
    setIsLoading(false);
  }
};

  // Update the useEffect for prefillData to check source
  useEffect(() => {
    if (location.state?.from === 'sidebar') {
      // Reset form if coming from sidebar
      setFormValues({
        firstName: '',
        middleName: '',
        lastName: '',
        bloodType: '',
        profession: '',
        hobbies: ''
      });
      setIsPrefilledDisabled(false);
    } else if (location.state?.prefillData) {
      const prefillData = location.state.prefillData;
      console.log('Setting prefilled data:', prefillData);
      
      setFormValues({
        firstName: prefillData.fName || '',
        middleName: prefillData.mName || '',
        lastName: prefillData.lName || '',
        bloodType: prefillData.bloodType || '',
        profession: prefillData.profession || '',
        hobbies: prefillData.hobbies || ''
      });

      // Set disabled state based on location state
      setIsPrefilledDisabled(location.state.isPrefilledDisabled || false);
    }
  }, [location.state]);

  // Add useEffect to update the time
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(timer);
  }, []);

// Add preview functionality
const PreviewDocument = ({ docId }) => {
    const [pdfUrl, setPdfUrl] = useState(null);

    useEffect(() => {
        if (docId) {
            setPdfUrl(`http://localhost:5000/api/scan/document/${docId}`);
        }
    }, [docId]);

    if (!pdfUrl) return null;

    return (
        <iframe
            src={pdfUrl}
            width="100%"
            height="600px"
            title="Document Preview"
        />
    );
};
  useEffect(() => {
    // Cleanup PDF URL when component unmounts or when PDF changes
    return () => {
        if (pdfFile && pdfFile.startsWith('blob:')) {
            URL.revokeObjectURL(pdfFile);
        }
    };
  }, [pdfFile]);

  // Update the useEffect for prefillData
useEffect(() => {
    if (location.state?.prefillData) {
        const prefillData = location.state.prefillData;
        console.log('Setting prefilled data:', prefillData);
        
        setFormValues({
            firstName: prefillData.fName || '',
            middleName: prefillData.mName || '',
            lastName: prefillData.lName || '',
            bloodType: prefillData.bloodType || '',
            profession: prefillData.profession || '',
            hobbies: prefillData.hobbies || ''
        });

        // Also set isPrefilledDisabled from location state
        setIsPrefilledDisabled(location.state.isPrefilledDisabled || false);
    }
}, [location.state]);

// Update the handleAddDocument function
const handleAddDocument = () => {
  if (previewUrl && documentType) {
    // Create blob URL for the PDF file
    const pdfBlob = pdfFile instanceof Blob ? pdfFile : new Blob([pdfFile], { type: 'application/pdf' });
    const blobUrl = URL.createObjectURL(pdfBlob);

    setSavedDocuments(prev => [...prev, {
      id: Date.now(),
      type: documentType,
      preview: previewUrl,
      file: blobUrl
    }]);

    // Reset states after adding document
    setDocumentType('');
    setPreviewUrl(null);
    setPdfFile(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }
};

// Add cleanup for blob URLs
useEffect(() => {
  // Cleanup function to revoke blob URLs when component unmounts
  return () => {
    savedDocuments.forEach(doc => {
      if (doc.file && doc.file.startsWith('blob:')) {
        URL.revokeObjectURL(doc.file);
      }
      if (doc.preview && doc.preview.startsWith('blob:')) {
        URL.revokeObjectURL(doc.preview);
      }
    });
  };
}, [savedDocuments]);

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

        {/* Add Sidebar Component */}
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
            bottom: '40px', // Match footer height
            padding: 2, // Reduced padding
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
          }}
        >
          <Container 
            maxWidth="lg" 
            sx={{ 
              height: '100%' // Make container take full height
            }}
          >
            <Box 
              sx={{ 
                background: 'rgb(255, 255, 255, 0.7)',
                backdropFilter: 'blur(3px)',
                borderRadius: 2,
                padding: 2,
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 2,
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.7)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%',
                overflow: 'hidden'
              }}
            >
              {/* Left Column - Scanning Controls */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, height: '90%', mt: 4, ml: 2 }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Scan Document
                </Typography>

                {/* Document Type and Add Button */}
                <Box sx={{ 
  display: 'flex', 
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  width: '300px', // Fixed width container
  margin: '0 auto' // Center the container
}}>
  <FormControl 
    sx={{ 
      width: '100%' // Take full width of container
    }}
  >
    <InputLabel id="document-type-label">Document Type</InputLabel>
    <Select
      labelId="document-type-label"
      id="document-type"
      value={documentType}
      label="Document Type"
      onChange={handleDocumentTypeChange}
      required
      disabled={location.state?.fixedDocumentType}
      sx={{
    borderRadius: '15px',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  }}
      MenuProps={{
        PaperProps: {
          sx: {
            maxHeight: 300,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
            '& .MuiMenuItem-root': {
              padding: '8px 16px',
              '&:hover': {
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                }
              }
            }
          }
        }
      }}
    >
      <MenuItem value="PDS">Personal Data Sheet</MenuItem>
      <MenuItem value="SALN">Statement of Assets, Liabilities and Net Worth</MenuItem>
      <MenuItem value="NOSA">Notices of Salary Adjustments/Step Increments</MenuItem>
      <MenuItem value="SR">Service Records</MenuItem>
      <MenuItem value="CA">Certificate of Appoinments</MenuItem>
      <MenuItem value="DO">Assignments/Designation Orders</MenuItem>
      <MenuItem value="NOA">Notice of Assumption</MenuItem>
      <MenuItem value="SAT">Seminars and Trainings</MenuItem>
      <MenuItem value="COE">Certificate of Eligibilities/Licenses</MenuItem>
      <MenuItem value="TOR">School Diplomas and Transcript of Records</MenuItem>
      <MenuItem value="MC">Marriage Contract/Certificate</MenuItem>
      <MenuItem value="med_cert">Medical Certificate</MenuItem>
      <MenuItem value="NBI">NBI Clearance</MenuItem>
      <MenuItem value="CCAA">Commendations, Cert of Achievement, Awards, etc.</MenuItem>
      <MenuItem value="DAD">Disciplinary Action Documents</MenuItem>
    </Select>
  </FormControl>

  {previewUrl && (
    <IconButton
      onClick={handleAddDocument}
      sx={{
        position: 'absolute',
        right: '-45px', // Position button to the right of dropdown
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        '&:hover': {
          backgroundColor: 'rgba(25, 118, 210, 0.2)'
        },
        width: '40px',
        height: '40px'
      }}
    >
      <AddIcon />
    </IconButton>
  )}
</Box>

                {/* Saved Documents List */}
                {savedDocuments.length > 0 && (
  <Box
    sx={{
      position: 'absolute',
      left: '24px',
      top: '120px',
      width: '100px',
      maxHeight: 'calc(100vh - 360px)', // Maximum height
      minHeight: '200px', // Minimum height to show scrollbar
      display: 'flex',
      flexDirection: 'column',
      gap: 2, // Increased gap between items
      overflowY: 'auto',
      overflowX: 'hidden',
      '&::-webkit-scrollbar': {
        width: '8px', // Increased width
        backgroundColor: 'rgba(255, 255, 255, 0.1)', // Added background color
      },
      '&::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.1)',
        borderRadius: '8px',
        margin: '4px', // Added margin
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'rgba(0, 0, 0, 0.5)', // Darker color
        borderRadius: '8px',
        border: '4px solid transparent', // Added border
        backgroundClip: 'padding-box', // Makes the thumb more rounded
        '&:hover': {
          background: 'rgba(95, 89, 89, 0.7)',
        },
      },
      padding: '8px', // Increased padding
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '8px',
      height: 'auto', // Let height adjust based on content
    }}
  >
    {savedDocuments.map((doc) => (
      <Paper
        key={doc.id}
        elevation={3}
        sx={{
          width: '85px',
          height: '110px',
          flex: '0 0 auto', // Prevent shrinking
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          borderRadius: 2,
          overflow: 'hidden',
          mb: 1 // Add margin bottom for spacing
        }}
      >
        <Box sx={{ 
          p: 0.5, 
          backgroundColor: 'rgba(25, 118, 210, 0.08)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
        }}>
          <Typography variant="caption" noWrap>
            {doc.type}
          </Typography>
        </Box>
        <Box sx={{ flex: 1 }}>
          <iframe
            src={doc.preview}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              pointerEvents: 'none'
            }}
            title={`Saved document ${doc.id}`}
          />
        </Box>
        <IconButton
          size="small"
          onClick={() => {
            // Revoke blob URL when removing document
            if (doc.file && doc.file.startsWith('blob:')) {
              URL.revokeObjectURL(doc.file);
            }
            if (doc.preview && doc.preview.startsWith('blob:')) {
              URL.revokeObjectURL(doc.preview);
            }
            setSavedDocuments(prev => prev.filter(d => d.id !== doc.id));
          }}
          sx={{
            position: 'absolute',
            top: 2,
            right: 2,
            padding: '2px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.9)'
            }
          }}
        >
          <CloseIcon sx={{ fontSize: '0.8rem' }} />
        </IconButton>
      </Paper>
    ))}
  </Box>
)}

                {/* Main Preview Box */}
                <Box
                  id="dwtcontrolContainer"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{
                      width: '100%',
                      flex: 1,
                      maxWidth: '300px',
                      aspectRatio: '1 / 1.4142',
                      margin: '0 auto',
                      border: `2px dashed ${isDragging ? '#1976d2' : 'rgba(0, 0, 0, 0.2)'}`,
                      borderRadius: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isDragging ? 'rgba(25, 118, 210, 0.08)' : 'rgba(255, 255, 255, 0.95)',
                      overflow: 'hidden',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                      position: 'relative',
                      transition: 'all 0.2s ease'
                  }}
              >
                  <input
                      type="file"
                      ref={fileInputRef}
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={(e) => handleFileUpload(e.target.files[0])}
                  />
                  
                  {isLoading ? (
                      <Box sx={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          alignItems: 'center',
                          gap: 2 
                      }}>
                          <CircularProgress />
                          <Typography>Processing...</Typography>
                      </Box>
                  ) : (
                      <>
                          {error ? (
                              <Box sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  alignItems: 'center',
                                  gap: 2,
                                  p: 2,
                                  textAlign: 'center'
                              }}>
                                  <Typography color="error">{error}</Typography>
                                  <IconButton
                                      color="primary"
                                      onClick={handleScanButtonClick}
                                      sx={{ 
                                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                          '&:hover': {
                                              backgroundColor: 'rgba(25, 118, 210, 0.2)'
                                          }
                                      }}
                                  >
                                      <ScanIcon sx={{ fontSize: 40 }} />
                                  </IconButton>
                              </Box>
                          ) : previewUrl ? (
                              <Box 
                                  sx={{ 
                                      position: 'relative', 
                                      width: '100%', 
                                      height: '100%',
                                      cursor: 'pointer',
                                      '&:hover .fullscreen-overlay': {
                                          opacity: 1
                                      }
                                  }}
                                  onClick={() => setFullPreview(true)}
                              >
                                  {/* Fullscreen overlay */}
                                  <Box 
                                      className="fullscreen-overlay"
                                      sx={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          right: 0,
                                          bottom: 0,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          backgroundColor: 'rgba(0, 0, 0, 0.3)',
                                          opacity: 0,
                                          transition: 'opacity 0.2s ease-in-out',
                                          zIndex: 1
                                      }}
                                  >
                                      <FullscreenIcon 
                                          sx={{ 
                                              fontSize: 48,
                                              color: 'white',
                                              transition: 'transform 0.2s ease-in-out',
                                              '&:hover': {
                                                  transform: 'scale(1.1)'
                                              }
                                          }} 
                                      />
                                  </Box>
                                  <iframe
                                      src={previewUrl}
                                      style={{
                                          width: '100%',
                                          height: '100%',
                                          border: 'none',
                                          pointerEvents: 'none' // Prevent iframe from capturing clicks
                                      }}
                                      title="Document Preview"
                                  />
                              </Box>
                          ) : (
                              <Box sx={{ 
                                  display: 'flex', 
                                  flexDirection: 'column', 
                                  alignItems: 'center',
                                  gap: 2,
                                  p: 2,
                                  textAlign: 'center'
                              }}>
                                  <Typography>
                                      {isDragging ? 'Drop PDF here' : 'Click to browse or drag PDF here'}
                                  </Typography>
                                  <IconButton
                                      color="primary"
                                      onClick={handleScanButtonClick}
                                      disabled={isLoading || !documentType}
                                      sx={{ 
                                          backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                          '&:hover': {
                                              backgroundColor: 'rgba(25, 118, 210, 0.2)'
                                          }
                                      }}
                                  >
                                      <ScanIcon sx={{ fontSize: 40 }} />
                                  </IconButton>
                              </Box>
                          )}
                      </>
                  )}
              </Box>

              </Box>

              {/* Right Column - Information Fields */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', mt: 4}}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0, ml: 4 }}>
                  {[
                    { label: 'First Name', required: true, field: 'firstName' },
                    { label: 'Middle Name', required: false, field: 'middleName' },
                    { label: 'Last Name', required: true, field: 'lastName' },
                    { 
                      label: 'Blood Type', 
                      required: false,
                      field: 'bloodType',
                      type: 'select',
                      options: bloodTypes
                    },
                    { label: 'Profession', required: false, field: 'profession' }, // Changed from true to false
                    { label: 'Hobbies', required: false, field: 'hobbies' } // Changed from true to false
                  ].map((field) => (
                    <Box 
                      key={field.label}
                      sx={{ 
                        position: 'relative',  // Add position relative to contain error message
                        mb: 2  // Add margin bottom for spacing
                      }}
                    >
                      <FormControl
                        fullWidth
                        required={field.required}
                        error={formErrors[field.field]}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            width: '65%',
                            borderRadius: '15px',
                            backgroundColor: 'rgba(255, 255, 255, 0.7)',
                            fontFamily: 'Roboto',
                            height: '45px',
                            '& fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.23)',
                            },
                            '&:hover fieldset': {
                              borderColor: 'rgba(0, 0, 0, 0.5)',
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: '#1976d2',
                            },
                            '&.Mui-error fieldset': {
                              borderColor: '#d32f2f',
                            },
                            '&.Mui-error.Mui-focused fieldset': {
                              borderColor: '#d32f2f',
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(0, 0, 0, 0.6)',
                            fontFamily: 'Roboto',
                            transform: 'translate(14px, 12px) scale(1)',
                            '&.Mui-focused, &.MuiFormLabel-filled': {
                              transform: 'translate(14px, -9px) scale(0.75)',
                            },
                            '&.Mui-focused': {
                              color: '#1976d2',
                            },
                            '&.Mui-error': {
                              color: '#d32f2f',
                            }
                          }
                        }}
                      >
                        {field.type === 'select' ? (
                          <>
                            <InputLabel>{field.label}</InputLabel>
                            <Select
                              value={formValues[field.field]}
                              label={field.label}
                              onChange={handleInputChange}
                              name={field.field}
                              disabled={isPrefilledDisabled}
                              sx={{
                                width: '65%',
                                height: '45px',
                                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                borderRadius: '15px',
                                '& .MuiSelect-select': {
                                  padding: '0 14px',  // Add left padding
                                  height: '45px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'flex-start',  // Align content to the left
                                  textAlign: 'left',  // Text align left
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderRadius: '15px',
                                  borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(0, 0, 0, 0.5)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#1976d2',
                                },
                                '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#d32f2f',
                                }
                              }}
                              MenuProps={{
                                PaperProps: {
                                  sx: {
                                    maxHeight: 300, 
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                                    '& .MuiMenuItem-root': {
                                      padding: '8px 16px',
                                      '&:hover': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                      },
                                      '&.Mui-selected': {
                                        backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                        '&:hover': {
                                          backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                        }
                                      }
                                    }
                                  }
                                }
                              }}
                            >
                              {field.options.map((option) => (
                                <MenuItem key={option} value={option}>
                                  {option}
                                </MenuItem>
                              ))}
                            </Select>
                          </>
                        ) : (
                          <>
                            <InputLabel error={formErrors[field.field]}>{field.label}</InputLabel>
                            <OutlinedInput
                              label={field.label}
                              required={field.required}
                              value={formValues[field.field]}
                              onChange={handleInputChange}
                              name={field.field}
                              error={formErrors[field.field]}
                              onBlur={() => {
                                if (field.required) {
                                  setFormErrors(prev => ({
                                    ...prev,
                                    [field.field]: formValues[field.field].trim() === ''
                                  }));
                                }
                              }}
                              disabled={isPrefilledDisabled}
                              sx={{
                                width: '65%',
                                '& .MuiOutlinedInput-input': {
                                  height: '45px',
                                  padding: '0 14px',  // Add horizontal padding
                                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                  borderRadius: '15px',
                                  display: 'flex',
                                  alignItems: 'center', // Center vertically
                                  lineHeight: '45px', // Match height for vertical centering
                                  textAlign: 'left', // Center horizontally
                                },
                                '& input': {  // Add this block
                                  textAlign: 'left',
                                  width: '100%',
                                  padding: '0 14px',  // Add padding to input
                                },
                                '& .MuiOutlinedInput-notchedOutline': {
                                  borderRadius: '15px',
                                  borderColor: 'rgba(0, 0, 0, 0.23)',
                                },
                                '&:hover .MuiOutlinedInput-notchedOutline': {
                                  borderColor: 'rgba(0, 0, 0, 0.5)',
                                },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#1976d2',
                                },
                                '&.Mui-error .MuiOutlinedInput-notchedOutline': {
                                  borderColor: '#d32f2f',
                                }
                              }}
                            />
                          </>
                        )}
                      </FormControl>
                    </Box>
                  ))}
                </Box>

                <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSubmit}
                            disabled={!formValues.firstName || !formValues.lastName} // Only check required fields
                            disableRipple
                            sx={{
                              alignSelf: 'center',
                              mr: 15,
                              borderRadius: '10px',
                              width: '30%',
                              textTransform: 'none',
                              '&:focus': {
                                outline: 'none',
                              },
                              '&.Mui-focusVisible': {
                                outline: 'none',
                              },
                              '&.Mui-disabled': {
                                backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                color: 'rgba(0, 0, 0, 0.26)'
                              }
                            }}
                          >
                            Submit
                          </Button>
                                </Box>
                              </Box>
                            </Container>
                          </Box>
                          {/* Footer Box */}
                          <Footer currentTime={currentTime} />
                          </Box>
                        <Modal
                    open={successModalOpen}
                    onClose={() => setSuccessModalOpen(false)}
                    closeAfterTransition
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Fade in={successModalOpen}>
                      <Box
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          backdropFilter: 'blur(8px)',
                          borderRadius: 2,
                          padding: 4,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 2,
                          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          minWidth: '300px'
                        }}
                      >
                      <CheckCircleOutlineIcon 
                    sx={{ 
                      fontSize: 60, 
                      color: '#4caf50',
                      animation: `${checkmarkAnimation} 1s ease-out`,
                      // Optional bounce effect when hovering
                      '&:hover': {
                        transform: 'scale(1.1)',
                        transition: 'transform 0.2s ease-in-out'
                      }
                    }} 
                  />
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            textAlign: 'center',
                            fontWeight: 'bold'
                          }}
                        >
                          File Submitted Successfully!
                        </Typography>
                      </Box>
                    </Fade>
                  </Modal>
                  <Modal
    open={fullPreview}
    onClose={() => setFullPreview(false)}
    closeAfterTransition
    sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        '& .MuiBackdrop-root': {
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
        }
    }}
>
    <Fade in={fullPreview}>
        <Box
            sx={{
                position: 'relative',
                width: '90vw',
                height: '90vh',
                backgroundColor: 'white',
                borderRadius: 1,
                overflow: 'hidden',
                boxShadow: 24,
            }}
        >
            <IconButton
                onClick={() => setFullPreview(false)}
                sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    zIndex: 1,
                    '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    }
                }}
            >
                <CloseIcon />
            </IconButton>
            <iframe
                src={previewUrl}
                style={{
                    width: '100%',
                    height: '100%',
                    border: 'none',
                }}
                title="Full Document Preview"
            />
        </Box>
    </Fade>
</Modal>
                      </ThemeProvider>
                    );
                  };

export default Main;