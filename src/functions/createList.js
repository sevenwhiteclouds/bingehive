const { executeSQL } = require('./executeSQL');

async function createList(userId, listName) {
    let sql = "INSERT INTO list (user_id, list_name) VALUES (?, ?)"
    let params = [userId, listName];

    let rows = await executeSQL(sql, params);
}

module.exports = {
    createList
};