import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster4 = ({ isEditable = false }) => {
  return (
    <>
      {[
        {
          team: "08",
          station: "DILG, Upper Carmen, Cagayan de Oro City",
          auditees: [
            "1. DILG - Department of Interior and Local Govt. - RO and Pos",
            "2. NAPOLCOM - National Police Commission Regional Office X"
          ]
        },
        {
          team: "09",
          station: "PNP, Regional Office 10, Camp Alagar, Lapasan, Cagayan de Oro City",
          auditees: [
            "1. Bureau of Jail Management Penology - X",
            "2. PNP - Philippine National Police - X"
          ]
        },
        {
          team: "10a",
          station: "Phil Army - 4th Infantry Division, Camp Evangelista, Patag, Cagayan de Oro City",
          auditees: [
            "1. Phil Army- 4th Infantry Division, P A, Camp Evangelista, CDOC",
            "-"
          ]
        },
        {
          team: "10b",
          station: "-",
          auditees: [
            "2. Phil Army - 52nd Engineering  Brigade",
            "3.1. (NDRRMC) National Disaster Risk Reduction and Management Council",
            "3.2. OCD - Office of Civil Defense and",
            "4. AFPCES- AFP Commissary & Exchange Services"
          ]
        },
        {
          team: "11",
          station: "Parole & Probation Administration (PPA), 3rd Flr. Joefelmar Building, Mortola Street, Cagayan de Oro City",
          auditees: [
            {
              title: "1. PPA- Parole & Probation Administration RO X,",
              details: [ 
                "Mortola St., CDOC",
                "CDO, POs and 6 cities"
              ]
            },
            "2. NBI - National Bureau of Investigation, CDO",
            "3. NBI - Iligan City ",
            "4. BOD -Bureau of Immigration, CDO",
            "5. BOD, Bureau of Immigration, Iligan City",
            "6. BOD, Bureau of Immigration, Ozamiz City",
            "7. Prosecutor's Office, CDO, POs and Cities",
            "a. Regional Prosecutor (1)",
            "b. Provincial Prosecutors (7)",
            "c. City Prosecutors (9)",
            "8. Land Registration Authority -Registry of Deeds-",
            "9. PAO - Public Attorney's Office, CDO"
          ]
        },
        {
            team: "12",
            station: "BFP Regional Office X, Gumamela Ext., Carmen, Cagayan de Oro City",
            auditees: [
              "Bureau of Fire Protection - Region X (5 Provincial Offices, 74 Municipal fire Station, 16 City Fire Station and 21 City Fire Sub-Station)",
              "-",
            ]
          }
      ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 4</TableCell>
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
                       {detail}
                    </Typography>
                  ))}
                </Stack>
              )}
            </TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster4-${team.team}-1`} /></TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
            <TableRow key={`${team.team}-${index}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{auditee}</TableCell>
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster4-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster4.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster4.defaultProps = {
  isEditable: false
};

export default NgasCluster4;