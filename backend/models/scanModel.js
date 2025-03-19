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

            // Insert person record
            const insertPersonQuery = `
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

            const personResult = await client.query(insertPersonQuery, [
                null, // pdsID
                null, // salnID
                fName,
                mName,
                lName,
                bloodType,
                profession,
                hobbies
            ]);

            const pid = personResult.rows[0].PID;

            // Insert log entry with the correct structure
            const insertLogQuery = `
                INSERT INTO "logs" (
                    "log_id",
                    "PID",
                    "status",
                    "timestamp"
                )
                VALUES (
                    nextval('logs_log_id_seq'),
                    $1,
                    $2,
                    CURRENT_TIMESTAMP
                )
                RETURNING "log_id"
            `;

            const logResult = await client.query(insertLogQuery, [
                pid,
                'ACTIVE'  // Set default status
            ]);

            await client.query('COMMIT');
            return { 
                success: true, 
                pid: pid,
                logId: logResult.rows[0].log_id 
            };

        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = ScanModel;