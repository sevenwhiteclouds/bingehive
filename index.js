const express = require("express");
const app = express();
const dbAccess = require("./dbAccess.js");
const apiOptions = require("./apiAccess.js");

app.use(express.static("public"));

app.get('/', (req, res) => {
  res.render('index.ejs', {'css': 'main'});
})

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
