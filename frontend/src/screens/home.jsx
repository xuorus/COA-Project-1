import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, ThemeProvider, createTheme, IconButton } from '@mui/material';
import backgroundImage from '../assets/bldg.jpg';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';

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
          </Box>
        </Box>
            {/* Footer */}
        <Footer currentTime={currentTime} />
              </Box>
    </ThemeProvider>
  );
};

export default Main;