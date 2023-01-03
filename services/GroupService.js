const cloudinary = require("cloudinary").v2;

const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");

const { findUserByEmail } = require("./UserService");
const logger = require("../logger");
const { addKehuType } = require("../utils/ServerUtils");

/**
 * Get user's groups from database.
 *
 * @param {number} userId - User whose group(s) are returned
 * @param {number} [groupId] - Which group is returned. If not defined or null all user's groups are returned
 * @returns User's group(s)
 */
async function getGroups(userId, groupId = null) {
  logger.info(`Fetching groups for user ${userId}`);

  const groupQuery = Group.query()
    .alias("g")
    .select(
      "g.id",
      "g.name",
      "g.description",
      "g.picture",
      "m.is_admin",
      "m.joined_at"
    )
    .withGraphJoined(
      "kehus(selectKehus).[role, situations, tags, giver(selectGiver), owner(selectOwner), group(selectGroup)]"
    )
    .joinRelated("members as m")
    .where("m.user_id", userId)
    .withGraphJoined("members(selectMember).user(selectUser)")
    .modifiers({
      selectGiver(builder) {
        builder.select("picture");
      },
      selectOwner(builder) {
        builder.select("first_name", "last_name", "picture");
      },
      selectGroup(builder) {
        builder.select("name");
      },
      selectKehus(builder) {
        builder
          .where("is_public", true)
          .orWhere("owner_id", userId)
          .orWhere("giver_id", userId)
          // For some reason the order given here is reversed in the final
          // result, probably related to how Objection.js parses the raw data
          .orderBy("date_given", "asc");
      },
      selectMember(builder) {
        builder.select("is_admin");
      },
      selectUser(builder) {
        builder.select("id", "first_name", "last_name", "email", "picture");
      },
    });

  // If groupId is specified return only that group
  if (groupId != null) groupQuery.andWhere("g.id", groupId);

  const groups = await groupQuery;

  // Add Kehu types
  groups.forEach((group) => addKehuType(group.kehus, userId));

  return groups;
}

async function createGroup(
  userId,
  { name, description, picture, members, cloudinaryPublicId }
) {
  try {
    const group = await Group.query().insert({ name, description, picture });
    if (!group) throw new Error("Unable to create a new group");
    logger.info(`Created a new group "${name}"" (id=${group.id})`);

    // Update Cloudinary public id if custom picture was used
    if (cloudinaryPublicId) {
      const url = await updateCloudinaryPublicId(cloudinaryPublicId, group.id);
      // Update picture url in database. Must be done here since group id which
      // is used in the url is not known when the group is being created
      await group.$query().patch({ picture: url });
    }

    await GroupMember.query().insert({
      user_id: userId,
      group_id: group.id,
      is_admin: true,
      joined_at: new Date().toISOString(),
    });

    // Assign group members
    await addMembersToGroup(members, group.id);

    return (await getGroups(userId, group.id))[0];
  } catch (error) {
    logger.error(`Creating Group failed.`);
    logger.error(error.message);
    throw error;
  }
}

async function updateGroup(
  userId,
  groupId,
  { name, description, picture, cloudinaryPublicId }
) {
  logger.info(
    `Updating group name, description and picture for a group ${groupId}`
  );

  try {
    // Check that user is admin of the group
    const isAdmin = await isUserGroupAdmin(userId, groupId);
    if (!isAdmin) {
      throw new Error("User is not a group admin");
    }

    // Update Cloudinary public id if custom picture was used
    if (cloudinaryPublicId) {
      picture = await updateCloudinaryPublicId(cloudinaryPublicId, groupId);
    }

    await Group.query().findById(groupId).patch({ name, description, picture });
    return (await getGroups(userId, groupId))[0];
  } catch (error) {
    logger.error(`Updating a group failed`);
    logger.error(error.message);
    throw error;
  }
}

async function changeMemberAdminRole(userId, memberId, groupId, isAdmin) {
  logger.info(`Changing user's admin status in a group ${groupId}`);

  try {
    // Check that user making the request is admin of the group
    const isRequesterAdmin = await isUserGroupAdmin(userId, groupId);
    if (!isRequesterAdmin) {
      throw new Error("User is not a group admin");
    }

    await GroupMember.query()
      .where({ user_id: memberId, group_id: groupId })
      .patch({ is_admin: isAdmin });

    return (await getGroups(userId, groupId))[0];
  } catch (error) {
    logger.error(`Assigning user's admin role failed`);
    logger.error(error.message);
    throw error;
  }
}

async function deleteMember(userId, memberId, groupId) {
  logger.info(`Removing a member from a group ${groupId}`);

  try {
    // Check that user making the request is admin of the group
    const isRequesterAdmin = await isUserGroupAdmin(userId, groupId);
    if (!isRequesterAdmin) {
      throw new Error("User is not a group admin");
    }

    await GroupMember.query()
      .delete()
      .where({ user_id: memberId, group_id: groupId });

    return (await getGroups(userId, groupId))[0];
  } catch (error) {
    logger.error(`Removing user from a group failed`);
    logger.error(error.message);
    throw error;
  }
}

// `members` is an array of email addresses
async function addGroupMembers(userId, groupId, members) {
  logger.info(`Adding members to a group ${groupId}`);

  try {
    // Check that user making the request is admin of the group
    const isRequesterAdmin = await isUserGroupAdmin(userId, groupId);
    if (!isRequesterAdmin) {
      throw new Error("User is not a group admin");
    }

    await addMembersToGroup(members, groupId);
    return (await getGroups(userId, groupId))[0];
  } catch (error) {
    logger.error(`Adding members to a group failed`);
    logger.error(error.message);
    throw error;
  }
}

async function isUserGroupAdmin(user_id, group_id) {
  const member = await GroupMember.query().findOne({ user_id, group_id });
  return member?.is_admin === true;
}

// `members` is an array of email addresses
async function addMembersToGroup(members, groupId) {
  return Promise.all(
    members.map(async (member) => {
      const user = await findUserByEmail(member);
      if (user) {
        logger.info(`Adding user ${member} to group`);
        await GroupMember.query().insert({
          user_id: user.id,
          group_id: groupId,
          is_admin: false,
          joined_at: new Date().toISOString(),
        });
      } else {
        logger.info(`User ${member} not signed up, sending invitation email`);
        // TODO: send invites to members who haven't signed up yet
      }
    })
  );
}

// Update Cloudinary public id from randomly generated to one generated from
// the group id and return the new public url
async function updateCloudinaryPublicId(cloudinaryPublicId, groupId) {
  // Public id also contains the path of the file, only update the name
  const imagePath = cloudinaryPublicId.split("/");
  imagePath.pop(); // Remove old name from the path
  const newPublicId = [...imagePath, `group_${groupId}`].join("/");

  logger.debug(
    `Updating Cloudinary public id (${cloudinaryPublicId} -> ${newPublicId})`
  );
  const res = await cloudinary.uploader.rename(cloudinaryPublicId, newPublicId);
  return res.secure_url;
}

module.exports = {
  getGroups,
  createGroup,
  updateGroup,
  changeMemberAdminRole,
  deleteMember,
  addGroupMembers,
  isUserGroupAdmin,
};
