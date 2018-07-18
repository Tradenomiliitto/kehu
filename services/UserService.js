const User = require("../models/User");
const logger = require("../logger");
const Auth0 = require("../utils/Auth0Client");

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

async function createUserFromAuth0(user) {
  try {
    const auth0User = await Auth0.getUser({ id: user.id });
    logger.info("Creating new user");
    return await User.query().insert({
      first_name: auth0User.user_metadata.first_name,
      last_name: auth0User.user_metadata.last_name,
      auth0_id: user.id,
      email: auth0User.email,
      picture: auth0User.picture
    });
  } catch (error) {
    logger.error(error.stack);
  }
}

module.exports = {
  findUserByAuth0Id,
  createUserFromAuth0
};
