const blog = require("./blog");
const user = require("./user");
const userApi = require("./api/user");
const kehuApi = require("./api/kehu");
const { ensureAuthenticated } = require("../utils/Middlewares");

// Load languages from file and create allowed routes which are redirected to
// React app
const languages = require("../languages.json");
const LANG = languages.map(lang => "/" + lang.value);
const ROUTES = ["/kehut", "/kehut/lisaa/*", "/profiili", "/raportit"];
const CLIENT_ROUTES = [...ROUTES];
LANG.forEach(lang => ROUTES.forEach(route => CLIENT_ROUTES.push(lang + route)));
LANG.forEach(lang => CLIENT_ROUTES.push(lang + "/"));

module.exports = function setupRoutes(app) {
  app.use("/api/v1/profiili", ensureAuthenticated, userApi);
  app.use("/api/v1/kehut", ensureAuthenticated, kehuApi);

  app.get("/kehut/lisaa/*", (req, res, next) => {
    if (req.user) {
      next();
    } else {
      req.session.returnTo = req.originalUrl;
      res.render("redirect-login", {
        env: process.env
      });
    }
  });

  app.get(CLIENT_ROUTES, (req, res) => {
    if (req.user) {
      res.render("app", {
        csrfToken: req.csrfToken(),
        env: process.env
      });
    } else {
      res.redirect("/");
    }
  });

  app.use("/blogi", blog);

  app.get("/info", (req, res) => {
    res.render("info", {
      user: req.user,
      pageUrl: process.env.HOME_URL + req.originalUrl,
      env: process.env
    });
  });

  app.get("/kayttoehdot", (req, res) => {
    res.render("terms", {
      user: req.user,
      pageUrl: process.env.HOME_URL + req.originalUrl,
      env: process.env
    });
  });

  app.use("/profiili", user);

  app.get("/rekisteriseloste", (req, res) => {
    res.render("privacy-policy", {
      user: req.user,
      pageUrl: process.env.HOME_URL + req.originalUrl,
      env: process.env
    });
  });

  app.get("/", async (req, res) => {
    if (req.user) {
      res.render("app", {
        csrfToken: req.csrfToken(),
        env: process.env
      });
    } else {
      res.render("index", {
        env: process.env
      });
    }
  });
};
