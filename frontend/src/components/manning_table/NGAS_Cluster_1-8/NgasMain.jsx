import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const NgasMain = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);

  return (
    <>
      <TableRow data-testid="ngas-main"></TableRow>
      <TableRow>
        <TableCell rowSpan={2}>NGAS</TableCell>
        <TableCell rowSpan={2}>Clusters 1, 2, 3 & 4</TableCell>
        <TableCell>-</TableCell>
        <TableCell>Regional Office No X, Cagayan de Oro City</TableCell>
         <TableCell>
                  <Stack spacing={1}>
                    <Typography variant="body2">
                    Cluster 1 - Executive Offices 
                    </Typography>
                    <Typography variant="body2">
                    Cluster 2 - Legislative and Oversight
                    </Typography>
                    <Typography variant="body2">
                    Cluster 3 - Judiciary and Constitutional Offices
                    </Typography>
                    <Typography variant="body2">
                    Cluster 4 - Defense and Security
                    </Typography>
                  </Stack>
                  </TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="NgasMain-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>{getNumber("NgasMain-1")}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(1)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell isEditable={isEditable} cellId={`NgasMain-1-${index + 2}`} /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>{getNumber(`NgasMain-1-${index + 2}`)}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}
    </>
  );
};
NgasMain.propTypes = {
  isEditable: PropTypes.bool
};

NgasMain.defaultProps = {
  isEditable: false
};
export default NgasMain;