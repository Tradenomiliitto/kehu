exports.up = function (knex) {
  return knex.schema
    .table("Kehus", function (table) {
      table.timestamps();
    })
    .table("Tags", function (table) {
      table.timestamps();
    })
    .table("Users", function (table) {
      table.timestamps();
    });
};

exports.down = function (knex) {
  return knex.schema
    .table("Users", function (table) {
      table.dropTimestamps();
    })
    .table("Tags", function (table) {
      table.dropTimestamps();
    })
    .table("Kehus", function (table) {
      table.dropTimestamps();
    });
};
