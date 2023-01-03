const express = require("express");
const router = express.Router();
const { checkSchema, validationResult } = require("express-validator");
const {
  createGroupSchema,
  updateGroupNameSchema,
} = require("../../utils/ValidationSchemas");
const {
  getGroups,
  createGroup,
  updateGroupName,
} = require("../../services/GroupService");
const logger = require("../../logger");

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

router.put(
  "/:groupId",
  checkSchema(updateGroupNameSchema),
  async (req, res) => {
    try {
      const validations = validationResult(req);
      if (!validations.isEmpty()) {
        return res.status(422).json({ errors: validations.array() });
      }

      const group = await updateGroupName(
        req.user.id,
        req.params.groupId,
        req.body
      );
      return res.json(group);
    } catch (err) {
      logger.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

module.exports = router;
