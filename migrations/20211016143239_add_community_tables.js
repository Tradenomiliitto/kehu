exports.up = async function (knex) {
  await knex.schema.createTable("Groups", function (table) {
    table.increments("id").primary();
    table.string("name");
    table.text("description");
    table.string("picture");
    table.timestamps(); // created_at and updated_at columns
  });

  await knex.schema.createTable("GroupMembers", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("Users")
      .onDelete("CASCADE");
    table
      .integer("group_id")
      .unsigned()
      .references("id")
      .inTable("Groups")
      .onDelete("RESTRICT");
    table.boolean("is_admin");
    table.timestamp("joined_at");
    table.string("invitation_id");
    table.timestamps();
  });

  await knex.schema.createTable("Likes", function (table) {
    table.increments("id").primary();
    table
      .integer("kehu_id")
      .unsigned()
      .references("id")
      .inTable("Kehus")
      .onDelete("CASCADE");
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("Users")
      .onDelete("SET NULL");
    table.string("emoji");
    table.timestamps();
  });

  await knex.schema.table("Kehus", function (table) {
    table
      .integer("group_id")
      .unsigned()
      .references("id")
      .inTable("Groups")
      .onDelete("RESTRICT");
    table.boolean("is_public");
  });
};

exports.down = async function (knex) {
  await knex.schema.table("Kehus", function (table) {
    table.dropColumn("group_id");
    table.dropColumn("is_public");
  });

  await knex.schema
    .dropTableIfExists("GroupMembers")
    .dropTableIfExists("Likes")
    .dropTableIfExists("Groups");
};
