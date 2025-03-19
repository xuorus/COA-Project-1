import React, { useContext } from 'react';
import { TableRow, TableCell } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const LgasH = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);

  return (
    <>
      <TableRow data-testid="lgas-h"></TableRow>
      <TableRow>    
        <TableCell rowSpan={5}>LGAS</TableCell>
        <TableCell rowSpan={5}>H</TableCell>
        <TableCell>-</TableCell>
        <TableCell>PSAO - Iligan City</TableCell>
        <TableCell>Lanao del Norte I</TableCell>
        <TableCell><NameCell isEditable={isEditable} cellId="LGAS-H-1" /></TableCell>
        <TableCell>-</TableCell>
        <TableCell>-</TableCell>
        <TableCell>{getNumber("LGAS-H-1")}</TableCell>
        <TableCell>-</TableCell>
      </TableRow>
      {[...Array(4)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-H-1-${index + 2}`} /></TableCell>
          <TableCell>-</TableCell>
          <TableCell>-</TableCell>
          <TableCell>{getNumber(`LGAS-H-1-${index + 2}`)}</TableCell>
          <TableCell>-</TableCell>
        </TableRow>
      ))}

      {/* Teams 02-07 */}
      {[
        {
          team: "01",
          station: "Iligan City Office",
          auditees: [
            "City of Iligan with 44 Barangays",
            "-",
            "-",
            "-",
            "-",
            "-"
          ]
        },
        {
          team: "02",
          station: "PSAO - Iligan City",
          auditees: [
            "1. Municipality of Linamon with 8 Barangays",
            "2. Municipality of Kauswagan with 13 Barangays",
            "3. Municipality of Matungao with 12 Barangays",
            "4. Municipality of Poona-Piagapo with 26 Barangays"
          ]
        },
        {
          team: "03",
          station: "PSAO - Iligan City",
          auditees: [
            "1. Municipality of Baloi with 21 Barangays",
            "2. Municipality of Pantao Ragat with 20 Barangays",
            "3. Municipality of Pantar with 21 Barangays"
          ]
        },
        {
          team: "04", 
          station: "PSAO - Iligan City",
          auditees: [
            "1. Municipality of Bacolod with 16 Barangays",
            "2. Municipality of Munai with 26 Barangays", 
            "3. Municipality of Tagoloan & 7 Barangays"
          ]
        },
        {
          team: "05",
          station: "PSAO - Iligan City", 
          auditees: [
            "1. Municapality of Kolambugan with 26 Barangays",
            "2. Municipality of Tangkal with 18 Barangays",
            "3. Municipality of Maigo with 13 Barangays"
          ]
        }
      ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>LGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>H</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-H-${team.team}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{getNumber(`LGAS-H-${team.team}-1`)}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{auditee}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`LGAS-H-${team.team}-${index + 2}`} /></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{getNumber(`LGAS-H-${team.team}-${index + 2}`)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};
LgasH.propTypes = {
  isEditable: PropTypes.bool
};

LgasH.defaultProps = {
  isEditable: false
};
export default LgasH;