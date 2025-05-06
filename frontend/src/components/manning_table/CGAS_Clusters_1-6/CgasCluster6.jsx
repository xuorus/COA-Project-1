import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasCluster6 = ({ isEditable = false }) => {
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
        id: 'cgas6-team12',
        team: "12",
        station: "PHIC, Cagayan de Oro City",
        auditees: [
          "1. Philippine Charity Sweepstakes Office (PCSO) Bukidnon Branches",
          "2. Philippine Charity Sweepstakes Office (PCSO) Misamis Oriental Branches",
          "3. Philippine Charity Sweepstakes Office (PCSO), Misamis Occidental",
          "4. Philippine Charity Sweepstakes Office (PCSO), Lanao del Norte",
          "5. Philippine Health Insurance Corporation (PHILHEALTH) Regional Office",
          "6. Boy Scouts of the Philippines (BSoP)"
        ]
      }
      ].map((team) => (
        <React.Fragment key={team.id}>
          <TableRow data-testid="cgas-cluster6">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 6</TableCell>
            <TableCell>{team.team === "-" ? "-" : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{renderAuditee(team.auditees[0])}</TableCell>
            <TableCell> <NameCell isEditable={isEditable} cellId={`${team.id}-1`}/></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{getNumber(`${team.id}-1`)}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
             <TableRow key={`${team.id}-c6-${index + 2}`}>
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

CgasCluster6.propTypes = {
  isEditable: PropTypes.bool
};

CgasCluster6.defaultProps = {
  isEditable: false
};

export default CgasCluster6;