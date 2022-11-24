const cloudinary = require("cloudinary").v2;

const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");

const { findUserByEmail } = require("./UserService");
const logger = require("../logger");

/**
 * Get user's groups from database.
 *
 * @param {number} userId - User whose group(s) are returned
 * @param {number} [groupId] - Which group is returned. If not defined or null all user's groups are returned
 * @returns User's group(s)
 */
async function getGroups(userId, groupId = null) {
  logger.info(`Fetching groups for user ${userId}`);

  const groups = Group.query()
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
      "kehus(selectKehus).[role, situations, tags, giver(selectGiver)]"
    )
    .joinRelated("members as m")
    .where("m.user_id", userId)
    .withGraphJoined("members(selectMember).user(selectUser)")
    .modifiers({
      selectGiver(builder) {
        builder.select("picture");
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
  if (groupId != null) groups.andWhere("g.id", groupId);

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
      // Public id also contains the path of the file, only update the name
      const imagePath = cloudinaryPublicId.split("/");
      imagePath.pop(); // Remove old name from the path
      const newPublicId = [...imagePath, `group_${group.id}`].join("/");

      logger.debug(
        `Updating Cloudinary public id (${cloudinaryPublicId} -> ${newPublicId})`
      );
      const res = await cloudinary.uploader.rename(
        cloudinaryPublicId,
        newPublicId
      );
      // Update picture url in database
      await group.$query().patch({ picture: res.secure_url });
    }

    await GroupMember.query().insert({
      user_id: userId,
      group_id: group.id,
      is_admin: true,
      joined_at: new Date().toISOString(),
    });

    // Assign group members
    await Promise.all(
      members.map(async (member) => {
        const user = await findUserByEmail(member);
        if (user) {
          logger.info(`Adding user ${member} to group`);
          await GroupMember.query().insert({
            user_id: user.id,
            group_id: group.id,
            is_admin: false,
            joined_at: new Date().toISOString(),
          });
        } else {
          logger.info(`User ${member} not signed up, sending invitation email`);
          // TODO: send invites to members who haven't signed up yet
        }
      })
    );

    return (await getGroups(userId, group.id))[0];
  } catch (error) {
    logger.error(`Creating Group failed.`);
    logger.error(error.message);
    throw error;
  }
}

module.exports = {
  getGroups,
  createGroup,
};
