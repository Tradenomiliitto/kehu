const express = require("express");
const router = express.Router();
const RoleService = require("../../services/RoleService");
const SituationService = require("../../services/SituationService");
const TagService = require("../../services/TagService");

router.get("/", async (req, res) => {
  const roles = await RoleService.getRoles();
  const situations = await SituationService.getUserSituations(req.user.id);
  const tags = await TagService.getUserTags(req.user.id);
  const profile = req.user;
  res.json({ profile, roles, situations, tags });
});

module.exports = router;
