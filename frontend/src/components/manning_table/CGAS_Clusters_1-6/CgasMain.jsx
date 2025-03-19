import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasMain = ({ isEditable = false }) => {
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
          team: "-",
          station: "Regional Office No. X, Cagayan de Oro City",
          auditees:[
            {
              title: "Agencies Under:",
              details: [ 
                "Cluster 1 - Banking and Credit",
                "Cluster 2 - Social Services and Housing",
                "Cluster 4 - Industrial and Area Development"
              ]
            },
            "-"
          ]
        }
      ].map((team) => (
        <React.Fragment key={team.team || 'empty'}>
          <TableRow data-testid="cgas-main">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Clusters 1, 2 and 4</TableCell>
            <TableCell>{team.team === "-" ? "-" : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{renderAuditee(team.auditees[0])}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`CgasMain-${team.team || '0'}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{getNumber(`CgasMain-${team.team || '0'}-1`)}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{renderAuditee(auditee)}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`CgasMain-${team.team}-${index + 2}`} /></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{getNumber(`CgasMain-${team.team}-${index + 2}`)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

CgasMain.propTypes = {
  isEditable: PropTypes.bool
};

CgasMain.defaultProps = {
  isEditable: false
};

export default CgasMain;