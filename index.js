const pool = require("./dbPool.js");

async function executeSQL(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, rows, fields) => {
      if (err) throw err;
      resolve(rows);
    });
  });
}
