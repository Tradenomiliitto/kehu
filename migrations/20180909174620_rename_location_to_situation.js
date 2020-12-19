exports.up = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.renameColumn("location", "situation");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.renameColumn("situation", "location");
  });
};
