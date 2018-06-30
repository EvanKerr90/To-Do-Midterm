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

exports.apiSearch = function (req) {
  if (!req.body.list) {
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
      let input = req.body.list;
      let inputLower = input.toLowerCase();
      const apiKey = 'zSL9-cuYDgOMp4YRJ9LjlwidFo8hTQ2P6fmXm6fAN3M8E7VVuyQT7mmE4HTlWks7nJ5X9h1mbluRPY9zMC_XI8S46YprxtQspNATurms73EN-OiUZ5UkH5cEnCk0W3Yx';

      const client = yelp.client(apiKey);
      const searchRequest = {
        term: input,
        location: 'Vancouver, BC'
      }

      client.search(searchRequest).then(response => {
        const firstResult = response.jsonBody.businesses[0];
        const firstName = firstResult && firstResult.name;
        const restaurantName = JSON.stringify(firstName, null, 4);
        // only return true if firstName includes inputName
        return resolve(apiChoice.food = firstName && restaurantName.toLowerCase().includes(input.toLowerCase()))
      }).catch(function (error){
        apiChoice.food = false;
      })

    }).catch(function (error) {
      apiChoice.food = false;
    })

    const product = new Promise((resolve, reject) => {
      let input = req.body.list
      let inputLower = input.toLowerCase();
      request('http://api.walmartlabs.com/v1/search?apiKey=erubnzcy46ck4nsjxnhnndp8&query=' + input,
        (err, apiRes, body) => {
          if (err || !body) {
            return reject(new Error('error in walmart'));
          } else {
            let result = JSON.parse(body);
            if (!result.items) {
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
          }
        })
    }).catch(function (error) {
      apiChoice.product = false;
    })

    const movie = new Promise((resolve, reject) => {
      let input = req.body.list;
      let inputLower = input.toLowerCase();
      let url = 'http://www.omdbapi.com/?s=' + input + '&apikey=thewdb'
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
      let input = req.body.list;
      let inputLower = input.toLowerCase();
      let key = '2zgVviFR7njEvPz8Tsna7w';
      request(`https://www.goodreads.com/book/title.xml?key=${key}&title=${input}`,
        (err, response, body) => {
          let xml = body;
          if (err || !body) {
            return reject(new Error('error in book'));
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
        database.insertPost(req.body.list, category);
        database.getAllPosts();
      })
  }
}
