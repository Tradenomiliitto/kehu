const Tag = require("../models/Tag");

async function findTagWithText(text) {
  return await Tag.query()
    .where("text", text)
    .first();
}

async function getTags() {
  const tags = await Tag.query();
  return tags.map(t => ({ text: t.text }));
}

module.exports = {
  findTagWithText,
  getTags
};
