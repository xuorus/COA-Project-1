import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const LgasB = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);
  return (
    <>
      {/* First group (Misamis Oriental 2) */}
      <TableRow data-testid="lgas-b"></TableRow>
      <TableRow>
        <TableCell>LGAS</TableCell>
        <TableCell>B</TableCell>
        <TableCell>-</TableCell>
        <TableCell>PSAO-Misamis Oriental, Cagayan de Oro City</TableCell>
        <TableCell>Misamis Oriental 2</TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-B-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>{getNumber("LGAS-B-1")}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[
        {
          team: "01",
          station: "Province of Misamis Oriental",
          auditees: [
            "Provincial Government of Misamis Oriental",
            "-",
            "-",
            "-"
          ]
        },
        {
          team: "02",
          station: "Regional Office No. X, Cagayan de Oro City",
          auditees: [
            "1. Municipality of Villanueva with 11 Barangays",
            "2. Municipality of Tagoloan with 10 Barangays",
            "-"
          ]
        },
        {
          team: "03",
          station: "COA Auditor's Office, Opol, Misamis Oriental",
          auditees: [
            "1. Municipality of Opol with 14 Barangays",
            "2. Municipality of Alubijid with 16 Barangays",
            "3. Municipality of Laguindingan with 11 Barangays"
          ]
        },
        {
          team: "04", 
          station: "Regional Office No. X, Cagayan de Oro City",
          auditees: [
            "1. Municipality of Libertad with 9 Barangays",
            "2. Municipality of Gitagum with 11 barangays", 
            "3. Municipality of Initao with 16 Barangays"
          ]
        },
        {
          team: "05",
          station: "Regional Office No. X, Cagayan de Oro City", 
          auditees: [
            "1. Municipality of Naawan with 10 Barangays",
            "2. Municipality of Manticao with 13 Barangays",
            "3. Municipality of Lugait with 8 Barangays"
          ]
        }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>B</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-B-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-B-${team.team}-${index + 2}`} /></TableCell>
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

LgasB.propTypes = {
  isEditable: PropTypes.bool
};

LgasB.defaultProps = {
  isEditable: false
};

export default LgasB;