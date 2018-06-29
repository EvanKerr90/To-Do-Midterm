"use strict";

const express       = require('express');
const postsRoutes  = express.Router();



module.exports = function(database) {

  postsRoutes.get("/", function(req, res) {
    DataHelpers.getTweets((err, posts) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.json(posts);
      }
    });
  });

  postsRoutes.post("/", function(req, res) {
    if (!req.body.list) {
      res.status(400).json({ error: 'invalid request: no data in POST body'});
      return;
    }

    database.insertPost(post, (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
      } else {
        res.status(201).send();
      }
    });
  });

  return postsRoutes;

}
