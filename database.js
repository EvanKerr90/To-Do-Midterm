module.exports = function knexData(knex) {
  return {

    getAllPosts: function () {
      knex('posts')
        .asCallback(function (err, result) {
          if (err) {
            return console.log(err)
          } else {
            console.log(result)
            knex.destroy();
          }
        });
    },

    insertPost: function (content, category) {
      knex('posts').insert([{content: content, category: category}])
        .asCallback(function (err, result) {
          if (err) {
            return console.log(err)
          } else {
            console.log(result)
            knex.destroy();
          }
        });
    }
  }
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
