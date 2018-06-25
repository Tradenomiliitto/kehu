const express = require("express");
const router = express.Router();
const KehuService = require("../services/KehuService");

router.get("/", async (req, res) => {
  const kehus = await KehuService.getKehus(req.user.id);
  res.render("kehus/index", {
    user: req.user,
    kehus
  });
});

router.get("/new", (req, res) => {
  res.render("kehus/new", {
    user: req.user,
    csrfToken: req.csrfToken()
  });
});

module.exports = router;
