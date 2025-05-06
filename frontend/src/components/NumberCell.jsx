import React from 'react';
import { TableCell } from '@mui/material';
import { useNumbering } from '../context/NumberingContext';
import PropTypes from 'prop-types';

const NumberCell = ({ cellId }) => {
  const { getNumber } = useNumbering();
  const number = getNumber(cellId);

  return (
    <TableCell align="center">
      {number}
    </TableCell>
  );
};

NumberCell.propTypes = {
    cellId: PropTypes.string.isRequired,
    isEditable: PropTypes.bool
  };
  
  NumberCell.defaultProps = {
    isEditable: false
  };

export default NumberCell;