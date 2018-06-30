module.exports = function knexData(knex) {
  return {

    getAllPosts: function () {
      knex('posts').where({category: 'to eat'})
        .asCallback(function (err, result) {
          if (err) {
            return console.log(err)
          } else {
            console.log(result)
            return result
            //knex.destroy();
          }
        });
    },

    insertPost: function (content, category) {
      knex('posts').insert([{
          content: content,
          category: category
        }])
        .asCallback(function (err, result) {
          if (err) {
            return console.log(err)
          } else {
            console.log(result)
            return
            //knex.destroy();
          }
        });
    },

    modifyPost: function (id, newCategory) {
      knex('posts').where('id', id).update('category', newCategory)
    },

    deletePost: function (id) {
      knex('posts').where('id', id).delete()
    }
  }
}
