import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import backgroundImage from '../assets/bldg.jpg';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import logo from '../assets/logo.png';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const Main = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
            left: '50%',
            transform: 'translateX(-50%)',
            width: '95%',
            height: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: 3,
          }}
        >
          <Box
            sx={{
              width: '92%',
              maxWidth: 1500,
              height: '90%',
              background: 'linear-gradient(179deg, hsla(152, 63.70%, 57.80%, 0.4) 0%, rgb(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(3px)',
              borderRadius: 2,
              padding: '2%',
              display: 'flex',
              flexDirection: { xs: 'column', lg: 'row' }, // Change flex direction breakpoint from md to lg for more space
              alignItems: 'center',
              justifyContent: 'space-around',
              gap: { xs: 4, lg: 0 }, // Add gap for mobile
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'auto',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                position: { xs: 'relative', lg: 'absolute' }, // Relative on mobile, absolute on desktop
                left: { xs: 'auto', lg: '50px' },
                zIndex: 2,
                maxWidth: { xs: '100%', sm: '80%', md: '70%', lg: '50%' },
                mb: { xs: 0, lg: 30 },
                textAlign: { xs: 'center', lg: 'left' }, // Center text on mobile
                px: { xs: 2, lg: 0 } // Add padding on mobile
              }}
            >
              <Typography
                sx={{
                  fontSize: { 
                    xs: '24px', // Even smaller on mobile
                    sm: '28px', // Small tablets
                    md: '32px', // Tablets
                    lg: '40px'  // Desktop
                  }, // Responsive font sizes
                  fontFamily: 'Roboto',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: 'rgba(255, 255, 255, 0.87)',
                  whiteSpace: { xs: 'normal', lg: 'nowrap' }, // Allow wrapping on mobile
                  textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)'
                }}
              >
                HUMAN RESOURCE
              </Typography>
              <Typography
                sx={{
                  fontSize: { 
                    xs: '24px',
                    sm: '28px',
                    md: '32px',
                    lg: '40px'
                  },
                  fontFamily: 'Roboto',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  color: 'rgba(255, 255, 255, 0.87)',
                  marginBottom: '8px',
                  whiteSpace: { xs: 'normal', lg: 'nowrap' },
                  textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)'
                }}
              >
                INFORMATION SYSTEM
              </Typography>
              <Typography
                sx={{
                  fontSize: { 
                    xs: '16px',
                    sm: '18px',
                    md: '20px',
                    lg: '25px'
                  },
                  fontFamily: 'Roboto',
                  fontWeight: 600,
                  color: 'rgba(255, 255, 255, 0.87)',
                  whiteSpace: { xs: 'normal', lg: 'nowrap' },
                  textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)'
                }}
              >
                COA REGION 10
              </Typography>
            </Box>
            <Box
              sx={{
                flex: '0 0 auto',
                height: { xs: '300px', md: '100%' }, // Smaller height on mobile
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Center on all screens
                padding: '20px',
                zIndex: 1
              }}
            >
              <img 
                src={logo} 
                alt="Logo" 
                style={{
                  height: 'auto',
                  maxHeight: '450px',
                  width: 'auto',
                  maxWidth: '100%',
                  opacity: 0.15
                }}
              />
            </Box>
            <Box
              sx={{
                flex: '0 0 auto',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', // Center on all screens
                padding: '20px',
                '& .MuiDateCalendar-root': {
                  border: '1px solid rgba(0, 0, 0, 0.2)',
                  borderRadius: '8px',
                  padding: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                  maxWidth: '100%' // Ensure calendar doesn't overflow
                },
                '& .MuiPickersDay-root:focus': {
                  outline: 'none'
                },
                '& .MuiPickersDay-root.Mui-selected:focus': {
                  outline: 'none'
                }
              }}
            >
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateCalendar />
              </LocalizationProvider>
            </Box>
          </Box>
        </Box>
        <Footer currentTime={currentTime} />
      </Box>
    </ThemeProvider>
  );
};

export default Main;