const Kehu = require("../models/Kehu");
const User = require("../models/User");
const logger = require("../logger");
const Auth0 = require("../utils/Auth0Client");
const { raw } = require("objection");
const GroupInvitation = require("../models/GroupInvitation");

function canAuth0EmailBeUpdated(user) {
  const prefix = user.auth0_id.split("|")[0];
  return prefix === "auth0";
}

async function updateProfilePicture(user_id, picture) {
  logger.info(`Updating profile picture for ${user_id}.`);
  try {
    return await User.query().patchAndFetchById(user_id, { picture });
  } catch (e) {
    console.error(e.message);
    throw e;
  }
}

async function updateAuth0Id(id, newAuth0Id) {
  logger.info(`Updating Auth0 ID for user ${id}.`);
  try {
    return await User.query().patchAndFetchById(id, { auth0_id: newAuth0Id });
  } catch (e) {
    console.error(e.message);
    throw e;
  }
}

async function updateProfile(user_id, data) {
  logger.info(`Updating user ${user_id}.`);
  const user = await User.query().where("id", user_id).first();
  try {
    if (canAuth0EmailBeUpdated(user)) {
      await Auth0.updateUser(
        { id: user.auth0_id },
        {
          email: data.email,
          client_id: process.env.AUTH0_CLIENT_ID,
          connection: "Username-Password-Authentication",
          user_metadata: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      );
      await Auth0.sendEmailVerification({ user_id: user.auth0_id });
    } else {
      await Auth0.updateUser(
        { id: user.auth0_id },
        {
          user_metadata: {
            first_name: data.first_name,
            last_name: data.last_name,
          },
        },
      );
    }
    return await User.query().patchAndFetchById(user_id, data);
  } catch (e) {
    logger.error(`Error occurred when updating user ${user_id}: ${e.message}`);
    throw e;
  }
}

async function findUserByAuth0Id(auth0_id) {
  try {
    logger.debug("Finding user with auth0_id", auth0_id);
    return await User.query().where("auth0_id", auth0_id).first();
  } catch (error) {
    logger.error(error.message);
  }
}

async function findUserByEmail(email) {
  try {
    logger.info("Finding user with email", email);
    let user = await User.query().where("email", email).first();
    if (user) {
      return user;
    }
    const kehu = await Kehu.query()
      .select("owner_id")
      .where("receiver_email", email)
      .andWhere(raw("owner_id IS NOT NULL"))
      .first();
    if (kehu && kehu.owner_id) {
      return await User.query().where("id", kehu.owner_id).first();
    }
  } catch (error) {
    logger.error(error.message);
  }
}

async function getContacts(user_id) {
  return await Kehu.query()
    .select("receiver_name as name", "receiver_email as email")
    .where(function () {
      this.where("giver_id", user_id).andWhere("owner_id", "<>", user_id);
    })
    .orWhere(function () {
      this.where("giver_id", user_id).andWhere(raw("claim_id IS NOT NULL"));
    })
    .groupBy("name", "email");
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
    picture: user.picture_large ? user.picture_large : user.picture,
  };
}

async function createUserFromAuth0(user) {
  try {
    const auth0User = await Auth0.getUser({ id: user.id });
    logger.info("Creating new user");
    const createdUser = await User.query().insert(parseUser(auth0User));
    // Check for any pending invitations for the user and update user_id if so
    await fillInvitationUserIdFromEmail(createdUser.id, createdUser.email);
    return createdUser;
  } catch (error) {
    logger.error(error.stack);
  }
}

async function deleteKehusForUser(user_id) {
  logger.info(`Deleting information from sent kehus...`);
  const patch = Kehu.fromJson({ giver_id: null }, { skipValidation: true });
  await Kehu.query()
    .patch(patch)
    .where(function () {
      this.where("giver_id", user_id).andWhere("owner_id", "<>", user_id);
    })
    .orWhere(function () {
      this.where("giver_id", user_id).andWhere(raw("claim_id IS NOT NULL"));
    });
  logger.info(`Deleting all user's kehus...`);
  return await Kehu.query().delete().where("owner_id", user_id);
}

async function deleteProfile(user_id) {
  logger.info(`Deleting user: ${user_id}`);
  await deleteKehusForUser(user_id);
  const user = await User.query().where("id", user_id).first();
  logger.info(`Deleting Auth0 data...`);
  await Auth0.deleteUser({ id: user.auth0_id });
  logger.info(`Deleting user data...`);
  await User.query().delete().where("id", user_id);
  logger.info(`User ${user_id} deleted.`);
}

async function fillInvitationUserIdFromEmail(userId, email) {
  if (!userId || !email) return;

  const updatedInvitations = await GroupInvitation.query()
    .patch({ user_id: userId })
    .whereNull("user_id")
    .andWhere("email", email);

  logger.info(`Assigned ${updatedInvitations} invitations for user ${userId}`);
}

module.exports = {
  deleteProfile,
  findUserByAuth0Id,
  findUserByEmail,
  createUserFromAuth0,
  getContacts,
  parseUser,
  updateProfile,
  updateProfilePicture,
  updateAuth0Id,
};
