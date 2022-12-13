const { transaction } = require("objection");
const { v4: uuidv4 } = require("uuid");
const XLSX = require("xlsx");
const Kehu = require("../models/Kehu");
const { findTagWithText } = require("./TagService");
const { findSituationWithText } = require("./SituationService");
const { findUserByEmail } = require("./UserService");
const {
  sendEmailToUnkownUser,
  sendEmailToKnownUser,
} = require("./EmailService");
const { raw } = require("objection");
const logger = require("../logger");
const { addKehuType } = require("../utils/ServerUtils");

async function getKehus(user_id, t) {
  logger.info(`Fetching kehus for user ${user_id}`);
  const kehus = await Kehu.query()
    .context({ t })
    .withGraphFetched("[role, situations, tags]")
    .where("owner_id", user_id)
    // Add Kehus sent to the whole group in groups user is a member
    .union(
      Kehu.query()
        .context({ t })
        .withGraphFetched("[role, situations, tags]")
        .joinRelated("group")
        .leftJoin("GroupMembers", "group.id", "GroupMembers.group_id")
        .where("GroupMembers.user_id", user_id)
        // owner_id is null for Kehus sent to the whole group
        .andWhere(raw(`"Kehus".owner_id IS NULL`))
        // Exclude Kehus user himself sent to the whole group
        .andWhere("Kehus.giver_id", "<>", user_id)
    )
    .orderBy("date_given", "desc");

  // Add Kehu types
  addKehuType(kehus, user_id);

  return kehus;
}

async function getSentKehus(user_id, t) {
  logger.info(`Fetching given Kehus for user ${user_id}`);
  const sentKehus = await Kehu.query()
    .context({ t })
    .withGraphFetched("[role, situations, tags]")
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
  addKehuType(sentKehus, user_id);

  return sentKehus;
}

async function getKehu(user_id, kehu_id, t) {
  logger.info(`Fetching kehu ${kehu_id} for user ${user_id}`);
  return await Kehu.query()
    .context({ t })
    .where("owner_id", user_id)
    .andWhere("id", kehu_id)
    .withGraphFetched("[role, situations, tags]")
    .first();
}

async function unrelateTags(kehu, tags) {
  const oldTags = kehu.tags;
  const tagsToUnrelate = oldTags.filter(
    (tag) =>
      -1 === tags.findIndex((tagFromData) => tag.text === tagFromData.text)
  );
  return await Promise.all(
    tagsToUnrelate.map((tag) =>
      kehu.$relatedQuery("tags").unrelate().where("id", tag.id)
    )
  );
}

async function unrelateSituations(kehu, situations) {
  const oldSituations = kehu.situations;
  const situationsToUnrelate = oldSituations.filter(
    (situation) =>
      -1 ===
      situations.findIndex(
        (situationFromData) => situation.text === situationFromData.text
      )
  );
  return await Promise.all(
    situationsToUnrelate.map((situation) =>
      kehu.$relatedQuery("situations").unrelate().where("id", situation.id)
    )
  );
}

async function createOrRelateTags(kehu, tagsFromData) {
  const oldTags = kehu.tags;
  let tagsToRelate;

  if (!oldTags) {
    tagsToRelate = tagsFromData;
  } else {
    tagsToRelate = tagsFromData.filter(
      (tag) => -1 === oldTags.findIndex((oldTag) => tag.text === oldTag.text)
    );
  }

  return await Promise.all(
    tagsToRelate.map(async (tag) => {
      const existingTag = await findTagWithText(tag.text);
      if (existingTag) {
        return await kehu.$relatedQuery("tags").relate(existingTag.id);
      } else {
        return await kehu.$relatedQuery("tags").insert(tag);
      }
    })
  );
}

async function createOrRelateSituations(kehu, situationsFromData) {
  const oldSituations = kehu.situations;
  let situationsToRelate;

  if (!oldSituations) {
    situationsToRelate = situationsFromData;
  } else {
    situationsToRelate = situationsFromData.filter(
      (situation) =>
        -1 ===
        oldSituations.findIndex(
          (oldSituation) => situation.text === oldSituation.text
        )
    );
  }

  return await Promise.all(
    situationsToRelate.map(async (situation) => {
      const existingSituation = await findSituationWithText(situation.text);
      if (existingSituation) {
        return await kehu
          .$relatedQuery("situations")
          .relate(existingSituation.id);
      } else {
        return await kehu.$relatedQuery("situations").insert(situation);
      }
    })
  );
}

