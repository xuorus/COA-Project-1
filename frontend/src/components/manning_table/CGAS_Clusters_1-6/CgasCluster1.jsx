import React, { useContext } from 'react';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import NameCell from '../../NameCell';
import { NumberingContext } from '../../../context/NumberingContext';

const CgasCluster1 = ({ isEditable = false }) => {
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
        id: 'cgas1-team01',
        team: "01",
        station: "BSP, Cagayan de Oro City",
        auditees: [
          "1. BANGKO SENTRAL NG PILIPINAS, CDO Branch",
          "2. AL-AMANAH ISLAMIC INVESTMENT BANK, CDO",
          "3. AAIIBP, Iligan Branch",
          "4. AAIIBP, Marawi Branch",
          "5. UCPB SB (USB) CDO Branch",
          "6. USB Lapasan Branch",
          "7. USB Bulua Branch",
          "8. USB Aloran Branch"
        ]
      },
      {
        id: 'cgas1-team02',
        team: "02",
        station: "DBP, Cagayan de Oro City",
        auditees: [
          "1. BANGKO SENTRAL NG PILIPINAS, Ozamiz City",
          "2. Development Bank of the Philippines (DBP) CDO Branch",
          "3. DBP Limketkai",
          "4. DBP Iligan City",
          "5. DBP Ozamiz City",
          "6. DBP Villanueva",
          "7. DBP BBG Northern Mindanao",
          "8. DBP CDO Lending Center",
          "9. DBP Iligan Lending Center",
          "10. DBP Tubod Branch",
          "11. LBP Ozamiz Branch",
          "12. LBP Oroquieta Branch"
        ]
      },
      {
        id: 'cgas1-team03',
        team: "03",
        station: "DBP, Malaybalay City",
        auditees: [
          "1. DBP Malaybalay Branch",
          "2. DBP Valencia Branch",
          "3. DBP Lending Center – Bukidnon",
          "4. Land Bank of the Philippines (LBP) Aglayan",
          "5. Land Bank of the Philippines (LBP) Don Carlos, Bukidnon",
          "6. Land Bank of the Philippines (LBP) Malaybalay City branch",
          "7. Land Bank of the Philippines (LBP) Manolo Fortich",
          "8. Land Bank of the Philippines (LBP) Maramag Branch",
          "9. Land Bank of the Philippines (LBP) Valencia",
          "10.Land Bank of the Philippines (LBP) Wao",
          "11. Land Bank of the Philippines (LBP) Quezon",
          "12. Land Bank of the Philippines (LBP) Bukidnon Lending Center",
          "13. Land Bank of the Philippines (LBP) Bukidnon Accounting Center"
        ]
      },
      {
        id: 'cgas1-team04',
        team: "04",
        station: "LBP, Velez, Cagayan de Oro City",
        auditees: [
          "1. Land Bank of the Philippines (LBP), Velez Branch",
          "2. Land Bank of the Philippines (LBP), Carmen, SSS Branch",
          "3. Land Bank of the Philippines (LBP), Capistrano Branch",
          "4. Land Bank of the Philippines (LBP), Puerto Branch",
          "5. Land Bank of the Philippines (LBP), Limketkai Extension Office (of Capistrano Branch)",
          "6. Land Bank of the Philippines (LBP), West Mindanao Branches Group",
          "7. Land Bank of the Philippines (LBP), CDO Lending Center",
          "8. Land Bank of the Philippines (LBP), Agrarian Operation Center 10",
          "9. Land Bank of the Philippines (LBP), CDO Accounting Center",
          "10. Land Bank of the Philippines (LBP), Field Legal Services 10",
          "11. Land Bank of the Philippines (LBP), Balingasag",
          "12. Land Bank of The Philippines (LBP), Camiguin",
          "13. Land Bank of The Philippines (LBP), Iligan City",
          "14. Land Bank of The Philippines (LBP), Tubod, Lanao del Norte",
          "15. Land Bank of The Philippines (LBP), Gingoog City",
          "16. Land Bank of The Philippines (LBP), El Salvador, Mis. Or.",
          "17. Land Bank of The Philippines (LBP), Maigo, Lanao del Norte",
          "18. Land Bank of The Philippines (LBP), Kapatagan, Lanao del Norte",
          "19. Land Bank of the Philippines (LBP), Marawi City Branch",
          "20. Land Bank of The Philippines (LBP), Lanao Accounting  Center",
          "21. Land Bank of The Philippines (LBP), Lanao Lending  Center",
          "22. Land Bank of the Philippines (LBP), Tubod Accounting Center"
        ]
      }
      ].map((team) => (
        <React.Fragment key={team.id}>
          <TableRow data-testid="cgas-cluster1">
            <TableCell rowSpan={team.auditees.length}>CGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 1</TableCell>
            <TableCell>{team.team === "-" ? "-" : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{renderAuditee(team.auditees[0])}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`${team.id}-1`}/>
            </TableCell>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
            <TableCell>{getNumber(`${team.id}-1`)}</TableCell>
            <TableCell>-</TableCell>
          </TableRow>
          {team.auditees.slice(1).map((auditee, index) => (
              <TableRow key={`${team.id}-c1-${index + 2}`}>
              <TableCell>-</TableCell>
              <TableCell>-</TableCell>
              <TableCell>{renderAuditee(auditee)}</TableCell>
              <TableCell>
                <NameCell 
                  isEditable={isEditable} 
                  cellId={`${team.id}-${index + 2}`} 
                />
              </TableCell>
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

CgasCluster1.propTypes = {
  isEditable: PropTypes.bool
};

CgasCluster1.defaultProps = {
  isEditable: false
};

export default CgasCluster1;