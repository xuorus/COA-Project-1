const pool = require('../config/db');

class ScanModel {
    static async addPerson(personData) {
        const client = await pool.connect();
        try {
            const {
                fName,
                mName,
                lName,
                bloodType,
                profession,
                hobbies
            } = personData;

            await client.query('BEGIN');

            const insertQuery = `
                INSERT INTO "person" (
                    "pdsID",
                    "salnID",
                    "fName",
                    "mName",
                    "lName",
                    "bloodType",
                    "profession",
                    "hobbies"
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING "PID"
            `;

            const result = await client.query(insertQuery, [
                null, // pdsID
                null, // salnID
                fName,
                mName,
                lName,
                bloodType,
                profession,
                hobbies
            ]);

            await client.query('COMMIT');
            return { success: true, pid: result.rows[0].PID };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = ScanModel;