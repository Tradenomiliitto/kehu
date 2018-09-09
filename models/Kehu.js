const Model = require("objection").Model;

class Kehu extends Model {
  static get tableName() {
    return "Kehus";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["date_given", "giver_id", "situation", "owner_id", "text"],
      properties: {
        id: { type: "integer" },
        date_given: { type: "string" },
        giver_id: { type: "integer" },
        giver_name: { type: "string" },
        situation: { type: "string" },
        owner_id: { type: "integer" },
        text: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    return {
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/Tag`,
        join: {
          from: "Kehus.id",
          through: {
            from: "Kehus_Tags.kehu_id",
            to: "Kehus_Tags.tag_id"
          },
          to: "Tags.id"
        }
      },
      giver: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: "Users.id",
          to: "Kehus.giver_id"
        }
      },
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: "Users.id",
          to: "Kehus.owner_id"
        }
      }
    };
  }

  $beforeInsert() {
    this.created_at = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updated_at = new Date().toISOString();
  }
}

module.exports = Kehu;
