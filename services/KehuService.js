const moment = require("moment");
const { transaction } = require("objection");
const Kehu = require("../models/Kehu");
const { findTagWithText } = require("./TagService");
const logger = require("../logger");

async function getKehus(user_id) {
  logger.info(`Fetching kehus for user ${user_id}`);
  return await Kehu.query()
    .where("owner_id", user_id)
    .eager("tags")
    .orderBy("date_given", "desc");
}

async function getKehu(user_id, kehu_id) {
  logger.info(`Fetching kehu ${kehu_id} for user ${user_id}`);
  return await Kehu.query()
    .where("owner_id", user_id)
    .andWhere("id", kehu_id)
    .eager("tags")
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

async function createKehu(data) {
  const knex = Kehu.knex();
  let trx;

  try {
    trx = await transaction.start(knex);

    const kehu = await Kehu.query().insert(parseKehu(data));
    const tags = parseTags(data);
    await createOrRelateTags(kehu, tags);
    await trx.commit();
    logger.info(`Created kehu ${kehu.id} for user ${data.owner_id}`);
    return await Kehu.query()
      .findById(kehu.id)
      .eager("tags")
      .first();
  } catch (error) {
    logger.error(`Creating Kehu failed. Rolling back..`);
    logger.error(error.message);
    return await trx.rollback();
  }
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
    const kehu = await Kehu.query()
      .eager("tags")
      .where("id", kehu_id)
      .first();
    await unrelateTags(kehu, tagsFromData);
    await createOrRelateTags(kehu, tagsFromData);
    logger.info(`Created kehu ${kehu_id} for user ${user_id}`);
    await trx.commit();
  } catch (error) {
    logger.error(`Updating Kehu with tags failed. Rolling back..`);
    logger.error(error.message);
    return await trx.rollback();
  }
}

async function deleteKehu(user_id, kehu_id) {
  const knex = Kehu.knex();
  let trx;

  try {
    trx = await transaction.start(knex);

    const kehu = await getKehu(user_id, kehu_id);
    await unrelateTags(kehu, kehu.tags);
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
    return await trx.rollback();
  }
}

function parseKehu(data) {
  const {
    date_given,
    giver_id,
    giver_name,
    location,
    owner_id,
    text,
    title
  } = data;
  return {
    date_given: moment(date_given, "D.M.YYYY").format(),
    giver_id,
    giver_name,
    location,
    owner_id,
    text,
    title
  };
}

function parseTags(data) {
  return data.tags
    .split(",")
    .map(tag => tag.trim().toLowerCase())
    .map(text => ({ text }));
}

module.exports = {
  getKehus,
  getKehu,
  createKehu,
  updateKehu,
  deleteKehu
};
