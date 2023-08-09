// multer, picture upload middleware
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// database and api access
const mysql = require("mysql2");
const dbAccess = mysql.createPool(require("./configs_DO_NOT_GITHUB.json").db);
const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;

// s3 bucket
const { s3Upload, s3Download } = require('./s3.js');

// Trailer API calls
const { fetchTrailers } = require('./fetchTrailers');

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
  saveUninitialized: true,
  cookie: {maxAge: 630720000000}
}));

// Change genre arrays to object when time permits. Inefficient to use arrays
const genres = ['Action', 'Horror', 'Thriller', 'Western', 'Science Fiction', 'Drama', 'Romance',
  'Comedy', 'Fantasy', 'Animation', 'Documentary', 'Mystery', 'Family'];

// API uses different generes for TV
const tvGenres = ["Action & Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Mystery", "Reality", "Sci-Fi & Fantasy", "Soap", "Western"];
const tvGenreIDs = ['10759', '16', '35', '80', '99', '18', '10751', '9648', '10764', '10765', '10766', '37'];

// Same indexes as `genres` array - just in num format
const genreIDs = ['28', '27', '53', '37', '878', '18', '10749', '35', '14', '16', '99', '9648', '10751']
const types = ['Movies', 'Television'];

// server started
app.listen(3000, () => {
  console.log("server started");
})

// Sends user straight to login. Most aesthetic for URL.
app.get('/', (req, res) => {
  res.redirect('/login');
})

app.get("/search", async (req, res) => {
  const query = encodeURIComponent(req.query.query);

  if (query.length === 0) {
    res.send("You didn't search anything :(");
  }

  const results = (await (await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&include_adult=false&language=en-US&page=1`, apiOptions)).json()).results;

  res.render("search.ejs", {'css': 'main',
                            bannerImg: movieData.bannerUrl,
                            movieDescription: movieData.description,
                            movieTitle: movieData.title,
                            trending: movieData.trendingMovies,
                            trendingMoviesImg: movieData.trendingMoviesImg,
                            genreList: genreList,
                            genreMovies: genreMovies,
                            genres: genres,
                            genreIDs: genreIDs,
                            types: types,
                            movieData: movieData.data,
                            index: movieData.index,
                            authenticated: req.session.authenticated,
                            currentPage: "movies",
                            tvGenreIDs: tvGenreIDs,
                            tvGenres: tvGenres});
});

app.get("/api/image/", async (req, res) => {
  let fileKey;

  if (req.session.authenticated) {
    let sql = `SELECT pic FROM user WHERE user_id = '${req.session.userId}'`;
    fileKey = (await executeSQL(sql))[0].pic;
  } else {
    fileKey = "default";
  }

  s3Download(fileKey).pipe(res);
});

// TODO: this needs middleware to check if user is already logged in
app.get('/login', async (req, res) => {
  res.render('index.ejs', { 'css': 'login' });
})

app.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get('/create-account', async (req, res) => {
  res.render('createAccount.ejs', { 'css': 'login' });
})

app.get('/fetchMovieData', async (req, res) => {
  res.send(await fetchMovieData());
});

app.get('/settings/delete', async function(req, res) {
  // TODO: ask user if they are sure they want to delete, prevent accidental click
  let sql = `DELETE FROM user WHERE user_id = "${req.session.userId}"`;
  let rows = await executeSQL(sql);
  res.redirect('/');
})
app.get('/settings/password', isAuthenticated, async function(req, res) {
  let sql = `SELECT *
             FROM user
             WHERE user_id = '${req.session.userId}'`;
  let rows = (await executeSQL(sql))[0];

  res.render('userSettings.ejs', {
    'css': 'settings',
    'genres': genres,
    'users': rows,
    'genreIDs': genreIDs,
    'types': types
  });
});

app.get('/settings', isAuthenticated, async function(req, res) {
  let sql = `SELECT * FROM user WHERE user_id = '${req.session.userId}'`;
  let rows = (await executeSQL(sql))[0];

  res.render('userSettings.ejs', { 'css': 'settings',
                                  'genres': genres,
                                  'users': rows,
                                  'genreIDs': genreIDs,
                                  'types': types });
})

app.get('/category', async (req, res) => {
  const genreParam = req.query.genre;
  const path = req.query.path;
  let pageParam = 1;
  const content = [];
  let genre;

  switch(path.toLowerCase()) {

    case 'movies':
      genre = genreIDs.indexOf(genreParam);
      genre = genres[genre];
      content.push(genre);

      for (pageParam; pageParam <= 3; pageParam++) {
        content.push(await fetchMoviesFromGenres(genreParam, pageParam));
      }
      break;

    case 'television':
      genre = tvGenreIDs.indexOf(genreParam);
      genre = tvGenres[genre];
      content.push(genre);

      for (pageParam; pageParam <= 3; pageParam++) {
        content.push(await fetchShowsFromGenres(genreParam, pageParam));
      }
      break;

    default:
      console.error('SWITCH ERROR: /category');
  }

  res.send(content);
});

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

  res.render('movies.ejs', {
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
    'types': types,
    'movieData': movieData.data,
    'index' : movieData.index,
    'authenticated': req.session.authenticated,
    'currentPage': "movies",
    'tvGenreIDs': tvGenreIDs,
    'tvGenres': tvGenres
  });
})

app.get('/api/fetch-trailer', async (req, res) => {
  const movieID = req.query.id;
  const contentType = req.query.contentType;
  const data = await fetchTrailers(movieID, contentType);
  console.log(data)
  res.json(data);
});

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
        trendingShows.push(show);
        trendingShowsImg.push(show.backdrop_path);
      }
    });

    console.log(trendingShows)

    res.render('television.ejs', {
      'css': 'main',
      'bannerUrl': `https://image.tmdb.org/t/p/original/${banner}`,
      'description': data.results[index].overview,
      'title': data.results[index].original_name,
      'trendingShows': trendingShows,
      'trendingShowsImg': trendingShowsImg,
      'genres': tvGenres,
      'genreIDs': tvGenreIDs,
      'tvGenreIDs': tvGenreIDs,
      'tvGenres': tvGenres,
      'genreShows': genreShows,
      'genreList': genreList,
      'types': types,
      'index': index,
      'tvData' : data,
      'currentPage': "television"
    });

  } catch (err) {
    console.error("APIerror:" + err);
  }
});

