import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasCluster5 = ({ isEditable = false }) => {
  const { getNumber } = useContext(NumberingContext);

  const renderAuditee = (auditee) => {
    if (typeof auditee === 'string') {
      return auditee;
    }
    if (auditee && auditee.title && auditee.details) {
      return (
        <Stack spacing={0.5}>
          <Typography variant="body2" fontWeight="medium">
            {auditee.title}
          </Typography>
          {auditee.details.map((detail, index) => (
            <Typography key={index} variant="body2">
              {detail}
            </Typography>
          ))}
        </Stack>
      );
    }
    return '-';
  };

  return (
    <>
      {[
       {
        id: 'cgas5-team05-unique1',
        team: "05",
        station: "NFA 10, Baloy, Cagayan de Oro City",
        auditees: [
          "1. National Food Authority (NFA) - Regional Office No. X",
          "2. National Food Authority (NFA) - Misamis Oriental PO",
          "3. National Dairy Authority (NDA)-Mindanao Field Office",
          "4. National Food Authority (NFA)  Camiguin, Mambajao",
          "5. Phil. Coconut Authority Regional Office - X (PCA RO-X) "
        ]
      },
      {
        id: 'cgas5-team06-unique1',
        team: "06",
        station: "NIA R10, Cagayan de Oro City",
        auditees: [
          "1. National Irrigation Administration (NIA) RO 10",
          "2. Phil. Coconut Authority Regional Office - X (PCA RO-X)"
        ]
      },
      {
        id: 'cgas5-team07',
        team: "07",
        station: "NIA LAMISCA IMO, Opol, Misamis Orienta;",
        auditees: [
          "1. National Irrigation Administration (NIA) LAMISCA (Lanao/Mis. Occ/ Mis.Or/ Camiguin)",
          "2. Philippine Coconut Authority, Misamis Oriental Provincial Office",
          "3. Philippine Coconut Authority (PCA), Camiguin",
          "-"
        ]
      },
      {
        id: 'cgas5-team08',
        team: "08",
        station: "NFA, Malaybalay City",
        auditees: [
          "1. Phil. Postal Corp. (PPC) - Area 8 - Central Mindanao Admin Center",
          "-"
        ]
      },
      {
        id: 'cgas5-team09',
        team: "09",
        station: "NIA BIMO, Valencia City, Bukidnon",
        auditees: [
          "1. National Irrigation Administration, Bukidnon Irrigation Management Office, Valencia City, Bukidnon",
          "2. Bukidnon Irrigation Management Office, Batongas, Valencia City",
          "3. Philippine Coconut Authority, Bukidnon Provincial Office, Maramag, Bukidnon"
        ]
      },
      {
        id: 'cgas5-team10',
        team: "10",
        station: "NFA Lanao del Norte, Iligan City",
        auditees: [
          "1. National Food Authority, Lanao del Norte",
          "2. Philippine Coconut Authority, Lanao del Norte Provincial Office, Camague Highway, Tomas Cabili, Iligan City"
        ]
      },
      {
        id: 'cgas5-team011',
        team: "11",
        station: "NFA Misamis Occidental",
        auditees: [
          "1. National Food Authority Misamis Occidental",
          "2. Philippine Coconut Authority, Misamis Occidental Provinicial Office, Ozamiz City"
        ]
      }
      ].map((team) => (
        <React.Fragment key={team.id}>
          <TableRow data-testid="cgas-cluster5">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 5</TableCell>
            <TableCell>{team.team === "-" ? "-" : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{renderAuditee(team.auditees[0])}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`${team.id}-1`}/></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{getNumber(`${team.id}-1`)}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.id}-${team.team}-${index + 2}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{renderAuditee(auditee)}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`${team.id}-${index + 2}`}/></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{getNumber(`${team.id}-${index + 2}`)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

CgasCluster5.propTypes = {
  isEditable: PropTypes.bool
};

CgasCluster5.defaultProps = {
  isEditable: false
};

export default CgasCluster5;