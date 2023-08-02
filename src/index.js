const express = require("express");
const mysql = require("mysql2");
const dbAccess = mysql.createPool(require("./configs_DO_NOT_GITHUB.json").db);
const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session ({
  secret: "top secret!", 
  resave: true,
  saveUninitialized: true
}));

app.use(express.urlencoded({extended:true})); //to be able to parse Post parameters 

// Sends user straight to login. Most aesthetic for URL.
app.get('/', async (req, res) => {
    res.redirect('/login');
})

app.get('/login', async (req, res) => {
    res.render('index.ejs', {'css': 'login'});
})

app.get('/create-account', async (req, res) => {
    res.render('createAccount.ejs', {'css': 'login'});
})

app.get('/home', async (req, res) => {
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

    res.render('home.ejs', {'css': 'main',
        'bannerImg': movieData.bannerUrl,
        'movieDescription': movieData.description,
        'movieTitle': movieData.title,
        'trending': movieData.trendingMovies,
        'trendingMoviesImg': movieData.trendingMoviesImg,
        'genreList': genreList,
        'genreMovies': genreMovies});

})

app.get('/settings', (req,res) => {
  res.render('userSettings.ejs', {'css': 'settings'});
})

app.listen(3000, () => {
    console.log("server started");
})

async function executeSQL(query, params) {
  return new Promise((resolve, reject) => {
    dbAccess.query(query, params, (err, rows, fields) => {
      if (err) throw err;
      resolve(rows);
    });
  });
}

function getRandomNumFromLength(size) {
    return Math.floor(Math.random() * size);
}

async function fetchMovieData() {
    try {
        const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US';
        const response = await fetch(url, apiOptions)
        const data = await  response.json();
        const index = getRandomNumFromLength(data.results.length)
        const banner = data.results[index].backdrop_path;
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

async function fetchMoviesFromGenres(genre) {
    const url = `https://api.themoviedb.org/3/discover/movie?language=en-US&page=3&sort_by=popularity.desc&with_genres=${genre}`;
    const response = await fetch(url, apiOptions)
    const data = await response.json();

    return data.results;
}

// if testing the db table access and api info pull, uncomment the lines below.
test();

async function test() {
  // the next 3 lines test database table access
  console.log(await executeSQL("SELECT * FROM user"));
  console.log(await executeSQL("SELECT * FROM list"));
  console.log(await executeSQL("SELECT * FROM list_entry"));

  // everything below grabs a movie from list_entry table and then calls tmdb api for info
  let scifiListId = (await executeSQL(`SELECT list_id 
                                       FROM list 
                                       WHERE list_name = 'Scifi favs'`))[0].list_id;

  let url = (await executeSQL(`SELECT title_id
                                  FROM list_entry
                                  WHERE list_id = ${scifiListId}
                                  LIMIT 1`))[0].title_id;

  let movieInfo = await (await fetch(url, apiOptions)).json();
  console.log(movieInfo);
}

app.post('/create-account', async(req, res) =>{
  const username = req.body.username;
  const password = req.body.password;

  console.log("Username:" + username);
  console.log("Password:" + password);
})

app.post("/login", async(req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  console.log("username: " + username);
  console.log("password: " + password);
  let hashedPwd = "";
  
  let sql = "SELECT * FROM user WHERE username = ?";
  let rows = await executeSQL(sql, [username]);

  if (rows === null || rows.length === 0) {
    req.session.authenticated = false;
    res.redirect('/');
    return;
  }
  
  if(rows.length > 0){
    hashedPwd = rows[0].password;
  }

  let passwordMatch = await bcrypt.compare(password, hashedPwd);
  console.log("passwordMatch:" + passwordMatch + hashedPwd + password); 
  
  if(passwordMatch){
    req.session.authenticated = true;
    req.session.loginError = true;
    res.redirect('/home');
  } else {
    req.session.authenticated = false;
    res.render('index.ejs',{"loginError": true});
  }
});

app.get("/home", isAuthenticated, (req, res) => {
    res.redirect("/");
});

//functions
function isAuthenticated(req, res, next){
  if(!req.session.authenticated){
    res.redirect("/");
  } else {
    next();
  }
}