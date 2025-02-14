import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import backgroundImage from '../assets/bldg.jpg';
import logo from '../assets/logo.png';
import Sidebar from '../components/sidebar';

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
            zIndex: -1
          }
        }}
      >
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
            justifyContent: 'space-between',
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
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
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
                  textDecoration: 'overline',
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
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
                  lineHeight: 1,
                  textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)'
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
              borderRadius: 0,
              '&:hover': {
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

        {/* Sidebar Component */}
        <Sidebar 
          open={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <Box
          sx={{
            position: 'absolute',
            top: '64px',
            left: 0,
            right: 0,
            bottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 3,
            padding: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            color: 'white',
            boxShadow: '0 -2px 4px rgba(0, 0, 0, 0.5)'
          }}
        >
          <Box
            sx={{
              width: '92%',
              maxWidth: 1500,
              minHeight: 450,
              background: 'linear-gradient(179deg, hsla(152, 63.70%, 57.80%, 0.4) 0%, rgb(255, 255, 255, 0.8) 100%)',
              backdropFilter: 'blur(3px)',
              borderRadius: 2,
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3,
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {/* Add your content here */}
          </Box>
        </Box>

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
            variant="body"
            sx={{
              mr: 112,
              color: '#000',
              fontSize: '0.7rem',
              fontFamily: 'roboto',
              fontWeight: 'bold'
            }}
          >
            All Rights Reserved 2025 © COA Region X
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: '#000',
              fontSize: '0.7rem',
              fontFamily: 'roboto',
              fontWeight: 'bold'
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