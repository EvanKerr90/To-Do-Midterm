"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const request     = require('request');
const yelp        = require('yelp-fusion');


const database = require("./database")(knex);

// Seperated Routes for each Resource
//const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
//app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index", {restaurant:null, other:null});
  //return database.insertPost('Test', 'Test')
  //return database.getAllPosts()
});

app.post('/', function (req, res) {
  let input = req.body.list;
  const apiKey = 'zSL9-cuYDgOMp4YRJ9LjlwidFo8hTQ2P6fmXm6fAN3M8E7VVuyQT7mmE4HTlWks7nJ5X9h1mbluRPY9zMC_XI8S46YprxtQspNATurms73EN-OiUZ5UkH5cEnCk0W3Yx';
  const client = yelp.client(apiKey);
  const searchRequest = {
    term: input,
    location: 'Vancouver, BC'
  };

  client.search(searchRequest).then(response => {
    const firstResult = response.jsonBody.businesses[0].categories;
    console.log(firstResult)
    const restaurantName = JSON.stringify(firstResult, null, 4);
    res.render('index', {
      restaurant: restaurantName,
      other: null
    }) 
  }).catch(error => {
      res.render('index', {
        restaurant: null,
        other: input
      })
      return;
    })

  })


app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
