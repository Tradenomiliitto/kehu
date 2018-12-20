const Situation = require("../models/Situation");
const Kehu = require("../models/Kehu");

async function findSituationWithText(text) {
  return await Situation.query()
    .where("text", text)
    .first();
}

async function getUserSituations(user_id) {
  const kehus = await Kehu.query()
    .where("owner_id", user_id)
    .eager("situations");
  return kehus
    .map(k => k.situations)
    .reduce((acc, val) => acc.concat(val), [])
    .map(t => ({ text: t.text }));
}

module.exports = {
  findSituationWithText,
  getUserSituations
};
