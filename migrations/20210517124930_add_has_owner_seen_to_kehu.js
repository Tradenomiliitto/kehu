exports.up = async function(knex) {
  await knex.schema.table("Kehus", function(table) {
    table.timestamp("date_owner_saw");
  });
  // Mark all Kehus seen by owner
  await knex.table("Kehus").update({ date_owner_saw: new Date("2020-01-01") });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("date_owner_saw");
  });
};
