import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const LgasG = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);
  return (
    <>
      <TableRow data-testid="lgas-g"></TableRow>
      <TableRow>
        <TableCell rowSpan={4}>LGAS</TableCell>
        <TableCell rowSpan={4}>G</TableCell>
        <TableCell>-</TableCell>
        <TableCell>PSAO - Ozamiz City, Misamis Occidental</TableCell>
        <TableCell sx={{ whiteSpace: 'pre-line' }}>
          <Stack spacing={1}>
            <Typography variant="body2">
              1. Cities of Oroquieta & 47 Barangays
            </Typography>
            <Typography variant="body2">
              2. City of Ozamiz & 51 Barangays
            </Typography>
            <Typography variant="body2">
              3. City of Tangub & 55 Barangays
            </Typography>
          </Stack>
        </TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-G-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>{getNumber("LGAS-G-1")}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(3)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-G-2-${index + 2}`} /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>{getNumber(`LGAS-G-2-${index + 2}`)}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}
      {[
        {
          team: "01",
          station: "COA-CAO, Oroquieta City",
          auditees: [
            "City of Oroquieta & 47 Barangays",
            "-",
            "-",
            "-"
          ]
        },
        {
          team: "02",
          station: "COA-CAO, Ozamiz City",
          auditees: [
            "City of Ozamiz with 51 Barangays",
            "-",
            "-"
          ]
        },
        {
            team: "03",
            station: [
              "COA-CAO, Tangub City Hall, Tangub City",
              "-",
              "PSAO - Ozamiz City, Misamis Occidental",
              "-"
            ],
            auditees: [
              "City of Tangub with 55 Barangays",
              "-",
              "-",
              "-"
            ]
          }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>G</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{Array.isArray(team.station) ? team.station[0] : team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-G-${team.team}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>{Array.isArray(team.station) ? team.station[index + 1] : '-'}</TableCell>
              <TableCell>{auditee}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-G-${team.team}-${index + 2}`} /></TableCell>
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

LgasG.propTypes = {
  isEditable: PropTypes.bool
};

LgasG.defaultProps = {
  isEditable: false
};

export default LgasG;