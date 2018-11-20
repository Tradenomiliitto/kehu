const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/kirjaudu-ulos", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get(
  "/callback",
  passport.authenticate("auth0", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(req.session.returnTo || "/");
  }
);

module.exports = router;
