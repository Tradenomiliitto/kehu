const moment = require("moment");
const { raw } = require("objection");
const Kehu = require("../models/Kehu");
const logger = require("../logger");

async function getKehus(user_id, t) {
  return await Kehu.query()
    .context({ t })
    .limit(5)
    .where("owner_id", user_id)
    .eager("[role, situations, tags, giver]")
    .modifyEager("giver", builder => {
      builder.select("picture");
    })
    .orderBy("date_given", "desc");
}

async function getSentKehus(user_id) {
  return await Kehu.query()
    .select(
      "date_given",
      "giver_name",
      "role_id",
      "receiver_name",
      "text",
      "Users.picture as picture"
    )
    .join("Users", "Kehus.giver_id", "=", "Users.id")
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

async function getFeedItems(user_id, t) {
  logger.info(`Fetching feed items for user ${user_id}`);
  try {
    const kehus = await getKehus(user_id, t);
    const sentKehus = await getSentKehus(user_id);
    return [...kehus, ...sentKehus].sort(sortKehus).slice(0, 5);
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  getFeedItems
};
