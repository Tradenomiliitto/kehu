exports.up = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("situation");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.string("situation");
  });
};
