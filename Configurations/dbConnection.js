const Mysql = require('mysql2/promise');
require('dotenv').config();

const DB = Mysql.createPool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});
DB.getConnection()
    .then(() => console.log('Database connection pool created successfully.'))
    .catch((err) => console.error('Database connection failed:', err));

module.exports = DB;