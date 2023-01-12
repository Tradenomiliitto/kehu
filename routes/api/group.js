const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const {
  createGroupSchema,
  updateGroupSchema,
  updateGroupMemberSchema,
  addGroupMembersSchema,
} = require("../../utils/ValidationSchemas");
const {
  getGroups,
  createGroup,
  updateGroup,
  changeMemberAdminRole,
  deleteMember,
  addGroupMembers,
} = require("../../services/GroupService");
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

    const group = await createGroup(req.user.id, req.body);
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

    const group = await updateGroup(req.user.id, groupId, req.body);
    return res.json(group);
  } catch (err) {
    logger.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post(
  "/:groupId/members",
  checkSchema(addGroupMembersSchema),
  async (req, res) => {
    try {
      const validations = validationResult(req);
      if (!validations.isEmpty()) {
        return res.status(422).json({ errors: validations.array() });
      }
      const groupId = strToInt(req.params.groupId);

      const group = await addGroupMembers(
        req.user.id,
        groupId,
        req.body.members
      );
      return res.json(group);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: err.message });
    }
  }
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
        req.body.isAdmin
      );
      return res.json(group);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: err.message });
    }
  }
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

module.exports = router;
