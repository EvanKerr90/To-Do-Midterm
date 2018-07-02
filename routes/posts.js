"use strict";
const express = require('express');
const postsRoutes = express.Router();
const bodyParser = require("body-parser");

const search = require("../apis")

module.exports = function (database) {

  postsRoutes.get("/", function (req, res) {
    database.getAllPosts()
      .then(function (result) {
        res.json(result)
      })
  });

  postsRoutes.post("/", async function (req, res) {
    await search.apiSearch(req)
    res.status(201).send()

  })

  postsRoutes.post("/delete", async function (req, res) {
    await database.deletePost(req.body)
    res.status(201).send()

  })

  postsRoutes.post("/edit", async function (req, res) {
    await database.modifyPost(req.body)
    res.status(201).send()

  })

  return postsRoutes;

}
