const moment = require("moment");
const { raw } = require("objection");
const Kehu = require("../models/Kehu");
const logger = require("../logger");
const { addKehuType } = require("../utils/ServerUtils");

async function getKehus(user_id, t) {
  const kehus = await Kehu.query()
    .context({ t })
    .where("owner_id", user_id)
    .withGraphFetched("[role, situations, tags, giver]")
    .modifyGraph("giver", (builder) => {
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

  // Add Kehu types
  addKehuType(kehus, "received", user_id);

  return kehus;
}

// Get all Kehus from user's groups which are not sent or owned by the user,
// in practise this means Kehus sent to the whole group or a public Kehu sent
// between two other group members
async function getGroupKehusNotOwnedOrSent(user_id, t) {
  const kehus = await Kehu.query()
    .context({ t })
    .select("Kehus.*")
    .withGraphFetched("[role, situations, tags, giver]")
    .modifyGraph("giver", (builder) => {
      builder.select("picture");
    })
    .joinRelated("group")
    .leftJoin("GroupMembers", "group.id", "GroupMembers.group_id")
    .where("GroupMembers.user_id", user_id)
    // COALESCE is required since owner_id is null for Kehus sent to the whole group
    .andWhere(raw(`COALESCE("Kehus".owner_id, -1)`), "<>", user_id)
    .andWhere("Kehus.giver_id", "<>", user_id)
    .andWhere("Kehus.is_public", true)
    .orderBy("date_given", "desc");

  addKehuType(kehus, "received", user_id);
  return kehus;
}

async function getSentKehus(user_id) {
  const sentKehus = await Kehu.query()
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
    .where(function () {
      this.where("giver_id", user_id).andWhere("owner_id", "<>", user_id);
    })
    .orWhere(function () {
      this.where("giver_id", user_id).andWhere(raw("claim_id IS NOT NULL"));
    })
    // Include Kehus sent to a whole group
    .orWhere(function () {
      this.where("giver_id", user_id).andWhere(raw("group_id IS NOT NULL"));
    })
    .orderBy("date_given", "desc");

  // Add Kehu types
  addKehuType(sentKehus, "sent", user_id);

  return sentKehus;
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
    const groupKehus = await getGroupKehusNotOwnedOrSent(user_id, t);

    // Return top 5 kehus but always return all new kehus even if not fitting
    // in top 5
    return [...kehus, ...groupKehus, ...sentKehus]
      .sort(sortKehus)
      .filter((kehu, idx) => idx < 5 || kehu.isNewKehu);
  } catch (e) {
    logger.error(e);
  }
}

module.exports = {
  getFeedItems,
};
