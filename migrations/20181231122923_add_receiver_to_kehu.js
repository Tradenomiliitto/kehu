exports.up = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.string("receiver_name");
    table.string("receiver_email");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("receiver_name");
    table.dropColumn("receiver_email");
  });
};
