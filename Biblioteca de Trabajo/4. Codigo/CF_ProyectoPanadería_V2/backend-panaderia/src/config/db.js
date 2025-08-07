// src/config/db.js
const { Pool } = require('pg');
module.exports = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'panaderia',
  password: 'cjgranda16',
  port: 5432,
});
