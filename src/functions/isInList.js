const { executeSQL } = require('./executeSQL');

async function isInList(listId, contentId) {
    const sql = `SELECT id
               FROM list_entry
               WHERE id = ${contentId} AND list_id = ${listId}`

    const rows = await executeSQL(sql);

    return rows.length !== 0;

}

module.exports = {
    isInList
};