const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/kirjaudu-ulos", (req, res) => {
  req.logout();
  res.redirect("/" + (req.query.redirectLanguage || ""));
});

router.get(
  "/callback",
  passport.authenticate("auth0", { failureRedirect: "/" }),
  (req, res) => {
    const returnTo = req.session.returnTo;
    delete req.session.returnTo;
    res.redirect(returnTo || req.session.languageRedirect || "/");
  }
);

module.exports = router;
