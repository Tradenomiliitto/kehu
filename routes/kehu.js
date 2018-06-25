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

module.exports = router;
