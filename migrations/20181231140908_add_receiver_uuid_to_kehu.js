exports.up = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.string("claim_id");
  });
};

exports.down = function(knex) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("claim_id");
  });
};