app.post('/create-account', upload.single("pfp"), async (req, res) =>{
  const username = req.body.username;
  const password = req.body.password;
  const first = req.body.first;
  const last = req.body.last;
  // TODO: put server checks in place so user can only upload pictures, also file size?
  // also, maybe there's a better way intead of constantly sending the same image everytime create button
  // is clicked on client side.
  const image = req.file;

  // TODO: make sure that we do have a check if one or more field is empty everything is rejected
  const minLength = 8;
  const maxLength = 32;
  const minNameLength = 1;
  const maxNameLength = 50;
  const cleanFirst = first.trim();
  const cleanLast = last.trim();

  console.log("First name/Last name: " + cleanFirst + " " + cleanLast);

  if (username === password) {
    res.send("Username can not match password.");
    return;
  }
  if (!isUsernameValid(username, minLength, maxLength)) {
    res.send("Username must be 8-32 letters, numbers, and/or symbols only.");
    return;
  }
  if (!isPasswordValid(password, minLength, maxLength)) {
    res.send("Password must be 8-32 letters, numbers, and/or symbols only.");
    return;
  }
  if (!isNameValid(first, minNameLength, maxNameLength)) { // First Name
    res.send("Names only accept letters and hypens");
    return;
  }
  if (!isNameValid(last, minNameLength, maxNameLength)) { // No Last Name
    res.send("Names only accept letters and hypens");
    return;
  }

  console.log("Username:" + username);
  console.log("Password:" + password);

  bcrypt.hash(password, saltRounds, async function(err, hash) {
    console.log("Hashed Pswd: " + hash);
    let sql1 = "SELECT COUNT(*) as count FROM user where username = ?";
    let row = await executeSQL(sql1, [username]);
    let count = row[0].count;
    if (count > 0) {
      res.send("Username taken");
    }
    else {
      let sql = "INSERT INTO user (username, password, first, last, pic) VALUES (?, ?, ?, ?, ?);"
      let params = [username, hash, cleanFirst, cleanLast, "default"];
      let rows = await executeSQL(sql, params);

      let uploadStatus;

      if (image !== undefined) {
        uploadStatus = await s3Upload(image.buffer);
      }

      if (uploadStatus !== undefined) {
        sql = `UPDATE user SET pic = ? WHERE user_id = ${rows.insertId}`;
        params = [uploadStatus.key];
        await executeSQL(sql, params);
      }

      // TODO: should be a redirect to the homepage with session.
      res.send("User added!");
    }
  });
});

