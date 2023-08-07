// uncomment line below to run db and api test
// const test = require("./test.js");

// multer, picture upload middleware
const multer = require("multer");
const multerStorage = multer.memoryStorage();
const upload = multer();

// database and api access
const mysql = require("mysql2");
const dbAccess = mysql.createPool(require("./configs_DO_NOT_GITHUB.json").db);
const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;

// sessions
const session = require('express-session');
const secret = require("./configs_DO_NOT_GITHUB.json").sessionsSecret;

// password handling
const bcrypt = require('bcrypt');
const saltRounds = 10;

// express
const express = require("express");
const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true })); //to be able to parse Post parameters 
app.use(session({
  secret: secret,
  resave: true,
  saveUninitialized: true
}));

// idk?
let userId = null;

// Change genre arrays to object when time permits. Inefficient to use arrays
const genres = ['Action', 'Horror', 'Thriller', 'Western', 'Science Fiction', 'Drama', 'Romance',
  'Comedy', 'Fantasy', 'Animation', 'Documentary', 'Mystery', 'Family'];

// API uses different generes for TV
const tvGenres = ["Action & Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Mystery", "Reality", "Sci-Fi & Fantasy", "Soap", "Western"];
const tvGenreIDs = [10759, 16, 35, 80, 99, 18, 10751, 9648, 10764, 10765, 10766, 37];

// Same indexes as `genres` array - just in num format
const genreIDs = ['28', '27', '53', '37', '878', '18', '10749', '35', '14', '16', '99', '9648', '10751']
const types = ['Movies', 'Television'];

// Sends user straight to login. Most aesthetic for URL.
app.get('/', async (req, res) => {
  res.redirect('/login');
})

app.get('/login', async (req, res) => {
  res.render('index.ejs', { 'css': 'login' });
})

app.get('/create-account', async (req, res) => {
  res.render('createAccount.ejs', { 'css': 'login' });
})

app.get('/movies', async (req, res) => {
  const genreList = [];
  const genreMovies = [];

  for (let i = 0; i < 4; i++) {
    let number = getRandomNumFromLength(genres.length);

    if (!genreList.includes(genres[number])) {
      genreList.push(genres[number]);
      genreMovies.push(await fetchMoviesFromGenres(genreIDs[number], 3));
    } else {
      i--;
    }
  }

  let movieData = await fetchMovieData();

  res.render('home.ejs', {
    'css': 'main',
    'bannerImg': movieData.bannerUrl,
    'movieDescription': movieData.description,
    'movieTitle': movieData.title,
    'trending': movieData.trendingMovies,
    'trendingMoviesImg': movieData.trendingMoviesImg,
    'genreList': genreList,
    'genreMovies': genreMovies,
    'genres': genres,
    'genreIDs': genreIDs,
    'types': types
  });
})

app.get('/settings', isAuthenticated, async function(req, res) {
  let sql = `SELECT * from user WHERE username = "${userId}"`;
  let rows = await executeSQL(sql);
  res.render('userSettings.ejs', {
    'css': 'settings', 'genres': genres, 'users': rows,
    'genreIDs': genreIDs,
    'types': types
  });
})

app.get('/settings/delete', async function(req, res) {
  let sql = `DELETE FROM user WHERE username = "${userId}"`;
  let rows = await executeSQL(sql);
  console.log(rows);
  res.redirect('/');
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

app.get('/fetchMovieData', async (req, res) => {
  res.send(await fetchMovieData());
});

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
      trendingMoviesImg: trendingMoviesImg
    };
  } catch (err) {
    console.error("APIerror:" + err);
  }
}

app.get('/television', async (req, res) => {
  try {

    const genreList = [];
    const genreShows = [];

    for (let i = 0; i < 4; i++) {
      let number = getRandomNumFromLength(tvGenres.length);

      if (!genreList.includes(tvGenres[number])) {
        genreList.push(tvGenres[number]);
        genreShows.push(await fetchShowsFromGenres(tvGenreIDs[number], 3));
      } else {
        i--;
      }
    }

    const url = 'https://api.themoviedb.org/3/trending/tv/week?language=en-US';
    const response = await fetch(url, apiOptions)
    const data = await response.json();
    let index = getRandomNumFromLength(data.results.length);

    // Keeps shows without a backdrop out of the rotation
    while (data.results[index].backdrop_path == null) {
      index = getRandomNumFromLength(data.results.length);
    }

    const banner = data.results[index].backdrop_path;
    const trendingShows = [];
    const trendingShowsImg = [];

    data.results.forEach((show) => {
      if (show.backdrop_path != null) {
        trendingShows.push(show.original_name);
        trendingShowsImg.push(show.backdrop_path);
      }
    });

    res.render('television.ejs', {
      'css': 'main',
      'bannerUrl': `https://image.tmdb.org/t/p/original/${banner}`,
      'description': data.results[index].overview,
      'title': data.results[index].original_name,
      'trendingShows': trendingShows,
      'trendingShowsImg': trendingShowsImg,
      'genres': genres,
      'genreIDs': genreIDs,
      'genreShows': genreShows,
      'genreList': genreList,
      'types': types
    });

  } catch (err) {
    console.error("APIerror:" + err);
  }
});

