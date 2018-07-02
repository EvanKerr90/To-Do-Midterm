"use strict";

require('dotenv').config();

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const sass = require("node-sass-middleware");
const app = express();
const knexConfig = require("./knexfile");
const knex = require("knex")(knexConfig[ENV]);
const morgan = require('morgan');
const knexLogger = require('knex-logger');
const request = require('request');
const yelp = require('yelp-fusion');


const database = require("./database")(knex);
const search = require("./apis")

const postsRoutes = require("./routes/posts")(database);

app.use(morgan('dev'));

// Log knex SQL queries to STDOUT
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use("/posts", postsRoutes);

// Home page
app.get("/", (req, res) => {
  res.render("index", database)
});

app.post('/', (req, res) => {
res.redirect("/")
})

app.get("/register", (req, res) => {
res.sendFile("/vagrant/To-Do-Midterm/views/register.html")
})

app.get("/login", (req, res) => {
  res.sendFile("/vagrant/To-Do-Midterm/views/login.html")
  })

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
