const mysql = require("mysql2");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: "",
  user: "",
  password: "",
  database: ""
});

module.exports = pool;
