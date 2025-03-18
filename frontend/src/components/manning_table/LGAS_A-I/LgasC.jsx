import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import NameCell from '../../NameCell';

const LgasC = ({ isEditable = false }) => {
  return (
    <>
      {/* First group (Cities) */}
      <TableRow data-testid="lgas-c"></TableRow>
      <TableRow>
        <TableCell rowSpan={2}>LGAS</TableCell>
        <TableCell rowSpan={2}>C</TableCell>
        <TableCell>-</TableCell>
        <TableCell rowSpan={2}>Regional Office No. X, Cagayan de Oro City</TableCell>
        <TableCell>
          <Stack spacing={1}>
            <Typography variant="body2">
              1. City Government of Cagayan de Oro with 80 Barangays
            </Typography>
            <Typography variant="body2">
              2. City of Gingoog with 79 Barangays
            </Typography>
            <Typography variant="body2">
              3. City of El Salvador with 15 Barangays
            </Typography>
          </Stack>
        </TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-C-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      <TableRow>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-C-2" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
      </TableRow>

      {[
        {
          team: "01",
          station: "City Hall, Cagayan de Oro City",
          auditees: [
            "1. City Government of Cagayan de Oro with 80 Barangays;",
            "-",
            "-",
            "-",
            "-"
          ]
        },
        {
          team: "02",
          station: "City Hall, Gingoog City",
          auditees: [
            "2. City of Gingoog with 79 Barangays; and",
            "-",
            "-",
            "-"
          ]
        },
        {
          team: "R10-03",
          station: "City Hall, El Salvador City",
          auditees: [
            "3. City of El Salvador with 15 Barangays",
            "-",
            "-"
          ]
        }
      ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>C</TableCell>
            <TableCell>{team.team.startsWith('R10-') ? team.team : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-C-3${team.team}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{auditee}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-C-4${team.team}-${index + 2}`} /></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

LgasC.propTypes = {
  isEditable: PropTypes.bool
};

LgasC.defaultProps = {
  isEditable: false
};

export default LgasC;