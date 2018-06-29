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

  const eat = new Promise((resolve, reject) => {
    let input = req.body.list;
    const apiKey = 'zSL9-cuYDgOMp4YRJ9LjlwidFo8hTQ2P6fmXm6fAN3M8E7VVuyQT7mmE4HTlWks7nJ5X9h1mbluRPY9zMC_XI8S46YprxtQspNATurms73EN-OiUZ5UkH5cEnCk0W3Yx';
    const client = yelp.client(apiKey);
    const searchRequest = {
      term: input,
      location: 'Vancouver, BC'
    }
    client.search(searchRequest).then(err, response => {
      if (err) {
        return reject(new Error("error with yelp"))
      }
      const firstResult = response.jsonBody.businesses[0].name;
      const restaurantName = JSON.stringify(firstResult, null, 4)
      const restaurantNameLower = restaurantName.toLowerCase();
      const inputLower = input.toLowerCase();
      if (restaurantNameLower.includes(inputLower)) {
        console.log('restaurant exist', restaurantName)
        return resolve(category = 'to eat')
      } else {
          return reject(new Error("error with yelp"))
      }
    })
  }).catch(function () {
    return;
  })

  const product = new Promise((resolve, reject) => {
    let input = req.body.list
    request('http://api.walmartlabs.com/v1/search?apiKey=erubnzcy46ck4nsjxnhnndp8&query=' + input,
      (err, apiRes, body) => {
        if (err || !body) {
          return reject(new Error('error on walmart'));
        } else {
          let result = JSON.parse(body);
          if (!result.items) {
            return reject(new Error('error on walmart'));
          } else {
            let resultName = result.items[0].name;
            return resolve(category = 'to buy');
          }
        }
      })
  }).catch(function () {
    return;
  })

  const movie = new Promise((resolve, reject) => {
    let query = req.body.list;
    let url = 'http://www.omdbapi.com/?s=' + query + '&apikey=thewdb'
    request(url, function (error, response, body) {
      let data = JSON.parse(body);
      console.log(data)
      if (error || !data && !!response.statusCode === 200 || data.Error) {
        return reject(new Error('error in movie'))
      } else {
        //let data = JSON.parse(body);
        //let newData = data["Search"][0]["Title"];
        //console.log(newData)
        //console.log(data)
        return resolve(category = 'to watch')
      }
    })
  }).catch(function () {
    return;
  })

  const book = new Promise((resolve, reject) => {
    let input = req.body.list;
    let key = '2zgVviFR7njEvPz8Tsna7w';
    request(`https://www.goodreads.com/book/title.xml?key=${key}&title=${input}`,
      (err, response, body) => {
        let xml = body;
        if (err || !body) {
          return reject(new Error('error on books'));
        } parseString(xml, function (err, result) {
          if(!result.GoodreadsResponse) {
            return reject(new Error('error on books'));
          } else {
            return resolve(category = 'to read')
          }
        })
      })
  }).catch(function () {
    return;
  })


  return Promise.all([eat, product, movie, book]).then(function (r) {
    database.insertPost(req.body.list, category)
    database.getAllPosts()
  })
}
}
