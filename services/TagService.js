const Tag = require("../models/Tag");

async function findTagWithText(text) {
  return await Tag.query()
    .where("text", text)
    .first();
}

module.exports = {
  findTagWithText
};
