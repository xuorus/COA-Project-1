import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const NgasSUCsSAAs = ({ isEditable = false }) => {
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
          auditees: [
            "Agencies under State Universities and Colleges and Other NGS Stand Alone Agencies"
          ]
        },
        {
          team: "01",
          station: "USTP, Cagayan de Oro City",
          auditees: [
            "1. University of Science & Technology of Southern Phils. (USTsP) CDO",
            "2. University of Science & Technology of Southern Phils. (USTsP) Claveria",
            "3. Camiguin Polytechnic State College (CPSC)",
            "-"
          ]
        },
        {
          team: "02",
          station: "BSU, Malaybalay City, Bukidnon",
          auditees: [
            "1. Bukidnon State University (BSU) -  Malaybalay City, Bukidnon",
            "2. Northern Bukidnon State College (NBSC) - Manolo Fortich, Bukidnon",
            "3. Central Mindanao University (CMU)",
            "4. Philippine Carabao Center (PCC)"
          ]
        },
        {
         team: "03",
         station: "MSU, Iligan City",
         auditees: [
             "1. Mindanao State University-Iligan Institute of Technology (MSU-IIT)",
             "2. Mindanao State University (MSU) - Naawan",
             "-"
            ]
          },
          {
            team: "04",
            station: "PSAO, Ozamiz City",
            auditees: [
                "1. Northwestern Mindanao State  College of Science & Technology (NMSCST)"
               ]
             }
      ].map((team) => (
        <React.Fragment key={team.team || 'empty'}>
          <TableRow data-testid="ngas-sucs-saas">
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>SUCs & Other SAAs</TableCell>
            <TableCell>{team.team === "-" ? "-" : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{renderAuditee(team.auditees[0])}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasSUCsSAAs-${team.team || '0'}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{getNumber(`NgasSUCsSAAs-${team.team || '0'}-1`)}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{renderAuditee(auditee)}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasSUCsSAAs-${team.team}-${index + 2}`} /></TableCell>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{getNumber(`NgasSUCsSAAs-${team.team}-${index + 2}`)}</TableCell>
              <TableCell>-</TableCell>
            </TableRow>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

NgasSUCsSAAs.propTypes = {
  isEditable: PropTypes.bool
};

NgasSUCsSAAs.defaultProps = {
  isEditable: false
};

export default NgasSUCsSAAs;