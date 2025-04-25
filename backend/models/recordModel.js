const pool = require('../config/db');

class RecordModel {
  static async getRecords({ search, sortBy, bloodType, documentType }) {
    const client = await pool.connect();
    try {
      console.log('Executing query with params:', { search, sortBy, bloodType, documentType });
      
      let query = `
        SELECT DISTINCT ON (a."PID")
          a."PID",
          a."fName",
          a."mName",
          a."lName",
          a."bloodType",
          a."pdsID",
          a."salnID",
          a."nosaID",
          a."srID",
          a."caID",
          a."designation_orderID",
          a."noaID",
          a."satID",
          a."coeID",
          a."torID",
          a."mcID",
          a."med_certID",
          a."nbiID",
          a."ccaaID",
          a."dadID",
          l."timestamp" as "date"
        FROM "person" a
        LEFT JOIN "logs" l ON a."PID" = l."PID"
        WHERE 1=1
      `;

      const params = [];
      let paramCount = 1;

      // Document type filtering
      if (documentType && documentType !== 'all') {
        // Convert from hyphenated format if needed
        const dbDocType = documentType.replace('-', '_');
        const idColumn = `"${dbDocType}ID"`;
        
        // Join with the specific document table to ensure file exists
        query = `
          SELECT DISTINCT ON (a."PID")
            a."PID",
            a."fName",
            a."mName",
            a."lName",
            a."bloodType",
            a."pdsID",
            a."salnID",
            a."nosaID",
            a."srID",
            a."caID",
            a."designation_orderID",
            a."noaID",
            a."satID",
            a."coeID",
            a."torID",
            a."mcID",
            a."med_certID",
            a."nbiID",
            a."ccaaID",
            a."dadID",
            l."timestamp" as "date"
          FROM "person" a
          LEFT JOIN "logs" l ON a."PID" = l."PID"
          INNER JOIN "${dbDocType}" doc ON a.${idColumn} = doc."${dbDocType}ID"
          WHERE doc."filePath" IS NOT NULL
        `;
      }

      if (bloodType) {
        if (bloodType === 'unknown') {
          query += ` AND a."bloodType" IS NULL`;
        } else if (bloodType !== 'all') {
          query += ` AND a."bloodType" = $${paramCount}`;
          params.push(bloodType);
          paramCount++;
        }
        // For 'all', we don't add any condition - show everything
      }

      if (search) {
        query += ` AND (
          LOWER(a."fName" || ' ' || COALESCE(a."mName", '') || ' ' || a."lName") LIKE $${paramCount}
          OR LOWER(a."profession") LIKE $${paramCount}
        )`;
        params.push(`%${search.toLowerCase()}%`);
      }

      // First, order by PID and timestamp to get the latest log entry
      query += ` ORDER BY a."PID", l."timestamp" DESC NULLS LAST`;

      // Then wrap it in a subquery to apply the final sorting
      query = `
        WITH OrderedRecords AS (${query})
        SELECT * FROM OrderedRecords
      `;

      // Add final sorting
      if (sortBy === 'name_asc') {
        query += ` ORDER BY "lName" ASC, "fName" ASC`;
      } else if (sortBy === 'name_desc') {
        query += ` ORDER BY "lName" DESC, "fName" DESC`;
      } else if (sortBy === 'date_asc') {
        query += ` ORDER BY "date" ASC NULLS LAST`;
      } else if (sortBy === 'date_desc') {
        query += ` ORDER BY "date" DESC NULLS LAST`;
      } else {
        query += ` ORDER BY "lName" ASC`;
      }
      
      console.log('Executing query:', query, 'with params:', params);
      const { rows } = await client.query(query, params);
      console.log('Query result:', rows);
      return rows;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getPersonDetails(pid) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT "fName", "mName", "lName", "bloodType", "profession", "hobbies"
        FROM "person"
        WHERE "PID" = $1
      `;
      
      const { rows } = await client.query(query, [pid]);
      console.log('Database result:', rows[0]); // Debug log
      return rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getDocuments(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT 
          pds."filePath" as "pdsPath",
          s."filePath" as "salnPath",
          n."filePath" as "nosaPath",
          sr."filePath" as "srPath",
          ca."filePath" as "caPath",
          do."filePath" as "designation_orderPath",
          noa."filePath" as "noaPath",
          sat."filePath" as "satPath",
          coe."filePath" as "coePath",
          tor."filePath" as "torPath",
          mc."filePath" as "mcPath",
          med."filePath" as "med_certPath",
          nbi."filePath" as "nbiPath",
          ccaa."filePath" as "ccaaPath",
          dad."filePath" as "dadPath",
          pds."pdsID",
          s."salnID",
          n."nosaID",
          sr."srID",
          ca."caID",
          do."designation_orderID",
          noa."noaID",
          sat."satID",
          coe."coeID",
          tor."torID",
          mc."mcID",
          med."med_certID",
          nbi."nbiID",
          ccaa."ccaaID",
          dad."dadID"
        FROM "person" p
        LEFT JOIN "pds" pds ON p."pdsID" = pds."pdsID"
        LEFT JOIN "saln" s ON p."salnID" = s."salnID"
        LEFT JOIN "nosa" n ON p."nosaID" = n."nosaID"
        LEFT JOIN "sr" sr ON p."srID" = sr."srID"
        LEFT JOIN "ca" ca ON p."caID" = ca."caID"
        LEFT JOIN "designation_order" do ON p."designation_orderID" = do."designation_orderID"
        LEFT JOIN "noa" noa ON p."noaID" = noa."noaID"
        LEFT JOIN "sat" sat ON p."satID" = sat."satID"
        LEFT JOIN "coe" coe ON p."coeID" = coe."coeID"
        LEFT JOIN "tor" tor ON p."torID" = tor."torID"
        LEFT JOIN "mc" mc ON p."mcID" = mc."mcID"
        LEFT JOIN "med_cert" med ON p."med_certID" = med."med_certID"
        LEFT JOIN "nbi" nbi ON p."nbiID" = nbi."nbiID"
        LEFT JOIN "ccaa" ccaa ON p."ccaaID" = ccaa."ccaaID"
        LEFT JOIN "dad" dad ON p."dadID" = dad."dadID"
        WHERE p."PID" = $1
      `, [pid]);

      if (rows.length === 0) return null;

      return {
        pds: rows[0]?.pdsPath ? {
          id: rows[0].pdsID,
          data: Buffer.from(rows[0].pdsPath).toString('base64'),
          displayName: 'Personal Data Sheet'
        } : null,
        saln: rows[0]?.salnPath ? {
          id: rows[0].salnID,
          data: Buffer.from(rows[0].salnPath).toString('base64'),
          displayName: 'Statement of Assets, Liabilities and Net Worth'
        } : null,
        nosa: rows[0]?.nosaPath ? {
          id: rows[0].nosaID,
          data: Buffer.from(rows[0].nosaPath).toString('base64'),
          displayName: 'Notices of Salary Adjustments/Step Increments'
        } : null,
        sr: rows[0]?.srPath ? {
          id: rows[0].srID,
          data: Buffer.from(rows[0].srPath).toString('base64'),
          displayName: 'Service Records'
        } : null,
        ca: rows[0]?.caPath ? {
          id: rows[0].caID,
          data: Buffer.from(rows[0].caPath).toString('base64'),
          displayName: 'Certificate of Appointments'
        } : null,
        designation_order: rows[0]?.designation_orderPath ? {
          id: rows[0].designation_orderID,
          data: Buffer.from(rows[0].designation_orderPath).toString('base64'),
          displayName: 'Assignments/Designation Orders'
        } : null,
        noa: rows[0]?.noaPath ? {
          id: rows[0].noaID,
          data: Buffer.from(rows[0].noaPath).toString('base64'),
          displayName: 'Notice of Assumption'
        } : null,
        sat: rows[0]?.satPath ? {
          id: rows[0].satID,
          data: Buffer.from(rows[0].satPath).toString('base64'),
          displayName: 'Seminars and Trainings'
        } : null,
        coe: rows[0]?.coePath ? {
          id: rows[0].coeID,
          data: Buffer.from(rows[0].coePath).toString('base64'),
          displayName: 'Certificate of Eligibility'
        } : null,
        tor: rows[0]?.torPath ? {
          id: rows[0].torID,
          data: Buffer.from(rows[0].torPath).toString('base64'),
          displayName: 'School Diplomas and Transcript of Records'
        } : null,
        mc: rows[0]?.mcPath ? {
          id: rows[0].mcID,
          data: Buffer.from(rows[0].mcPath).toString('base64'),
          displayName: 'Marriage Contract/Certificate'
        } : null,
        med_cert: rows[0]?.med_certPath ? {
          id: rows[0].med_certID,
          data: Buffer.from(rows[0].med_certPath).toString('base64'),
          displayName: 'Medical Certificate'
        } : null,
        nbi: rows[0]?.nbiPath ? {
          id: rows[0].nbiID,
          data: Buffer.from(rows[0].nbiPath).toString('base64'),
          displayName: 'NBI Clearance'
        } : null,
        ccaa: rows[0]?.ccaaPath ? {
          id: rows[0].ccaaID,
          data: Buffer.from(rows[0].ccaaPath).toString('base64'),
          displayName: 'Commendations, Cert of Achievements, Awards'
        } : null,
        dad: rows[0]?.dadPath ? {
          id: rows[0].dadID,
          data: Buffer.from(rows[0].dadPath).toString('base64'),
          displayName: 'Disciplinary Action Document'
        } : null
      };
    } catch (error) {
      console.error('Error retrieving documents:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getPersonHistory(pid) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT DISTINCT 
          status AS activity,
          timestamp AS date
        FROM logs 
        WHERE "PID" = $1
        ORDER BY timestamp DESC
      `;
      
      const { rows } = await client.query(query, [pid]);
      console.log('History result:', rows);
      
      // Filter out duplicate entries based on activity and date
      const uniqueHistory = rows.filter((item, index, self) =>
        index === self.findIndex((t) => (
          t.activity === item.activity && t.date.getTime() === item.date.getTime()
        ))
      );
      
      return uniqueHistory;
    } catch (error) {
      console.error('Database error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async updatePersonDetails(pid, updates) {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // First check if person exists
      const checkResult = await client.query(
        'SELECT "PID" FROM "person" WHERE "PID" = $1',
        [pid]
      );

      if (checkResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, message: 'Person not found' };
      }

      // Build update query
      const updateFields = [];
      const values = [];
      let paramCount = 1;

      // Only include fields that are present and not null
      const allowedFields = ['fName', 'mName', 'lName', 'bloodType', 'profession', 'hobbies'];
      
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          updateFields.push(`"${field}" = $${paramCount}`);
          values.push(updates[field]);
          paramCount++;
        }
      });

      if (updateFields.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, message: 'No valid fields to update' };
      }

      values.push(pid);

      const query = `
        UPDATE "person"
        SET ${updateFields.join(', ')}
        WHERE "PID" = $${paramCount}
        RETURNING *
      `;

      console.log('Update query:', query, 'values:', values);

      const { rows } = await client.query(query, values);

      if (rows.length === 0) {
        await client.query('ROLLBACK');
        return { success: false, message: 'Update failed' };
      }

      // Log the update
      await client.query(
        'INSERT INTO "logs" ("PID", "status", "timestamp") VALUES ($1, $2, CURRENT_TIMESTAMP)',
        [pid, 'Updated personal details']
      );

      await client.query('COMMIT');

      return { 
        success: true, 
        data: rows[0]
      };

    } catch (error) {
      await client.query('ROLLBACK');
      console.error('Database error:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async addHistoryLog(pid, activity) {
    const client = await pool.connect();
    try {
      await client.query(
        `INSERT INTO "logs" ("PID", "status", "timestamp")
         VALUES ($1, $2, CURRENT_TIMESTAMP)`,
        [pid, activity]
      );
      return true;
    } catch (error) {
      console.error('Error adding history log:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getPDS(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT p."filePath", p."pdsID"
        FROM "person" AS a
        LEFT JOIN "pds" AS p ON a."pdsID" = p."pdsID"
        WHERE a."PID" = $1 AND p."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].pdsID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Personal Data Sheet'
      } : null;
    } catch (error) {
      console.error('Error getting PDS:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getSALN(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT s."filePath", s."salnID"
        FROM "person" AS a
        LEFT JOIN "saln" AS s ON a."salnID" = s."salnID"
        WHERE a."PID" = $1 AND s."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].salnID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Statement of Assets, Liabilities and Net Worth'
      } : null;
    } catch (error) {
      console.error('Error getting SALN:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getNOSA(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT n."filePath", n."nosaID"
        FROM "person" AS a
        LEFT JOIN "nosa" AS n ON a."nosaID" = n."nosaID"
        WHERE a."PID" = $1 AND n."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].nosaID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Notices of Salary Adjustments/Step Increments'
      } : null;
    } catch (error) {
      console.error('Error getting NOSA:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getSR(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT sr."filePath", sr."srID"
        FROM "person" AS a
        LEFT JOIN "sr" AS sr ON a."srID" = sr."srID"
        WHERE a."PID" = $1 AND sr."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].srID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Service Records'
      } : null;
    } catch (error) {
      console.error('Error getting SR:', error);
      throw error;
    } finally {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               2
      client.release();
    }
  }

  static async getCA(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT ca."filePath", ca."caID"
        FROM "person" AS a
        LEFT JOIN "ca" AS ca ON a."caID" = ca."caID"
        WHERE a."PID" = $1 AND ca."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].caID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Certificate of Appointments'
      } : null;
    } catch (error) {
      console.error('Error getting CA:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getDesignationOrder(pid) {
    const client = await pool.connect();
    try {
      console.log('[Debug] Fetching designation order for PID:', pid);
      
      // First check if the ID exists
      const checkQuery = `
        SELECT "designation_orderID" 
        FROM "person" 
        WHERE "PID" = $1 AND "designation_orderID" IS NOT NULL
      `;
      
      const checkResult = await client.query(checkQuery, [pid]);
      console.log('[Debug] Check result:', checkResult.rows);

      if (checkResult.rows.length === 0) {
        console.log('[Debug] No designation_orderID found for PID:', pid);
        return null;
      }

      // Get the actual document
      const query = `
        SELECT d."filePath", d."designation_orderID"
        FROM "designation_order" d
        INNER JOIN "person" p ON p."designation_orderID" = d."designation_orderID"
        WHERE p."PID" = $1
      `;
      
      const { rows } = await client.query(query, [pid]);
      console.log('[Debug] Query result:', rows[0]);

      if (!rows[0]) {
        console.log('[Debug] No designation order found');
        return null;
      }

      if (!rows[0].filePath) {
        console.log('[Debug] FilePath is null');
        return null;
      }

      return {
        id: rows[0].designation_orderID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Designation Order'
      };

    } catch (error) {
      console.error('[Error] Getting Designation Order:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getNOA(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT noa."filePath", noa."noaID"
        FROM "person" AS a
        LEFT JOIN "noa" AS noa ON a."noaID" = noa."noaID"
        WHERE a."PID" = $1 AND noa."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].noaID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Notice of Assumption'
      } : null;
    } catch (error) {
      console.error('Error getting NOA:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getSAT(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT sat."filePath", sat."satID"
        FROM "person" AS a
        LEFT JOIN "sat" AS sat ON a."satID" = sat."satID"
        WHERE a."PID" = $1 AND sat."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].satID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Seminars and Trainings'
      } : null;
    } catch (error) {
      console.error('Error getting SAT:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getCOE(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT coe."filePath", coe."coeID"
        FROM "person" AS a
        LEFT JOIN "coe" AS coe ON a."coeID" = coe."coeID"
        WHERE a."PID" = $1 AND coe."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].coeID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Certificate of Eligibility'
      } : null;
    } catch (error) {
      console.error('Error getting COE:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getTOR(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT tor."filePath", tor."torID"
        FROM "person" AS a
        LEFT JOIN "tor" AS tor ON a."torID" = tor."torID"
        WHERE a."PID" = $1 AND tor."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].torID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'School Diplomas and Transcript of Records'
      } : null;
    } catch (error) {
      console.error('Error getting TOR:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getMC(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT mc."filePath", mc."mcID"
        FROM "person" AS a
        LEFT JOIN "mc" AS mc ON a."mcID" = mc."mcID"
        WHERE a."PID" = $1 AND mc."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].mcID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Marriage Contract/Certificate'
      } : null;
    } catch (error) {
      console.error('Error getting MC:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getMedCert(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT med."filePath", med."med_certID"
        FROM "person" AS a
        LEFT JOIN "med_cert" AS med ON a."med_certID" = med."med_certID"
        WHERE a."PID" = $1 AND med."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].med_certID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Medical Certificate'
      } : null;
    } catch (error) {
      console.error('Error getting Medical Certificate:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getNBI(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT nbi."filePath", nbi."nbiID"
        FROM "person" AS a
        LEFT JOIN "nbi" AS nbi ON a."nbiID" = nbi."nbiID"
        WHERE a."PID" = $1 AND nbi."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].nbiID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'NBI Clearance'
      } : null;
    } catch (error) {
      console.error('Error getting NBI:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getCCAA(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT ccaa."filePath", ccaa."ccaaID"
        FROM "person" AS a
        LEFT JOIN "ccaa" AS ccaa ON a."ccaaID" = ccaa."ccaaID"
        WHERE a."PID" = $1 AND ccaa."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].ccaaID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Commendations, Cert of Achievements, Awards'
      } : null;
    } catch (error) {
      console.error('Error getting CCAA:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  static async getDAD(pid) {
    const client = await pool.connect();
    try {
      const { rows } = await client.query(`
        SELECT dad."filePath", dad."dadID"
        FROM "person" AS a
        LEFT JOIN "dad" AS dad ON a."dadID" = dad."dadID"
        WHERE a."PID" = $1 AND dad."filePath" IS NOT NULL
      `, [pid]);
      
      return rows[0] ? {
        id: rows[0].dadID,
        data: Buffer.from(rows[0].filePath).toString('base64'),
        displayName: 'Disciplinary Action Document'
      } : null;
    } catch (error) {
      console.error('Error getting DAD:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

module.exports = RecordModel;