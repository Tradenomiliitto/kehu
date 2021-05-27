exports.up = function (knex) {
  return knex.schema.table("Kehus", function (table) {
    table.dropColumn("title");
  });
};

exports.down = function (knex) {
  return knex.schema.table("Kehus", function (table) {
    table.string("title");
  });
};
