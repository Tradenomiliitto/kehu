const Model = require("objection").Model;
const Kehu = require("./Kehu");

class Role extends Model {
  static get tableName() {
    return "Roles";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["text"],
      properties: {
        id: { type: "integer" },
        role: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    return {
      kehus: {
        relation: Model.HasManyRelation,
        modelClass: Kehu,
        join: {
          from: "Roles.id",
          to: "Kehus.role_id"
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

module.exports = Role;
