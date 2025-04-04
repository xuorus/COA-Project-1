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

            // Handle designation_order special case
            let tableName, columnName;
            if (documentType === 'designation_order') {
                tableName = 'designation_order';
                columnName = 'designation_orderID';
            } else {
                tableName = documentType.toLowerCase();
                columnName = `${documentType.toLowerCase()}ID`;
            }

            const insertQuery = `
                INSERT INTO "${tableName}" ("filePath")
                VALUES (decode($1, 'base64'))
                RETURNING "${columnName}"
            `;

            const result = await client.query(insertQuery, [base64Data]);
            const docId = result.rows[0][columnName.toLowerCase()];

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

            // Handle designation_order special case
            const columnName = documentType === 'designation_order' 
                ? 'designation_orderID' 
                : `${documentType.toLowerCase()}ID`;

            const updateQuery = `
                UPDATE "person" 
                SET "${columnName}" = $1 
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
                       pds."filePath" as "pdsDocument",
                       saln."filePath" as "salnDocument",
                       do."filePath" as "designation_orderDocument"
                FROM "person" p
                LEFT JOIN "pds" ON p."pdsID" = pds."pdsID"
                LEFT JOIN "saln" ON p."salnID" = saln."salnID"
                LEFT JOIN "designation_order" do ON p."designation_orderID" = do."designation_orderID"
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