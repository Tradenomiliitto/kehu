const Tag = require("../models/Tag");
const Kehu = require("../models/Kehu");

async function findTagWithText(text) {
  return await Tag.query().where("text", text).first();
}

async function getUserTags(user_id) {
  const kehus = await Kehu.query()
    .where("owner_id", user_id)
    .withGraphFetched("tags");
  return kehus
    .map((k) => k.tags)
    .reduce((acc, val) => acc.concat(val), [])
    .map((t) => ({ text: t.text }));
}

module.exports = {
  findTagWithText,
  getUserTags,
};
