const mysql = require("mysql2/promise");

// A pool keeps a few connections open and reuses them for every request
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

module.exports = pool;
