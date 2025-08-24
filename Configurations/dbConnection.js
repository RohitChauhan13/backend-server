const { Pool } = require('pg');
require('dotenv').config();

const DB = new Pool({
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});
DB.connect()
    .then(() => console.log('PostgreSQL connection pool created successfully.'))
    .catch((err) => console.error('PostgreSQL connection failed:', err));

module.exports = DB;