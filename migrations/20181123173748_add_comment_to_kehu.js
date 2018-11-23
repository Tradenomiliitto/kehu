exports.up = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.text("comment");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.text("comment");
  });
};
