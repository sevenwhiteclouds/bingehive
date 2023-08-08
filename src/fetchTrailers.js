const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;

async function fetchTrailers(movieId) {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=en-US`;
  const response = await fetch(url, apiOptions);
  const data = await response.json();

  for (const video of data.results) {
    if (video.site === "YouTube" && video.type === "Teaser" && video.size === 1080) {
      return `${video.key}`;
    }
  }

  // Fallback if no video satisfies basic requirements.
  for (const video of data.results) {
    if (video.site === "YouTube") {
      return video.key;
    }
  }

  // Fallback if no video at all is available
  return 'dQw4w9WgXcQ';
}

module.exports = {
  fetchTrailers
};