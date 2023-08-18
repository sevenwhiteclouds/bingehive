const apiOptions = require("../configs_DO_NOT_GITHUB.json").api;

async function fetchShowsFromGenres(genre, page) {
    const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=US&with_genres=${genre}&with_origin_country=US&with_original_language=en`
    const response = await fetch(url, apiOptions)
    const data = await response.json();

    for (const content of data.results) {
        content.media_type = "tv";
        content.original_title = content.original_name;
    }

    return data.results;
}

module.exports = {
    fetchShowsFromGenres
};