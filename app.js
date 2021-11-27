const createError = require("http-errors");
const favicon = require("serve-favicon");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const passport = require("passport");
const Knex = require("knex");
const pg = require("pg");
const Model = require("objection").Model;
const redis = require("redis");
const connectRedis = require("connect-redis");
const csrf = require("csurf");
const compression = require("compression");
const methodOverride = require("method-override");
const httpsRedirect = require("express-https-redirect");
const webpack = require("webpack");

// Following packages are not required in production and importing them
// will throw an error if devDependencies are not installed
const isProd = process.env.NODE_ENV === "production";
const webpackConfig = isProd ? null : require("./webpack.dev.config");
const compiler = isProd ? null : webpack(webpackConfig);

const { initializeI18n } = require("./utils/i18n");
const log = require("./logger");
const RedisStore = connectRedis(session);
const csrfProtection = csrf({ cookie: true });
const staticify = require("staticify")(path.join(__dirname, "public"));

const { setupLocals } = require("./utils/ServerUtils");
const setupPassport = require("./passport");
const setupRoutes = require("./routes");
const logger = require("./logger");

pg.defaults.ssl = isProd;
const knex = Knex({
  client: "pg",
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  },
});
Model.knex(knex);

const app = express();
setupPassport(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// Strip staticify hash before webpack-dev-middleware, otherwise it won't
// recognize hashed files
app.use((req, res, next) => {
  req.url = staticify.stripVersion(req.url);
  next();
});

if (!isProd && process.env.WEBPACK_HOT_RELOAD) {
  logger.info("Webpack building frontend... Watch and hot reload enabled.");
  app.use(
    require("webpack-dev-middleware")(compiler, {
      publicPath: webpackConfig.output.publicPath,
    })
  );
  app.use(require("webpack-hot-middleware")(compiler));
} else {
  logger.info("Frontend build step skipped, using existing build");
}

app.disable("x-powered-by");
app.use(compression());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(methodOverride("_method"));

// i18n initialization must be early to have t, languages etc. set when
// rendering error page if e.g. csrf fails
initializeI18n(app);

app.use(csrfProtection);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      client: redis.createClient(process.env.REDIS_URL),
    }),
  })
);

app.use(staticify.middleware);

app.use(express.static(path.join(__dirname, "public")));
app.use("/", httpsRedirect());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // Add language to session for correct redirect after login
  // conditional required, otherwise value overwritten with 'fi' after login
  if (!req.user && req.path !== "/profiili/callback")
    req.session.languageRedirect = "/" + req.language;

  // Add locals for rendering pug views
  res.locals.user = req.user;
  res.locals.pageUrl = process.env.HOME_URL + req.originalUrl;
  res.locals.env = process.env;
  res.locals.pathWithoutLanguage = req.url;
  next();
});

setupLocals(app, staticify.getVersionedPath);
setupRoutes(app);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.status !== 404) {
    log.warn("Express error handler", { err });
  }

  res.status(err.status || 500);
  res.render("error", {
    user: req.user,
    env: process.env,
  });
});

module.exports = app;