async function createKehu(data, t) {
  const knex = Kehu.knex();
  let trx;

  try {
    trx = await transaction.start(knex);

    const kehu = await Kehu.query().insert(parseKehu(data));
    const tags = parseTags(data);
    const situations = parseSituations(data);
    await createOrRelateTags(kehu, tags);
    await createOrRelateSituations(kehu, situations);
    await trx.commit();
    logger.info(`Created kehu ${kehu.id} for user ${data.owner_id}`);
    return await Kehu.query()
      .context({ t })
      .findById(kehu.id)
      .withGraphFetched("[role, situations, tags]")
      .first();
  } catch (error) {
    logger.error(`Creating Kehu failed. Rolling back..`);
    logger.error(error.message);
    await trx.rollback();
    throw error;
  }
}

async function sendKehu(data, t) {
  const knex = Kehu.knex();
  let trx;

  try {
    trx = await transaction.start(knex);

    let kehuData, user, claim_id;

    // If receiver_email field is null then the kehu is for the whole group
    const receiverIsGroup = data.receiver_email == null;

    if (receiverIsGroup) {
      kehuData = parseKehu(data);
    } else {
      user = await findUserByEmail(data.receiver_email);

      if (user) {
        kehuData = parseKehu({ ...data, owner_id: user.id });
      } else {
        claim_id = uuidv4();
        kehuData = parseKehu({ ...data, claim_id });
      }
    }

    const kehu = await Kehu.query().insert(kehuData);
    const tags = parseTags(data);
    const situations = parseSituations(data);
    await createOrRelateTags(kehu, tags);
    await createOrRelateSituations(kehu, situations);
    await trx.commit();
    logger.info(`User ${data.giver_id} sent kehu ${kehu.id}`);

    // Only send emails if receiver is not a group
    if (!receiverIsGroup) {
      if (user) {
        await sendEmailToKnownUser(user, kehu.id, t);
        logger.info(`Email sent to user ${user.id}`);
      } else {
        await sendEmailToUnkownUser(data, claim_id, kehu.id, t);
        logger.info(`Email sent to unknown user`);
      }
    }

    return await Kehu.query()
      .context({ t })
      .findById(kehu.id)
      .withGraphFetched("[role]")
      .first();
  } catch (error) {
    logger.error(`Sending Kehu failed. Rolling back..`);
    logger.error(error.message);
    await trx.rollback();
    throw error;
  }
}

async function claimKehu(user_id, claim_id) {
  logger.info(`Claiming Kehu with claim_id ${claim_id} for user ${user_id}`);
  const kehu = await Kehu.query()
    .where("claim_id", claim_id)
    .patch({ claim_id: null, owner_id: user_id })
    .returning("*")
    .first();

  if (!kehu) {
    logger.error(`No Kehu with claim_id ${claim_id} found.`);
    throw new Error(`No Kehu with claim_id ${claim_id} found.`);
  }

  return kehu;
}

async function updateKehu(user_id, kehu_id, data, t) {
  const knex = Kehu.knex();
  let trx;

  try {
    trx = await transaction.start(knex);

    const result = await Kehu.query()
      .where("owner_id", user_id)
      .andWhere("id", kehu_id)
      .patch(parseKehu(data));

    if (!result) {
      logger.error(`No kehu with id ${kehu_id} found for user ${user_id}`);
      return await trx.rollback();
    }

    const tagsFromData = parseTags(data);
    const situationsFromData = parseSituations(data);
    const kehu = await Kehu.query()
      .withGraphFetched("[situations, tags]")
      .where("id", kehu_id)
      .first();
    await unrelateTags(kehu, tagsFromData);
    await unrelateSituations(kehu, situationsFromData);
    await createOrRelateTags(kehu, tagsFromData);
    await createOrRelateSituations(kehu, situationsFromData);
    await trx.commit();
    logger.info(`Updated kehu ${kehu_id} for user ${user_id}`);
    return await Kehu.query()
      .context({ t })
      .findById(kehu.id)
      .withGraphFetched("[role, situations, tags]")
      .first();
  } catch (error) {
    logger.error(`Updating Kehu with tags failed. Rolling back..`);
    logger.error(error.message);
    await trx.rollback();
    throw error;
  }
}

async function deleteKehu(user_id, kehu_id) {
  const knex = Kehu.knex();
  let trx;

  try {
    trx = await transaction.start(knex);

    const kehu = await getKehu(user_id, kehu_id);
    await unrelateTags(kehu, kehu.tags);
    await unrelateSituations(kehu, kehu.situations);
    await Kehu.query()
      .where("owner_id", user_id)
      .andWhere("id", kehu_id)
      .delete();
    await trx.commit();
  } catch (error) {
    logger.error(
      `Deleting Kehu ${kehu_id} for user ${user_id} failed. Rolling back..`
    );
    logger.error(error.message);
    await trx.rollback();
    throw error;
  }
}

