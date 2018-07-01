
exports.up = function (knex, Promise) {
  return Promise.all([
      knex.schema.createTable('posts', function (table) {
          table.increments('id');
          table.string('content', 255);
          table.string('category', 255);
      })
  ])
};


exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('posts')
    ])
  };