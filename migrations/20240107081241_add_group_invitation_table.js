/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable("GroupInvitations", function (table) {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("Users")
      .onDelete("CASCADE");
    table.string("email");
    table
      .integer("group_id")
      .unsigned()
      .references("id")
      .inTable("Groups")
      .onDelete("RESTRICT");
    table.timestamps();
  });

  await knex.schema.table("GroupMembers", function (table) {
    table.dropColumn("invitation_id");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists("GroupInvitations");

  await knex.schema.table("GroupMembers", function (table) {
    table.string("invitation_id");
  });
};
