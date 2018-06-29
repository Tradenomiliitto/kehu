exports.up = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.timestamp("date_given");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("date_given");
  });
};
