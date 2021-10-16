const Model = require("objection").Model;
const Kehu = require("./Kehu");
const User = require("./User");

class Like extends Model {
  static get tableName() {
    return "Likes";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["kehu_id", "user_id", "emoji"],
      properties: {
        id: { type: "integer" },
        kehu_id: { type: "integer" },
        user_id: { type: "integer" },
        emoji: { type: "string" },
      },
    };
  }

  static get relationMappings() {
    return {
      giver: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: "Users.id",
          to: "Likes.user_id",
        },
      },
      kehu: {
        relation: Model.BelongsToOneRelation,
        modelClass: Kehu,
        join: {
          from: "Kehus.id",
          to: "Likes.kehu_id",
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

module.exports = Like;
