const user = require("./user");
const kehu = require("./kehu");
const userApi = require("./api/user");
const kehuApi = require("./api/kehu");
const { ensureAuthenticated } = require("../utils/Middlewares");

module.exports = function setupRoutes(app) {
  app.use("/api/v1/profiili", ensureAuthenticated, userApi);
  app.use("/api/v1/kehut", ensureAuthenticated, kehuApi);
  app.use("/kehut", ensureAuthenticated, kehu);
  app.use("/profiili", user);

  app.get("/rekisteriseloste", (req, res) => {
    res.render("privacy-policy", {
      user: req.user
    });
  });

  app.get("/", async (req, res) => {
    if (req.user) {
      res.render("app", {
        csrfToken: req.csrfToken()
      });
    } else {
      res.render("index", {
        env: process.env
      });
    }
  });
};
