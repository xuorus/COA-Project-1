const pool = require('../config/db');

class RecordModel {
  static async getRecords({ search, sortBy, bloodType }) {
    const client = await pool.connect();
    try {
      console.log('Executing query with params:', { search, sortBy, bloodType });
      
      let query = `
        SELECT DISTINCT ON (a."PID")
          a."PID",
          a."fName",
          a."mName",
          a."lName",
          a."bloodType",
          a."pdsID",
          a."salnID",
          l."timestamp" as "date"
        FROM "person" a
        LEFT JOIN "logs" l ON a."PID" = l."PID"
        WHERE 1=1
      `;

      const params = [];
      let paramCount = 1;

      if (bloodType && bloodType !== 'all') {
        query += ` AND a."bloodType" = $${paramCount}`;
        params.push(bloodType);
        paramCount++;
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
          b."PDSfile",
          c."SALNfile",
          b."pdsID",
          c."salnID"
        FROM "person" AS a
        LEFT JOIN "pds" AS b ON a."pdsID" = b."pdsID"
        LEFT JOIN "saln" AS c ON a."salnID" = c."salnID"
        WHERE a."PID" = $1
      `, [pid]);

      if (rows.length === 0) return null;

      return {
        pds: rows[0].PDSfile ? {
          id: rows[0].pdsID,
          data: Buffer.from(rows[0].PDSfile).toString('base64')
        } : null,
        saln: rows[0].SALNfile ? {
          id: rows[0].salnID,
          data: Buffer.from(rows[0].SALNfile).toString('base64')
        } : null
      };
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
}

module.exports = RecordModel;