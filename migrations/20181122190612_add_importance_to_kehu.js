exports.up = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.integer("importance");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("importance");
  });
};
