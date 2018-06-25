const Kehu = require("../models/Kehu");
const logger = require("../logger");

async function getKehus(user_id) {
  try {
    return await Kehu.query().where("owner_id", user_id);
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  getKehus
};
