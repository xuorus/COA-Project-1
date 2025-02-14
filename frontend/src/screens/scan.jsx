import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton, FormControl, InputLabel, Select, MenuItem, TextField, OutlinedInput } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import backgroundImage from '../assets/bldg.jpg';
import logo from '../assets/logo.png';
import Sidebar from '../components/sidebar';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [documentType, setDocumentType] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
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
        {/* Header Box */}
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
            justifyContent: 'space-between', // This will push the menu icon to the right
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
              borderRadius: 0,  // Make button square
              '&:hover': {      // Optional: customize hover state
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
                background: 'rgb(255, 255, 255, 0.4)',
                backdropFilter: 'blur(3px)',
                borderRadius: 2,
                padding: 2, // Reduced padding
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-start',
                gap: 2, // Reduced gap
                boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                height: '100%', // Take full height of container
                overflow: 'hidden' // Prevent internal scrolling
              }}
            >
              {/* Left Column - Scanning Controls */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Scan Document
                </Typography>

                {/* Document Type Dropdown - Moved up */}
                <FormControl 
                  sx={{ 
                    width: '70%',
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '15px',
                      backgroundColor: 'rgba(255, 255, 255, 0.7)',
                      fontFamily: 'Roboto',
                      height: '45px', // Reduced height
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
                  onClick={() => fileInputRef.current?.click()}
                  sx={{
                    width: '100%',
                    flex: 1,
                    maxWidth: '300px',
                    aspectRatio: '1 / 1.4142', // A4 paper ratio
                    margin: '0 auto',
                    border: '1px solid rgba(0, 0, 0, 0.2)', // Changed from dashed to solid
                    borderRadius: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(138, 138, 138, 0.9)', // Changed to light gray
                    cursor: 'pointer',
                    overflow: 'hidden',
                    boxShadow: 'inset 0 2px 4px rgba(32, 32, 32, 0.77)'
                  }}
                >
                  {pdfFile ? (
                    <Document
                      file={pdfFile}
                      onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                      onLoadError={(error) => console.error('Error loading PDF:', error)}
                    >
                      <Page
                        pageNumber={pageNumber}
                        width={400}
                        renderTextLayer={false}
                        renderAnnotationLayer={false}
                      />
                    </Document>
                  ) : (
                    <Typography>
                    </Typography>
                  )}
                </Box>
              </Box>

              {/* Right Column - Information Fields */}
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, height: '100%' }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  Information
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {['First Name', 'Middle Name', 'Last Name'].map((label) => (
                    <FormControl
                      key={label}
                      fullWidth
                      sx={{ 
                        '& .MuiOutlinedInput-root': {
                          width: '80%',
                          borderRadius: '15px',
                          backgroundColor: 'rgba(255, 255, 255, 0.7)',
                          fontFamily: 'Roboto',
                          height: '45px', // Reduced height
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
                        }
                      }}
                    >
                      <InputLabel>{label}</InputLabel>
                      <OutlinedInput
                        label={label}
                        sx={{
                          '& input': {
                            padding: '8px 14px', // Reduced padding
                          }
                        }}
                      />
                    </FormControl>
                  ))}
                </Box>

                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    borderRadius: '10px',
                    width: '30%',
                    textTransform: 'none',
                  }}
                >
                  Submit
                </Button>

              </Box>
            </Box>
          </Container>
        </Box>

        {/* Footer Box */}
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

export default Main;