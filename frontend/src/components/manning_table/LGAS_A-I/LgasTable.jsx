import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';

const LgasTable = () => {
  return (
    <>
      {/* First group (Misamis Oriental 1) */}
      <TableRow>
        <TableCell rowSpan={4}>LGAS</TableCell>
        <TableCell rowSpan={4}>A</TableCell>
        <TableCell>-</TableCell>
        <TableCell>COA Regional Office No. X, Cagayan de Oro City</TableCell>
        <TableCell>Misamis Oriental 1</TableCell>
        <TableCell><NameCell /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(3)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>PSAO-Camiguin, Mambajao, Camiguin</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}

      {/* Group B */}
      <TableRow>
        <TableCell rowSpan={3}>LGAS</TableCell>
        <TableCell rowSpan={3}>A</TableCell>
        <TableCell>Team 01</TableCell>
        <TableCell>PSAO-Camiguin, Mambajao, Camiguin</TableCell>
        <TableCell>Provincial Government of Camiguin</TableCell>
        <TableCell><NameCell /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(2)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}

      {/* Teams 02-07 */}
      {[
        {
          team: "02",
          station: "PSAO-Camiguin, Mambajao, Camiguin",
          auditees: [
            "1. Municipality of Mambajao with 15 Barangays",
            "2. Municipality of Catarman with 14 Barangays"
          ]
        },
        {
          team: "03",
          station: "PSAO-Camiguin, Mambajao, Camiguin",
          auditees: [
            "1. Municipality of Sagay with 9 Barangays",
            "2. Municipality of Guinsiliban with 7 Barangays",
            "3. Municipality of Mahinog with 13 Barangays"
          ]
        },
        {
          team: "04",
          station: "Office of the Auditor, Magsaysay, Misl Or.",
          auditees: [
            "1. Municipality of Magsaysay with 25 Barangays",
            "2. Municipality of Medina with 19 Barangays",
            "3. Municipality of Talisayan with 18 Barangays"
          ]
        },
        {
          team: "05", 
          station: "COA Regional Office No. X, Cagayan de Oro City",
          auditees: [
            "1. Municipality of Balingoan with 9 Barangays",
            "2. Municipality of Kinoguitan with 15 Barangays", 
            "3. Municipality of Sugbongcogon with 10 Barangays"
          ]
        },
        {
          team: "06",
          station: "COA Regional Office No. X, Cagayan de Oro City", 
          auditees: [
            "1. Municipality of Binuangan with 8 Barangays",
            "2. Municipality of Salay with 18 Barangays",
            "3. Municipality of Lagonglong with 10 Barangays"
          ]
        },
        {
          team: "07",
          station: "COA Regional Office No. X, Cagayan de Oro City",
          auditees: [
            "1. Municipality of Balingasag with 30 Barangays",
            "2. Municipality of Jasaan with 15 Barangays",
            "3. Municipality of Claveria with 24 Barangays"
          ]
        }
      ].map((team, teamIndex) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>A</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell /></TableCell>
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
              <TableCell><NameCell /></TableCell>
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

export default LgasTable;