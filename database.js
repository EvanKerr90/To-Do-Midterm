const settings = require("./settings"); // settings.json

const knex = require('knex')({
  client: 'pg',
  connection: {
    host: settings.hostname,
    user: settings.user,
    password: settings.password,
    database: settings.database
  }
});

module.exports = function knexData 

function getAllPosts() {
    knex('posts')
    .asCallback(function (err, result) {
        if (err) {
          return console.log(err)
        } else {
          result
          knex.destroy();
        }
    });
}

function insertUser(email,password) {
    knex('posts')
    .asCallback(function (err, result) {
        if (err) {
          return console.log(err)
        } else {
          result
          knex.destroy();
        }
    });
}




function verifyUserByEmail(email, password) {
    knex.select('email', 'password').from('users').where({
        email: email,
        password: password
    })
  .asCallback(function (err, result) {
    if (err) {
      return console.log(err)
    } else {
      result
      knex.destroy();
    }
  });
}