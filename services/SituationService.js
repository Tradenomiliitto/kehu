const Situation = require("../models/Situation");
const Kehu = require("../models/Kehu");

async function findSituationWithText(text) {
  return await Situation.query()
    .where("text", text)
    .first();
}

async function getUserSituations(user_id) {
  const kehus = Kehu.query()
    .where("owner_id", user_id)
    .eager("situations");
  const tags = kehus.map(k => k.tags).reduce((acc, val) => acc.concat(val), []);
  return tags.map(t => ({ text: t.text }));
}

module.exports = {
  findSituationWithText,
  getUserSituations
};
