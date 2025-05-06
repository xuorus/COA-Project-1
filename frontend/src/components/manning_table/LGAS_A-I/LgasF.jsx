import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const LgasF = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);
  return (
    <>
      <TableRow data-testid="lgas-f"></TableRow>
      <TableRow>
        <TableCell rowSpan={3}>LGAS</TableCell>
        <TableCell rowSpan={3}>F</TableCell>
        <TableCell>-</TableCell>
        <TableCell>Oroquieta Province, Oroquieta City</TableCell>
        <TableCell>Misamis Occidental 1</TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-F-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>{getNumber("LGAS-F-1")}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(2)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-F-2-${index + 2}`} /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>{getNumber(`LGAS-F-2-${index + 2}`)}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}
      {[
        {
          team: "01",
          station: "Provincial Office, Misamis Occidental",
          auditees: [
            "Provincial Government of Misamis Occidental",
            "-",
            "-",
            "-",
            "-",
          ]
        },
        {
          team: "02",
          station: "Provincial Office, Misamis Occidental",
          auditees: [
            "1. Municipality of Concepcion with 18 Barangays",
            "2. Municipality of Calamba with 19 Barangays",
            "3. Municipality of Lopez Jaena with 28 Barangays"
          ]
        },
        {
          team: "03",
          station: "Provincial Office, Misamis Occidental",
          auditees: [
            "1. Municipality of Panaon with 16 Barangays",
            "2. Municipality of Jimenez with 24 Barangays",
            "3. Municipality of Aloran  with 38 Barangays"
          ]
        },
        {
          team: "04", 
          station: "PSAO - Ozamiz City, Misamis Occidental",
          auditees: [
            "1. Municipality of Don Victoriano with 11 Barangays",
            "2. Municipality of Bonifacio with 28 Barangays", 
            "3. Municipality of Clarin with 29 Barangays"
          ]
        },
        {
          team: "05",
          station: "Provincial Office, Misamis Occidental", 
          auditees: [
            "1. Municipality of Baliangao with 15 Barangays",
            "2. Municipality of Sapang Dalaga with 28 Barangays",
            "3. Municiplaity of Plaridel with 33 Barangays"
          ]
        },
        {
            team: "06",
            station: "PSAO - Ozamiz City, Misamis Occidental", 
            auditees: [
              "1. Municipality of Sinacaban with 17 Barangays",
              "2. Municipality of Tudela with 33 Barangays"
            ]
          }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>F</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-F-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-F-${team.team}-${index + 2}`} /></TableCell>
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

LgasF.propTypes = {
  isEditable: PropTypes.bool
};

LgasF.defaultProps = {
  isEditable: false
};

export default LgasF;