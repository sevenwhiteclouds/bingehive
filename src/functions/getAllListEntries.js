const { executeSQL } = require('./executeSQL');

async function getAllListEntries(listId) {
    let sql = `SELECT * FROM list_entry WHERE list_entry.list_id = ?`

    let params = [listId];
    return await executeSQL(sql, params);
}

module.exports = {
    getAllListEntries
};