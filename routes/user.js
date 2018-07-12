const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("../utils/Middlewares");

router.get("/", ensureAuthenticated, (req, res) => {
  res.render("user/index", {
    user: req.user
  });
});

router.get("/kirjaudu", (req, res) => {
  if (req.user) {
    return res.redirect("/profiili");
  }
  res.render("user/auth", { env: process.env });
});

router.get("/rekisteroidy", (req, res) => {
  if (req.user) {
    return res.redirect("/profiili");
  }
  res.render("user/auth", { env: process.env, initialScreen: "signUp" });
});

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
