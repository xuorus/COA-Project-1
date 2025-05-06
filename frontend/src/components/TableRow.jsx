import React from 'react';
import { TableCell, TableRow } from '@mui/material';
import { useNumbering } from '../context/NumberingContext';
import NameCell from './NameCell';

const CustomTableRow = ({ rowIndex, isEditable }) => {
  const { getNumber, getPosition } = useNumbering();
  const cellId = `cell-${rowIndex}`;

  return (
    <TableRow>
      <TableCell>{getNumber(cellId)}</TableCell>
      <TableCell>
        <NameCell cellId={cellId} isEditable={isEditable} />
      </TableCell>
      <TableCell>{getPosition(cellId)}</TableCell>
    </TableRow>
  );
};

export default CustomTableRow;