import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button, Container, Typography, Box, ThemeProvider, 
 createTheme, IconButton, Table, TableBody, TableContainer, TableHead, TableRow, TableCell, Paper, TextField, InputAdornment, Modal, Grid, Select, MenuItem, Menu } from '@mui/material';
import backgroundImage from '../assets/bldg.jpg';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import SearchIcon from '@mui/icons-material/Search';
import BorderColorRoundedIcon from '@mui/icons-material/BorderColorRounded';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PropTypes from 'prop-types';
import WindowControl from '../components/WindowControl';
import LgasA from '../components/manning_table/LGAS_A-I/LgasA';
import LgasB from '../components/manning_table/LGAS_A-I/LgasB';
import LgasC from '../components/manning_table/LGAS_A-I/LgasC';
import LgasD from '../components/manning_table/LGAS_A-I/LgasD';
import LgasE from '../components/manning_table/LGAS_A-I/LgasE';
import LgasF from '../components/manning_table/LGAS_A-I/LgasF';
import LgasG from '../components/manning_table/LGAS_A-I/LgasG';
import LgasH from '../components/manning_table/LGAS_A-I/LgasH';
import LgasI from '../components/manning_table/LGAS_A-I/LgasI';
import { ManningProvider } from '../context/ManningContext';
import GetAppRoundedIcon from '@mui/icons-material/GetAppRounded';
import * as XLSX from 'xlsx';
import { NumberingProvider } from '../context/NumberingContext';
import NgasMain from '../components/manning_table/NGAS_Cluster_1-8/NgasMain';
import NgasCluster1 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster1';
import NgasCluster2 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster2';
import NgasCluster3 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster3';
import NgasCluster4 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster4';
import NgasCluster5 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster5';
import NgasCluster68 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster68';
import NgasCluster6 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster6';
import NgasCluster8 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster8';
import NgasCluster7 from '../components/manning_table/NGAS_Cluster_1-8/NgasCluster7';
import NgasSUCsSAAs from '../components/manning_table/NGAS_SUCs_SAAs/NgasSUCsSAAs';
import CgasMain from '../components/manning_table/CGAS_Clusters_1-6/CgasMain';
import CgasCluster1 from '../components/manning_table/CGAS_Clusters_1-6/CgasCluster1';

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
  const [selectedNgas, setSelectedNgas] = useState('');
  const [selectedNgasSUCsSAAs, setSelectedNgasSUCsSAAs] = useState('');
  const [selectedCgas, setSelectedCgas] = useState('');

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
    'NGAS Cluster 1 - Executive Offices',
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

  const technicalAuditList = [
    'TECHNICAL AUDIT GROUP',
    'TECHNICAL AUDIT TEAM A',
    'TECHNICAL AUDIT TEAM B',
    'TECHNICAL AUDIT TEAM C',
    'TECHNICAL AUDIT TEAM D'
  ];

  const sectorMap = {
    'LGAS A-I': 'LGAS A-I',
    'NGAS Cluster 1-8': 'NGAS Cluster 1-8',
    'NGAS SUCs & Other SAAs': 'NGAS SUCs & Other SAAs',
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
      { 
        text: 'NGAS SUCs & Other SAAs',
        sx: { fontSize: '0.8rem' } // Match the font size with others
      },
      'CGAS Cluster 1-6',
      { 
        text: 'CGAS WD & Other SAAs',
        sx: { fontSize: '0.8rem' }
      },
      'ORD'
    ].map(item => typeof item === 'string' ? { text: item, sx: { fontSize: '0.9rem' } } : item),
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
    setSelectedSection(section);
    switch(section) {
      case 'LGAS A-I':
        setLgasItems(lgasList);
        break;
      case 'NGAS Cluster 1-8':
        setLgasItems(ngasList);
        break;
      case 'NGAS SUCs & Other SAAs':
        setLgasItems(ngasSucsList);
        break;
      case 'CGAS Cluster 1-6':
        setLgasItems(cgasList);
        break;
      case 'CGAS WD & Other SAAs':
        setLgasItems(cgasWdList);
        break;
      case 'TECHNICAL AUDIT GROUP A-D':
        setLgasItems(technicalAuditList);
        break;
      default:
        setLgasItems([]);
    }
    setSecondModalOpen(true);
  };

  const handleSectionChange = (e) => {
    const newSection = e.target.value;
    setSelectedSection(newSection);
    
    // Update items based on the selected section text
    switch(newSection) {
      case 'LGAS A-I':
        setLgasItems(lgasList);
        break;
      case 'NGAS Cluster 1-8':
        setLgasItems(ngasList);
        break;
      case 'NGAS SUCs & Other SAAs':
        setLgasItems(ngasSucsList);
        break;
      case 'CGAS Cluster 1-6':
        setLgasItems(cgasList);
        break;
      case 'CGAS WD & Other SAAs':
        setLgasItems(cgasWdList);
        break;
      case 'TECHNICAL AUDIT GROUP A-D':
        setLgasItems(technicalAuditList);
        break;
      default:
        setLgasItems([]);
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
                    onClick={() => handleSectionClick(typeof item === 'object' ? item.text : item)}
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
                      fontWeight: 'normal',
                      ...(typeof item === 'object' ? item.sx : {})
                    }}
                  >
                    {typeof item === 'object' ? item.text : item}
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
                {columns.flat().map((item, index) => {
                  const itemText = typeof item === 'object' ? item.text : item;
                  return (
                    <MenuItem 
                      key={index} 
                      value={itemText} // Use the text value for both value and display
                      sx={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '250px'
                      }}
                    >
                      {itemText}
                    </MenuItem>
                  );
                })}
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
                  },
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
            {(selectedSection === 'LGAS A-I' || 
  selectedSection === 'NGAS Cluster 1-8' || 
  selectedSection === 'NGAS SUCs & Other SAAs' || 
  selectedSection === 'CGAS Cluster 1-6' || 
  selectedSection === 'CGAS WD & Other SAAs' ||
  selectedSection === 'TECHNICAL AUDIT GROUP A-D') && (
  <Grid container spacing={2}>
    {filterItems(lgasItems, searchQuery).map((item, index) => (
      <Grid item xs={12} key={index}>
        <Button
          fullWidth
          onClick={() => {
            if (item === 'Reg X - Corporate Government Audit Sector (CGAS) Clusters 1, 2, & 4' ||
                item === 'CGAS Cluster 1 - Banking & Credit'
            ) {
              setSelectedCgas(item);
              setThirdModalOpen(true);
            }
            else if (item === 'Reg X - National Government Audit Sector (NGAS) State Universities and Colleges (SUCs) & Other Stand Alone Agencies (SAAs)') {
              setSelectedNgasSUCsSAAs(item);
              setThirdModalOpen(true);
            }
            else if (item === 'Reg X - National Government Audit Section (NGAS) Clusters 1, 2, 3 & 4' ||
                item === 'NGAS Cluster 1 - Executive Offices' ||
                item === 'NGAS Cluster 2 - Oversight & Public Debt. Management Agencies' ||
                item === 'NGAS Cluster 3 - Legislative, Judiciary & Constitutional Offices' ||
                item === 'NGAS Cluster 4 - Defense & Security' ||
                item === 'Reg X - National Government Audit Section(NGAS) Cluster 5' ||
                item === 'Reg X - National Government Audit Sector (NGAS) Clusters 6 & 8' ||
                item === 'NGAS Cluster 6 - Health & Science' || 
                item === 'NGAS Cluster 8 - Agricultural & Environment' || 
                item === 'Reg X - National Government Audit Sector (NGAS) Cluster 7') {
              setSelectedNgas(item);
              setThirdModalOpen(true);
            }
            else if (item === 'Reg X - Local Government Audit Sector (LGAS) A - Misamis Oriental 1' ||
                item === 'Reg X - Local Government Audit Sector (LGAS) B - Misamis Oriental 2' ||
                item === 'Reg X - Local Government Audit Sector (LGAS) C - Cities of Cagayan de Oro, Gingoog & El Salvador' ||
                item === 'Reg X - Local Government Audit Sector (LGAS) D - Bukidnon 1' ||
                item === 'Reg X - Local Government Audit Sector (LGAS) E - Bukidnon 2'|| 
                item === 'Reg X - Local Government Audit Sector (LGAS) F - Misamis Occidental 1' ||
                item === 'Reg X - Local Government Audit Sector (LGAS) G - Cities of Oroquita, Ozamiz and Tangub' ||
                item === 'Reg X - Local Government Audit Sector (LGAS) H - Lanao del Norte 1' || 
                item === 'Reg X - Local Government Audit Sector (LGAS) I - Lanao del Norte 2' ) {
              setSelectedLgas(item);
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
            width: '90%',
            height: '80vh',
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: 24,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 4,
              pb: 3,
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)'
            }}
          >
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <IconButton
                onClick={() => setThirdModalOpen(false)}
                sx={{ 
                  color: 'rgba(0, 0, 0, 0.54)',
                  '&:hover': {
                    backgroundColor: 'transparent'
                  },
                  '&:focus': {
                    outline: 'none'
                  }
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6">
                {selectedNgas || selectedLgas}
              </Typography>
            </Box>
            <IconButton
              onClick={handleCloseAll}
              sx={{ 
                color: 'rgba(0, 0, 0, 0.54)',
                '&:hover': {
                  backgroundColor: 'transparent'
                },
                '&:focus': {
                    outline: 'none'
                  }
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <TableContainer 
            sx={{ 
              flex: 1,
              overflow: 'auto',
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
              }
            }}
          >
            <Table 
              stickyHeader 
              size="small" 
              sx={{ 
                borderCollapse: 'collapse',
                tableLayout: 'fixed',
                minWidth: '150%'
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: '8%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Sector</TableCell>
                  <TableCell sx={{ width: '10%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>AG</TableCell>
                  <TableCell sx={{ width: '8%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Team No.</TableCell>
                  <TableCell sx={{ width: '16%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Official Station</TableCell>
                  <TableCell sx={{ width: '24%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Auditees</TableCell>
                  <TableCell sx={{ width: '12%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Name</TableCell>
                  <TableCell sx={{ width: '16%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Position</TableCell>
                  <TableCell sx={{ width: '16%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Designation</TableCell>
                  <TableCell sx={{ width: '6%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>No.</TableCell>
                  <TableCell sx={{ width: '12%', fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Office Order</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedCgas === 'Reg X - Corporate Government Audit Sector (CGAS) Clusters 1, 2, & 4' ? (
                  <CgasMain isEditable={true} />
                ) : selectedCgas === 'CGAS Cluster 1 - Banking & Credit' ? (
                  <CgasCluster1 isEditable={true} />
  
                ) : selectedNgas === 'Reg X - National Government Audit Section (NGAS) Clusters 1, 2, 3 & 4' ? (
                  <NgasMain isEditable={true} />
                ) : selectedNgas === 'NGAS Cluster 1 - Executive Offices' ? (
                  <NgasCluster1 isEditable={true} />
                ) : selectedNgas === 'NGAS Cluster 2 - Oversight & Public Debt. Management Agencies' ? (
                  <NgasCluster2 isEditable={true} />
                ) : selectedNgas === 'NGAS Cluster 3 - Legislative, Judiciary & Constitutional Offices' ? (
                  <NgasCluster3 isEditable={true} />
                ) : selectedNgas === 'NGAS Cluster 4 - Defense & Security' ? (
                  <NgasCluster4 isEditable={true} />
                ) : selectedNgas === 'Reg X - National Government Audit Section(NGAS) Cluster 5' ? (
                  <NgasCluster5 isEditable={true} />
                ) : selectedNgas === 'Reg X - National Government Audit Sector (NGAS) Clusters 6 & 8' ? (
                  <NgasCluster68 isEditable={true} />
                ) : selectedNgas === 'NGAS Cluster 6 - Health & Science' ? (
                  <NgasCluster6 isEditable={true} />
                ) : selectedNgas === 'NGAS Cluster 8 - Agricultural & Environment' ? (
                  <NgasCluster8 isEditable={true} />
                ) : selectedNgas === 'Reg X - National Government Audit Sector (NGAS) Cluster 7' ? (
                  <NgasCluster7 isEditable={true} />

                ) : selectedNgasSUCsSAAs === 'Reg X - National Government Audit Sector (NGAS) State Universities and Colleges (SUCs) & Other Stand Alone Agencies (SAAs)' ? (
                  <NgasSUCsSAAs isEditable={true} />

                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) A - Misamis Oriental 1' ? (
                  <LgasA isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) B - Misamis Oriental 2' ? (
                  <LgasB isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) C - Cities of Cagayan de Oro, Gingoog & El Salvador' ? (
                  <LgasC isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) D - Bukidnon 1' ? (
                  <LgasD isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) E - Bukidnon 2' ? (
                  <LgasE isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) F - Misamis Occidental 1' ? (
                  <LgasF isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) G - Cities of Oroquita, Ozamiz and Tangub' ? (
                  <LgasG isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) H - Lanao del Norte 1' ? (
                  <LgasH isEditable={true} />
                ) : selectedLgas === 'Reg X - Local Government Audit Sector (LGAS) I - Lanao del Norte 2' ? (
                  <LgasI isEditable={true} />
                ) : (
                  <TableRow>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentSection, setCurrentSection] = useState('Reg X - Local Government Audit Sector (LGAS) A - Misamis Oriental 1');
  const tableContainerRef = useRef(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

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

  // Add the debounce function at the top level
const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Update the useEffect with improved Intersection Observer configuration
useEffect(() => {
  if (!tableContainerRef.current) return;

  const options = {
    root: tableContainerRef.current,
    threshold: 0.5, // Increased threshold for more stable detection
    rootMargin: '-20px 0px'
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
        const sectionType = entry.target.getAttribute('data-testid');
        switch (sectionType) {
          case 'lgas-a':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) A - Misamis Oriental 1');
            break;
          case 'lgas-b':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) B - Misamis Oriental 2');
            break;
          case 'lgas-c':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) C - Cities of Cagayan de Oro, Gingoog & El Salvador');
            break;
          case 'lgas-d':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) D - Bukidnon 1');
            break;
          case 'lgas-e':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) E - Bukidnon 2');
            break;
          case 'lgas-f':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) F - Misamis Occidental 1');
            break;
          case 'lgas-g':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) G - Cities of Oroquita, Ozamiz and Tangub');
            break;
          case 'lgas-h':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) H - Lanao del Norte 1');
            break;
          case 'lgas-i':
            setCurrentSection('Reg X - Local Government Audit Sector (LGAS) I - Lanao del Norte 2');
            break;
          case 'ngas-main':
            setCurrentSection('Reg X - National Government Audit Section (NGAS) Clusters 1, 2, 3 & 4');
            break;
          case 'ngas-cluster1':
            setCurrentSection('NGAS Cluster 1 - Executive Offices');
            break;
          case 'ngas-cluster2':
            setCurrentSection('NGAS Cluster 2 - Oversight & Public Debt. Management Agencies');
            break;
          case 'ngas-cluster3':
            setCurrentSection('NGAS Cluster 3 - Legislative, Judiciary & Constitutional Offices');
            break;
          case 'ngas-cluster4':
            setCurrentSection('NGAS Cluster 4 - Defense & Security');
            break;
          case 'ngas-cluster5':
            setCurrentSection('Reg X - National Government Audit Section(NGAS) Cluster 5');
            break;
          case 'ngas-cluster68':
            setCurrentSection('Reg X - National Government Audit Sector (NGAS) Clusters 6 & 8');
            break;
          case 'ngas-cluster6':
            setCurrentSection('NGAS Cluster 6 - Health & Science');
            break;
          case 'ngas-cluster8':
            setCurrentSection('NGAS Cluster 8 - Agricultural & Environment');
            break;
          case 'ngas-cluster7':
            setCurrentSection('Reg X - National Government Audit Sector (NGAS) Cluster 7');
            break;
          case 'ngas-sucs-saas':
            setCurrentSection('Reg X - National Government Audit Sector (NGAS) State Universities and Colleges (SUCs) & Other Stand Alone Agencies (SAAs)');
            break;
          case 'cgas-main':
            setCurrentSection('Reg X - Corporate Government Audit Sector (CGAS) Clusters 1, 2, & 4');
            break;
          case 'cgas-cluster1':
            setCurrentSection('CGAS Cluster 1 - Banking & Credit');
            break;
        }
      }
    });
  }, options);

  // Observe all section elements
  const sections = document.querySelectorAll('[data-testid^="lgas-"], [data-testid^="ngas-"]');
  sections.forEach(section => {
    sectionObserver.observe(section);
  });

  return () => {
    sectionObserver.disconnect();
  };
}, []);

  // Add this function before the return statement in the Manning component
  const exportToExcel = () => {
    const table = document.querySelector('table');
    
    const ws = XLSX.utils.table_to_sheet(table, { 
      raw: false,
      cellStyles: true 
    });
    
    const columnWidths = [
      { wch: 10 },  // Sector
      { wch: 8 },   // AG
      { wch: 10 },  // Team No.
      { wch: 50 },  // Official Station
      { wch: 50 },  // Auditees
      { wch: 30 },  // Name
      { wch: 30 },  // Position
      { wch: 30 },  // Designation
      { wch: 8 },   // No.
      { wch: 20 }   // Office Order
    ];

    ws['!cols'] = columnWidths;
    const range = XLSX.utils.decode_range(ws['!ref']);

    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        
        if (!ws[cell_ref]) {
          ws[cell_ref] = { v: '', s: {} };
        }

        let cellStyle = {
          alignment: {
            vertical: 'center',
            wrapText: true,
            horizontal: C <= 2 ? 'center' : 'left' // Center first 3 columns, left align others
          },
          border: {
            top: { style: 'thin' },
            bottom: { style: 'thin' },
            left: { style: 'thin' },
            right: { style: 'thin' }
          },
          font: {
            name: 'Arial',
            sz: 10
          }
        };

        // Set the style for the cell
        if (!ws[cell_ref].s) ws[cell_ref].s = {};
        Object.assign(ws[cell_ref].s, cellStyle);
      }
    }

    // Set row heights for better wrapped text display
    ws['!rows'] = Array(range.e.r + 1).fill({ hpt: 35 }); // Increased height

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Manning Complement');

    XLSX.writeFile(wb, 'manning_complement_test.xlsx', {
      bookType: 'xlsx',
      bookSST: false,
      type: 'binary',
      cellStyles: true
    });
  };

  // Add this useEffect to handle scrolling
  useEffect(() => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop = 0;
      
      // Reset to first section when switching to Default view
      if (selectedFilter === 'all') {
        setCurrentSection('Reg X - Local Government Audit Sector (LGAS) A - Misamis Oriental 1');
      }
    }
  }, [selectedFilter]);

  return (
    <ManningProvider>
      <NumberingProvider>
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
            <WindowControl />
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
                padding: 2, // Reduced padding to give more space
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
              }}
            >
              <Container maxWidth="lg">
                <Box 
                  sx={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                    backdropFilter: 'blur(3px)',
                    borderRadius: 2,
                    padding: 3, // Reduced padding
                    boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    height: 'calc(100vh - 140px)', // Increased height
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
                    <Box>
                      <Typography variant="h5" component="h1" fontWeight="bold">
                        Manning Complement
                      </Typography>
                      {(!selectedFilter || selectedFilter === 'all') ? (
                        <Typography variant="subtitle1" sx={{ mt: 1, mb: -1, color: 'black' }}>
                          {currentSection}
                        </Typography>
                      ) : (
                        <Typography variant="subtitle1" sx={{ mt: 1, mb: -1, color: 'black' }}>
                          {selectedFilter === 'LGAS A-I' && 'Local Government Audit Sectors A-I'}
                          {selectedFilter === 'NGAS Cluster 1-8' && 'National Government Audit Section Clusters 1-8'}
                          {/* Add other sector subtitles here */}
                        </Typography>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                      <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: 1,
                        alignItems: 'flex-end'
                      }}>
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
                        
                        <Box sx={{ 
                          display: 'flex', 
                          gap: 1,
                          alignItems: 'center',
                        }}>
                          <Select
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            size="small"
                            displayEmpty
                            MenuProps={{
                              PaperProps: {
                                style: {
                                  maxHeight: 250, // Reduced height
                                },
                                sx: {
                                  '&::-webkit-scrollbar': {
                                    width: '6px', // Reduced scrollbar width
                                  },
                                  '&::-webkit-scrollbar-track': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.05)',
                                  },
                                  '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.15)',
                                    borderRadius: '5px',
                                  }
                                }
                              },
                            }}
                            sx={{
                              width: '175px',
                              height: '32px',
                              '& .MuiSelect-select': {
                                py: 0.5,
                              },
                              '&.MuiOutlinedInput-root': {
                                borderRadius: '12px',
                              }
                            }}
                          >
                            <MenuItem value="" disabled>
                              Filter
                            </MenuItem>
                            <MenuItem value="all">Default</MenuItem>
                            <MenuItem 
                              value="LGAS A-I"
                              sx={{
                                '&.Mui-selected': {
                                  backgroundColor: 'transparent',
                                },
                                '&.Mui-selected:hover': {
                                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                                }
                              }}
                            >
                              LGAS A-I
                            </MenuItem>
                            <MenuItem value="NGAS Cluster 1-8">NGAS Cluster 1-8</MenuItem>
                            <MenuItem value="NGAS SUCs & Other SAAs">NGAS SUCs & Other SAAs</MenuItem>
                            <MenuItem value="CGAS Cluster 1-6">CGAS Cluster 1-6</MenuItem>
                            <MenuItem value="CGAS WD & Other SAAs">CGAS WD & Other SAAs</MenuItem>
                            <MenuItem value="ORD">ORD</MenuItem>
                            <MenuItem value="OARD">OARD</MenuItem>
                            <MenuItem value="ATFD">ATFD</MenuItem>
                            <MenuItem value="ATFD FS">ATFD FS</MenuItem>
                            <MenuItem value="ATFD FS/Cashier">ATFD FS/Cashier</MenuItem>
                            <MenuItem value="ATFD HRMS">ATFD HRMS</MenuItem>
                            <MenuItem value="ATFD RMS">ATFD RMS</MenuItem>
                            <MenuItem value="ATFD TS">ATFD TS</MenuItem>
                            <MenuItem value="ATFD IT">ATFD IT</MenuItem>
                            <MenuItem value="ATFD GSS">ATFD GSS</MenuItem>
                            <MenuItem value="FRAUD AUDIT DIVISION">FRAUD AUDIT DIVISION</MenuItem>
                            <MenuItem value="LEGAL & ADJUCATION">LEGAL & ADJUCATION</MenuItem>
                            <MenuItem value="AGAD">AGAD</MenuItem>
                            <MenuItem value="TECHNICAL AUDIT GROUP A-D">TECHNICAL AUDIT GROUP A-D</MenuItem>
                          </Select>

                          <IconButton
                            onClick={handleEditClick}
                            sx={{
                              padding: '4px',
                            '&:focus': {
                              outline: 'none'
                            },
                          }}
                          >
                            <BorderColorRoundedIcon sx={{ fontSize: 22 }} />
                          </IconButton>

                          <IconButton
                            onClick={exportToExcel}
                            sx={{
                              padding: '4px',
                            '&:focus': {
                            outline: 'none'
                          },
                        }}
                          >
                            <GetAppRoundedIcon sx={{ fontSize: 22 }} />
                          </IconButton>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <TableContainer 
                    ref={tableContainerRef}
                    component={Paper} 
                    sx={{ 
                      flexGrow: 1, 
                      overflow: 'auto',
                      borderRadius: 2,
                      boxShadow: 3,
                      mt: -1,
                      maxHeight: 'calc(100vh - 280px)',
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
                        width: '6px', // Reduced scrollbar width
                        height: '6px',
                      },
                      '&::-webkit-scrollbar-track': {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                        borderRadius: '3px',
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
                        {selectedFilter === 'all' ? (
                          <>
                            <LgasA isEditable={false} />
                            <LgasB isEditable={false} />
                            <LgasC isEditable={false} />
                            <LgasD isEditable={false} />
                            <LgasE isEditable={false} />
                            <LgasF isEditable={false} />
                            <LgasG isEditable={false} />
                            <LgasH isEditable={false} />
                            <LgasI isEditable={false} />
                            <NgasMain isEditable={false} />
                            <NgasCluster1 isEditable={false} />
                            <NgasCluster2 isEditable={false} />
                            <NgasCluster3 isEditable={false} />
                            <NgasCluster4 isEditable={false} />
                            <NgasCluster5 isEditable={false} />
                            <NgasCluster68 isEditable={false}/>
                            <NgasCluster6 isEditable={false}/>
                            <NgasCluster8 isEditable={false}/>
                            <NgasCluster7 isEditable={false}/>
                            <NgasSUCsSAAs isEditable={false} />
                            <CgasMain isEditable={false} />
                            <CgasCluster1 isEditable={false} />
                          </>
                        ) : selectedFilter === 'LGAS A-I' ? (
                          <>
                            <LgasA isEditable={false} />
                            <LgasB isEditable={false} />
                            <LgasC isEditable={false} />
                            <LgasD isEditable={false} />
                            <LgasE isEditable={false} />
                            <LgasF isEditable={false} />
                            <LgasG isEditable={false} />
                            <LgasH isEditable={false} />
                            <LgasI isEditable={false} />
                          </>
                        ) : selectedFilter === 'NGAS Cluster 1-8' ? (
                          <>
                            <NgasMain isEditable={false} />
                            <NgasCluster1 isEditable={false} />
                            <NgasCluster2 isEditable={false} />
                            <NgasCluster3 isEditable={false} />
                            <NgasCluster4 isEditable={false} />
                            <NgasCluster5 isEditable={false} />
                            <NgasCluster68 isEditable={false}/>
                            <NgasCluster6 isEditable={false}/>
                            <NgasCluster8 isEditable={false}/>
                            <NgasCluster7 isEditable={false}/>
                          </>
                        ) : selectedFilter === 'NGAS SUCs & Other SAAs' ? (
                          <NgasSUCsSAAs isEditable={false} />
                        ) : selectedFilter === 'CGAS Cluster 1-6' ? (
                          <>
                          <CgasMain isEditable={false} />
                          <CgasCluster1 isEditable={false} />
                          </>
                        ) : null}
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
      </NumberingProvider>
    </ManningProvider>
  );
};

export default Manning;