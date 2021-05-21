const moment = require("moment");
const { raw } = require("objection");
const Kehu = require("../models/Kehu");
const logger = require("../logger");

async function getKehus(user_id, t) {
  const kehus = await Kehu.query()
    .context({ t })
    .where("owner_id", user_id)
    .eager("[role, situations, tags, giver]")
    .modifyEager("giver", builder => {
      builder.select("picture");
    })
    .orderBy("date_given", "desc");

  // Mark all unseen kehus as seen
  const markKehusSeen = await Kehu.query()
    .where("owner_id", user_id)
    .andWhere("date_owner_saw", null)
    .patch({ date_owner_saw: new Date().toISOString() });

  if (markKehusSeen > 0) logger.info(`Marked ${markKehusSeen} kehus seen`);

  // Show new kehu badge if kehu has never been seen or has been seen in the
  // last 5 seconds (this is to show the badge even if user makes double-click
  // when logging in)
  for (const kehu of kehus) {
    const seenDate = Date.parse(kehu.date_owner_saw);
    kehu.isNewKehu =
      kehu.date_owner_saw == null ||
      (!isNaN(seenDate) && new Date().getTime() - seenDate < 5 * 1000);
  }
  return kehus;
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
    // Return top 5 kehus but always return all new kehus even if not fitting
    // in top 5
    return [...kehus, ...sentKehus]
      .sort(sortKehus)
      .filter((kehu, idx) => idx < 5 || kehu.isNewKehu);
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  getFeedItems
};
