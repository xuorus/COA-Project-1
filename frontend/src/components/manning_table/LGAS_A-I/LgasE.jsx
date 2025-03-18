import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const LgasE = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);
  return (
    <>
      {/* First group (Misamis Oriental 2) */}
      <TableRow data-testid="lgas-e"></TableRow>
      <TableRow>
        <TableCell rowSpan={2}>LGAS</TableCell>
        <TableCell rowSpan={2}>E</TableCell>
        <TableCell>-</TableCell>
        <TableCell>PSAO, Malaybalay City, Bukidnon </TableCell>
        <TableCell>Bukidnon 2</TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-E-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>{getNumber("LGAS-E-1")}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(1)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-E-2-${index + 2}`} /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>{getNumber(`LGAS-E-2-${index + 2}`)}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}
      {[
        {
          team: "01",
          station: "PSAO, Malaybalay City, Bukidnon",
          auditees: [
            "1. Municiplaity of Maramag with 20 Barangays",
            "2. Municipality of Kibawe with 23 Barangays",
            "3. Municipality of Kadingilan with 17 Barangays"
          ]
        },
        {
          team: "02",
          station: "PSAO, Malaybalay City, Bukidnon",
          auditees: [
            "1. Municipality of Don Carlos with 29 Barangays",
            "2. Municipality of Kitaotao with 35 Barangays",
            "-"
          ]
        },
        {
          team: "03",
          station: "PSAO, Malaybalay City, Bukidnon",
          auditees: [
            "1. Municipality of Dangcagan with 14 Barangays",
            "2. Municipality of Quezon with 31 Barangays"
          ]
        },
        {
          team: "04", 
          station: "PSAO, Malaybalay City, Bukidnon",
          auditees: [
            "1. Municipality of Damulog with 17 Barangays",
            "2. Municipality of Pangantucan  & 19 Barangays", 
            "3. Municipality of Kalilangan & 14 Barangays"
          ]
        },
        {
          team: "05",
          station: "PSAO, Malaybalay City, Bukidnon", 
          auditees: [
            "1. Municipality of Baungon with 16 Barangays",
            "2. Municipality of Malitbog with 11 Barangays",
            "3. Municipality of Talakag with 29 Barangays",
            "-"
          ]
        }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>E</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-E-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-E-${team.team}-${index + 2}`} /></TableCell>
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

LgasE.propTypes = {
  isEditable: PropTypes.bool
};

LgasE.defaultProps = {
  isEditable: false
};

export default LgasE;