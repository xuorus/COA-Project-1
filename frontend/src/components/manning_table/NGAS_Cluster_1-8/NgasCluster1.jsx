import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster1 = ({ isEditable = false }) => {
  return (
    <>
      {[
        {
          team: "01",
          station: "NCIP, Regional Office 10, Cagayan de Oro City",
          auditees: [
            "1. CDA-Cagayan de Oro Extension Office",
            "2. PBS - Philippine Broadcasting Services - BBS - Bureau Broadcast Services - Provincial Station CDO",
            "3. PBS - BBS - Gingoog Station",
            "4. PIA - Philippine Information Agency - Regional Office and its Provincial Offices",
            "5. DFA-Department of Foreign Affairs CDO - Regional Consular Office",
            "6. DFA-Department of Foreign Affairs Clarin - Mis Occ Consular Office",
            "7. NCIP Regional Office with 4 Provincial Offices Service Centers",
            "8. Games and Amusement Board"
          ]
        },
        {
          team: "02",
          station: "DHSUD, 2nd Floor, Gateway Limketkai, Cagayan de Oro City",
          auditees: [
            "1. PMS - Presidential Management Staff - Regional Field Office",
            "2. HSAC-Human Settlement Adjudication Commission, Regional Office",
            "3. DSUD- Dept of Human Settlement & Urban Development, Regional Office",
            "4. Office of the Presidential Adviser on the Peace, Reconciliation and Unity-International Monitoring, Regional Office",
            "5. NCMF - Natl Commission on Muslim Filipino - Regional Office",
            "6. FPA - Fertilizer and Pesticide Authority, Regional Office X",
            "7. FPA - Misamis Oriental Office",
            "8. FPA - Bukidnon Office",
            "9. FPA - Camiguin Office ",
            "10. PDEA-Phil Drugs Enforcement Administration"
          ]
        }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow data-testid="ngas-cluster1"></TableRow>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 1</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster1-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster1-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster1.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster1.defaultProps = {
  isEditable: false
};

export default NgasCluster1;