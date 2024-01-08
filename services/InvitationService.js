const GroupMember = require("../models/GroupMember");
const GroupInvitation = require("../models/GroupInvitation");
const logger = require("../logger");
const { CustomError } = require("../utils/ServerUtils");
const { isUserGroupAdmin, getGroups } = require("./GroupService");

async function processGroupInvitation({ userId, invitationId, groupId, type }) {
  if (type !== "accept" && type !== "del")
    throw new Error(`Invalid type ("${type}") in processGroupInvitation`);

  const action = type === "accept" ? "Accepting" : "Removing";
  logger.info(`${action} group invitation ${invitationId} for user ${userId}`);

  try {
    const invitation = await GroupInvitation.query().findById(invitationId);
    if (!invitation) {
      throw new CustomError("Invitation not found", "NOT_FOUND");
    }

    const isAuthorized =
      // User can always accept and remove their own invitations
      invitation.user_id === userId ||
      // Admin can remove any invitation
      (type === "del" && (await isUserGroupAdmin(userId, groupId)));

    if (isAuthorized === false) {
      throw new CustomError(
        "User is not the invited user or group admin",
        "UNAUTHORIZED",
      );
    }

    if (invitation.group_id !== groupId) {
      throw new CustomError(
        "Invitation is not for the specified group",
        "BAD_REQUEST",
      );
    }

    if (type === "accept")
      await GroupMember.query().insert({
        user_id: userId,
        group_id: groupId,
        is_admin: false,
        joined_at: new Date().toISOString(),
      });

    await GroupInvitation.query().deleteById(invitationId);

    return (await getGroups(userId, groupId))[0];
  } catch (error) {
    logger.error(`${action} group invitation failed`);
    throw error;
  }
}

module.exports = {
  processGroupInvitation,
};
