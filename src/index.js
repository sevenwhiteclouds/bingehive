// uncomment line below to run db and api test
// const test = require("./test.js");
const express = require("express");
const mysql = require("mysql2");
const dbAccess = mysql.createPool(require("./configs_DO_NOT_GITHUB.json").db);
const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;
const secret = require("./configs_DO_NOT_GITHUB.json").sessionsSecret;
const app = express();
const session = require('express-session');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const genres = ['Action', 'Horror', 'Thriller', 'Western', 'Science Fiction', 'Drama', 'Romance',
                'Comedy', 'Fantasy', 'Animation', 'Documentary', 'Mystery', 'Family'];

// Same indexs as `genres` array - just in num format
const genreIDs = ['28', '27', '53', '37', '878', '18', '10749', '35', '14', '16', '99', '9648', '10751']

app.use(express.static("public"));
app.set("view engine", "ejs");

app.use(session ({
  secret: secret, 
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

    const genreList = [];
    const genreMovies = [];
  
    for (let i = 0; i < 4; i++) {
        let number = getRandomNumFromLength(genres.length);

        if (!genreList.includes(genres[number])){
            genreList.push(genres[number]);
            genreMovies.push(await fetchMoviesFromGenres(genreIDs[number]));
        } else {
            i--;
        }
    }

    let movieData = await fetchMovieData();


    res.render('home.ejs', {'css': 'main',
        'bannerImg': movieData.bannerUrl,
        'movieDescription': movieData.description,
        'movieTitle': movieData.title,
        'trending': movieData.trendingMovies,
        'trendingMoviesImg': movieData.trendingMoviesImg,
        'genreList': genreList,
        'genreMovies': genreMovies,
        'genres' : genres});
})

app.get('/settings', (req,res) => {
  res.render('userSettings.ejs', {'css': 'settings', 'genres' : genres});
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
        let index = getRandomNumFromLength(data.results.length);
      
        // Keeps movies without a backdrop out of the rotation
        while(data.results[index].backdrop_path == null){
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
            trendingMoviesImg: trendingMoviesImg
        };
    } catch (err) {
        console.error("APIerror:" + err);
    }
}

//TODO: Fix 404 banners
async function fetchMoviesFromGenres(genre) {
    const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=4&sort_by=popularity.desc&with_genres=${genre}`;
    const response = await fetch(url, apiOptions)
    const data = await response.json();

    return data.results;
}

app.post('/create-account', async(req, res) =>{
  const username = req.body.username;
  const password = req.body.password;
  const first = req.body.first;
  const last = req.body.last;
  const minLength = 5;
  const maxLength = 10;
  if (isInputValid(password, minLength, maxLength)){
    console.log("Password is valid.");
  }
  else {
    res.render('createAccount.ejs', {'css': 'login', "message": "Password must be 5-10 letters, numbers, and/or symbols only."});
    return;
  }
  if (isInputValid(username, minLength, maxLength)){
    console.log("Username is valid.");
  }
  else {
    res.render('createAccount.ejs', {'css': 'login', "message": "Username must be 5-10 letters, numbers, and/or symbols only."});
    return;
  }
  console.log("Username:" + username);
  console.log("Password:" + password);
  bcrypt.hash(password, saltRounds, async function(err, hash) {
     console.log("Hashed Pswd: " + hash);
     let sql1 = "SELECT COUNT(*) as count from user where username = ?";
     let row = await executeSQL(sql1, [username]);
     let count = row[0].count;
     if(count > 0){
       res.render('createAccount.ejs', {'css': 'login', "message": "Username taken"});
     }
     else {
       let sql = "INSERT INTO user (username, password, first, last) VALUES (?, ?, ? , ?);"
       let params = [username, hash, first, last];
       let rows = await executeSQL(sql, params);
       res.render('createAccount.ejs', {'css': 'login', "message": "User added!"});
     }
  });
});

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
    res.render('index.ejs', {'css': 'login', "loginError": true});
    return;
  }
  
  if(rows.length > 0){
    hashedPwd = rows[0].password;
  }

  let passwordMatch = await bcrypt.compare(password, hashedPwd);
  console.log("passwordMatch:" + passwordMatch + hashedPwd + password); 
  
  if(passwordMatch){
    req.session.authenticated = true;
    res.redirect('/home');
  } else {
    req.session.authenticated = false;
    res.render('index.ejs', {'css': 'login', "loginError": true});
  }
});

app.get("/home", isAuthenticated, (req, res) => {
    res.redirect("/");
});

function isAuthenticated(req, res, next){
  if(!req.session.authenticated){
    res.redirect("/");
  } else {
    next();
  }
}

function isInputValid(password, min, max){
  const chars = /^[a-zA-Z0-9~!@#$%^&*()]+$/;
  const length = password.length;
  const check = chars.test(password);
  
  return (length >= min && length <= max && check)
}