app.post("/settings", upload.none(), async (req, res) => {
  let userId = req.session.userId;
  let newUsername = req.body.newUsername;
  const minLength = 8;
  const maxLength = 32;
  if(!isUsernameValid(newUsername, minLength, maxLength)){
    res.send("Username must be 8-32 letters, numbers, and/or symbols only.");
    return;
  }
  let sql = `UPDATE user SET username = ? WHERE user_id = ?`;
  let params = [newUsername, userId];
  await executeSQL(sql, params);
  res.send("Updated.");
});

app.post("/settings/password", upload.none(), async (req, res) => {
  let userId = req.session.userId;
  let newPassword = req.body.newPassword;
  let oldPassword = req.body.oldPassword;
  let sql = `SELECT * FROM user where user_id = ?`;
  let rows = await executeSQL(sql, [userId]);
  console.log(rows);
  let hashedPwd = rows[0].password;
  let passwordMatch = await bcrypt.compare(oldPassword, hashedPwd);
  if (!passwordMatch){
    res.send("Old password is incorrect");
    return;
  }
  const minLength = 8;
  const maxLength = 32;
  // TODO: check if user is entering correct password before updating it
  if (!isPasswordValid(newPassword, minLength, maxLength)) {
    res.send("Password must be 8-32 letters, numbers, and/or symbols only.");
    return;
  }
  bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
    let sql = `UPDATE user
               SET password = ?
               WHERE user_id = ?`;
    let params = [hash, userId];
    await executeSQL(sql, params);
    res.send("Updated.");
  });
});

app.post("/login", async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let hashedPwd = "";
  let sql = `SELECT * FROM user WHERE username = ?`;
  let rows = await executeSQL(sql, [username]);

  console.log("username: " + username);
  console.log("password: " + password);

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
    req.session.userId = rows[0].user_id;
    req.session.authenticated = true;
    res.redirect('/movies');
  } else {
    req.session.authenticated = false;
    res.render('index.ejs', { 'css': 'login', "loginError": true });
  }
});

function isAuthenticated(req, res, next) {
  if (!req.session.authenticated) {
    res.redirect("/");
  } else {
    next();
  }
}

function getRandomNumFromLength(size) {
  return Math.floor(Math.random() * size);
}

async function executeSQL(query, params) {
  return new Promise((resolve, reject) => {
    dbAccess.query(query, params, (err, rows, fields) => {
      if (err) throw err;
      resolve(rows);
    });
  });
}

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

function isUsernameValid(username, min, max) {
  const chars = /^[a-zA-Z0-9]+$/;
  const length = username.length;
  const check = chars.test(username);

  return ((length >= min) && (length <= max) && (check));
}

function isPasswordValid(password, min, max) {
  const chars = /^[a-zA-Z0-9~!@#$%^&*()]+$/;
  const length = password.length;
  const check = chars.test(password);

  return ((length >= min) && (length <= max) && (check));
}

function isNameValid(name, min, max) {
  const chars = /^[a-zA-Z -]+$/;
  const length = name.length;
  let check = chars.test(name);

  return ((length >= min) && (length <= max) && (check));
}

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