const Model = require("objection").Model;

class GroupInvitation extends Model {
  static get tableName() {
    return "GroupInvitations";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["group_id"],
      properties: {
        id: { type: "integer" },
        user_id: { type: ["integer", "null"] },
        email: { type: ["string", "null"] },
        group_id: { type: "integer" },
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
          to: "GroupInvitations.user_id",
        },
      },
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Group`,
        join: {
          from: "Groups.id",
          to: "GroupInvitations.group_id",
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

module.exports = GroupInvitation;
