
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'EliSaMlu',
    database: 'db_crud_tugas4',
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool;
