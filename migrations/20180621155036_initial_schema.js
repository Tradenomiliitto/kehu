exports.up = function(knex) {
  return knex.schema
    .createTable("Users", function(table) {
      table.increments("id").primary();
      table.string("first_name");
      table.string("last_name");
      table.string("auth0_id");
    })
    .createTable("Tags", function(table) {
      table.increments("id").primary();
      table.string("text");
    })
    .createTable("Kehus", function(table) {
      table.increments("id").primary();
      table
        .integer("giver_id")
        .unsigned()
        .references("id")
        .inTable("Users");
      table.string("giver_name");
      table.string("location");
      table
        .integer("owner_id")
        .unsigned()
        .references("id")
        .inTable("Users");
      table.text("text");
      table.string("title");
    })
    .createTable("Kehus_Tags", function(table) {
      table
        .integer("kehu_id")
        .unsigned()
        .references("id")
        .inTable("Kehus")
        .onDelete("CASCADE");
      table
        .integer("tag_id")
        .unsigned()
        .references("id")
        .inTable("Tags")
        .onDelete("CASCADE");
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("Kehus_Tags")
    .dropTableIfExists("Kehus")
    .dropTableIfExists("Tags")
    .dropTableIfExists("Users");
};
