import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasCluster356 = ({ isEditable = false }) => {
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
            <Typography key={`detail-${index}`} variant="body2">
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
          id: 'cgas356',
          team: "-",
          station: "Regional Office No. X, Cagayan de Oro City",
          auditees:[
            {
              title: "Agencies Under:",
              details: [ 
                "Cluster 3 - Public Utilities",
                "Cluster 5 - Agriculture and Natural Resource",
                "Cluster 6 - Social, Cultural Trading, Promotional & Other Services"
              ]
            },
            "-"
          ]
        }
      ].map((team) => (
        <React.Fragment key={team.id}>
          <TableRow data-testid="cgas-cluster356">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Clusters 3, 5 and 6</TableCell>
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
            <TableRow key={`${team.id}-356-${index + 2}`}>
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

CgasCluster356.propTypes = {
  isEditable: PropTypes.bool
};

export default CgasCluster356;