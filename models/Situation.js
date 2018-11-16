const Model = require("objection").Model;
const Kehu = require("./Kehu");

class Situation extends Model {
  static get tableName() {
    return "Situations";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["text"],
      properties: {
        id: { type: "integer" },
        text: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    return {
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: Kehu,
        join: {
          from: "Situations.id",
          through: {
            from: "Kehus_Situations.kehu_id",
            to: "Kehus_Situations.tag_id"
          },
          to: "Kehus.id"
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

module.exports = Situation;
