import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasCluster3 = ({ isEditable = false }) => {
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
        id: 'cgas3-team01',
        team: "01",
        station: "NPC (MinGen), Iligan City",
        auditees: [
          "1. National Power Corporation Mindanao Generation",
          "2. Agus 6/7",
          "3. Agus 4/5",
          "4. Agus 1/2 ",
          "5. Pulangi IV",
          "6.  PICC"
        ]
      },
      {
        id: 'cgas3-team02',
        team: "02",
        station: "PPA/PMO, Cagayan de Oro City",
        auditees: [
          "1. Philippine Ports Authority, Port Management Office Regional Office No. 10",
          "2. Terminal Management Office, Balingoan",
          "3. Terminal Management Office, Camiguin",
          "4. Terminal Management Office, Opol"
        ]
      },
      {
        id: 'cgas3-team03',
        team: "03",
        station: "PPA/PMO, Iligan City",
        auditees: [
          "1. Philippine Ports Authority, Port Management Office, Lanao del Norte/ Iligan City",
          "2. Terminal Management Office, Kolambugan",
          "3. Terminal Management Office, Tubod",
          "4. Philippine Ports Authority, Port Management Office, Misamis Occidental/ Ozamiz City",
          "5. Terminal Management Office, Plaridel",
          "6. Terminal Management Office, Jimenez"
        ]
      },
      {
        id: 'cgas3-team04',
        team: "04",
        station: "PPC Area 8, Cagayan de Oro City",
        auditees: [
          "1. Phil. Postal Corp. (PPC) - Area 8 - Central Mindanao Admin Center",
          "-"
        ]
      }
      ].map((team) => (
        <React.Fragment key={team.id}>
          <TableRow data-testid="cgas-cluster3">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 3</TableCell>
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
              <TableRow key={`${team.id}-c3-${index + 2}`}>
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

CgasCluster3.propTypes = {
  isEditable: PropTypes.bool
};

CgasCluster3.defaultProps = {
  isEditable: false
};

export default CgasCluster3;