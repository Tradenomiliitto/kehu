const createError = require("http-errors");
const favicon = require("serve-favicon");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const passport = require("passport");
const Knex = require("knex");
const pg = require("pg");
const Model = require("objection").Model;

const DEVELOPMENT = process.env.NODE_ENV !== "production";

const setupPassport = require("./passport");
const setupRoutes = require("./routes");

pg.defaults.ssl = true;
const knex = Knex({
  client: DEVELOPMENT ? "sqlite3" : "pg",
  connection: DEVELOPMENT
    ? { filename: "./kehu_database.sqlite" }
    : process.env.DATABASE_URL
});
Model.knex(knex);

const app = express();
setupPassport(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, "public")));

setupRoutes(app);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
