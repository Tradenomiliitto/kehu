exports.up = function(knex, Promise) {
  return knex.schema
    .createTable("Roles", function(table) {
      table.increments("id").primary();
      table.string("role");
      table.timestamps();
    })
    .table("Kehus", function(table) {
      table
        .integer("role_id")
        .unsigned()
        .references("id")
        .inTable("Roles")
        .onDelete("SET NULL");
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .table("Kehus", function(table) {
      table.dropColumn("role_id");
    })
    .dropTable("Roles");
};
