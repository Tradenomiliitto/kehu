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

async function createGroup(userId, { name, description, picture, members }) {
  try {
    // TODO: Update picture url
    const group = await Group.query().insert({ name, description, picture });
    logger.info(`Created a new group ${name} (id=${group.id})`);
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
