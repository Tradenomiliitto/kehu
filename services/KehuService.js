const { transaction } = require("objection");
const uuidv4 = require("uuid/v4");
const XLSX = require("xlsx");
const Kehu = require("../models/Kehu");
const { findTagWithText } = require("./TagService");
const { findSituationWithText } = require("./SituationService");
const { findUserByEmail } = require("./UserService");
const {
  sendEmailToUnkownUser,
  sendEmailToKnownUser
} = require("./EmailService");
const { raw } = require("objection");
const logger = require("../logger");

async function getKehus(user_id) {
  logger.info(`Fetching kehus for user ${user_id}`);
  return await Kehu.query()
    .where("owner_id", user_id)
    .eager("[role, situations, tags]")
    .orderBy("date_given", "desc");
}

async function getSentKehus(user_id) {
  logger.info(`Fetching given Kehus for user ${user_id}`);
  return await Kehu.query()
    .select(
      "id",
      "date_given",
      "giver_name",
      "role_id",
      "receiver_name",
      "text"
    )
    .where(function() {
      this.where("giver_id", user_id).andWhere("owner_id", "<>", user_id);
    })
    .orWhere(function() {
      this.where("giver_id", user_id).andWhere(raw("claim_id IS NOT NULL"));
    })
    .orderBy("date_given", "desc");
}

async function getKehu(user_id, kehu_id) {
  logger.info(`Fetching kehu ${kehu_id} for user ${user_id}`);
  return await Kehu.query()
    .where("owner_id", user_id)
    .andWhere("id", kehu_id)
    .eager("[role, situations, tags]")
    .first();
}

async function unrelateTags(kehu, tags) {
  const oldTags = kehu.tags;
  const tagsToUnrelate = oldTags.filter(
    tag => -1 === tags.findIndex(tagFromData => tag.text === tagFromData.text)
  );
  return await Promise.all(
    tagsToUnrelate.map(tag =>
      kehu
        .$relatedQuery("tags")
        .unrelate()
        .where("id", tag.id)
    )
  );
}

