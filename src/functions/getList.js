const { executeSQL } = require('./executeSQL');

async function getList(userId) {
    let sql = `SELECT list.list_id, list.list_name FROM list WHERE list.user_id = ?`

    let params = [userId];
    return await executeSQL(sql, params);
}

module.exports = {
  getList
};