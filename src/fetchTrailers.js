const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;
const link = 'https://www.youtube.com/embed/';

async function fetchTrailers(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  const response = await fetch(url, apiOptions);
  const data = await response.json();

  for (const video of data.results) {
    if (video.site === "YouTube" && video.type === "Teaser" && video.size === 1080) {
      return `${video.key}`;
    }
  }
}

module.exports = {
  fetchTrailers
};