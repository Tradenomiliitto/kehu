const User = require("../models/User");
const logger = require("../logger");

async function findUserByAuth0Id(auth0_id) {
  try {
    logger.info("Finding user with auth0_id", auth0_id);
    return await User.query()
      .where("auth0_id", auth0_id)
      .first();
  } catch (error) {
    logger.error(error.message);
  }
}

async function createUser(user) {
  try {
    logger.info("Creating new user");
    return await User.query().insert({
      first_name: user.name.givenName,
      last_name: user.name.familyName,
      auth0_id: user.id
    });
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = {
  findUserByAuth0Id,
  createUser
};
