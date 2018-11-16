const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.json(req.user);
});

module.exports = router;
