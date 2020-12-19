exports.up = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.text("comment");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.text("comment");
  });
};
