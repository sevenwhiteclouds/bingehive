const pool = require("./dbPool.js");

testDb();

async function testDb() {
  console.log(await executeSQL("SELECT * FROM user"));
  console.log(await executeSQL("SELECT * FROM list"));
  console.log(await executeSQL("SELECT * FROM list_entry"));
}

async function executeSQL(query, params) {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (err, rows, fields) => {
      if (err) throw err;
      resolve(rows);
    });
  });
}
