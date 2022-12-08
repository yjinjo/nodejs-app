const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
  host: process.env.DATABASE_HOSTNAME,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});
db.connect();

module.exports = db;
