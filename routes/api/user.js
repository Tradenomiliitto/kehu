const express = require("express");
const router = express.Router();

router.get("/user", async (req, res) => {
  res.json(req.user);
});

module.exports = router;
