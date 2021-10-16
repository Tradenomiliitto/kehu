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
        // Giver (i.e. sender) of the Kehu. Sent Kehus page lists all
        // Kehus user has sent EXCEPT when the receiver is the user itself (this
        // is the case when user adds a Kehu themselves)
        giver_id: { type: "integer" },
        // Giver name is shown to the owner in Received Kehus page. When sending
        // a Kehu it's the user's name, when adding a Kehu it's what user wrote
        giver_name: { type: "string" },
        date_owner_saw: { type: ["string", "null"] },
        importance: { type: "integer", minimum: 0, maximum: 5 },
        // Owner (i.e. receiver) of the Kehu. Received Kehus page lists all
        // Kehus user owns
        owner_id: { type: "integer" },
        // Receiver name is not visible to the owner but is visible in Sent
        // Kehus for the sender. When sending a Kehu the value is what user
        // wrote when sending it, when adding a Kehu the value is NULL
        receiver_name: { type: "string" },
        // Receiver email is not visible to anyone. Value is NULL when adding
        // a Kehu
        receiver_email: { type: "string" },
        role_id: { type: ["integer", "null"] },
        text: { type: "string" },
        group_id: { type: "integer" },
        is_public: { type: "boolean" },
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
      group: {
        relation: Model.BelongsToOneRelation,
        modelClass: `${__dirname}/Group`,
        join: {
          from: "Groups.id",
          to: "Kehus.group_id",
        },
      },
      likes: {
        relation: Model.HasManyRelation,
        modelClass: `${__dirname}/Like`,
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

module.exports = Kehu;
