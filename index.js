const express = require("express");
const mysql = require("mysql2");
const dbAccess = mysql.createPool(require("./configs_DO_NOT_GITHUB.json").db);
const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(express.static("public"));

app.get('/', async (req, res) => {
  const genres = ['Action', 'Horror', 'Thriller', 'Western', 'Science Fiction', 'Drama', 'Romance',
                    'Comedy', 'Fantasy', 'Animation', 'Documentary', 'Mystery', 'Teen'];
    const genreList = [];


    for (let i = 0; i < 4; i++) {
        let number = getRandomNumFromLength(genres.length);

        if (!genreList.includes(genres[number])){
            genreList.push(genres[number]);
        } else {
            i--;
        }

    }

    let movieData = await fetchMovieData();
    const genreMovies = [];

    for (const genre of genreList) {
        genreMovies.push(await fetchMoviesFromGenres(genre));
    }


    res.render('index.ejs', {'css': 'main',
        'bannerImg': movieData.bannerUrl,
        'movieDescription': movieData.description,
        'movieTitle': movieData.title,
        'trending': movieData.trendingMovies,
        'trendingMoviesImg': movieData.trendingMoviesImg,
        'genreList': genreList,
        'genreMovies': genreMovies});
})

async function fetchMovieData() {
    try {
        const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US';
        const response = await fetch(url, apiOptions)
        const data = await  response.json();
        const index = getRandomNumFromLength(data.results.length)
        const banner = await getBestBanner(data.results[index].id);
        const trendingMovies = [];
        const trendingMoviesImg = [];
        data.results.forEach((movie) => {
           trendingMovies.push(movie.original_title);
           trendingMoviesImg.push(movie.backdrop_path);
        });
        return {
            bannerUrl: `https://image.tmdb.org/t/p/original/${banner}`,
            description: data.results[index].overview,
            title: data.results[index].original_title,
            trendingMovies: trendingMovies,
            trendingMoviesImg: trendingMoviesImg
        };
    } catch (err) {
        console.error("APIerror:" + err);
    }
}

async function fetchBanner() {

    try {
        const url = 'https://api.themoviedb.org/3/movie/popular';
        const response = await fetch(url, apiOptions)
        const data = await  response.json();
        return 'https://image.tmdb.org/t/p/original' + data.results[0].backdrop_path;
    } catch (err) {
        console.error("APIerror:" + err);
    }

}

function getRandomNumFromLength(size) {
    return Math.floor(Math.random() * size);
}

app.get('/settings', (req,res) => {
  res.render('userSettings.ejs', {'css': 'settings'});
})

async function fetchMoviesFromGenres(genre) {
    const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=3&sort_by=popularity.desc&with_genres=${genre}`;
    const response = await fetch(url, apiOptions)
    const data = await response.json();

    return data.results;
}

//functions
function isAuthenticated(req, res, next){
  if(!req.session.authenticated){
    res.redirect("/");
  } else {
    next();
  }
}

app.get("/home", isAuthenticated, (req, res) => {
    res.redirect("home");
});

app.listen(3000, () => {
  console.log("server started");
})

// if testing the db table access and api info pull, uncomment the lines below.
//test();
//
//async function test() {
//  // the next 3 lines test database table access
//  console.log(await executeSQL("SELECT * FROM user"));
//  console.log(await executeSQL("SELECT * FROM list"));
//  console.log(await executeSQL("SELECT * FROM list_entry"));
//
//  // everything below grabs a movie from list_entry table and then calls tmdb api for info
//  let scifiListId = (await executeSQL(`SELECT list_id
//                                       FROM list
//                                       WHERE list_name = 'Scifi favs'`))[0].list_id;
//
//  let url = (await executeSQL(`SELECT title_id
//                                  FROM list_entry
//                                  WHERE list_id = ${scifiListId}
//                                  LIMIT 1`))[0].title_id;
//
//  let movieInfo = await (await fetch(url, apiOptions)).json();
//  console.log(movieInfo);
//}
