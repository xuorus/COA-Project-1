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
            console.error('Error adding person:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async addDocument(documentType, base64Data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const insertQuery = `
                INSERT INTO "${documentType.toLowerCase()}" ("${documentType}file")
                VALUES (decode($1, 'base64'))
                RETURNING "${documentType}ID"
            `;

            const result = await client.query(insertQuery, [base64Data]);
            const docId = result.rows[0][`${documentType.toLowerCase()}id`];

            await client.query('COMMIT');
            return { success: true, documentId: docId };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error adding document:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async linkDocumentToPerson(pid, documentType, documentId) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const updateQuery = `
                UPDATE "person" 
                SET "${documentType}ID" = $1 
                WHERE "PID" = $2
            `;

            await client.query(updateQuery, [documentId, pid]);
            await client.query('COMMIT');

            return { success: true };

        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Error linking document:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    static async getPersonById(pid) {
        const client = await pool.connect();
        try {
            const query = `
                SELECT p.*, 
                       pds."PDSfile" as "pdsDocument",
                       saln."SALNfile" as "salnDocument"
                FROM "person" p
                LEFT JOIN "pds" ON p."pdsID" = pds."PDSID"
                LEFT JOIN "saln" ON p."salnID" = saln."SALNID"
                WHERE p."PID" = $1
            `;

            const result = await client.query(query, [pid]);
            return result.rows[0] || null;

        } catch (error) {
            console.error('Error fetching person:', error);
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = ScanModel;