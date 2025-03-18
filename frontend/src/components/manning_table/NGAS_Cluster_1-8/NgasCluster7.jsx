import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster7 = ({ isEditable = false }) => {
  // Helper function to render auditee content
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
            {
              title: "Auditees Under:",
              details: [ 
                "Cluster 7 - Public Works, Transport and Energy"
              ]
            },
          ]
        },
        {
          team: "01",
          station: "DPWH Regional Office 10, Bulua, Cagayan de Oro City",
          auditees: [
            "1. Dept. of Public Works & Highways (DPWH) Regional Office No. X",
            "2. Dept. of Public Works & Highways (DPWH) Camiguin District Engineering Office (DEO)",
            "3. Land Transportation Office (LTO)-Camiguin District Office",
            "-"
          ]
        },
        {
          team: "02",
          station: "DPWH CDO 1st DEO, Bulua, Cagayan de Oro City",
          auditees: [
            "1. Dept. of Public Works & Highways (DPWH) Cagayan de Oro 1st DEO",
            "2. Dept. of Public Works & Highways (DPWH) Cagayan de Oro 2nd DEO"
          ]
        },
        {
          team: "03",
          station: "DPWH Mis. Or. 1st DEO, (Gingoog)",
          auditees: [
            "1. Dept. of Public Works & Highways (DPWH) Misamis Oriental 1st DEO - Gingoog City",
            "2. Dept. of Public Works & Highways (DPWH) Misamis Oriental 2nd DEO - El Salvador City",
            "3. Land Transportation Office (LTO) - Gingoog District Office",
            "4. Philippine Coast Guard (PCG)Cagayan de Oro City"
          ]
        },
        {
          team: "04",
          station: "DPWH Bukidnon 1st DEO (Malaybalay)",
          auditees: [
            "1. Dept. of Public Works & Highways (DPWH) Bukidnon 1st DEO - Malaybalay City",
            "2. Dept. of Public Works & Highways (DPWH) Bukidnon 2nd DEO - Don Carlos, Bukidnon",
            "3. Land Transportation Office (LTO) - Malaybalay District Office",
            "4. Land Transportation Office (LTO) - Maramag Extension Office",
            "5. Land Transportation Office (LTO) - Valencia Mobile Office and Valencia e-Patrol Office",
            "6. Land Transportation Office (LTO) - Kibawe District Office"
          ]
        },
        {
          team: "05",
          station: "DPWH Bukidnon 3rd DEO, Dicklum, Manolo Fortich",
          auditees: [
            "1. Dept. of Public Works & Highways (DPWH) Bukidnon 3rd DEO, Dicklum, Manolo Fortich, Bukidnon",
            "-"
          ]
        },
        {
          team: "06",
          station: "DPWH Lanao del Norte 1st DEO (Del Carmen, Iligan City)",
          auditees: [
            "1. Dept. of Public Works & Highways (DPWH) Lanao Del Norte 1st DEO, Del Carmen, Iligan City",
            "2. Dept. of Public Works & Highways (DPWH) Iligan City DEO",
            "3. Land Transportation Office (LTO) Tubod Extension Office"
          ]
        },
        {
            team: "06",
            station: "DPWH Lanao del Norte 1st DEO (Del Carmen, Iligan City)",
            auditees: [
              "1. Dept. of Public Works & Highways (DPWH) Lanao Del Norte 1st DEO, Del Carmen, Iligan City",
              "2. Dept. of Public Works & Highways (DPWH) Iligan City DEO",
              "3. Land Transportation Office (LTO) Tubod Extension Office"
            ]
          },
          {
            team: "07",
            station: "DPWH Lanao del Norte 2nd DEO (Palao, Iligan City)",
            auditees: [
              "1. Dept. of Public Works & Highways (DPWH) Lanao Del Norte 2nd DEO - Del Carmen, Iligan City",
              "2. Land Transportation Office (LTO)-Iligan City District Office Rosario Heights, Tubod, Iligan City",
              "3. Land Transportation Office (LTO) - Initao District Office - Initao, Misamis Oriental",
              "4. Philippine Coast Guard (PCG) Station Lanao del Norte - Port Area, Iligan City"
            ]
          },
          {
            team: "08",
            station: "DPWH Misamis Occidental 1st DEO, Oroquieta City",
            auditees: [
              "1. Dept. of Public Works & Highways (DPWH) Misamis Occidental 1st DEO - Oroquieta City",
              "2. Dept. of Public Works & Highways (DPWH) Misamis Occidental 2nd DEO - Tangub City",
              "3. Land Transportation Office (LTO) - Oroquieta District Office",
              "4. Land Transportation Office (LTO) - Ozamis City District Office",
              "5. Land Transportation Office (LTO) - Tangub District Office",
              "6. PCG Ozamiz Station, Port Area, Ozamiz City",
              "7. PCG, Port Area, Canubay, Oroquieta City"
            ]
          },
          {
            team: "09",
            station: "LTO Regional Office X - Cagayan de Oro City",
            auditees: [
              "1. Land Transportation Office (LTO) Regional Office X - CDO ",
              "2. Land Transportation Office (LTO)-Cagayan de Oro District Office, Bulua, Cagayan de Oro City",
              "3. Land Transportation Office (LTO)-Cagayan de Oro Licensing Center, Bulua, Cagayan de Oro City",
              "4. Land Transportation Office (LTO)- 2nd District  Cagayan de Oro District Office, Agusan, Cagayan de Oro City",
              "5. Land Transportation Office (LTO)-DLRC- Limketkai Center, Cagayan de Oro City",
              "6. Land Transportation Office (LTO)-DLRO-Cagayan de Oro City, SM Uptown, Upper Carmen, Cagayan de Oro City",
              "7. Maritime Industry Authority (MARINA) Regional Office X - Cagayan de Oro City",
              "8. Maritime Industry Authority (MARINA) Regional Office X - Cagayan de Oro City",
              "9. Department of Tourism (DOT) Regional Office X",
              "10. PCG Northern Mindanao - Cagayan de Oro City",
              "11. PCG Station - Tagoloan, Misamis Oriental",
              "12. PCG Station - Mahinog, Camiguin"
            ]
          }
      ].map((team) => (
        <React.Fragment key={team.team || 'empty'}>
          <TableRow data-testid="ngas-cluster5">
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 7</TableCell>
            <TableCell>{team.team === "-" ? "-" : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{renderAuditee(team.auditees[0])}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster7-${team.team || '0'}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{renderAuditee(auditee)}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster7-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster7.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster7.defaultProps = {
  isEditable: false
};

export default NgasCluster7;