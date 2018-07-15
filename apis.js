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
const parseString = require('xml2js').parseString;
const database = require("./database")(knex);
const apiKeys = require ("./secrets")

exports.apiSearch = function (req) {
  let input = req.body.data

  if (!input) {
    return
  } else {
    let category = 'other';
    let apiChoice = {
      movie: false,
      food: false,
      book: false,
      product: false
    };

    const eat = new Promise((resolve, reject) => {
      let input = req.body.data;
      let inputLower = input.toLowerCase();
      const apiKey = apiKeys.Yelp;
      const client = yelp.client(apiKey);
      const searchRequest = {
        term: input,
        location: 'Vancouver, BC'
      }

      client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses[0];
        const firstName = firstResult && firstResult.name;
        const restaurantName = JSON.stringify(firstName, null, 4);
        return resolve(apiChoice.food = firstName && restaurantName.toLowerCase().includes(input.toLowerCase()))
      }).catch(function (error) {
        apiChoice.food = false;
      })

    }).catch(function (error) {
      apiChoice.food = false;
    })

    const product = new Promise((resolve, reject) => {
      let input = req.body.data
      let inputLower = input.toLowerCase();
      request(apiKeys.Walmart + input,
        (err, apiRes, body) => {
          let result = JSON.parse(body);
          if (err || !result || result['numItems'] === 0) {
            return reject(new Error('error in walmart'));
          } else {
            let resultName = result.items[0].name;
            let resultNameLower = resultName.toLowerCase();
            if (resultNameLower.includes(inputLower)) {
              return resolve(apiChoice.product = true);
            } else {
              return resolve(apiChoice.product = false);
            }
          }
        })
    }).catch(function (error) {
      apiChoice.product = false;
    })

    const movie = new Promise((resolve, reject) => {
      let input = req.body.data;
      let inputLower = input.toLowerCase();
      let url = apiKeys.Omdb.first + input + apiKeys.Omdb.second
      request(url, function (error, response, body) {
        let data = JSON.parse(body);
        if (error || !data && !!response.statusCode === 200 || data.Error === "Movie not found!") {
          return reject(new Error('error in movie'))
        } else {
          let movieTitle = data["Search"][0]["Title"];
          let movieTitleLower = movieTitle.toLowerCase()
          if (movieTitleLower.includes(inputLower)) {
            return resolve(apiChoice.movie = true);
          } else {
            return resolve(apiChoice.movie = false);
          }
        }
      })
    }).catch(function (error) {
      apiChoice.movie = false;
    })

    const book = new Promise((resolve, reject) => {
      let input = req.body.data;
      let inputLower = input.toLowerCase();
      let key = apiKeys.Goodreads.key;
      request(apiKeys.Goodreads.first + key + apiKeys.Goodreads.second + input,
        (err, response, body) => {
          let xml = body;
          if (err || !body) {
            return reject(new Error('error in book'));v
          }
          parseString(xml, function (err, result) {
            if (!result.GoodreadsResponse) {
              return reject(new Error('error in book'));
            } else {
              let bookName = result.GoodreadsResponse.book[0].title[0];
              let bookNameLower = bookName.toLowerCase()
              if (bookNameLower.includes(inputLower)) {
                return resolve(apiChoice.book = true);
              } else {
                return resolve(apiChoice.book = false);
              }
            }
          })
        })
    }).catch(function (error) {
      apiChoice.book = false;
    })

    return Promise.all([eat, product, movie, book]).then(function (r) {
        if (apiChoice.movie === true) {
          return category = "Movie";
        } else if (apiChoice.book === true) {
          return category = "Book";
        } else if (apiChoice.food === true) {
          return category = "Food";
        } else if (apiChoice.product === true) {
          return category = "Product";
        } else {
          return category = "Other";
        }
      })
      .then(function (category) {
        database.insertPost(req.body.data, category);
        database.getAllPosts();
      })
  }
}
