import { Box, Typography, IconButton, useTheme, useMediaQuery } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import logo from '../assets/logo.png';
import PropTypes from 'prop-types';

const Header = ({ onMenuClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: { xs: '70px', sm: '75px', md: '80px' },
        backgroundColor: '#F5F5F4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: { xs: '0 12px', sm: '0 18px', md: '0 24px' },
        zIndex: 1,
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5, md: 2 } }}>
        <img 
          src={logo} 
          alt="COA Logo" 
          style={{
            height: isMobile ? '50px' : isTablet ? '60px' : '70px',
            width: 'auto',
            objectFit: 'contain'
          }}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 0.2, sm: 0.3, md: 0.5 } }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#000',
              fontSize: { xs: '0.7rem', sm: '0.8rem', md: '0.9rem' },
              lineHeight: 1,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              whiteSpace: 'nowrap'
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
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' },
              whiteSpace: 'nowrap'
            }}
          >
            COMMISSION ON AUDIT
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#000',
              opacity: "0.9",
              fontSize: { xs: '0.65rem', sm: '0.75rem', md: '0.85rem' },
              lineHeight: 1,
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              whiteSpace: 'nowrap'
            }}
          >
            REGIONAL OFFICE X
          </Typography>
        </Box>
      </Box>

      <IconButton
        size={isMobile ? "medium" : "large"}
        edge="end"
        color="inherit"
        aria-label="menu"
        disableRipple
        onClick={onMenuClick}
        sx={{ 
          color: '#000',
          borderRadius: 0,
          padding: { xs: '8px', sm: '12px', md: '16px' },
          '&:hover': {
            backgroundColor: 'rgba(0, 0, 0, 0.04)'
          },
          '&:focus': {
            outline: 'none'
          },
          '&.Mui-focusVisible': {
            outline: 'none'
          }
        }}
      >
        <MenuRoundedIcon sx={{ fontSize: { xs: 24, sm: 26, md: 28 } }} />
      </IconButton>
    </Box>
  );
};

Header.propTypes = {
  onMenuClick: PropTypes.func.isRequired
};

export default Header;