function parseKehu(data) {
  const {
    claim_id,
    comment,
    date_given,
    giver_id,
    giver_name,
    importance,
    owner_id,
    receiver_name,
    receiver_email,
    role_id,
    text,
    group_id,
    is_public,
  } = data;
  return {
    claim_id,
    comment,
    date_given,
    giver_id,
    giver_name,
    importance,
    owner_id,
    receiver_name,
    receiver_email,
    role_id,
    text,
    group_id,
    is_public,
  };
}

function parseTags(data) {
  return parseArray(data.tags);
}

function parseSituations(data) {
  return parseArray(data.situations);
}

function parseArray(array) {
  return array
    .map((item) => item.trim().toLowerCase())
    .filter((item) => !!item)
    .map((text) => ({ text }));
}

async function excelReport(userId, i18n) {
  // Fetch and format received Kehus
  const kehus = await Kehu.query()
    .select(
      "date_given as " + i18n.t("excel-report.headers.time"),
      "giver_name as " + i18n.t("excel-report.headers.name"),
      "text as " + i18n.t("excel-report.headers.kehu"),
      "comment as " + i18n.t("excel-report.headers.comment"),
      "importance as " + i18n.t("excel-report.headers.stars")
    )
    .where("owner_id", userId)
    .withGraphFetched("[role, situations, tags]")
    .orderBy("date_given", "desc");

  // Join arrays to fit in a single spreadsheet cell
  kehus.forEach((kehu) => {
    if (kehu.role) {
      kehu[i18n.t("excel-report.headers.sender")] = kehu.role.role;
    }
    delete kehu.role;
    if (isArray(kehu.tags)) {
      kehu[i18n.t("excel-report.headers.skills")] = kehu.tags
        .map((t) => t.text)
        .join(", ");
    }
    delete kehu.tags;
    if (isArray(kehu.situations)) {
      kehu[i18n.t("excel-report.headers.situation")] = kehu.situations
        .map((t) => t.text)
        .join(", ");
    }
    delete kehu.situations;
  });

  // Fetch and format sent Kehus
  const sent_kehus = await Kehu.query()
    .select(
      "date_given as " + i18n.t("excel-report.headers.time"),
      "receiver_name as " + i18n.t("excel-report.headers.receiver"),
      "text as " + i18n.t("excel-report.headers.kehu")
    )
    .where(function () {
      this.where("giver_id", userId).andWhere("owner_id", "<>", userId);
    })
    .orWhere(function () {
      this.where("giver_id", userId).andWhere(raw("claim_id IS NOT NULL"));
    })
    .withGraphFetched("[role]")
    .orderBy("date_given", "desc");

  // Join arrays to fit in a single spreadsheet cell
  sent_kehus.forEach((kehu) => {
    if (kehu.role) {
      kehu[i18n.t("excel-report.headers.sender")] = kehu.role.role;
    }
    delete kehu.role;
  });

  // Create new sheets from json, define column orders and widths
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push(i18n.t("excel-report.received-kehus-sheet"));
  wb.Sheets[i18n.t("excel-report.received-kehus-sheet")] =
    XLSX.utils.json_to_sheet(kehus, {
      header: [
        i18n.t("excel-report.headers.time"),
        i18n.t("excel-report.headers.sender"),
        i18n.t("excel-report.headers.name"),
        i18n.t("excel-report.headers.kehu"),
        i18n.t("excel-report.headers.situation"),
        i18n.t("excel-report.headers.skills"),
        i18n.t("excel-report.headers.stars"),
        i18n.t("excel-report.headers.comment"),
      ],
    });
  const receivedColsWidths = [10, 10, 20, 50, 30, 30, 8, 50].map((width) => ({
    width,
  }));
  wb.Sheets[i18n.t("excel-report.received-kehus-sheet")]["!cols"] =
    receivedColsWidths;

  wb.SheetNames.push(i18n.t("excel-report.sent-kehus-sheet"));
  wb.Sheets[i18n.t("excel-report.sent-kehus-sheet")] = XLSX.utils.json_to_sheet(
    sent_kehus,
    {
      header: [
        i18n.t("excel-report.headers.time"),
        i18n.t("excel-report.headers.sender"),
        i18n.t("excel-report.headers.receiver"),
        i18n.t("excel-report.headers.kehu"),
      ],
    }
  );
  const sentColsWidths = [10, 10, 35, 60].map((width) => ({
    width,
  }));
  wb.Sheets[i18n.t("excel-report.sent-kehus-sheet")]["!cols"] = sentColsWidths;

  return XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
    compression: true,
  });
}

// Returns true if o is array
function isArray(o) {
  return Object.prototype.toString.call(o) === "[object Array]";
}

module.exports = {
  excelReport,
  getKehus,
  getKehu,
  getSentKehus,
  createKehu,
  updateKehu,
  deleteKehu,
  sendKehu,
  claimKehu,
};
