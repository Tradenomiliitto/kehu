const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const {
  createGroupSchema,
  updateGroupSchema,
  updateGroupMemberSchema,
  inviteGroupMembersSchema,
} = require("../../utils/ValidationSchemas");
const {
  getGroups,
  createGroup,
  updateGroup,
  changeMemberAdminRole,
  deleteMember,
  inviteGroupMembers,
} = require("../../services/GroupService");
const { processGroupInvitation } = require("../../services/InvitationService");
const logger = require("../../logger");
const { strToInt } = require("../../utils/ServerUtils");

router.get("/", async (req, res) => {
  try {
    const groups = await getGroups(req.user.id);
    res.json(groups);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/", checkSchema(createGroupSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
      return res.status(422).json({ errors: validations.array() });
    }

    const group = await createGroup(req.user.id, req.user.auth0_id, req.body);
    return res.json(group);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:groupId", checkSchema(updateGroupSchema), async (req, res) => {
  try {
    const validations = validationResult(req);
    if (!validations.isEmpty()) {
      return res.status(422).json({ errors: validations.array() });
    }
    const groupId = strToInt(req.params.groupId);

    const group = await updateGroup(
      req.user.id,
      req.user.auth0_id,
      groupId,
      req.body,
    );
    return res.json(group);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Member is not added directly but through an invitation
router.post(
  "/:groupId/members",
  checkSchema(inviteGroupMembersSchema),
  async (req, res) => {
    try {
      const validations = validationResult(req);
      if (!validations.isEmpty()) {
        return res.status(422).json({ errors: validations.array() });
      }
      const groupId = strToInt(req.params.groupId);

      const group = await inviteGroupMembers(
        req.user.id,
        groupId,
        req.body.members,
      );
      return res.json(group);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: err.message });
    }
  },
);

router.put(
  "/:groupId/members/:memberId",
  checkSchema(updateGroupMemberSchema),
  async (req, res) => {
    try {
      const validations = validationResult(req);
      if (!validations.isEmpty()) {
        return res.status(422).json({ errors: validations.array() });
      }
      const groupId = strToInt(req.params.groupId);
      const memberId = strToInt(req.params.memberId);

      const group = await changeMemberAdminRole(
        req.user.id,
        memberId,
        groupId,
        req.body.isAdmin,
      );
      return res.json(group);
    } catch (err) {
      if (err?.type === "LAST_ADMIN_ERROR") {
        logger.error(err.message);
        return res.status(403).json({ error: err.message, type: err.type });
      }

      logger.error(err);
      res.status(500).json({ error: err.message });
    }
  },
);

router.delete("/:groupId/members/:memberId", async (req, res) => {
  try {
    const groupId = strToInt(req.params.groupId);
    const memberId = strToInt(req.params.memberId);

    const group = await deleteMember(req.user.id, memberId, groupId);
    return res.json(group);
  } catch (err) {
    if (err?.type === "LAST_ADMIN_ERROR") {
      logger.error(err.message);
      return res.status(403).json({ error: err.message, type: err.type });
    }

    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Accept group invitation (only invited person can accept)
router.put("/:groupId/invitations/:invitationId", handleInvitation("accept"));

// Reject group invitation (invited person) or cancel invitation (group admin)
router.delete("/:groupId/invitations/:invitationId", handleInvitation("del"));

function handleInvitation(type) {
  return async (req, res) => {
    try {
      const groupId = strToInt(req.params.groupId);
      const invitationId = strToInt(req.params.invitationId);

      const group = await processGroupInvitation({
        userId: req.user.id,
        invitationId,
        groupId,
        type,
      });
      return res.json(group);
    } catch (err) {
      const STATUS_CODES = {
        BAD_REQUEST: 400,
        UNAUTHORIZED: 403,
        NOT_FOUND: 404,
      };

      const code = STATUS_CODES[err?.type];

      if (code) {
        logger.error(err.message);
        return res.status(code).json({ error: err.message, type: err.type });
      }

      logger.error(err);
      res.status(500).json({ error: err.message });
    }
  };
}

module.exports = router;
