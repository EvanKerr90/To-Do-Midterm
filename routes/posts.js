"use strict";
const express = require('express');
const postsRoutes = express.Router();
const bodyParser = require("body-parser");

const search = require("../apis")

module.exports = function (database) {

  postsRoutes.get("/", function (req, res) {
    database.getAllPosts()
    .then(function (result) {
        console.log(result)
        res.json(result)
        //knex.destroy();
      })
  });

  postsRoutes.post("/", async function (req, res) {
    //console.log(req.body)
  await search.apiSearch(req)
  res.status(201).send()

  })

  return postsRoutes;

}
