import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster2 = ({ isEditable = false }) => {
  return (
    <>
      {[
        {
          team: "03",
          station: "PSA Region 10, Gusa, Cagayan de Oro City",
          auditees: [
            "1. DBM - Department of Budget Management - Regional Office 10, CDO",
            "2. PS - Procurement Service - Regional  Depot  No. 10, CDO",
            "3. PS- Procurement Service - LGU Valencia City Sud-depot, Bukidnon",
            "4. NEDA-RDC- National Economic & Devt Authority Regional Development Council",
            "5. PSA - Philippine Statistics Authority- Regional Statistics Service Office X, CDO",
            "6. PSA - Philippine Statistics Authority - Misamis Oriental Provincial Office, CDO",
            "7. PSA - Philippine Statistics Authority - Bukidnon Provincial Office, Malaybalay City",
            "8. BTR - Bureau of Treasury - Bukidnon Provincial Office, Malaybalay City",
            "9. BTR - Bureau of Treasury - Lanao del Sur Provincial Office",
            "10. CPD- Commission on Population - Regional Office 10"
          ]
        },
        {
          team: "04",
          station: "Bureau of Treasury Regional Office 10, Cagayan de Oro City",
          auditees: [
            "1. BIR - Revenue DO (RDO)No. 99 - Malaybalay City",
            "2. BIR - RDO No. 102 – Marawi",
            "3. BIR - RDO No. 97 – Gingoog",
            "4. BTR - Bureau of Treasury - Regional Office X",
            "5. BTR - Bureau of Treasury - Camiguin PO",
            "6. BTR - Bureau of Treasury - Misamis Oriental POCollection District No X - BOC)",
            "7. BOC - Bureau of Customs - Port of CDO -Collection District X",
            "8. BOC - Bureau of Customs - Port of CDO -Collection District X - Sub-port Mindanao Container Terminal",
            "9. BLGF - Bureau of Local Government Finance - RO 10, Patag, CDOC Extension Office",
            "10. SEC - Securities Exchange Commission - CDO Extension Office",
            "11. PSA -  Philippine Statistics Authority - Camiguin Provincial Office",
            "12. PS - Procurement Service - Prov of Camiguin Sub-Depot",
            "13. PS - Procurement Service - Misamis Oriental Depot"
          ]
        },
        {
            team: "05",
            station: "BIR RD No. 16, Bulua, Cagayan de Oro City",
            auditees: [
              "1. BIR- Revenue Region (RR) 16 - Cagayan de Oro City",
              "2. BIR- RDO No. 98 - CDOC, Bulua, CDOC",
              "3. BIR - RDO No. 100 - Ozamis City",
              "4. BIR - RDO No. 101 - Iligan City",
              "5. PS- Procurement Service- Sub-Depot - Oroquieta City",
              "6. PSA- Phil Statistic Authority- Lanao del Norte",
              "7. PSA - Misamis Occidental",
              "8. BOC - Sub-port of Iligan",
              "9. BOC - Sub-port of Ozamis",
              "10. BTR - Misamis Occidental PO Provincial Office",
              "11. BTR - Lanao del Norte PO - for confirmation if audit belongs to us or COA-ARMM"
            ]
          }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 2</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster2-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster2-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster2.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster2.defaultProps = {
  isEditable: false
};

export default NgasCluster2;