async function unrelateSituations(kehu, situations) {
  const oldSituations = kehu.situations;
  const situationsToUnrelate = oldSituations.filter(
    situation =>
      -1 ===
      situations.findIndex(
        situationFromData => situation.text === situationFromData.text
      )
  );
  return await Promise.all(
    situationsToUnrelate.map(situation =>
      kehu
        .$relatedQuery("situations")
        .unrelate()
        .where("id", situation.id)
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
      tag => -1 === oldTags.findIndex(oldTag => tag.text === oldTag.text)
    );
  }

  return await Promise.all(
    tagsToRelate.map(async tag => {
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
      situation =>
        -1 ===
        oldSituations.findIndex(
          oldSituation => situation.text === oldSituation.text
        )
    );
  }

  return await Promise.all(
    situationsToRelate.map(async situation => {
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

async function createKehu(data) {
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
      .findById(kehu.id)
      .eager("[role, situations, tags]")
      .first();
  } catch (error) {
    logger.error(`Creating Kehu failed. Rolling back..`);
    logger.error(error.message);
    await trx.rollback();
    throw error;
  }
}

async function sendKehu(data) {
  const knex = Kehu.knex();
  let trx;

  try {
    trx = await transaction.start(knex);

    const user = await findUserByEmail(data.receiver_email);
    let kehuData;
    let claim_id;

    if (user) {
      kehuData = parseKehu({ ...data, owner_id: user.id });
    } else {
      claim_id = uuidv4();
      kehuData = parseKehu({ ...data, claim_id });
    }

    const kehu = await Kehu.query().insert(kehuData);
    const tags = parseTags(data);
    const situations = parseSituations(data);
    await createOrRelateTags(kehu, tags);
    await createOrRelateSituations(kehu, situations);
    await trx.commit();
    logger.info(`User ${data.giver_id} sent kehu ${kehu.id}`);

    if (user) {
      await sendEmailToKnownUser(user, kehu.id);
      logger.info(`Email sent to user ${user.id}`);
    } else {
      await sendEmailToUnkownUser(data, claim_id, kehu.id);
      logger.info(`Email sent to unknown user`);
    }

    return await Kehu.query()
      .findById(kehu.id)
      .eager("[role]")
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

async function updateKehu(user_id, kehu_id, data) {
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
      .eager("[situations, tags]")
      .where("id", kehu_id)
      .first();
    await unrelateTags(kehu, tagsFromData);
    await unrelateSituations(kehu, situationsFromData);
    await createOrRelateTags(kehu, tagsFromData);
    await createOrRelateSituations(kehu, situationsFromData);
    await trx.commit();
    logger.info(`Updated kehu ${kehu_id} for user ${user_id}`);
    return await Kehu.query()
      .findById(kehu.id)
      .eager("[role, situations, tags]")
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
    text
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
    text
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
    .map(item => item.trim().toLowerCase())
    .filter(item => !!item)
    .map(text => ({ text }));
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
    .eager("[role, situations, tags]")
    .orderBy("date_given", "desc");

  // Join arrays to fit in a single spreadsheet cell
  kehus.forEach(kehu => {
    if (kehu.role) {
      kehu.Kehuja = kehu.role.role;
    }
    delete kehu.role;
    if (isArray(kehu.tags)) {
      kehu.Taidot = kehu.tags.map(t => t.text).join(", ");
    }
    delete kehu.tags;
    if (isArray(kehu.situations)) {
      kehu.Tilanne = kehu.situations.map(t => t.text).join(", ");
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
    .where(function() {
      this.where("giver_id", userId).andWhere("owner_id", "<>", userId);
    })
    .orWhere(function() {
      this.where("giver_id", userId).andWhere(raw("claim_id IS NOT NULL"));
    })
    .eager("[role]")
    .orderBy("date_given", "desc");

  // Join arrays to fit in a single spreadsheet cell
  sent_kehus.forEach(kehu => {
    if (kehu.role) {
      kehu.Kehuja = kehu.role.role;
    }
    delete kehu.role;
  });

  // Create new sheets from json, define column orders and widths
  const wb = XLSX.utils.book_new();
  wb.SheetNames.push(i18n.t("excel-report.received-kehus-sheet"));
  wb.Sheets[
    i18n.t("excel-report.received-kehus-sheet")
  ] = XLSX.utils.json_to_sheet(kehus, {
    header: [
      i18n.t("excel-report.headers.time"),
      i18n.t("excel-report.headers.sender"),
      i18n.t("excel-report.headers.name"),
      i18n.t("excel-report.headers.kehu"),
      i18n.t("excel-report.headers.situation"),
      i18n.t("excel-report.headers.skills"),
      i18n.t("excel-report.headers.stars"),
      i18n.t("excel-report.headers.comment")
    ]
  });
  const receivedColsWidths = [10, 10, 20, 50, 30, 30, 8, 50].map(width => ({
    width
  }));
  wb.Sheets[i18n.t("excel-report.received-kehus-sheet")][
    "!cols"
  ] = receivedColsWidths;

  wb.SheetNames.push(i18n.t("excel-report.sent-kehus-sheet"));
  wb.Sheets[i18n.t("excel-report.sent-kehus-sheet")] = XLSX.utils.json_to_sheet(
    sent_kehus,
    {
      header: [
        i18n.t("excel-report.headers.time"),
        i18n.t("excel-report.headers.sender"),
        i18n.t("excel-report.headers.receiver"),
        i18n.t("excel-report.headers.kehu")
      ]
    }
  );
  const sentColsWidths = [10, 10, 35, 60].map(width => ({
    width
  }));
  wb.Sheets[i18n.t("excel-report.sent-kehus-sheet")]["!cols"] = sentColsWidths;

  return XLSX.write(wb, {
    type: "buffer",
    bookType: "xlsx",
    compression: true
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
  claimKehu
};
