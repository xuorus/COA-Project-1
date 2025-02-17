import React from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Footer = ({ currentTime }) => {
  return (
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
  );
};

Footer.propTypes = {
    currentTime: PropTypes.instanceOf(Date).isRequired,
  };

export default Footer;