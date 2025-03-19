import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster8 = ({ isEditable = false }) => {
  return (
    <>
      {[
        {
          team: "07",
          station: "DA RFO X, Cagayan de Oro City",
          auditees: [
            "1. Department of Agriculture - Regional Field Office 10 (DA RFO 10)",
            "2. Agricultural Training Institute - Regional Training Center (ATI-RTC), El Salvador City",
            "3. DA - Research Center for Upland Development (RCUD) - Bukidnon",
            "4. DA - Research and Crop Protection Center (RCPC) - Bukidnon",
            "5. DA - Northern Mindanao Agriculture Crops and Livestock Research Complex (NMACLRC) - Bukidnon",
            "6. DA - Research Center for Hillyland Development (RCHD) - Claveria",
            "7. Bureau of Plant Industry (BPI) - National Plant Quarantine Services (NPQS)- Ozamiz City",
            "8. BPI - National Plant Quarantine Services (NPQS) - Cagayan de Oro City",
            "9. BPI- National Seed Quality Control Services (NSQCS) - Cagayan de Oro City",
            "10. Bureau of Animal Industry (BAI)- National Beef Cattle Research and Development Center (NBCRDC)- Bukidnon"
          ]
        },
        {
          team: "08",
          station: "BFAR R10, Cagayan de Oro City",
          auditees: [
            "1. Bureau of Fisheries and Aquatic Resources- Regional Office No. 10 (BFAR R10), Cagayan de Oro City",
            "2. National Meat Inspection Services (NMIS) RO X",
            "3. Phil. Fiber Industry Dev't. Administration (FIDA) RO X",
            "4. Provincial Environment and Natural Resources Office (PENRO) - Misamis Occidental",
            "5. Community Environment and Natural Resources Office (CENRO)- Oroquieta",
            "6. CENRO- Ozamiz City",
            "7. PhilFIDA Provincial Office - Camiguin",
            "8. Department of Agrarian Reform - Provincial Office - (DARPO) Misamis Occidental"
          ]
        },
        {
            team: "09",
            station: "DENR RO 10, Cagayan de Oro City",
            auditees: [
              "1. Department of Environment of Natural Resources Regional Office No. X (DENR R10)",
              "2. PENRO - Malaybalay City, Bukidnon",
              "3. CENRO - Don Carlos",
              "4. CENRO - Valencia",
              "5. CENRO - Manolo Fortich",
              "6. CENRO - Talakag",
              "7. NAMRIA Map Sales Office - Misamis Oriental",
              "8. Mines and Geo Sciences Bureau (MGB) Regional Office X - Macabalan, Cagayan de Oro City",
              "9. PENRO - Misamis Oriental ",
              "10. CENRO - Initao",
              "11. CENRO - Gingoog"
            ]
          },
          {
            team: "10",
            station: "DTI, RO 10, Cagayan de Oro City",
            auditees: [
              "1. Dept. of Trade & Industry (DTI) Regional Office No. X",
              "2. DTI - Camiguin",
              "3. DTI - Lanao del Norte",
              "4. DTI - Misamis Occidental",
              "5. DTI - Misamis Oriental",
              "6. DTI - Bukidnon",
              "7. Plant Quarantine Services - Iligan City",
              "8. PENRO - Lanao del Norte",
              "9. CENRO - Iligan City",
              "10. CENRO - Kolambugan",
              "11. PENRO - Camiguin"
            ]
          },
          {
            team: "11",
            station: "DAR, RO 10, Cagayan de Oro City",
            auditees: [
              "1. Dept. of Agrarian Reform (DAR) Regional Office No. X",
              "2. DARPO - Bukidnon",
              "3. Environmental Management Bureau 10 (EMB 10)",
              "4. DARPO - Lanao del Norte",
              "5. DARPO - Misamis Oriental",
              "6. Department of Agrarian Reform - Provincial Office - Camiguin (DARPO-Camiguin)"
            ]
          }
    ].map((team) => (
        <React.Fragment key={team.team}>
          <TableRow data-testid="ngas-cluster8"></TableRow>
          <TableRow>
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 8</TableCell>
            <TableCell>Team {team.team}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{team.auditees[0]}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster8-${team.team}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster8-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster8.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster8.defaultProps = {
  isEditable: false
};

export default NgasCluster8;