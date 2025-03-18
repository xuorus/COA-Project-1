import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';

const LgasD = ({ isEditable = false }) => {
  return (
    <>
      {/* First group (Misamis Oriental 2) */}
      <TableRow data-testid="lgas-d"></TableRow>
      <TableRow>
        <TableCell>LGAS</TableCell>
        <TableCell>D</TableCell>
        <TableCell>-</TableCell>
        <TableCell>PSAO, Malaybalay City, Bukidnon </TableCell>
        <TableCell>Bukidnon 1</TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-D-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[
        {
          team: "01",
          station: "-",
          auditees: [
            "Province Government of Bukidnon",
            "-",
            "-",
            "-"
          ]
        },
        {
          team: "02",
          station: "PSAO, Malaybalay City, Bukidnon",
          auditees: [
            "1. City of Malaybalay with 46 Barangays",
            "2. Municipality of Sumilao with 10 Barangays",
            "-"
          ]
        },
        {
          team: "03",
          station: "PSAO, Malaybalay City, Bukidnon",
          auditees: [
            "1. City of Valencia with 31 Barangays",
            "2. Municipality of Cabanglasan with 15 Barangays",
            "-"
          ]
        },
        {
          team: "04", 
          station: "PSAO, Malaybalay City, Bukidnon",
          auditees: [
            "1. Municipality of Libona with 14 Barangays",
            "2. Municipality of Manolo Fortich with 22 Barangays", 
            "3. Municipality of Impasug-ong with 13 barangays"
          ]
        },
        {
          team: "05",
          station: "PSAO, Malaybalay City, Bukidnon", 
          auditees: [
            "1. Municipality of Lantapan with 14 Barangays",
            "2. Municipality of San Fernando with 24 Barangays"
          ]
        }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>D</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-D-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-D-${team.team}-${index + 2}`} /></TableCell>
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

LgasD.propTypes = {
  isEditable: PropTypes.bool
};

LgasD.defaultProps = {
  isEditable: false
};

export default LgasD;