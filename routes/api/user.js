const express = require("express");
const router = express.Router();
const RoleService = require("../../services/RoleService");

router.get("/", async (req, res) => {
  const roles = await RoleService.getRoles();
  const profile = req.user;
  res.json({ profile, roles });
});

module.exports = router;