async function fetchShowsFromGenres(genre, page) {
  const url = `https://api.themoviedb.org/3/discover/tv?include_adult=false&include_null_first_air_dates=false&language=en-US&page=${page}&sort_by=popularity.desc&watch_region=US&with_genres=${genre}&with_origin_country=US&with_original_language=en`

  const response = await fetch(url, apiOptions)
  const data = await response.json();

  return data.results;
}

async function fetchMoviesFromGenres(genre, page) {
  const url = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&region=US&sort_by=popularity.desc&watch_region=US&with_genres=${genre}&with_origin_country=US&with_original_language=en`;
  const response = await fetch(url, apiOptions)
  const data = await response.json();

  return data.results;
}

app.get('/category', async (req, res) => {
  const genreParam = req.query.genre;
  let pageParam = 1;
  const movies = [];

  // Exchanges genreID which the API uses to readable genre
  let genre = genreIDs.indexOf(genreParam);
  genre = genres[genre];

  movies.push(genre);

  for (pageParam; pageParam <= 3; pageParam++) {
    movies.push(await fetchMoviesFromGenres(genreParam, pageParam));
  }

  res.send(movies);
});

app.post('/create-account', upload.single("pfp"), async (req, res) =>{
  const username = req.body.username;
  const password = req.body.password;
  const first = req.body.first;
  const last = req.body.last;
  // TODO: put server checks in place so user can only upload pictures, also file size?
  // also, maybe there's a better way intead of constantly sending the same image everytime create button 
  // is clicked on client side.
  const pfp = req.file;

  // TODO: make sure that we do have a check if one or more field is empty everything is rejected
  const minLength = 8;
  const maxLength = 32;
  const minNameLength = 1;
  const maxNameLength = 50;
  const cleanFirst = first.trim();
  const cleanLast = last.trim();

  console.log(cleanFirst + " " + cleanLast);

  if (username == password) {
    res.send("Username can not match password.");
    return;
  }
  if (isUsernameValid(username, minLength, maxLength)) {
    console.log("Username is valid.");
  }
  else {
    res.send("Username must be 8-32 letters, numbers, and/or symbols only.");
    return;
  }
  if (isPasswordValid(password, minLength, maxLength)) {
    console.log("Password is valid.");
  }
  else {
    res.send("Password must be 8-32 letters, numbers, and/or symbols only.");
    return;
  }
  if (isNameValid(first, minNameLength, maxNameLength)) {
    console.log("First name is valid");
  }
  else {
    res.send("Names only accept letters and hypens");
  }
  if (isNameValid(last, minNameLength, maxNameLength)) {
    console.log("Last name is valid");
  }
  else {
    res.send("Names only accept letters and hypens");
  }

  console.log("Username:" + username);
  console.log("Password:" + password);

  bcrypt.hash(password, saltRounds, async function(err, hash) {
    console.log("Hashed Pswd: " + hash);
    let sql1 = "SELECT COUNT(*) as count from user where username = ?";
    let row = await executeSQL(sql1, [username]);
    let count = row[0].count;
    if (count > 0) {
      res.send("Username taken");
    }
    else {
      let sql = "INSERT INTO user (username, password, first, last) VALUES (?, ?, ? , ?);"
      let params = [username, hash, cleanFirst, cleanLast];
      let rows = await executeSQL(sql, params);

      // TODO: should be a redirect to the homepage with session. also, need to send session as a cookie to user.
      res.send("User added!");
    }
  });
});

app.post("/login", async (req, res) => {
  let username = req.body.username;
  userId = username;
  let password = req.body.password;
  console.log("username: " + username);
  console.log("password: " + password);
  let hashedPwd = "";

  let sql = "SELECT * FROM user WHERE username = ?";
  let rows = await executeSQL(sql, [username]);

  if (rows === null || rows.length === 0) {
    req.session.authenticated = false;
    res.render('index.ejs', { 'css': 'login', "loginError": true });
    return;
  }

  if (rows.length > 0) {
    hashedPwd = rows[0].password;
  }

  let passwordMatch = await bcrypt.compare(password, hashedPwd);
  console.log("passwordMatch:" + passwordMatch + hashedPwd + password);

  if (passwordMatch) {
    req.session.authenticated = true;
    res.redirect('/movies');
  } else {
    req.session.authenticated = false;
    res.render('index.ejs', { 'css': 'login', "loginError": true });
  }
});

app.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get("/home", (req, res) => {
  res.redirect("/");
});

function isAuthenticated(req, res, next) {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else {
    next();
  }
}

function isUsernameValid(username, min, max) {
  const chars = /^[a-zA-Z0-9]+$/;
  const length = username.length;
  const check = chars.test(username);

  return (length >= min && length <= max && check);
}

function isPasswordValid(password, min, max) {
  const chars = /^[a-zA-Z0-9~!@#$%^&*()]+$/;
  const length = password.length;
  const check = chars.test(password);

  return (length >= min && length <= max && check);
}

function isNameValid(name, min, max) {
  const chars = /^[a-zA-Z -]+$/;
  const length = name.length;
  let check = chars.test(name);

  return (length >= min && length <= max && check);
}