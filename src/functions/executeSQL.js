const mysql = require("mysql2");
const dbAccess = mysql.createPool(require("../configs_DO_NOT_GITHUB.json").db);

async function executeSQL(query, params) {
    return new Promise((resolve, reject) => {
        dbAccess.query(query, params, (err, rows, fields) => {
            if (err) console.log("SQL ERROR: " + err);
            resolve(rows);
        });
    });
}

module.exports = {
    executeSQL
};