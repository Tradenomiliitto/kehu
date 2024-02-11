const Model = require("objection").Model;

class GroupMember extends Model {
  static get tableName() {
    return "GroupMembers";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["group_id", "is_admin"],
      properties: {
        id: { type: "integer" },
        user_id: { type: ["integer", "null"] },
        group_id: { type: "integer" },
        is_admin: { type: "boolean" },
        joined_at: { type: ["string", "null"] },
      },
    };
  }

  static get relationMappings() {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: "Users.id",
          to: "GroupMembers.user_id",
        },
      },
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Group`,
        join: {
          from: "Groups.id",
          to: "GroupMembers.group_id",
        },
      },
    };
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = GroupMember;
