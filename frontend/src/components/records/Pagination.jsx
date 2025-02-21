import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, IconButton } from '@mui/material';

const Pagination = ({ page, totalPages, onPageChange }) => {
  return (
    <Box sx={{ 
      mt: 2,
      display: 'flex', 
      justifyContent: 'center',
      alignItems: 'center',
      gap: 1
    }}>
      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          width: '32px',
          height: '32px',
          overflow: 'hidden'
        }}
      >
        <IconButton 
          disabled={page === 0}
          onClick={() => onPageChange(Math.max(0, page - 1))}
          disableRipple
          sx={{
            color: page === 0 ? 'rgba(0, 0, 0, 0.26)' : '#000',
            padding: 0,
            width: '100%',
            height: '100%',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            },
            '&.Mui-focusVisible': {
              outline: 'none'
            }
          }}
        >
          &lt;
        </IconButton>
      </Box>

      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          padding: '4px 16px',
          borderRadius: '4px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          minWidth: '32px',
          height: '32px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Typography>
          {`${page + 1}`}
        </Typography>
      </Box>

      <Box
        sx={{
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          border: '1px solid rgba(0, 0, 0, 0.12)',
          width: '32px',
          height: '32px',
          overflow: 'hidden'
        }}
      >
        <IconButton 
          disabled={page >= totalPages - 1}
          onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
          disableRipple
          sx={{
            color: page >= totalPages - 1 ? 'rgba(0, 0, 0, 0.26)' : '#000',
            padding: 0,
            width: '100%',
            height: '100%',
            borderRadius: 0,
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)'
            },
            '&.Mui-focusVisible': {
              outline: 'none'
            }
          }}
        >
          &gt;
        </IconButton>
      </Box>
    </Box>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};

export default Pagination;