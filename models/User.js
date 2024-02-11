const Model = require("objection").Model;
const Kehu = require("./Kehu");
const GroupMember = require("./GroupMember");
const Like = require("./Like");

class User extends Model {
  static get tableName() {
    return "Users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["auth0_id", "first_name", "last_name", "email", "picture"],
      properties: {
        id: { type: "integer" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        auth0_id: { type: "string" },
        email: { type: "string" },
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
          from: "Users.id",
          to: "Kehus.owner_id",
        },
      },
      kehus_given: {
        relation: Model.HasManyRelation,
        modelClass: Kehu,
        join: {
          from: "Users.id",
          to: "Kehus.giver_id",
        },
      },
      groups: {
        relation: Model.HasManyRelation,
        modelClass: GroupMember,
        join: {
          from: "Users.id",
          to: "GroupMembers.user_id",
        },
      },
      likes: {
        relation: Model.HasManyRelation,
        modelClass: Like,
        join: {
          from: "Users.id",
          to: "Likes.user_id",
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

module.exports = User;
