import React from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import PropTypes from 'prop-types';

const Footer = ({ currentTime }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: { xs: '40px', sm: '40px', md: '40px' },
        backgroundColor: '#F5F5F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: '0 12px', sm: '0 18px', md: '0 24px' },
        zIndex: 1,
        flexDirection: 'row', // Force single row layout
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: '#000',
          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
          fontFamily: 'roboto',
          fontWeight: 'bold',
          whiteSpace: 'nowrap', // Prevent text wrapping
          overflow: 'hidden',
          textOverflow: 'ellipsis', // Add ellipsis if text overflows
          maxWidth: { xs: '60%', sm: '70%', md: 'auto' },
        }}
      >
        All Rights Reserved 2025 © COA Region X
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: '#000',
          fontSize: { xs: '0.6rem', sm: '0.65rem', md: '0.7rem' },
          fontFamily: 'roboto',
          fontWeight: 'bold',
          whiteSpace: 'nowrap', // Prevent text wrapping
        }}
      >
        {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
      </Typography>
    </Box>
  );
};

Footer.propTypes = {
  currentTime: PropTypes.instanceOf(Date).isRequired,
};

export default Footer;