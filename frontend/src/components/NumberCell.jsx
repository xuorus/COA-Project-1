import React from 'react';
import { TableCell } from '@mui/material';
import { useNumbering } from '../context/NumberingContext';

const NumberCell = ({ cellId }) => {
  const { getNumber } = useNumbering();
  const number = getNumber(cellId);

  return (
    <TableCell align="center">
      {number}
    </TableCell>
  );
};

export default NumberCell;