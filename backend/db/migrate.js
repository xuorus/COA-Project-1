const fs = require('fs').promises;
const path = require('path');
const pool = require('../config/db');

async function migrate() {
    let client;
    try {
        console.log('Starting database migration...');
        
        const schema = await fs.readFile(
            path.join(__dirname, 'schema.sql'), 
            'utf8'
        );

        client = await pool.connect();
        
        // Run migration in a transaction
        await client.query('BEGIN');
        await client.query(schema);
        await client.query('COMMIT');
        
        console.log('Migration completed successfully!');
        
    } catch (error) {
        if (client) await client.query('ROLLBACK');
        console.error('Migration failed:', error);
        throw error;
    } finally {
        if (client) client.release();
    }
}

// Run migration and handle process exit properly
migrate()
    .then(() => {
        console.log('Migration process finished.');
        process.exit(0);
    })
    .catch(error => {
        console.error('Migration process failed:', error);
        process.exit(1);
    });