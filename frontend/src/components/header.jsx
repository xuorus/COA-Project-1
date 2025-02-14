import { Box, Typography, IconButton } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import logo from '../assets/logo.png';
import PropTypes from 'prop-types';

const Header = ({ onMenuClick }) => {
  return (
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
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
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
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
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
              textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)'
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
        onClick={onMenuClick}
        sx={{ 
          color: '#000',
          borderRadius: 0,
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
        <MenuRoundedIcon />
      </IconButton>
    </Box>
  );
};

Header.propTypes = {
    onMenuClick: PropTypes.func.isRequired
  };
  
export default Header;