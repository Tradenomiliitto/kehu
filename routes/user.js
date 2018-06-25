const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("user");
});

router.get("/login", (req, res) => {
  res.render("login", { env: process.env });
});

router.get("/register", (req, res) => {
  res.render("login", { env: process.env, initialScreen: "signUp" });
});

router.get("/logout", (req, res) => {
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
