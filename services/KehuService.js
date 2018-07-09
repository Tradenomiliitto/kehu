const Kehu = require("../models/Kehu");
const moment = require("moment");

async function getKehus(user_id) {
  return await Kehu.query()
    .where("owner_id", user_id)
    .eager("tags")
    .orderBy("date_given", "desc");
}

async function getKehu(user_id, kehu_id) {
  return await Kehu.query()
    .where("owner_id", user_id)
    .andWhere("id", kehu_id)
    .eager("tags")
    .first();
}

async function createKehu(data) {
  const kehu = await Kehu.query().insert(parseKehu(data));
  const tags = parseTags(data);
  await Promise.all(
    tags.map(tag => kehu.$relatedQuery("tags").insert({ text: tag }))
  );
  return await Kehu.query()
    .findById(kehu.id)
    .eager("tags")
    .first();
}

async function updateKehu(user_id, kehu_id, data) {
  return await Kehu.query()
    .where("owner_id", user_id)
    .andWhere("id", kehu_id)
    .patch(parseKehu(data));
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
  return data.tags.split(",");
}

module.exports = {
  getKehus,
  getKehu,
  createKehu,
  updateKehu
};
