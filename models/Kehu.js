const Model = require("objection").Model;

class Kehu extends Model {
  static get tableName() {
    return "Kehus";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["giver_name", "giver_id", "text"],
      properties: {
        id: { type: "integer" },
        claim_id: { type: ["string", "null"] },
        comment: { type: "string" },
        date_given: { type: "string" },
        giver_id: { type: "integer" },
        giver_name: { type: "string" },
        date_owner_saw: { type: ["string", "null"] },
        importance: { type: "integer", minimum: 0, maximum: 5 },
        owner_id: { type: "integer" },
        receiver_name: { type: "string" },
        receiver_email: { type: "string" },
        role_id: { type: ["integer", "null"] },
        text: { type: "string" },
      },
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
            to: "Kehus_Tags.tag_id",
          },
          to: "Tags.id",
        },
      },
      situations: {
        relation: Model.ManyToManyRelation,
        modelClass: `${__dirname}/Situation`,
        join: {
          from: "Kehus.id",
          through: {
            from: "Kehus_Situations.kehu_id",
            to: "Kehus_Situations.situation_id",
          },
          to: "Situations.id",
        },
      },
      giver: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: "Users.id",
          to: "Kehus.giver_id",
        },
      },
      owner: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/User`,
        join: {
          from: "Users.id",
          to: "Kehus.owner_id",
        },
      },
      role: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Role`,
        join: {
          from: "Roles.id",
          to: "Kehus.role_id",
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

module.exports = Kehu;
