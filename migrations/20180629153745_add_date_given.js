exports.up = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.timestamp("date_given");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("date_given");
  });
};
