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
import WindowControl from '../components/WindowControl'; // Add this import
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import '../styles/slider.css';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
  },
});

const getMonthColors = () => {
  const month = new Date().getMonth(); // 0-11
  const colors = {
    0: ['rgba(255, 255, 255, 0.4)', 'rgba(173, 216, 230, 0.8)'], // January
    1: ['rgba(220, 20, 60, 0.4)', 'rgba(255, 192, 203, 0.8)'],   // February
    2: ['rgba(46, 139, 87, 0.4)', 'rgba(147, 112, 219, 0.8)'],   // March
    3: ['rgba(255, 255, 224, 0.4)', 'rgba(124, 252, 0, 0.8)'],   // April
    4: ['rgba(255, 253, 208, 0.4)', 'rgba(200, 162, 200, 0.8)'], // May
    5: ['rgba(255, 218, 185, 0.4)', 'rgba(234, 224, 200, 0.8)'], // June
    6: ['rgba(255, 127, 80, 0.4)', 'rgba(255, 255, 0, 0.8)'],    // July
    7: ['rgba(178, 34, 34, 0.4)', 'rgba(255, 165, 0, 0.8)'],     // August
    8: ['rgba(183, 65, 14, 0.4)', 'rgba(0, 191, 255, 0.8)'],     // September
    9: ['rgba(128, 0, 0, 0.4)', 'rgba(75, 0, 130, 0.8)'],        // October
    10: ['rgba(139, 69, 19, 0.4)', 'rgba(255, 215, 0, 0.8)'],    // November
    11: ['rgba(34, 139, 34, 0.4)', 'rgba(139, 0, 0, 0.8)']       // December
  };
  return colors[month];
};

const CustomPrevArrow = ({ className, onClick }) => (
  <Box 
    className={className}
    sx={{ 
      left: '25px',
      '&:hover': { cursor: 'pointer' }
    }}
    onClick={onClick}
  >
    <ArrowBackIosNewRoundedIcon sx={{ color: 'white', fontSize: 30, ml: -5 }} />
  </Box>
);

const CustomNextArrow = ({ className, onClick }) => (
  <Box 
    className={className}
    sx={{ 
      right: '25px',
      '&:hover': { cursor: 'pointer' }
    }}
    onClick={onClick}
  >
    <ArrowForwardIosRoundedIcon sx={{ color: 'white', fontSize: 30, mr: -5 }} />
  </Box>
);

const SlideContent = () => {
  const slides = [
    // Slide 1
    <Box key="title" sx={{ 
      textAlign: 'center',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      mt: { xs: 5, md: 15 }
    }}>
      <Typography
        sx={{
          fontSize: { xs: '24px', sm: '28px', md: '32px', lg: '40px' },
          fontFamily: 'Roboto',
          fontWeight: 600,
          lineHeight: 1.2,
          color: 'rgba(255, 255, 255, 0.87)',
          whiteSpace: { xs: 'normal', lg: 'nowrap' },
          textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)',
          mb: 1
        }}
      >
        HUMAN RESOURCE
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '20px', sm: '24px', md: '28px', lg: '36px' },
          fontFamily: 'Roboto',
          fontWeight: 600,
          lineHeight: 1.2,
          color: 'rgba(255, 255, 255, 0.87)',
          marginBottom: '8px',
          whiteSpace: { xs: 'normal', lg: 'nowrap' },
          textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)',
        }}
      >
        INFORMATION SYSTEM
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '16px', sm: '18px', md: '20px', lg: '25px' },
          fontFamily: 'Roboto',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.87)',
          whiteSpace: { xs: 'normal', lg: 'nowrap' },
          textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)',
          mb: 3
        }}
      >
        COA REGION 10
      </Typography>
    </Box>,
    // Slide 2
    <Box key="vision" sx={{ 
      textAlign: 'center', 
      p: 2, 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      mt: { xs: 5, md: 15 }
    }}>
      <Typography
        sx={{
          fontSize: { xs: '24px', sm: '28px', md: '32px' },
          fontFamily: 'Roboto',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.87)',
          mb: 3,
          textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)'
        }}
      >
        VISION
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '16px', sm: '18px', md: '20px' },
          fontFamily: 'Roboto',
          color: 'rgba(255, 255, 255, 0.87)',
          textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)',
          maxWidth: '800px',
          mx: 'auto',
          lineHeight: 1.6,
        }}
      >
        A trustworthy, respected and independent audit institution that is an enabling partner of government in ensuring a better life for every Filipino.
      </Typography>
    </Box>,
    // Slide 3
    <Box key="mission" sx={{ 
      textAlign: 'center', 
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      height: '100%',
      mt: { xs: 5, md: 15 }
    }}>
      <Typography
        sx={{
          fontSize: { xs: '24px', sm: '28px', md: '32px' },
          fontFamily: 'Roboto',
          fontWeight: 600,
          color: 'rgba(255, 255, 255, 0.87)',
          mb: 3,
          textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)'
        }}
      >
        MISSION
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: '16px', sm: '18px', md: '20px' },
          fontFamily: 'Roboto',
          color: 'rgba(255, 255, 255, 0.87)',
          textShadow: '0 4px 3px rgba(0, 0, 0, 0.5)'
        }}
      >
        To ensure accountability for public resources, promote transparency, and help improve government operations, in partnership with stakeholders, for the benefit of the Filipino people.
      </Typography>
    </Box>
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    pauseOnHover: true,
    prevArrow: <CustomPrevArrow />,
    nextArrow: <CustomNextArrow />
  };

  return (
    <Box sx={{ width: '100%', maxWidth: '600px', mt: 20 }}>
      <Slider {...settings}>
        {slides}
      </Slider>
    </Box>
  );
};

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
      <WindowControl /> {/* Add this line here */}
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
              background: `linear-gradient(179deg, ${getMonthColors()[0]} 0%, ${getMonthColors()[1]} 100%)`,
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
              <SlideContent />
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
                  height: '450px',
                  maxHeight: '450px',
                  width: '450px',
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
                },
                // Add these styles
                '& .MuiPickersArrowSwitcher-button': {
                  '&:focus': {
                    outline: 'none'
                  }
                },
                '& .MuiPickersCalendarHeader-switchViewButton': {
                  '&:focus': {
                    outline: 'none'
                  }
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