exports.up = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("title");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.string("title");
  });
};
