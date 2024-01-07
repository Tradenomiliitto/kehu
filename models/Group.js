const Model = require("objection").Model;
const Kehu = require("./Kehu");
const GroupMember = require("./GroupMember");
const GroupInvitation = require("./GroupInvitation");

class Group extends Model {
  static get tableName() {
    return "Groups";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name", "picture"],
      properties: {
        id: { type: "integer" },
        name: { type: "string" },
        description: { type: "string" },
        picture: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      kehus: {
        relation: Model.HasManyRelation,
        modelClass: Kehu,
        join: {
          from: "Groups.id",
          to: "Kehus.group_id",
        },
      },
      members: {
        relation: Model.HasManyRelation,
        modelClass: GroupMember,
        join: {
          from: "Groups.id",
          to: "GroupMembers.group_id",
        },
      },
      invitations: {
        relation: Model.HasManyRelation,
        modelClass: GroupInvitation,
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

module.exports = Group;
