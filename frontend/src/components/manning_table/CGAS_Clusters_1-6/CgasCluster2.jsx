import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasCluster2 = ({ isEditable = false }) => {
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
        id: 'cgas2-team05-unique2',
        team: "05",
        station: "HDMF, Cagayan de Oro City",
        auditees: [
          "1. Home Dev't. Mutual Fund (HDMF) Northern Mindanao",
          "2. Home Dev't. Mutual Fund (HDMF) CDO Carmen Branch",
          "3. Home Dev't. Mutual Fund (HDMF) CDO Lapasan Branch",
          "4. Home Dev't. Mutual Fund (HDMF) Robinson Limketkai Services",
          "5. Home Dev't. Mutual Fund (HDMF) Puerto MSO",
          "6. Home Dev't. Mutual Fund (HDMF) Gingoog MSO",
          "7. Home Dev't. Mutual Fund (HDMF) Camiguin MSO",
          "8. Home Dev't. Mutual Fund (HDMF) Iligan Branch",
          "9. Home Dev't. Mutual Fund (HDMF) Iligan MSO",
          "10. Home Dev't. Mutual Fund (HDMF) Tubod MSO",
          "11. Home Dev't. Mutual Fund (HDMF) Valencia Branch",
          "12. Home Dev't. Mutual Fund (HDMF) Malaybalay MSO",
          "13. Home Dev't. Mutual Fund (HDMF) Cagayan Housing Business Center (HSB)",
          "14. Home Dev't. Mutual Fund (HDMF) Northern Mindanao - Technical & Admin Support (TAS)"
        ]
      },
      {
        id: 'cgas2-team06-unique2', 
        team: "06",
        station: "NHA R10, Cagayan de Oro City",
        auditees: [
          "1. National Home Mortgage Finance Corporation, Cagayan de Oro",
          "2. Social Housing Finance Corporation, Cagayan de Oro",
          "3. National Housing Authority (NHA), Region 10"
        ]
      },
      {
        id: 'cgas2-team07',
        team: "07",
        station: "GSIS, Cagayan de Oro City Branch",
        auditees: [
          "1. Gov't. Service Insurance System (GSIS) Cagayan de Oro City",
          "2. Gov't. Service Insurance System (GSIS) Malaybalay Branch",
          "3. Gov't. Service Insurance System (GSIS) Iligan Branch",
          "4. Social Security System (SSS) NMB Carmen",
          "5. Social Security System (SSS) Carmen Branch",
          "6. Social Security System (SSS) Lapasan Branch",
          "7. Social Security System (SSS) Gingoog Branch",
          "8. Social Security System (SSS) Valencia Branch",
          "9. Social Security System (SSS) Iligan Branch",
          "10. Social Security System (SSS) Ozamiz Branch",
          "11. Social Security System (SSS) Oroquieta Branch"
        ]
      }
      ].map((team) => (
        <React.Fragment key={team.id}>
          <TableRow data-testid="cgas-cluster2">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 2</TableCell>
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

CgasCluster2.propTypes = {
  isEditable: PropTypes.bool
};

CgasCluster2.defaultProps = {
  isEditable: false
};

export default CgasCluster2;