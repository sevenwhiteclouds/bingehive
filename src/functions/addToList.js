const { executeSQL } = require('./executeSQL');

async function addToList(listId, contentId, backdropPath, originalTitle, overview, mediaType) {

    let sql = `INSERT INTO list_entry (list_id, id, backdrop_path, original_title, media_type, overview)
             VALUES (?, ?, ?, ?, ?, ?)`

    let params = [listId, contentId, backdropPath, originalTitle, mediaType, overview];

    await executeSQL(sql, params);
}

module.exports = {
    addToList
};