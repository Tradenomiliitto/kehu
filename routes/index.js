const blog = require("./blog");
const user = require("./user");
const userApi = require("./api/user");
const kehuApi = require("./api/kehu");
const { ensureAuthenticated } = require("../utils/Middlewares");

const CLIENT_ROUTES = ["/kehut", "/kehut/lisaa/*", "/profiili", "/raportit"];

module.exports = function setupRoutes(app) {
  app.use("/api/v1/profiili", ensureAuthenticated, userApi);
  app.use("/api/v1/kehut", ensureAuthenticated, kehuApi);

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

  app.use("/profiili", user);

  app.get("/rekisteriseloste", (req, res) => {
    res.render("privacy-policy", {
      user: req.user,
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
