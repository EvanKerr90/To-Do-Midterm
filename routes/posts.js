"use strict";
const express = require('express');
const postsRoutes = express.Router();

const search = require("../apis")

module.exports = function (database) {

  postsRoutes.get("/", function (req, res) {
    database.getAllPosts((err, result) => {
      if (err) {
        console.log(err)
      } else {
      console.log(JSON.stringify(result))
      res.send(result)
      }
    })
  });

  postsRoutes.post("/", function (req, res) {
    //console.log(req.body)
  search.apiSearch(req)
  res.status(201).send()

  })

  return postsRoutes;

}
