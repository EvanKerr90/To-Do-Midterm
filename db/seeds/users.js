exports.seed = function(knex, Promise) {
      return Promise.all([
        knex('posts').insert({content: 'Harry Potter', category: 'Read'}),
        knex('posts').insert({content: 'Lion King', category: 'Watch'}),
        knex('posts').insert({content: 'Chipotle', category: 'Eat'})
      ]);
};
