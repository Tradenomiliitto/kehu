const cloudinary = require("cloudinary").v2;

const Group = require("../models/Group");
const GroupMember = require("../models/GroupMember");

const { findUserByEmail } = require("./UserService");
const logger = require("../logger");

async function getGroups(userId) {
  logger.info(`Fetching groups for user ${userId}`);
  return await Group.query()
    .select("Groups.*", "GroupMembers.is_admin", "GroupMembers.joined_at")
    .join("GroupMembers", "Groups.id", "GroupMembers.group_id")
    .where("GroupMembers.user_id", userId);
}

async function createGroup(
  userId,
  { name, description, picture, members, cloudinaryPublicId }
) {
  try {
    let group = await Group.query().insert({ name, description, picture });
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
      group = await group
        .$query()
        .patch({ picture: res.secure_url })
        .returning("*");
    }

    const groupAdmin = await GroupMember.query().insert({
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

    const { is_admin, joined_at } = groupAdmin;
    return { ...group, is_admin, joined_at };
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
