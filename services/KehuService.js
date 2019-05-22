const { transaction } = require("objection");
const uuidv4 = require("uuid/v4");
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

async function deleteKehusForUser(user_id) {
  await Kehu.query()
    .delete()
    .where("owner_id", user_id);
  // TODO: Remove user data from sent kehus?
}

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
    .select("date_given", "giver_name", "role_id", "receiver_name", "text")
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

module.exports = {
  deleteKehusForUser,
  getKehus,
  getKehu,
  getSentKehus,
  createKehu,
  updateKehu,
  deleteKehu,
  sendKehu,
  claimKehu
};
