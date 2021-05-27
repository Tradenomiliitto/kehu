exports.up = function (knex) {
  return knex.schema
    .createTable("Situations", function (table) {
      table.increments("id").primary();
      table.string("text");
      table.timestamps();
    })
    .createTable("Kehus_Situations", function (table) {
      table
        .integer("kehu_id")
        .unsigned()
        .references("id")
        .inTable("Kehus")
        .onDelete("CASCADE");
      table
        .integer("situation_id")
        .unsigned()
        .references("id")
        .inTable("Situations")
        .onDelete("CASCADE");
      table.timestamps();
    });
};

exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists("Kehus_Situations")
    .dropTableIfExists("Situations");
};
