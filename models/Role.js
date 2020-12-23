const i18n = require("i18next");
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

  $afterFind({ t }) {
    const translatedRoles =
      typeof t === "function"
        ? t("default-config.roles", { returnObjects: true })
        : {};
    this.imageId = this.role;
    if (this.id in translatedRoles) this.role = translatedRoles[this.id];
  }
}

module.exports = Role;
