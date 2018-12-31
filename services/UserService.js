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

async function findUserByEmail(email) {
  try {
    logger.info("Finding user with email", email);
    return await User.query()
      .where("email", email)
      .first();
  } catch (error) {
    logger.error(error.message);
  }
}

function isAuth0RegisteredUser(user) {
  const prefix = user.user_id.split("|")[0];
  return prefix === "auth0";
}

function parseUser(user) {
  return {
    first_name: isAuth0RegisteredUser(user)
      ? user.user_metadata.first_name
      : user.given_name,
    last_name: isAuth0RegisteredUser(user)
      ? user.user_metadata.last_name
      : user.family_name,
    auth0_id: user.user_id,
    email: user.email || "",
    picture: user.picture_large ? user.picture_large : user.picture
  };
}

async function createUserFromAuth0(user) {
  try {
    const auth0User = await Auth0.getUser({ id: user.id });
    logger.info("Creating new user");
    return await User.query().insert(parseUser(auth0User));
  } catch (error) {
    logger.error(error.stack);
  }
}

module.exports = {
  findUserByAuth0Id,
  findUserByEmail,
  createUserFromAuth0
};
