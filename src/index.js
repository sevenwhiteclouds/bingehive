// multer, picture upload middleware
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });

// Api access
const apiOptions = require("./configs_DO_NOT_GITHUB.json").api;

// s3 bucket
const { s3Upload, s3Download } = require('./functions/s3.js');

// Trailer API calls
const { fetchTrailers } = require('./functions/fetchTrailers.js');

// List functions
const { isInList } = require('./functions/isInList');
const { removeFromList } = require('./functions/removeFromList');
const { addToList } = require('./functions/addToList');
const { createList } = require('./functions/createList');
const { getList } = require('./functions/getList');
const { getAllListEntries } = require('./functions/getAllListEntries');

// Random num generator function
const { getRandomNumFromLength } = require('./functions/getRandomNumFromLength');

// SQL execution function
const { executeSQL } = require('./functions/executeSQL');

// Authentication functions
const { isAuthenticatedSpecial, isAuthenticatedSettings, isAuthenticatedInList, isAuthenticated} = require('./functions/authentications.js');

// Input Validation functions

const { isUsernameValid, isPasswordValid, isNameValid } = require('./functions/validation');

// Movie data functions
const { fetchMovieData } = require('./functions/fetchMovieData');
const { fetchMoviesFromGenres } = require('./functions/fetchMoviesFromGenre');

// Show data functions
const { fetchShowsFromGenres } = require('./functions/fetchShowsFromGenre');

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

// Sends user straight to movies. Most aesthetic for URL.
app.get('/', (req, res) => {
  res.redirect('/movies');
})

