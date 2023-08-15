const apiOptions = require("../configs_DO_NOT_GITHUB.json").api;

async function fetchMoviesFromGenres(genre, page) {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&region=US&sort_by=popularity.desc&watch_region=US&with_genres=${genre}&with_origin_country=US&with_original_language=en`;
    const response = await fetch(url, apiOptions)
    const data = await response.json();

    for (const content of data.results) {
        content.media_type = "movie";
    }

    return data.results;
}

module.exports = {
    fetchMoviesFromGenres
};