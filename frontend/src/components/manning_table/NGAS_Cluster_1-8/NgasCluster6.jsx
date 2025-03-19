import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster6 = ({ isEditable = false }) => {
  return (
    <>
      {[
        {
          team: "01",
          station: "DOH CHD-NM, Cagayan de Oro City",
          auditees: [
            "1. Center for Health Development (CHD) for Northern Mindanao (NM)",
            "2. National Nutrition Council (NNC)- Region X",
            "3. Bureau of Quarantine Provincial Station",
            "4. Food and Drug Administration Satellite Office Northern Mindanao",
            "5. Camiguin General Hospital (newly created from LGU Camiguin) (newly created-previously from LGU Camiguin)"
          ]
        },
        {
          team: "02",
          station: "DOH-MHARSMC, Ozamiz City",
          auditees: [
            "1. DOH-Mayor Hilarion A. Ramiro, Sr. Medical Center (DOH-MHARSMC), Ozamiz City, Misamis Occidental",
            "-"
          ]
        },
        {
            team: "03",
            station: "NMMC, Cagayan de Oro City",
            auditees: [
              "1. Northern Mindanao Medical Center (NMMC), Cagayan de Oro City",
              "2. Dept. of Health (DOH)-Treatment and Rehabilitation Center (TRC)- Cagayan de Oro City",
              "3. First Misamis Oriental General Hospital, Medina, Misamis Oriental",
              "4. DOH Drug Abuse Treatment and Rehabilitation Center- Bukidnon (formerly Northern Mindanao Wellness and Rehabilitation Center, Malaybalay, Bukidnon)"
            ]
          },
          {
            team: "04",
            station: "Amai Pakpak Medical Center, Marawi City",
            auditees: [
              "1. Amai Pakpak Medical Center (APMC) Marawi City, Lanao del Sur",
              "2. Phil. Science High School (PSHS) - Central Mindanao Campus",
              "-",
              "-"
            ]
          },
          {
            team: "05",
            station: "DSWD FO 10, Masterson Avenue Upper Carmen, Cagayan de Oro City",
            auditees: [
              "1. Department of Social Welfare and Development Field Office (FO) No. X",
              "-",
              "-"
            ]
          },
          {
            team: "06",
            station: "DOST Region 10, Cagayan de Oro City",
            auditees: [
              "1. Department of Science and Technology - RO No. X (DOST R10)",
              "2. Department of Information and Communication Technology- Field Operation Office No.1 (DICT-FOO-MC2)",
              "3. NTC - National Telecommunication - RO X, Kauswagan, CDO and Field Offices",
              "4. Philippine Institute of Volcanology and Seismology- Seismic and Volcanic Station - Region X. (PHILVOCS)",
              "5. Philippine Atmospheric Geophysical and Astronomical Services Administration (PAG-ASA Region X)"
            ]
          }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow data-testid="ngas-cluster6"></TableRow>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 6</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster6-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster6-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster6.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster6.defaultProps = {
  isEditable: false
};

export default NgasCluster6;