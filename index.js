const express = require("express");
const app = express();
const pool = require("./dbPool.js");

const apiOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "";
  }
};

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