app.get("/search", async (req, res) => {
  if (Object.keys(req.query).length === 0) {
    res.redirect("/movies");
    return;
  }

  const results = (await (await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(req.query.query)}&include_adult=false&language=en-US&page=1`, apiOptions)).json()).results;

  results.forEach(res => {
    if (res.original_name !== undefined) {
      res.original_title = res.original_name;
      delete res.original_name;
    }
  });

  res.render("search.ejs", {css: "main", data: results});
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

app.get('/login', isAuthenticatedSpecial, async (req, res) => {
  res.render('login.ejs', { 'css': 'login' });
})

app.get('/logout', isAuthenticated, (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

app.get('/create-account', isAuthenticatedSpecial, async (req, res) => {
  res.render('createAccount.ejs', { 'css': 'login' });
})


app.get('/fetchMovieData', async (req, res) => {
  res.send(await fetchMovieData());
});

app.get('/settings/delete', isAuthenticated, async function(req, res) {
  // TODO: ask user if they are sure they want to delete, prevent accidental click
  let sql1 = `SELECT * from list join user on user.user_id = list.user_id where user.user_id = "${req.session.userId}"`;
  let list_id = await executeSQL(sql1);

  for (let i = 0; i < list_id.length; i++) {
    let sql2 = `delete from list_entry where list_id = "${list_id[i].list_id}"`;
    await executeSQL(sql2);
  }
  let sql3 = `delete from list where user_id = "${req.session.userId}"`;
  await executeSQL(sql3);
  let sql4 = `delete from user where user_id = "${req.session.userId}"`;
  await executeSQL(sql4);

  req.session.destroy();
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

app.get('/settings', isAuthenticatedSettings, async function(req, res) {
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
  let listData = await getList(req.session.userId);

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
    'userLists': listData,
    'tvGenres': tvGenres
  });
})

app.get('/api/fetch-trailer', async (req, res) => {
  const movieID = req.query.id;
  const contentType = req.query.contentType;
  const data = await fetchTrailers(movieID, contentType);

  res.json(data);
});

app.get('/api/getList', async (req, res) => {
  const userID = req.session.userId;
  const lists = await getList(userID);

  res.send(lists);
});

app.post('/api/addToList', upload.none(), isAuthenticated, async (req, res) => {
  const listId = req.body.listId;
  const contentId = req.body.contentId;
  const mediaType = req.body.contentType;
  const backdropPath = req.body.backdropPath;
  const originalTitle = req.body.originalTitle;
  const overview = req.body.overview;

  await addToList(listId, contentId, backdropPath, originalTitle, overview, mediaType);

  res.send("Congrats! the movie was added!");
});

app.post('/api/removeFromList', upload.none(), isAuthenticated, async (req, res) => {
  const listId = req.body.listId;
  const contentId = req.body.contentId;

  await removeFromList(listId, contentId);

  res.send("Item removed from list");
});

app.get('/api/isInList', isAuthenticatedInList, async (req, res) => {
  const listId = req.query.listId;
  const contentId = req.query.contentId;

  res.send(await isInList(listId, contentId));
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

    for (show of data.results) {
      show.original_title = show.original_name;
    }

    let index = getRandomNumFromLength(data.results.length);
    let listData = await getList(req.session.userId);

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
      'authenticated': req.session.authenticated,
      'types': types,
      'index': index,
      'tvData' : data,
      'userLists': listData,
      'currentPage': "television"
    });

  } catch (err) {
    console.error("APIerror:" + err);
  }
});

app.post('/api/update-pfp', upload.single("pfp"), isAuthenticated, async (req, res) => {
  const image = req.file;

  if (image !== undefined) {
    if (image.size > (8 * (1024 * 1024))) {
      res.send("File too big");
      return;
    }
  }

  let uploadStatus = await s3Upload(image.buffer);

  if (uploadStatus !== undefined) {
    let sql = `UPDATE user SET pic = ? WHERE user_id = ${req.session.userId}`;
    let params = [uploadStatus.key];
    await executeSQL(sql, params);
  }

  res.redirect("/settings");
});

app.post('/create-account', upload.single("pfp"), isAuthenticatedSpecial, async (req, res) => {
  let image = req.file;

  if (image !== undefined) {
    if (image.size > (8 * (1024 * 1024))) {
      res.send("File too big");
      return;
    }
  }

  const username = req.body.username;
  const password = req.body.password;
  const first = req.body.first;
  const last = req.body.last;

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

      await createList(rows.insertId, "Favorites");

      req.session.authenticated = true;
      req.session.userId = rows.insertId;
      res.redirect("/movies");
    }
  });
});

app.get("/mylist", isAuthenticated, async (req, res) => {
  const listId = req.query.id;
  const title = req.query.title;

  let data = await (await getAllListEntries(listId));

  res.render("mylist.ejs", {css: "main", title: title, data: data});
});

app.post("/settings", upload.none(), isAuthenticatedSettings, async (req, res) => {
  let userId = req.session.userId;
  let newUsername = req.body.newUsername;
  const minLength = 8;
  const maxLength = 32;
  let sql1 = "SELECT COUNT(*) as count FROM user where username = ?";
  let row = await executeSQL(sql1, [newUsername]);
  let count = row[0].count;
  if (count > 0) {
    res.send("Username taken");
    return;
  }
  if(!isUsernameValid(newUsername, minLength, maxLength)){
    res.send("Username must be 8-32 letters, numbers, and/or symbols only.");
    return;
  }
  let sql = `UPDATE user SET username = ? WHERE user_id = ?`;
  let params = [newUsername, userId];
  await executeSQL(sql, params);
  res.send("Updated.");
});

app.post("/settings/password", upload.none(), isAuthenticated, async (req, res) => {
  let userId = req.session.userId;
  let newPassword = req.body.newPassword;
  let oldPassword = req.body.oldPassword;
  let sql = `SELECT * FROM user where user_id = ?`;
  let rows = await executeSQL(sql, [userId]);

  let hashedPwd = rows[0].password;
  let passwordMatch = await bcrypt.compare(oldPassword, hashedPwd);
  if (!passwordMatch){
    res.send("Old password is incorrect");
    return;
  }
  const minLength = 8;
  const maxLength = 32;
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

app.post("/login", isAuthenticatedSpecial, async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let hashedPwd = "";
  let sql = `SELECT * FROM user WHERE username = ?`;
  let rows = await executeSQL(sql, [username]);

  console.log("username: " + username);
  console.log("password: " + password);

  if (rows === null || rows.length === 0) {
    req.session.authenticated = false;
    res.render('login.ejs', { 'css': 'login', "loginError": true });
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
    res.render('login.ejs', { 'css': 'login', "loginError": true });
  }
});
