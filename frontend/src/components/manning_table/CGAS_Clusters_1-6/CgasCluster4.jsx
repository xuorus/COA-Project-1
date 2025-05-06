import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasCluster4 = ({ isEditable = false }) => {
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
        id: 'cgas4-team08',
        team: "08",
        station: "COA Regional Office X, Cagayan de Oro City",
        auditees: [
          "1. Civil Aviation Authority of the Philippines, Area Center X including 6 Airports",
          "1.1. Camiguin Airport",
          "1.2. Laguindingan Airport",
          "1.3. Malabang Airport",
          "1.4. Iligan (Balo-i) Airport",
          "1.5. Ozamis Airport",
          "1.6. Wao Airport",
          "2. Tourism Infrastructure and Enterprise Zone Authority - Gardens of Malasag Eco-Tourism Village",
          "TIEZA Travel Tax Unit - CDO"
        ]
      }
      ].map((team) => (
        <React.Fragment key={team.id}>
          <TableRow data-testid="cgas-cluster4">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 4</TableCell>
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
            <TableRow key={`${team.id}-c4-${index + 2}`}>
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

CgasCluster4.propTypes = {
  isEditable: PropTypes.bool
};

CgasCluster4.defaultProps = {
  isEditable: false
};

export default CgasCluster4;