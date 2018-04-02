
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('marsItems', table => {
      table.increments('id').primary();
      table.string('itemName');
      table.boolean('packed');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('marsItems')
  ]);
};
