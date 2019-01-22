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
const Redis = require("connect-redis");
const csrf = require("csurf");
const methodOverride = require("method-override");
const flash = require("express-flash");
const httpsRedirect = require("express-https-redirect");
const webpack = require("webpack");
const webpackConfig = require("./webpack.dev.config");

const RedisStore = Redis(session);
const csrfProtection = csrf({ cookie: true });
const compiler = webpack(webpackConfig);

const { setupLocals } = require("./utils/ServerUtils");
const setupPassport = require("./passport");
const setupRoutes = require("./routes");

pg.defaults.ssl = process.env.NODE_ENV === "production";
const knex = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});
Model.knex(knex);

const app = express();
setupPassport(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (process.env.NODE_ENV !== "production") {
  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  );
  app.use(require("webpack-hot-middleware")(compiler));
}

app.disable("x-powered-by");
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));
app.use(csrfProtection);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      url: process.env.REDIS_URL
    })
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", httpsRedirect());
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

setupLocals(app);
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
