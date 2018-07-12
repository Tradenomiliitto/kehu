const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("user/index", {
    user: req.user
  });
});

router.get("/kirjaudu", (req, res) => {
  res.render("user/auth", { env: process.env });
});

router.get("/rekisteroidy", (req, res) => {
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
