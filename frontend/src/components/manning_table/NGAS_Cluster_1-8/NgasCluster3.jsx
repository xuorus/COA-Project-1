import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster3 = ({ isEditable = false }) => {
  return (
    <>
      {[
        {
          team: "06",
          station: "CSC Regional Office 10, Carmen, Cagayan de Oro City",
          auditees: [
            "1. CSC - Civil Service Commission - Region X, Carmen, CDOC",
            "CSC Field Office - Bukidnon",
            "CSC Field Office - Camiguin",
            "CSC Field Office - Lanao del Norte",
            "CSC Field Office - Misamis Occidental",
            "CSC Field Office - Misamis Oriental",
            "2. CHR - Commission on Human Rights - Regional Office –X ",
            "3. CA - Court of Appeals - Mindanao Station",
            {
              title: "4. SC - Supreme Court – Lower Courts Region X",
              details: [ 
                "Misamis Oriental - 4 RTC & 15 MTC",
                "Camiguin - 1 RTC & 3 MTC",
                "Bukidnon - 2 RTC & 11 MTC",
                "Misamis Occidental - 4 RTC & 11 MTC",
                "Lanao del Norte - 3 RTC, 4 SCC & 11 MTC"
              ]
            }
          ]
        },
        {
          team: "07",
          station: "COA Regional Office No X, Cagayan de Oro City",
          auditees: [
            "1. COA - Commission on Audit - Regional Office - X",
            "2. COMELEC - Commission on Election - Regional Office -X with 5 provinces, 9 cities and 84 municipalities",
            "3. OMB - Ombudsman - Regional Office - X"
          ]
        }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 3</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>
              {typeof team.auditees[0] === 'string' ? (
                team.auditees[0]
              ) : (
                <Stack spacing={1}>
                  <Typography variant="body2">{team.auditees[0].title}</Typography>
                  {team.auditees[0].details.map((detail, idx) => (
                    <Typography key={idx} variant="body2" sx={{ pl: 2 }}>
                      • {detail}
                    </Typography>
                  ))}
                </Stack>
              )}
            </TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster3-${team.team}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>
                {typeof auditee === 'string' ? (
                  auditee
                ) : (
                  <Stack spacing={1}>
                    <Typography variant="body2">{auditee.title}</Typography>
                    {auditee.details.map((detail, idx) => (
                      <Typography key={idx} variant="body2" sx={{ pl: 2 }}>
                        • {detail}
                      </Typography>
                    ))}
                  </Stack>
                )}
              </TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster3-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster3.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster3.defaultProps = {
  isEditable: false
};

export default NgasCluster3;