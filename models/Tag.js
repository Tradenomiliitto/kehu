const Model = require("objection").Model;
const Kehu = require("./Kehu");

class Tag extends Model {
  static get tableName() {
    return "Tags";
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
          from: "Tags.id",
          through: {
            from: "Kehus_Tags.kehu_id",
            to: "Kehus_Tags.tag_id"
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

module.exports = Tag;
