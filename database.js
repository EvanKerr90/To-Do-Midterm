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

    modifyPost: function (data) {
      //console.log(data)
      knex('posts').where({'id': data.id}).update({'category': data.newCategory}).then()
    },

    deletePost: function (id) {
      //console.log(id.id)
      knex('posts').where({'id': id.id}).del().then();    
    }
  }
}
