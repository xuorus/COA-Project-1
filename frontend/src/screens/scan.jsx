import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, OutlinedInput } from '@mui/material';
import { Document, Page, pdfjs } from 'react-pdf';
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
  const isPrefilledDisabled = location.state?.isPrefilledDisabled;
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

  const handleScanButtonClick = async () => {
    if (!documentType) {
        setError('Please select a document type');
        return;
    }

    try {
        setError(null);
        setScanning(true);

        // First, initiate the scan
        const scanResponse = await axios.post('http://localhost:5000/api/scan/start-scan', {
            documentType
        });

        if (!scanResponse.data.success) {
            throw new Error(scanResponse.data.message);
        }

        // Get the document ID from scan response
        setScannedDocument(scanResponse.data.docId);
        
    } catch (error) {
        console.error('Scan error:', error);
        setError(error.response?.data?.message || 'Failed to scan document');
    } finally {
        setScanning(false);
    }
};

const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate only required fields
    if (!formValues.firstName || !formValues.lastName) {
        setError('First name and last name are required');
        return;
    }

    try {
        const personData = {
            fName: formValues.firstName.trim(),
            mName: formValues.middleName?.trim() || null,
            lName: formValues.lastName.trim(),
            bloodType: formValues.bloodType || null,
            profession: formValues.profession?.trim() || null,
            hobbies: formValues.hobbies?.trim() || null
        };

        const response = await axios.post('http://localhost:5000/api/scan/person', personData);

        if (response.data.success) {
            setSuccessModalOpen(true);
            // Reset form
            setFormValues({
                firstName: '',
                middleName: '',
                lastName: '',
                bloodType: '',
                profession: '',
                hobbies: ''
            });
            setError(null);
        }
    } catch (error) {
        console.error('Submit error:', error);
        setError(error.response?.data?.message || 'Failed to submit record');
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
    } else if (location.state?.prefillData) {
      const prefillData = location.state.prefillData;
      console.log('Updating form values with:', prefillData);
      
      setFormValues({
        firstName: prefillData.fName || '',
        middleName: prefillData.mName || '',
        lastName: prefillData.lName || '',
        bloodType: prefillData.bloodType || '',
        profession: prefillData.profession || '',
        hobbies: prefillData.hobbies || ''
      });
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
                  sx={{
                    width: '100%',
                    flex: 1,
                    maxWidth: '300px',
                    aspectRatio: '1 / 1.4142', // A4 aspect ratio
                    margin: '0 auto',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    position: 'relative'
                  }}
                >
                  {isLoading ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2 
                    }}>
                      <CircularProgress />
                      <Typography>Scanning...</Typography>
                    </Box>
                  ) : pdfFile ? (
                    <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
                      <Document
                        file={pdfFile}
                        onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                        loading={
                          <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center', 
                            alignItems: 'center',
                            height: '100%' 
                          }}>
                            <CircularProgress />
                          </Box>
                        }
                      >
                        <Page
                          pageNumber={pageNumber}
                          width={280} // Adjust based on your box size
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                        />
                      </Document>
                      {numPages > 0 && (
                        <Typography
                          sx={{
                            position: 'absolute',
                            bottom: 8,
                            right: 8,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            padding: '2px 6px',
                            borderRadius: 1,
                            fontSize: '0.75rem'
                          }}
                        >
                          Page {pageNumber} of {numPages}
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center',
                      gap: 2 
                    }}>
                      <Typography>Click to scan a document</Typography>
                      <IconButton
                      variant="contained"
                        color="primary"
                        onClick={handleScanButtonClick}
                        disabled={isLoading}
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
                        {formErrors[field.field] && (
                          <Typography 
                            variant="caption" 
                            color="error"
                            sx={{ 
                              position: 'absolute',  // Position error message absolutely
                              bottom: -20,          // Position below the input
                              left: 2,              // Align with input padding
                              fontSize: '0.75rem'
                            }}
                          >
                            This field is required
                          </Typography>
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
                      </ThemeProvider>
                    );
                  };

export default Main;