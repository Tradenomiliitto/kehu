const moment = require("moment");
const { raw } = require("objection");
const Kehu = require("../models/Kehu");
const logger = require("../logger");

async function getKehus(user_id) {
  return await Kehu.query()
    .where("owner_id", user_id)
    .eager("[role, situations, tags]")
    .limit(5)
    .orderBy("date_given", "desc");
}

async function getSentKehus(user_id) {
  return await Kehu.query()
    .select("date_given", "giver_name", "role_id", "receiver_name", "text")
    .limit(5)
    .where(function() {
      this.where("giver_id", user_id).andWhere("owner_id", "<>", user_id);
    })
    .orWhere(function() {
      this.where("giver_id", user_id).andWhere(raw("claim_id IS NOT NULL"));
    })
    .orderBy("date_given", "desc");
}

function sortKehus(a, b) {
  const aMoment = moment(a.date_given);
  const bMoment = moment(b.date_given);
  return aMoment.isAfter(bMoment) ? -1 : 1;
}

async function getFeedItems(user_id) {
  logger.info(`Fetching feed items for user ${user_id}`);
  const kehus = await getKehus(user_id);
  const sentKehus = await getSentKehus(user_id);
  return [...kehus, ...sentKehus].sort(sortKehus).slice(0, 5);
}

module.exports = {
  getFeedItems
};
