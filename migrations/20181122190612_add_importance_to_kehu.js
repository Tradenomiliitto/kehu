exports.up = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.integer("importance");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("importance");
  });
};
