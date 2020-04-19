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
const Redis = require("connect-redis");
const csrf = require("csurf");
const compression = require("compression");
const methodOverride = require("method-override");
const httpsRedirect = require("express-https-redirect");
const webpack = require("webpack");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-express-middleware");
const i18nextBackend = require("i18next-node-fs-backend");
const languages = require("./languages.json");

// Following packages are not required in production and importing them
// will throw an error if devDependencies are not installed
const isProd = process.env.NODE_ENV === "production";
const webpackConfig = isProd ? null : require("./webpack.dev.config");
const compiler = isProd ? null : webpack(webpackConfig);

const log = require("./logger");
const RedisStore = Redis(session);
const csrfProtection = csrf({ cookie: true });
const staticify = require("staticify")(path.join(__dirname, "public"));

const { setupLocals } = require("./utils/ServerUtils");
const setupPassport = require("./passport");
const setupRoutes = require("./routes");

pg.defaults.ssl = isProd;
const knex = Knex({
  client: "pg",
  connection: process.env.DATABASE_URL
});
Model.knex(knex);

const app = express();
setupPassport(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

if (!isProd) {
  app.use(
    require("webpack-dev-middleware")(compiler, {
      noInfo: true,
      publicPath: webpackConfig.output.publicPath
    })
  );
  app.use(require("webpack-hot-middleware")(compiler));
}

app.disable("x-powered-by");
app.use(compression());
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(morgan("dev"));
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

app.use(staticify.middleware);

const langWhitelist = languages.map(lang => lang.value);

i18next
  .use(i18nextBackend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "fi",
    whitelist: langWhitelist,
    preload: langWhitelist,

    backend: {
      loadPath: __dirname + "/public/locales/{{ns}}-{{lng}}.json"
    },
    detection: {
      // order and from where user language should be detected
      order: ["path", "localStorage", "navigator"],

      // only detect languages that are in the whitelist
      checkWhitelist: true
    }
  });
app.use(
  i18nextMiddleware.handle(i18next, {
    removeLngFromUrl: true
  })
);

app.use((req, res, next) => {
  req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js)$/, "/$1.$2");
  next();
});

app.use(express.static(path.join(__dirname, "public")));
app.use("/", httpsRedirect());
app.use(passport.initialize());
app.use(passport.session());

// Add locals for rendering pug views
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.pageUrl = process.env.HOME_URL + req.originalUrl;
  res.locals.env = process.env;
  res.locals.language = req.language;
  res.locals.languages = languages;
  res.locals.pathWithoutLanguage = req.url;
  next();
});

setupLocals(app, staticify.getVersionedPath);
setupRoutes(app);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  if (err.status !== 404) {
    log.warn("Express error handler", { err });
  }

  res.status(err.status || 500);
  res.render("error", {
    user: req.user,
    env: process.env
  });
});

module.exports = app;
