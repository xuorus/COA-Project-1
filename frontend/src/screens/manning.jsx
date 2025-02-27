import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Modal, Grid, Select, MenuItem } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import backgroundImage from '../assets/bldg.jpg';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import logo from '../assets/logo.png';
import SearchIcon from '@mui/icons-material/Search';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropTypes from 'prop-types';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const EditModal = ({ open, onClose }) => {
  const [secondModalOpen, setSecondModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('');
  const [lgasItems, setLgasItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [thirdModalOpen, setThirdModalOpen] = useState(false);
  const [selectedLgas, setSelectedLgas] = useState('');
  const [officeItems, setOfficeItems] = useState([]);

  const lgasList = [
    'Reg X - Local Government Audit Sector (LGAS) A - Misamis Oriental 1',
    'Reg X - Local Government Audit Sector (LGAS) B - Misamis Oriental 2',
    'Reg X - Local Government Audit Sector (LGAS) C - Cities of Cagayan de Oro, Gingoog & El Salvador',
    'Reg X - Local Government Audit Sector (LGAS) D - Bukidnon 1',
    'Reg X - Local Government Audit Sector (LGAS) E - Bukidnon 2',
    'Reg X - Local Government Audit Sector (LGAS) F - Misamis Occidental 1',
    'Reg X - Local Government Audit Sector (LGAS) G - Cities of Oroquita, Ozamiz and Tangub',
    'Reg X - Local Government Audit Sector (LGAS) H - Lanao del Norte 1',
    'Reg X - Local Government Audit Sector (LGAS) I - Lanao del Norte 2'
  ];

  const ngasList = [
    'Reg X - National Government Audit Section (NGAS) Clusters 1, 2, 3 & 4',
    'NGAS Cluster I - Executive Offices',
    'NGAS Cluster 2 - Oversight & Public Debt. Management Agencies',
    'NGAS Cluster 3 - Legislative, Judiciary & Constitutional Offices',
    'NGAS Cluster 4 - Defense & Security',
    'Reg X - National Government Audit Section(NGAS) Cluster 5',
    'Reg X - National Government Audit Sector (NGAS) Clusters 6 & 8',
    'NGAS Cluster 6 - Health & Science',
    'NGAS Cluster 8 - Agricultural & Environment',
    'Reg X - National Government Audit Sector (NGAS) Cluster 7',
  ];

  const ngasSucsList = [
    'Reg X - National Government Audit Sector (NGAS) State Universities and Colleges (SUCs) & Other Stand Alone Agencies (SAAs)'
  ];

  const cgasList = [
    'Reg X - Corporate Government Audit Sector (CGAS) Clusters 1, 2, & 4',
    'CGAS Cluster 1 - Banking & Credit',
    'CGAS Cluster 2 - Social Security & Housing',
    'CGAS Cluster 4 - Industrial & Area Development',
    'Reg X - Corporate Government Audit Sector (CGAS) Clusters 3, 5, & 6',
    'CGAS Cluster 3 - Public Utilities',
    'CGAS Cluster 5 - Agricultural & Natural Resources',
    'CGAS Cluster 6 - Social, Cultural, Trading, Promotional & Other Services'
  ];

  const cgasWdList = [
    'Reg X - Corporate Government Audit Sector (CGAS) - Water Districts & Stand-Alone Agencies (WD & other SAAs)'
  ];

  const sectorMap = {
    'LGAS A-I': 'LGAS A-I',
    'NGAS Cluster 1-8': 'NGAS Cluster 1-8',
    'NGAS SUCs & Other SAA': 'NGAS SUCs & Other SAA',
    'CGAS Cluster 1-6': 'CGAS CLUSTER 1-6',
    'CGAS WD & Other SAAs': 'CGAS WD & OTHER SAAs',
    'ORD': 'ORD',
    'OARD': 'OARD',
    'ATFD': 'ATFD',
    'ATFD FS': 'ATFD FS',
    'ATFD FS/Cashier': 'ATFD FS/CASHIER',
    'ATFD HRMS': 'ATFD HRMS',
    'ATFD RMS': 'ATFD RMS',
    'ATFD TS': 'ATFD TS',
    'ATFD IT': 'ATFD IT',
    'ATFD GSS': 'ATFD GSS',
    'FRAUD AUDIT DIVISION': 'FRAUD AUDIT',
    'LEGAL & ADJUCATION': 'LEGAL & ADJUCATION',
    'AGAD': 'AGAD',
    'TECHNICAL AUDIT GROUP A-D': 'TECHNICAL AUDIT GROUP A-D'
  };

  const columns = [
    [
      'LGAS A-I',
      'NGAS Cluster 1-8',
      'NGAS SUCs & Other SAA',
      'CGAS Cluster 1-6',
      'CGAS WD & Other',
      'ORD'
    ],
    [
      'OARD',
      'ATFD',
      'ATFD FS',
      'ATFD FS/Cashier',
      'ATFD HRMS',
      'ATFD RMS'
    ],
    [
      'ATFD TS',
      'ATFD IT',
      'ATFD GSS',
      'FRAUD AUDIT DIVISION',
      'LEGAL & ADJUCATION',
      'AGAD'
    ],
    [
      'TECHNICAL AUDIT GROUP A-D'
    ]
  ];
  const handleSectionClick = (section) => {
    if (section === 'LGAS A-I') {
      setLgasItems(lgasList);
    } else if (section === 'NGAS Cluster 1-8') {
      setLgasItems(ngasList);
    } else if (section === 'NGAS SUCs & Other SAA') {
      setLgasItems(ngasSucsList);
    } else if (section === 'CGAS Cluster 1-6') {
      setLgasItems(cgasList);
    } else if (section === 'CGAS WD & Other') {
      setLgasItems(cgasWdList);
    }
    setSelectedSection(section);
    setSecondModalOpen(true);
  };

  const handleSectionChange = (e) => {
    const newSection = e.target.value;
    setSelectedSection(newSection);
    if (newSection === 'LGAS A-I') {
      setLgasItems(lgasList);
    } else if (newSection === 'NGAS Cluster 1-8') {
      setLgasItems(ngasList);
    } else if (newSection === 'NGAS SUCs & Other SAA') {
      setLgasItems(ngasSucsList);
    } else if (newSection === 'CGAS Cluster 1-6') {
      setLgasItems(cgasList);
    } else if (newSection === 'CGAS WD & Other') {
      setLgasItems(cgasWdList);
    }
    setSearchQuery('');
  };

  const filterItems = (items, query) => {
    if (!query) return items;
    return items.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );
  };

  const highlightSearchMatch = (text, searchQuery) => {
    if (!searchQuery) return text;
    
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return (
      <span>
        {parts.map((part, index) => 
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <span key={index} style={{ backgroundColor: 'yellow' }}>
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const handleCloseAll = () => {
    setThirdModalOpen(false);
    setSecondModalOpen(false);
    onClose();
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const lgasAOffices = [
    'COA Regional Office No. X, Cagayan de Oro City',
    'PSAO-Camiguin, Mambajao, Camiguin',
    'Office of the Auditor, Magsaysay, Misl Or.'
  ];

  return (
    <>
      <Modal
        open={open && !secondModalOpen}
        onClose={handleCloseAll}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              transition: 'opacity 500ms ease-in-out'
            }
          }
        }}
      >
        <Box
          sx={{
            width: '80%',
            maxHeight: '70vh',
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            overflow: 'auto',
            position: 'relative',
            transform: open ? 'scale(1)' : 'scale(0.9)',
            opacity: open ? 1 : 0,
            transition: 'transform 500ms ease-in-out, opacity 500ms ease-in-out'
          }}
        >
          <IconButton
            onClick={handleCloseAll}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              '&:focus': {
      outline: 'none'
    },
              color: 'rgba(0, 0, 0, 0.54)'
            }}
          >
            <CloseIcon />
          </IconButton>

          <Grid container spacing={2} sx={{ mt: 2 }}>
            {columns.map((column, colIndex) => (
              <Grid item xs={3} key={colIndex}>
                {column.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    fullWidth
                    onClick={() => handleSectionClick(item)}
                    sx={{
                      justifyContent: 'flex-start',
                      py: 2,
                      px: 3,
                      mb: 1,
                      color: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                      '&:focus': {
                        outline: 'none'
                      },
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 'normal'
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Grid>
            ))}
          </Grid>
        </Box>
      </Modal>

      <Modal
        open={secondModalOpen}
        onClose={() => setSecondModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              transition: 'opacity 500ms ease-in-out'
            }
          }
        }}
      >
        <Box
          sx={{
            width: '80%',
            height: '65vh',
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: secondModalOpen ? 'scale(1)' : 'scale(0.9)',
            opacity: secondModalOpen ? 1 : 0,
            transition: 'transform 500ms ease-in-out, opacity 500ms ease-in-out'
          }}
        >
          {/* Fixed Header */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 4,
              pb: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <IconButton
                onClick={() => setSecondModalOpen(false)}
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.54)',
                  '&:focus': {
                    outline: 'none'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="h6">
                  {sectorMap[selectedSection] || selectedSection}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Select
                value={selectedSection}
                onChange={handleSectionChange}
                size="small"
                sx={{
                  width: '200px',
                  '& .MuiSelect-select': {
                    py: 0.5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  },
                  '&:focus': {
                    outline: 'none',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                  }
                }}
              >
                {columns.flat().map((item, index) => (
                  <MenuItem 
                    key={index} 
                    value={item}
                    sx={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '250px'
                    }}
                  >
                    {item}
                  </MenuItem>
                ))}
              </Select>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Search"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchQuery ? (
                        <IconButton
                          onClick={handleClearSearch}
                          sx={{ 
                            p: 0.5,
                            '&:focus': {
                              outline: 'none'
                            }
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : (
                        <SearchIcon />
                      )}
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
                  width: '250px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: 'none',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                    }
                  }
                }}
              />
              <IconButton
                onClick={handleCloseAll}
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.54)',
                  '&:focus': {
                    outline: 'none'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent'
                  },
                  '&:active': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Scrollable Content */}
          <Box 
            sx={{ 
              flex: 1,
              overflow: 'auto',
              p: 4,
              pt: 2
            }}
          >
            {(selectedSection === 'LGAS A-I' || selectedSection === 'NGAS Cluster 1-8' || selectedSection === 'NGAS SUCs & Other SAA' || selectedSection === 'CGAS Cluster 1-6' || selectedSection === 'CGAS WD & Other') && (
              <Grid container spacing={2}>
                {filterItems(lgasItems, searchQuery).map((item, index) => (
                  <Grid item xs={12} key={index}>
                    <Button
                      fullWidth
                      onClick={() => {
                        if (item === 'Reg X - Local Government Audit Sector (LGAS) A - Misamis Oriental 1') {
                          setSelectedLgas(item);
                          setOfficeItems(lgasAOffices);
                          setThirdModalOpen(true);
                        }
                      }}
                      sx={{
                        justifyContent: 'flex-start',
                        py: 2,
                        px: 3,
                        color: 'black',
                        backgroundColor: 'rgba(0, 0, 0, 0.04)',
                        '&:hover': {
                          backgroundColor: 'rgba(0, 0, 0, 0.08)',
                        },
                        '&:focus': {
                          outline: 'none',
                        },
                        textTransform: 'none',
                        fontSize: '0.9rem',
                        fontWeight: 'normal',
                        textAlign: 'left',
                        whiteSpace: 'normal',
                        lineHeight: 1.5
                      }}
                    >
                      {highlightSearchMatch(item, searchQuery)}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Modal>

      <Modal
        open={thirdModalOpen}
        onClose={() => setThirdModalOpen(false)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        slotProps={{
          backdrop: {
            sx: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              transition: 'opacity 500ms ease-in-out'
            }
          }
        }}
      >
        <Box
          sx={{
            width: '80%',
            height: '65vh',
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transform: thirdModalOpen ? 'scale(1)' : 'scale(0.9)',
            opacity: thirdModalOpen ? 1 : 0,
            transition: 'transform 500ms ease-in-out, opacity 500ms ease-in-out'
          }}
        >
          {/* Fixed Header */}
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 4,
              pb: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              backgroundColor: '#fff',
              position: 'sticky',
              top: 0,
              zIndex: 1
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <IconButton
                onClick={() => setThirdModalOpen(false)}
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.54)',
                  '&:focus': {
                    outline: 'none'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Typography variant="h6">
                  {selectedLgas}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="outlined"
                size="small"
                placeholder="Search"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {searchQuery ? (
                        <IconButton
                          onClick={handleClearSearch}
                          sx={{ 
                            p: 0.5,
                            '&:focus': {
                              outline: 'none'
                            }
                          }}
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : (
                        <SearchIcon />
                      )}
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
                  width: '250px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '20px',
                    backgroundColor: 'none',
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      border: '1px solid rgba(0, 0, 0, 0.23)',
                    }
                  }
                }}
              />
              <IconButton
                onClick={handleCloseAll}
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.54)',
                  '&:focus': {
                    outline: 'none'
                  },
                  '&:hover': {
                    backgroundColor: 'transparent'
                  }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>

          {/* Scrollable Content */}
          <Box 
            sx={{ 
              flex: 1,
              overflow: 'auto',
              p: 4,
              pt: 2
            }}
          >
            <Grid container spacing={2}>
              {filterItems(officeItems, searchQuery).map((item, index) => (
                <Grid item xs={12} key={index}>
                  <Button
                    fullWidth
                    sx={{
                      justifyContent: 'flex-start',
                      py: 2,
                      px: 3,
                      color: 'black',
                      backgroundColor: 'rgba(0, 0, 0, 0.04)',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.08)',
                      },
                      '&:focus': {
                        outline: 'none',
                      },
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 'normal',
                      textAlign: 'left',
                      whiteSpace: 'normal',
                      lineHeight: 1.5
                    }}
                  >
                    {highlightSearchMatch(item, searchQuery)}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

EditModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

EditModal.defaultProps = {
  open: false,
  onClose: () => {}
};

const Manning = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSearchChange = (value) => {
    setSearchQuery(value);
  };

  const handleEditClick = () => {
    setEditModalOpen(true);
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
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1,
            zIndex: -1
          }
        }}
      >
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            bottom: '40px',
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
                height: 'calc(100vh - 160px)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3 
              }}>
                <Typography variant="h5" component="h1" fontWeight="bold">
                  Manning Complement
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <IconButton
                    onClick={handleEditClick}
                    sx={{
                      backgroundColor: 'none',
                      width: 40,
                      height: 40,
                      '&:focus': {
                        outline: 'none'
                      },
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }}
                  >
                    <BorderColorRoundedIcon />
                  </IconButton>

                  <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
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
                      width: '250px',
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '20px',
                        backgroundColor: 'none',
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

              <TableContainer 
                component={Paper} 
                sx={{ 
                  flexGrow: 1, 
                  overflow: 'auto',
                  borderRadius: 2,
                  boxShadow: 3,
                  '& .MuiTableCell-root': {
                    textAlign: 'center',
                    verticalAlign: 'middle',
                    border: '1px solid #ddd',
                    padding: '8px 16px',
                    whiteSpace: 'normal',
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word',
                    minHeight: '48px',
                    display: 'table-cell',
                  },
                  '&::-webkit-scrollbar': {
                    width: '8px',
                    height: '8px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    borderRadius: '4px',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.25)',
                    },
                  },
                  scrollbarWidth: 'thin',
                  scrollbarColor: 'rgba(0, 0, 0, 0.15) rgba(0, 0, 0, 0.05)',
                }}
              >
                <Table 
                  stickyHeader 
                  size="small" 
                  sx={{ 
                    borderCollapse: 'collapse',
                    tableLayout: 'fixed',
                    minWidth: '150%',
                    '& .MuiTableRow-root': {
                      height: 'auto',
                    },
                  }}
                >
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '8%'
                      }}>Sector</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '10%'
                      }}>AG</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '8%'
                      }}>Team No.</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '16%'
                      }}>Official Station</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '24%'
                      }}>Auditees</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '12%'
                      }}>Name</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '16%'
                      }}>Position</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '16%'
                      }}>Designation</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '6%'
                      }}>No.</TableCell>
                      <TableCell sx={{ 
                        fontWeight: 'bold', 
                        backgroundColor: '#f5f5f5',
                        width: '12%'
                      }}>Office Order</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell 
                        rowSpan={4} 
                        sx={{ 
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          height: '100%',
                          padding: '0',
                          '&.MuiTableCell-root': {
                            display: 'table-cell',
                            verticalAlign: 'middle'
                          }
                        }}
                      >
                        LGAS
                      </TableCell>
                      <TableCell 
                        rowSpan={4}
                        sx={{ 
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          height: '100%',
                          padding: '0',
                          '&.MuiTableCell-root': {
                            display: 'table-cell',
                            verticalAlign: 'middle'
                          }
                        }}
                      >
                        A
                      </TableCell>
                      <TableCell 
                        rowSpan={4}
                        sx={{ 
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          height: '100%',
                          padding: '0',
                          '&.MuiTableCell-root': {
                            display: 'table-cell',
                            verticalAlign: 'middle'
                          }
                        }}
                      >
                        1
                      </TableCell>
                      <TableCell>COA Regional Office No. X, Cagayan de Oro City</TableCell>
                      <TableCell>Region X</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>Auditor</TableCell>
                      <TableCell>Team Leader</TableCell>
                      <TableCell>1</TableCell>
                      <TableCell>2025-001</TableCell>
                    </TableRow>

                    {/* Second row - First PSAO-Camiguin entry */}
                    <TableRow>
                      <TableCell>PSAO-Camiguin, Mambajao, Camiguin</TableCell>
                      <TableCell>Region X</TableCell>
                      <TableCell>Jane Smith</TableCell>
                      <TableCell>Auditor</TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>2</TableCell>
                      <TableCell>2025-001</TableCell>
                    </TableRow>

                    {/* Third row - Second PSAO-Camiguin entry with no name */}
                    <TableRow>
                      <TableCell>PSAO-Camiguin, Mambajao, Camiguin</TableCell>
                      <TableCell>Region X</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>2025-001</TableCell>
                    </TableRow>

                    {/* Fourth row - Third PSAO-Camiguin entry with no name */}
                    <TableRow>
                      <TableCell>PSAO-Camiguin, Mambajao, Camiguin</TableCell>
                      <TableCell>Region X</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>-</TableCell>
                      <TableCell>2025-001</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Container>
        </Box>
        <Footer currentTime={currentTime} />
        <EditModal 
          open={editModalOpen} 
          onClose={() => setEditModalOpen(false)} 
        />
      </Box>
    </ThemeProvider>
  );
};

export default Manning;