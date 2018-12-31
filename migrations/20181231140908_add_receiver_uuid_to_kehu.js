exports.up = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.string("claim_id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("Kehus", function(table) {
    table.dropColumn("claim_id");
  });
};
