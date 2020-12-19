exports.up = function(knex) {
  return knex.schema.table("Users", function(table) {
    table.string("email");
    table.string("picture");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Users", function(table) {
    table.dropColumn("picture");
    table.dropColumn("email");
  });
};
