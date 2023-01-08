exports.up = function (knex) {
  return knex.schema.table("GroupMembers", (table) => {
    table.unique(["user_id", "group_id"], "unique_group_members");
  });
};

exports.down = function (knex) {
  return knex.schema.table("GroupMembers", (table) => {
    table.dropUnique(["user_id", "group_id"], "unique_group_members");
  });
};
