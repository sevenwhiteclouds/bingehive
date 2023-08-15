const { executeSQL } = require('./executeSQL');

async function removeFromList(listId, contentId) {

    let sql = `DELETE FROM list_entry WHERE list_Id = ${listId} AND id = ${contentId}`

    await executeSQL(sql);
}

module.exports = {
    removeFromList
};