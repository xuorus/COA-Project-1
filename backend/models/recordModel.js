const pool = require('../config/db');

class RecordModel {
  static async getRecords({ search, sortBy, sortOrder = 'asc', bloodType }) {
    let query = `
      SELECT 
        a.PID,
        a.fName,
        a.mName,
        a.lName,
        a.profession,
        a.hobbies,
        a.bloodType,
        b.pdsID,
        c.salnID,
        (
          SELECT MAX(timestamp)
          FROM logs
          WHERE PID = a.PID
        ) as date
      FROM person AS a
      LEFT JOIN pds AS b ON a.pdsID = b.pdsID
      LEFT JOIN saln AS c ON a.salnID = c.salnID
      WHERE 1=1
    `;

    const params = [];

    if (bloodType && bloodType !== 'all') {
      query += ` AND a.bloodType = ?`;
      params.push(bloodType);
    }

    if (search) {
      query += `
        AND (
          LOWER(CONCAT(a.fName, ' ', COALESCE(a.mName, ''), ' ', a.lName)) LIKE ?
          OR LOWER(a.profession) LIKE ?
          OR LOWER(a.hobbies) LIKE ?
        )
      `;
      const searchPattern = `%${search.toLowerCase()}%`;
      params.push(...Array(3).fill(searchPattern));
    }

    const sortField = {
      'az': 'a.lName',
      'za': 'a.lName',
      'newest': 'date',
      'oldest': 'date',
      'bloodtype': 'a.bloodType'
    }[sortBy] || 'a.lName';

    const order = {
      'az': 'ASC',
      'za': 'DESC',
      'newest': 'DESC',
      'oldest': 'ASC',
      'bloodtype': 'ASC'
    }[sortBy] || 'ASC';

    query += ` ORDER BY ${sortField} ${order}`;

    const [rows] = await pool.query(query, params);
    return rows;
  }

  static async getPersonDetails(pid) {
    const [rows] = await pool.query(`
      SELECT 
        fName,
        mName,
        lName,
        profession,
        hobbies,
        bloodType
      FROM person 
      WHERE PID = ?
    `, [pid]);

    if (rows.length === 0) return null;

    return {
      firstName: rows[0].fName,
      middleName: rows[0].mName,
      lastName: rows[0].lName,
      profession: rows[0].profession,
      hobbies: rows[0].hobbies,
      bloodType: rows[0].bloodType
    };
  }

  static async getDocuments(pid) {
    const [rows] = await pool.query(`
      SELECT 
        b.PDSfile,
        c.SALNfile,
        b.pdsID,
        c.salnID
      FROM person AS a
      LEFT JOIN pds AS b ON a.pdsID = b.pdsID
      LEFT JOIN saln AS c ON a.salnID = c.salnID
      WHERE a.PID = ?
    `, [pid]);

    if (rows.length === 0) return null;

    return {
      pds: rows[0].PDSfile ? {
        id: rows[0].pdsID,
        data: rows[0].PDSfile.toString('base64')
      } : null,
      saln: rows[0].SALNfile ? {
        id: rows[0].salnID,
        data: rows[0].SALNfile.toString('base64')
      } : null
    };
  }

  static async getPersonHistory(pid) {
    const [rows] = await pool.query(`
      SELECT 
        status AS activity,
        timestamp AS date
      FROM logs 
      WHERE PID = ?
      ORDER BY timestamp DESC
    `, [pid]);

    return rows;
  }

  static async updatePersonDetails(pid, updates) {
    // Get current values
    const [currentPerson] = await pool.query(
      'SELECT fName, mName, lName, bloodType, profession, hobbies FROM person WHERE PID = ?',
      [pid]
    );

    if (!currentPerson[0]) return null;

    // Build dynamic query based on changed fields
    const updateFields = [];
    const updateValues = [];
    const changedFields = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== currentPerson[0][key]) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
        changedFields.push(key);
      }
    });

    if (updateFields.length === 0) {
      return { message: 'No changes detected' };
    }

    updateValues.push(pid);

    const query = `
      UPDATE person 
      SET ${updateFields.join(', ')}
      WHERE PID = ?
    `;

    const [result] = await pool.query(query, updateValues);

    if (result.affectedRows > 0) {
      const logMessage = `Updated: ${changedFields.join(', ')}`;
      await pool.query(
        'INSERT INTO logs (PID, activity, date) VALUES (?, ?, NOW())',
        [pid, logMessage]
      );

      return {
        success: true,
        updatedFields: changedFields
      };
    }

    return { success: false };
  }
}

module.exports = RecordModel;