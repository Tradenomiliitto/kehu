const cloudinary = require("cloudinary").v2;

const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");
const GroupInvitation = require("../models/GroupInvitation");

const { findUserByEmail } = require("./UserService");
const logger = require("../logger");
const { addKehuType, CustomError } = require("../utils/ServerUtils");
const { sendInvitationEmail } = require("./EmailService");

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
      "m.joined_at",
    )
    .withGraphJoined(
      "kehus(selectKehus).[role, situations, tags, giver(selectGiver), owner(selectOwner), group(selectGroup)]",
    )
    .joinRelated("members as m")
    .where("m.user_id", userId)
    .withGraphJoined("members(selectMember).user(selectUser)")
    .withGraphJoined("invitations")
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
  auth0Id,
  { name, description, picture, members, cloudinaryPublicId },
) {
  try {
    const group = await Group.query().insert({ name, description, picture });
    if (!group) throw new Error("Unable to create a new group");
    logger.info(`Created a new group "${name}"" (id=${group.id})`);

    // Update Cloudinary public id if custom picture was used
    if (cloudinaryPublicId) {
      const url = await updateCloudinaryPublicId(
        cloudinaryPublicId,
        group.id,
        auth0Id,
      );
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
    await inviteMembersToGroup(members, group.id);

    return (await getGroups(userId, group.id))[0];
  } catch (error) {
    logger.error(`Creating Group failed.`);
    logger.error(error.message);
    throw error;
  }
}

async function updateGroup(
  userId,
  auth0Id,
  groupId,
  { name, description, picture, cloudinaryPublicId },
) {
  logger.info(
    `Updating group name, description and picture for a group ${groupId}`,
  );

  try {
    // Check that user is admin of the group
    const isAdmin = await isUserGroupAdmin(userId, groupId);
    if (!isAdmin) {
      throw new Error("User is not a group admin");
    }

    // Update Cloudinary public id if custom picture was used
    if (cloudinaryPublicId) {
      picture = await updateCloudinaryPublicId(
        cloudinaryPublicId,
        groupId,
        auth0Id,
      );
    }

    await Group.query().findById(groupId).patch({ name, description, picture });
    return (await getGroups(userId, groupId))[0];
  } catch (error) {
    logger.error(`Updating a group failed`);
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

    // If removing admin rights the group must have at least one other admin
    if (isAdmin === false) {
      const remainingAdmings = await GroupMember.query()
        .where({ group_id: groupId, is_admin: true })
        .whereNot({ user_id: memberId });

      if (remainingAdmings.length < 1)
        throw new CustomError(
          "Cannot remove the group's last admin",
          "LAST_ADMIN_ERROR",
        );
    }

    await GroupMember.query()
      .where({ user_id: memberId, group_id: groupId })
      .patch({ is_admin: isAdmin });

    return (await getGroups(userId, groupId))[0];
  } catch (error) {
    logger.error(`Assigning user's admin role failed`);
    throw error;
  }
}

async function deleteMember(userId, memberId, groupId) {
  logger.info(`Removing a user from a group ${groupId}`);

  try {
    // Check that user making the request is admin of the group
    // or they are trying to remove themselves
    if (userId !== memberId && !(await isUserGroupAdmin(userId, groupId))) {
      throw new Error("User is not a group admin");
    }

    // Group must have at least one admin member after deletion
    const remainingAdmings = await GroupMember.query()
      .where({ group_id: groupId, is_admin: true })
      .whereNot({ user_id: memberId });

    // Allow group deletion if the last admin is removing themselves
    if (
      remainingAdmings.length < 1 &&
      (await GroupMember.query().where({ group_id: groupId })).length > 1
    )
      throw new CustomError(
        "Cannot remove the group's last admin",
        "LAST_ADMIN_ERROR",
      );

    await GroupMember.query()
      .delete()
      .where({ user_id: memberId, group_id: groupId });

    const groups = await getGroups(userId, groupId);

    // If no groups are returned the user making the request was removed from
    // the group -> return null instead of the group
    if (groups.length === 0) return null;
    return groups[0];
  } catch (error) {
    logger.error(`Removing user from a group failed`);
    throw error;
  }
}

// `members` is an array of email addresses
async function inviteGroupMembers(userId, groupId, members) {
  logger.info(`Adding members to a group ${groupId}`);

  try {
    // Check that user making the request is admin of the group
    const isRequesterAdmin = await isUserGroupAdmin(userId, groupId);
    if (!isRequesterAdmin) {
      throw new Error("User is not a group admin");
    }

    await inviteMembersToGroup(members, groupId);
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
async function inviteMembersToGroup(members, groupId) {
  // Verify that group exists
  const group = await Group.query().findById(groupId);
  if (!group) {
    throw new Error("Group does not exist");
  }

  return Promise.all(
    members.map(async (email) => {
      const user = await findUserByEmail(email);
      if (user) {
        // Check if user is already member of the group before adding
        const existingMember = await GroupMember.query().where({
          user_id: user.id,
          group_id: groupId,
        });
        if (existingMember.length > 0) {
          logger.info(
            `User ${email} is already member of the group, not inviting again`,
          );
          return;
        }
      }
      logger.info(`Inviting user ${email} to the group`);
      await GroupInvitation.query().insert({
        user_id: user?.id,
        email: email,
        group_id: groupId,
      });

      await sendInvitationEmail({
        email,
        firstName: user?.first_name,
        groupName: group.name,
        type: user ? "KNOWN_USER" : "UNKNOWN_USER",
      });
    }),
  );
}

// Update Cloudinary public id from temporary to one generated from
// the group id and return the new public url
async function updateCloudinaryPublicId(cloudinaryPublicId, groupId, userId) {
  // Public id also contains the path of the file, only update the name
  const imagePath = cloudinaryPublicId.split("/");
  const oldPublicId = imagePath.pop(); // Remove old name from the path

  // User can only change the publicId of their own picture
  if (oldPublicId !== "new_group_picture_" + userId) {
    logger.warn(
      `Unauthorized Cloudinary public id rename, user ${userId} tried to change ${oldPublicId}`,
    );
    throw new Error("Unauthorized Cloudinary public id rename");
  }

  const newPublicId = [...imagePath, `group_${groupId}`].join("/");

  logger.debug(
    `Updating Cloudinary public id (${cloudinaryPublicId} -> ${newPublicId})`,
  );
  const res = await cloudinary.uploader.rename(
    cloudinaryPublicId,
    newPublicId,
    { overwrite: true },
  );
  return res.secure_url;
}

module.exports = {
  getGroups,
  createGroup,
  updateGroup,
  changeMemberAdminRole,
  deleteMember,
  inviteGroupMembers,
  isUserGroupAdmin,
};
