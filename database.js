module.exports = function knexData(knex) {
  return {

    getAllPosts: function () {
       return knex('posts')
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
