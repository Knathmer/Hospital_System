import mysql from 'mysql2';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./config.json'));

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

export const query = (sql, params) => {
    return new Promise((resolve, reject) =>{
        pool.execute(sql, params, (err, results) => {
            if(err){
                return reject(err);
            }
            resolve(results);
        });
    });
};