import React from 'react';
import PropTypes from 'prop-types';
import { TableRow, TableCell, Stack, Typography } from '@mui/material';
import NameCell from '../../NameCell';

const NgasCluster5 = ({ isEditable = false }) => {
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
              title: "Agencies Under:",
              details: [ 
                "Cluster 5 - Education and Employment"
              ]
            },
            "-"
          ]
        },
        {
          team: "01",
          station: "DepEd RO X, Cagayan de Oro City",
          auditees: [
            "1. Commission on Higher Education (CHED) Region",
            "2. Dept. of Education (DepEd), RO-X",
            "-",
            "-"
          ]
        },
        {
          team: "02",
          station: "DepEd Mis. Or. Velez St., Cagayan de Oro City",
          auditees: [
            "1. Dept. of Education (DepEd), Division Office -Mis Or with 9 Natl. High School w/ Complete Set Books Accounts, 54 Natl. High School w/o Complete Set Books Accounts & 349 Elementary Schools",
            "-",
            "-"
          ]
        },
        {
          team: "03",
          station: "DepEd District Office, Cagayan de Oro City",
          auditees: [
            "1. Dept. of Education (DepEd), Division Office -Cagayan de Oro City with 40 Natl. High School w/o Complete Set Books Accounts & 64 Elementary Schools and 7 Integrated Schools",
            "2. Dept. of Education (DepEd), Division Office -El Salvador City with 8 Natl. High School w/o Complete Set Books Accounts & 14 Elementary Schools 1 Integrated School"
          ]
        },
        {
          team: "04",
          station: "DepEd District Office, Gingoog City",
          auditees: [
            "1. Dept. of Education (DepEd), Division Office -Gingoog City with 16 Natl. High School w/o Complete Set Books Accounts & 89 Elementary Schools",
            "2. Technical Education and Skills Development Authority (TESDA)- Kinoguitan National Agricultural School-KNAS",
            "3.Technical Education and Skills Development Authority (TESDA) -Regional Training Center (RTC) - Tagoloan"
          ]
        },
        {
          team: "05",
          station: "Camiguin Provincial Satellite Auditing Office (PSAO), Mambajao, Camiguin",
          auditees: [
            "1. Dept. of Education (DepEd), Division Office -Camiguin with 8 Natl. High School w/ Complete Set Books Accounts & 55 Elementary Schools",
            "2. Technical Education and Skills Development Authority (TESDA)-Camiguin Prov'l. Office",
            "3. Technical Education and Skills Development Authority (TESDA)- Camiguin  School of Arts & Trades - CSAT"
          ]
        },
        {
          team: "06",
          station: "DepEd - Division of Bukidnon, Malaybalay City",
          auditees: [
            "1. Dept. of Education (DepEd), Division Office -Bukidnon with 5 Natl. High School w/ Complete Set Books Accounts, 54 Natl. High School w/o Complete Set Books Accounts & 533 Elementary Schools",
            "2. Technical Education and Skills Development Authority (TESDA)-Bukidnon Prov'l. Office."
          ]
        },
        {
          team: "07",
          station: "BNHS, Division of Malaybalay and Division of Valencia City",
          auditees: [
            "1. Dept. of Education (DepEd), Division Office -Valencia  City with 1 Natl. High School w/ Complete Set Books Accounts & 56 Elementary Schools",
            "2. Dept. of Education (DepEd), Division Office -Malaybalay  City with 2 Natl. High School w/ Complete Set Books Accounts, 16 Natl. High School w/o Complete Set Books Accounts & 64 Elementary Schools",
            "3. Technical Education and Skills Development Authority (TESDA)-Provincial Training Center (PTC) - Bukidnon"
          ]
        },
        {
          team: "08",
          station: "DepEd Division, Lanao Del Norte",
          auditees: [
            "1. Dept. of Education (DepEd), Division Office -Lanao del Norte with 5 Natl. High School w/ Complete Set Books Accounts, 84 Natl. High School w/o Complete Set Books Accounts & 299 Elementary Schools",
            "2. Technical Education and Skills Development Authority (TESDA)- Lanao Norte National Schhol for Arts & Trades - LNNAIS",
            "3. Technical Education and Skills Development Authority (TESDA)- Salvador Trade School - STS"
          ]
        },
        {
          team: "09",
          station: "Deped District Office, Iligan City",
          auditees: [
            "1. Dept. of Education (DEPED), Division Office -Iligan City with 12 Natl. High School w/ Complete Set Books Accounts, 18 Natl. High School w/o Complete Set Books Accounts & 92 Elementary Schools",
            "2. Technical Education and Skills Development Authority (TESDA)-Regional Training Center-  Iligan City",
            "3. Technical Education and Skills Development Authority (TESDA)-Lanao del Norte Prov'l. Office"
          ]
        },
        {
          team: "10",
          station: "DepEd - Division of Misamis Occidental, Oroquieta City, Mis. Occ.",
          auditees: [
            "1. Dept. of Education (DEPED), Division Office -Misamis Occidental with 4 Natl. High School w/ Complete Set Books Accounts, 25 Natl. High School w/o Complete Set Books Accounts & 312 Elementary Schools",
            "2. Dept. of Education (DepEd), Division Office -Oroquieta City with 1 Natl. High School w/ Complete Set Books Accounts & 36 Elementary Schools, 6 National High Schools and 8 Integrated Schools",
            "3. Technical Education and Skills Development Authority (TESDA)A-Misamis Occidental PO",
            "4. Technical Education and Skills Development Authority (TESDA)-Prov'l. Training Center- Misamis Occidental",
            "5.Technical Education and Skills Development Authority (TESDA)- Oroquieta Agro-Industrial School - OAIS "
          ]
        },
        {
          team: "11",
          station: "Deped District Office, Ozamiz City",
          auditees: [
            "1. DEPED, Division Office -Ozamiz City with 3 Natl. High School w/ Complete Set Books Accounts, 10 Natl. High School w/o Complete Set Books Accounts & 48 Elementary Schools",
            "2. Dept. of Education (DepEd), Division Office -Tangub City with 1 Natl. High School w/ Complete Set Books Accounts, 9 Natl. High School w/o Complete Set Books Accounts & 55 Elementary Schools",
            "-"
          ]
        },
        {
          team: "12",
          station: "TESDA RO X, Cagayan de Oro City",
          auditees: [
            "1. Technical Education and Skills Development Authority (TESDA) - RO-X",
            "2. Technical Education and Skills Development Authority (TESDA)- Misamis Oriental Provincial Office (PO)",
            "3. Technical Education and Skills Development Authority (TESDA)- Cag de Oro -Bugo School of Arts & Trades- COBSAT",
            "- TESDA Bugo",
            "4. PRC Field Office - Cagayan de Oro City"
          ]
        },
        {
          team: "13",
          station: "DOLE RO X, Cagayan de Oro City",
          auditees: [
            "1. Department of Labor and Employment-DOLE Regional Office",
            "- DOLE - Fos (6) - Lanao del Norte, Bukidnon, Misamis Occidental, Misamis Oriental, (East), Misamis Oriental (West), Camiguin Technical Education and Skills Development Authority",
            "2. National Labor Relations Commission-RAB-X and 8th Division",
            "3. Philippine Overseas Employment Administration (POEA) - Regional Extension Unit",
            "4. National Concilliation and Mediation Board (NCMB) - Regional Office",
            "5. Regional Tripartite Welfare Promotion Board (RTWPB) - Regional Office",
            "6. POEA - Regional Extension Unit",
            "7. Overseas Workers Welfare Administration (OWWA) Region 10"
          ]
        },
      ].map((team) => (
        <React.Fragment key={team.team || 'empty'}>
          <TableRow data-testid="ngas-cluster5">
            <TableCell rowSpan={team.auditees.length}>NGAS</TableCell>
            <TableCell rowSpan={team.auditees.length}>Cluster 5</TableCell>
            <TableCell>{team.team === "-" ? "-" : `Team ${team.team}`}</TableCell>
            <TableCell>{team.station}</TableCell>
            <TableCell>{renderAuditee(team.auditees[0])}</TableCell>
            <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster5-${team.team || '0'}-1`} /></TableCell>
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
              <TableCell><NameCell isEditable={isEditable} cellId={`NgasCluster5-${team.team}-${index + 2}`} /></TableCell>
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

NgasCluster5.propTypes = {
  isEditable: PropTypes.bool
};

NgasCluster5.defaultProps = {
  isEditable: false
};

export default NgasCluster5;