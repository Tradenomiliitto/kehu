exports.up = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.renameColumn("location", "situation");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.renameColumn("situation", "location");
  });
};
