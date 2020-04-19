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

module.exports = function setupRoutes(app) {
  app.use("/api/v1/profiili", ensureAuthenticated, userApi);
  app.use("/api/v1/kehut", ensureAuthenticated, kehuApi);

  app.get("/kehut/lisaa/*", (req, res, next) => {
    if (req.user) {
      next();
    } else {
      req.session.returnTo = req.originalUrl;
      res.render("redirect-login", {});
    }
  });

  app.get(CLIENT_ROUTES, (req, res) => {
    if (req.user) {
      res.render("app", {
        csrfToken: req.csrfToken()
      });
    } else {
      res.redirect("/");
    }
  });

  app.use("/blogi", blog);

  app.get("/info", (req, res) => {
    res.render("info", {});
  });

  app.get("/kayttoehdot", (req, res) => {
    res.render("terms", {});
  });

  app.use("/profiili", user);

  app.get("/rekisteriseloste", (req, res) => {
    res.render("privacy-policy", {});
  });

  app.get(["/", ...LANG], async (req, res) => {
    if (req.user) {
      res.render("app", {
        csrfToken: req.csrfToken()
      });
    } else {
      res.render("index", {});
    }
  });
};
