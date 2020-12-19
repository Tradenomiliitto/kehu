exports.up = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("situation");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.string("situation");
  });
};
