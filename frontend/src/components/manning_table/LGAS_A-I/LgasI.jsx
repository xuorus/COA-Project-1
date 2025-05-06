import React, { useContext } from 'react';
import { TableRow, TableCell } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const LgasI = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);

  return (
    <>
      <TableRow data-testid="lgas-i"></TableRow>
      <TableRow>    
        <TableCell rowSpan={3}>LGAS</TableCell>
        <TableCell rowSpan={3}>I</TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>Lanao del Norte 2</TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-I-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>{getNumber("LGAS-I-1")}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(2)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-I-1-${index + 2}`} /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>{getNumber(`LGAS-I-1-${index + 2}`)}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}

      {/* Teams 02-07 */}
      {[
        {
          team: "01",
          station: "Tubod, Lanao del Norte",
          auditees: [
            "Provincial Government of Lanao del Norte",
            "-",
            "-",
            "-"
          ]
        },
        {
          team: "02",
          station: "PSAO - Iligan City",
          auditees: [
            "1. Municipality Baroy with 23 Barangays",
            "2. Municipality of Salvador with 25 Barangays"
          ]
        },
        {
          team: "03",
          station: "PSAO - Iligan City",
          auditees: [
            "1. Municipality of Lala with  27 Barangays",
            "2. Municipality of Sapad with 17 Barangays",
            "3. Municipality of Nunungan with  25 Barangays"
          ]
        },
        {
          team: "04", 
          station: "PSAO - Iligan City",
          auditees: [
            "1. Municipality of Sultan Naga Dimaporo with 37 Barangays",
            "2. Municipality of Kapatagan with 33 Barangays", 
            "-"
          ]
        },
        {
          team: "05",
          station: "PSAO - Iligan City", 
          auditees: [
            "1. Municipality of Tubod with 24 Barangays",
            "2. Municipality of Magsaysay with 24 Barangays"
          ]
        }
      ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>I</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-I-${team.team}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{getNumber(`LGAS-I-${team.team}-1`)}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{auditee}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-I-${team.team}-${index + 2}`} /></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{getNumber(`LGAS-I-${team.team}-${index + 2}`)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};
LgasI.propTypes = {
  isEditable: PropTypes.bool
};

LgasI.defaultProps = {
  isEditable: false
};
export default LgasI;