const Model = require("objection").Model;
const Kehu = require("./Kehu");

class User extends Model {
  static get tableName() {
    return "Users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["auth0_id"],
      properties: {
        id: { type: "integer" },
        first_name: { type: "string" },
        last_name: { type: "string" },
        auth0_id: { type: "string" }
      }
    };
  }

  static get relationMappings() {
    return {
      kehus: {
        relation: Model.HasManyRelation,
        modelClass: Kehu,
        join: {
          from: "Users.id",
          to: "Kehus.owner_id"
        }
      },
      kehus_given: {
        relation: Model.HasManyRelation,
        modelClass: Kehu,
        join: {
          from: "Users.id",
          to: "Kehus.giver_id"
        }
      }
    };
  }
}

module.exports = User;
