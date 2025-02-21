import React from 'react';
import PropTypes from 'prop-types';
import {
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Box,
  TextField,
  InputAdornment,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const RecordFilters = ({
  nameSort,
  dateSort,
  selectedBloodType,
  searchQuery,
  onNameSortChange,
  onDateSortChange,
  onBloodTypeSelect,
  onSearchChange,
  bloodTypes,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [bloodTypeAnchorEl, setBloodTypeAnchorEl] = React.useState(null);

  const handleSortClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSortClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        color="#000"
        onClick={handleSortClick}
        disableRipple
        sx={{
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
          '&:focus': { outline: 'none' },
          '&.Mui-focusVisible': { outline: 'none' }
        }}
      >
        <FilterListIcon />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleSortClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            marginTop: 1,
            minWidth: 180,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
          }
        }}
      >
        <MenuItem
          onClick={() => {
            const newSort = nameSort === 'az' ? 'za' : 'az';
            onNameSortChange(newSort);
            handleSortClose();
          }}
          sx={{
            gap: 1,
            padding: '8px 16px',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          {nameSort === 'az' ? (
            <>
              <ArrowUpwardIcon fontSize="small" /> A to Z
            </>
          ) : (
            <>
              <ArrowDownwardIcon fontSize="small" /> Z to A
            </>
          )}
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem
          onClick={() => {
            const newSort = dateSort === 'newest' ? 'oldest' : 'newest';
            onDateSortChange(newSort);
            handleSortClose();
          }}
          sx={{
            gap: 1,
            padding: '8px 16px',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          {dateSort === 'newest' ? (
            <>
              <ArrowDownwardIcon fontSize="small" /> Newest to Oldest
            </>
          ) : (
            <>
              <ArrowUpwardIcon fontSize="small" /> Oldest to Newest
            </>
          )}
        </MenuItem>
        
        <Divider sx={{ my: 1 }} />
        
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            setBloodTypeAnchorEl(e.currentTarget);
          }}
          sx={{
            gap: 1,
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <LocalHospitalIcon fontSize="small" />
            Blood Type
          </Box>
          <ArrowRightIcon fontSize="small" />
        </MenuItem>
      </Menu>

      <Menu
        anchorEl={bloodTypeAnchorEl}
        open={Boolean(bloodTypeAnchorEl)}
        onClose={() => setBloodTypeAnchorEl(null)}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: 2,
            marginTop: 1,
            minWidth: 120,
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
          }
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {bloodTypes.map((type) => (
          <MenuItem
            key={type}
            onClick={() => {
              onBloodTypeSelect(type);
              setBloodTypeAnchorEl(null);
            }}
            selected={selectedBloodType === type}
            sx={{
              padding: '8px 16px',
              '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' },
              '&.Mui-selected': {
                backgroundColor: 'rgba(25, 118, 210, 0.08)',
                '&:hover': {
                  backgroundColor: 'rgba(25, 118, 210, 0.12)',
                }
              }
            }}
          >
            {type === 'all' ? 'All Blood Types' : type}
          </MenuItem>
        ))}
      </Menu>

      <TextField
        variant="outlined"
        size="small"
        placeholder="Search"
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
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
          '& .MuiOutlinedInput-root': {
            borderRadius: '20px',
            '&.Mui-focused fieldset': {
              borderColor: 'black',
            },
            '&:hover fieldset': {
              borderColor: 'black',
            }
          }
        }}
      />
    </Box>
  );
};

RecordFilters.propTypes = {
  nameSort: PropTypes.oneOf(['az', 'za']).isRequired,
  dateSort: PropTypes.oneOf(['newest', 'oldest']).isRequired,
  selectedBloodType: PropTypes.string.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onNameSortChange: PropTypes.func.isRequired,
  onDateSortChange: PropTypes.func.isRequired,
  onBloodTypeSelect: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  bloodTypes: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default RecordFilters;