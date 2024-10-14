import mysql from 'mysql2/promise';
import fs from 'fs';

// Load configuration from config.json
const config = JSON.parse(fs.readFileSync('./config.json'));

// Create a connection pool with SSL settings if needed
const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 10,
    ssl: {
        rejectUnauthorized: true,  // You can set this to `false` to allow self-signed certs
    },
});

// Directly use the promise-based pool.execute
export const query = async (sql, params) => {
    try {
        const [results] = await pool.execute(sql, params);
        return results;
    } catch (err) {
        throw err;  // Forward the error for handling elsewhere
    }
};

// Optionally export the pool if you need to manage connections manually
export default pool;
