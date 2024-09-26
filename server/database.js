const mysql = require('mysql2');
const fs = require('fs');

const config = JSON.parse(fs.readFileSync('./config.json'));

const pool = mysql.createPool({
    host: config.db.host,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
    connectionLimit: 10
});

module.exports = {
    query: (sql, params) => {
        return new Promise((resolve, reject) =>{
            pool.execute(sql, params, (err, results) => {
                if(err){
                    return reject(err);
                }
                resolve(results);
            });
        });
    }
};