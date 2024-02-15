const express = require("express");
const router = express.Router();
const passport = require("passport");
const logger = require("../logger");

router.get("/kirjaudu-ulos", async (req, res) => {
  logger.info(`Logging out user ${req.user?.id}`);
  await new Promise((resolve, reject) => {
    req.logout({}, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  res.redirect("/" + (req.query.redirectLanguage || ""));
});

router.get(
  "/callback",
  passport.authenticate("auth0", { failureRedirect: "/" }),
  (req, res) => {
    logger.info(`User ${req.user?.id} logged in successfully`);
    const returnTo = req.session.returnTo;
    delete req.session.returnTo;
    res.redirect(returnTo || req.session.languageRedirect || "/");
  },
);

module.exports = router;
