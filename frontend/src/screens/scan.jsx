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

  // Update the formValues initialization to check if coming from sidebar
  const [formValues, setFormValues] = useState(() => {
    // Only use prefillData if not coming from sidebar
    if (location.state?.from === 'sidebar') {
      return {
        firstName: '',
        middleName: '',
        lastName: '',
        bloodType: '',
        profession: '',
        hobbies: ''
      };
    }

    const prefillData = location.state?.prefillData || {};
    console.log('Initializing form with data:', prefillData);
    
    return {
      firstName: prefillData.fName || '',
      middleName: prefillData.mName || '',
      lastName: prefillData.lName || '',
      bloodType: prefillData.bloodType || '',
      profession: prefillData.profession || '',
      hobbies: prefillData.hobbies || ''
    };
  });

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const [formErrors, setFormErrors] = useState({
    firstName: false,
    middleName: false,
    lastName: false,
    profession: false, // Add this if required
    hobbies: false // Add this if required
  });

  // Update handleInputChange to include logging
  const handleInputChange = (field) => (event) => {
    const value = event.target.value;
    console.log(`Field ${field} changed to:`, value);
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (field === 'firstName' || field === 'lastName') {
      setFormErrors(prev => ({
        ...prev,
        [field]: value.trim() === ''
      }));
    }
  };

  // Update handleSubmit to include logging
  const handleSubmit = () => {
    console.log('Submitting form with values:', formValues);
    console.log('Document type:', documentType);
    // Reset errors
    const newErrors = {
      firstName: false,
      lastName: false
    };
    
    // Validate required fields
    let hasErrors = false;
    
    // Check first name
    if (!formValues.firstName?.trim()) {
      newErrors.firstName = true;
      hasErrors = true;
    }
    
    // Check last name
    if (!formValues.lastName?.trim()) {
      newErrors.lastName = true;
      hasErrors = true;
    }
    
    // Check document type
    if (!documentType) {
      hasErrors = true;
    }
    
    setFormErrors(newErrors);
  
    // Only proceed if there are no errors
    if (!hasErrors) {
      setSuccessModalOpen(true);
      // Reset form after successful submission
      setTimeout(() => {
        setSuccessModalOpen(false);
        setFormValues({
          firstName: '',
          middleName: '',
          lastName: '',
          profession: '', // Add this
          hobbies: '' // Add this
        });
        setDocumentType('');
      }, 5000);
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

  const handleScanButtonClick = async () => {
    try {
        if (!documentType) {
            alert('Please select a document type');
            return;
        }

        console.log('Starting scan...', { documentType });
        const response = await fetch('http://localhost:5000/api/scan/start-scan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ documentType })
        });

        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || `HTTP error! status: ${response.status}`);
        }

        if (data.success) {
            if (data.output) {
                setPdfFile(data.output);
            }
            setSuccessModalOpen(true);
        } else {
            throw new Error(data.message || 'Scan failed');
        }
    } catch (error) {
        console.error('Scan error:', error);
        alert(`Scanning failed: ${error.message}`);
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

                {/* Document Type Dropdown - Moved up */}
                <FormControl 
                  sx={{ 
                    ml:13.5,
                    mt: 1,
                    mb: 1,
                    width: '60%',
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
                      transform: 'translate(14px, 12px) scale(1)', // Adjusted label position
                      '&.Mui-focused, &.MuiFormLabel-filled': {
                        transform: 'translate(14px, -9px) scale(0.75)',
                      },
                      '&.Mui-focused': {
                        color: '#1976d2',
                      }
                    },
                    '& .MuiSelect-select': {
                      fontFamily: 'Roboto',
                      padding: '8px 14px', // Reduced padding
                    }
                  }}
                >
                  <InputLabel id="document-type-label">Document Type</InputLabel>
                  <Select
                    labelId="document-type-label"
                    id="document-type"
                    value={documentType}
                    label="Document Type"
                    onChange={(e) => setDocumentType(e.target.value)}
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
                    aspectRatio: '1 / 1.4142',
                    margin: '0 auto',
                    border: '1px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(138, 138, 138, 0.9)',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px rgba(32, 32, 32, 0.77)'
                  }}
                >
                  {pdfFile ? (
                    <Document file={pdfFile}>
                      <Page pageNumber={1} width={400} />
                    </Document>
                  ) : (
                    <Typography>Click to scan a document</Typography>
                  )}
                  {/* FOR SCAN BUTTON */}
                  <Button
                variant="contained"
                color="primary"
                onClick={handleScanButtonClick}
                sx={{
                  mt: 2,
                  borderRadius: '10px',
                  textTransform: 'none',
                  '&:focus': {
                    outline: 'none',
                  },
                  '&.Mui-focusVisible': {
                    outline: 'none',
                  },
                }}
              >
                Start Scan
              </Button>
                </Box>
              </Box>

              {/* Right Column - Information Fields */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 1, height: '100%', mt: 4}}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
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
                            width: '80%',
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
                              onChange={handleInputChange(field.field)}
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
                              onChange={handleInputChange(field.field)}
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
                    disabled={!formValues.firstName || !formValues.lastName || !documentType}
                    disableRipple
                    sx={{
                      ml: 17,
                      mt: 2,
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