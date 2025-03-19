import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, OutlinedInput } from '@mui/material';
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
import CircularProgress from '@mui/material/CircularProgress';
import ScanIcon from '@mui/icons-material/DocumentScanner';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';

import axios from 'axios';
  
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

  // Initialize form state with empty strings instead of undefined
  const [formValues, setFormValues] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    bloodType: '',
    profession: '',
    hobbies: ''
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

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
    handleFileUpload(file);
};

const handleSubmit = async (event) => {
    try {
        event.preventDefault();
        const { state } = location;
        console.log('Location state:', state);

        if (!previewUrl || !documentType) {
            setError('Please scan a document first');
            return;
        }

        // Check if trying to add a document type that already exists
        if (state?.selectedRecord?.existingDocuments?.includes(documentType)) {
            setError(`This person already has a ${documentType} document`);
            return;
        }

        setIsLoading(true);

        // Create FormData
        const formData = new FormData();
        const pdfBlob = await fetch(previewUrl).then(res => res.blob());
        formData.append('file', pdfBlob, 'document.pdf');
        formData.append('documentType', documentType);

        let response;

        if (state?.selectedRecord?.PID) {
            // Adding document to existing person
            console.log('Adding document to person:', state.selectedRecord.PID);
            
            response = await axios.patch(
                `http://localhost:5000/api/scan/person/${state.selectedRecord.PID}/documents`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
        } else {
            // Creating new person with document
            console.log('Creating new person with document');

            // Validate required fields for new person
            const requiredFields = ['firstName', 'lastName', 'bloodType', 'profession'];
            const missingFields = requiredFields.filter(field => !formValues[field]);

            if (missingFields.length > 0) {
                setError(`Please fill in required fields: ${missingFields.join(', ')}`);
                return;
            }

            // Add form data for new person
            formData.append('formData', JSON.stringify({
                firstName: formValues.firstName.trim(),
                middleName: formValues.middleName?.trim() || null,
                lastName: formValues.lastName.trim(),
                bloodType: formValues.bloodType,
                profession: formValues.profession?.trim(),
                hobbies: formValues.hobbies?.trim() || null
            }));

            response = await axios.post(
                'http://localhost:5000/api/scan/submit',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
        }

        if (response?.data?.success) {
            setSuccessModalOpen(true);
            setFormValues({
                firstName: '',
                middleName: '',
                lastName: '',
                bloodType: '',
                profession: '',
                hobbies: ''
            });
            setPreviewUrl(null);
            setDocumentType('');
            setTimeout(() => navigate('/records'), 2000);
        }

    } catch (error) {
        console.error('Submit error:', error);
        setError(error.response?.data?.message || 'Failed to submit document');
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

//   const handleScanButtonClick = async () => {
//     try {
//         if (!documentType) {
//             alert('Please select a document type');
//             return;
//         }

//         setIsLoading(true);
//         console.log('Starting scan...', { documentType });
        
//         const response = await fetch('http://localhost:5000/api/scan/start-scan', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify({ documentType })
//         });

//         const data = await response.json();
//         console.log('Scan response:', data); // Add this log
        
//         if (!response.ok) {
//             throw new Error(data.message || `HTTP error! status: ${response.status}`);
//         }

//         if (data.success && data.output) {
//             try {
//                 console.log('Processing scan output...');
//                 const binaryString = window.atob(data.output);
//                 const bytes = new Uint8Array(binaryString.length);
//                 for (let i = 0; i < binaryString.length; i++) {
//                     bytes[i] = binaryString.charCodeAt(i);
//                 }
//                 const blob = new Blob([bytes], { type: 'application/pdf' });
//                 const pdfUrl = URL.createObjectURL(blob);
                
//                 console.log('PDF URL created:', pdfUrl);
//                 setPdfFile(pdfUrl);
//             } catch (error) {
//                 console.error('Error processing PDF data:', error);
//                 throw new Error('Failed to process scanned document');
//             }
//         } else {
//             throw new Error(data.message || 'Scan failed');
//         }
//     } catch (error) {
//         console.error('Scan error:', error);
//         alert(`Scanning failed: ${error.message}`);
//     } finally {
//         setIsLoading(false);
//     }
// };

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

                {/* Document Type Dropdown - Centered */}
                <FormControl 
                  sx={{ 
                    width: '300px', // Match the width of the scan box
                    alignSelf: 'center', // Center horizontally
                    mb: 1, // Add margin bottom for spacing
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '15px',
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
                      }
                    },
                    '& .MuiSelect-select': {
                      fontFamily: 'Roboto',
                      padding: '8px 14px',
                    }
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
                    disabled={location.state?.fixedDocumentType} // Disable if fixed type
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
                    {[...Array(13)].map((_, index) => (
                      <MenuItem key={index + 3} value={`DOC${index + 3}`}>
                        DOC{index + 3}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* PDF Upload Box */}
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
                        {isDragging ? 'Drop PDF here' : 'Click to browse, drag a PDF file, or use scan button'}
                    </Typography>
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'row', // Changed from 'column' to 'row'
                        gap: 2,
                        justifyContent: 'center' // Center the buttons horizontally
                    }}>
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
                        <IconButton
                          color="primary"
                          onClick={async () => {
                              try {
                                  setIsLoading(true);
                                  const response = await axios.post('http://localhost:5000/api/scanner/execute-scan', {
                                      scriptPath: '../backend/scripts/scan.ps1',
                                  });
                                  
                                  if (response.data.success) {
                                      const pdfBase64 = response.data.pdfData;
                                      const pdfBlob = new Blob(
                                          [Uint8Array.from(atob(pdfBase64), c => c.charCodeAt(0))],
                                          { type: 'application/pdf' }
                                      );
                                      setPreviewUrl(URL.createObjectURL(pdfBlob));
                                  } else {
                                      setError('Scanning failed: ' + response.data.message);
                                  }
                              } catch (error) {
                                  console.error('Scan error:', error);
                                  setError('Drop the PDF file here.');
                              } finally {
                                  setIsLoading(false);
                              }
                          }}
                          disabled={isLoading || !documentType}
                          sx={{ 
                              backgroundColor: 'rgba(25, 118, 210, 0.1)',
                              '&:hover': {
                                  backgroundColor: 'rgba(25, 118, 210, 0.2)'
                              },
                              '&.Mui-disabled': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.12)',
                                  color: 'rgba(0, 0, 0, 0.26)'
                              }
                          }}
                      >
                          <PrintIcon sx={{ fontSize: 40 }} />
                      </IconButton>
                    </Box>
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
                      required: true, 
                      field: 'bloodType',
                      type: 'select',
                      options: bloodTypes
                    },
                    { label: 'Profession', required: true, field: 'profession' },
                    { label: 'Hobbies', required: true, field: 'hobbies' }
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
                              sx={{
                                '& input': {
                                  padding: '8px 14px',
                                }
                              }}
                              disabled={isPrefilledDisabled}
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