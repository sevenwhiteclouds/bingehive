const {getRandomNumFromLength} = require("./getRandomNumFromLength");
const apiOptions = require("../configs_DO_NOT_GITHUB.json").api;

async function fetchMovieData() {
    try {
        const url = 'https://api.themoviedb.org/3/trending/movie/day?language=en-US';
        const response = await fetch(url, apiOptions)
        const data = await response.json();
        let index = getRandomNumFromLength(data.results.length);

        // Keeps movies without a backdrop out of the rotation
        while (data.results[index].backdrop_path == null) {
            index = getRandomNumFromLength(data.results.length);
        }

        const banner = data.results[index].backdrop_path;
        const trendingMovies = [];
        const trendingMoviesImg = [];
        data.results.forEach((movie) => {
            if (movie.backdrop_path != null) {
                trendingMovies.push(movie.original_title);
                trendingMoviesImg.push(movie.backdrop_path);
            }
        });
        return {
            bannerUrl: `https://image.tmdb.org/t/p/original/${banner}`,
            description: data.results[index].overview,
            title: data.results[index].original_title,
            trendingMovies: trendingMovies,
            trendingMoviesImg: trendingMoviesImg,
            data: data,
            index: index
        };
    } catch (err) {
        console.error("APIerror:" + err);
    }
}

module.exports = {
    fetchMovieData
};