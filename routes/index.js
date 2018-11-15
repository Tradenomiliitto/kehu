const user = require("./user");
const userApi = require("./api/user");
const kehu = require("./kehu");
const tags = require("./api/tags");
const { ensureAuthenticated } = require("../utils/Middlewares");

module.exports = function setupRoutes(app) {
  app.use("/api/v1", ensureAuthenticated, tags);
  app.use("/api/v1", ensureAuthenticated, userApi);
  app.use("/kehut", ensureAuthenticated, kehu);
  app.use("/profiili", user);

  app.get("/rekisteriseloste", (req, res) => {
    res.render("privacy-policy", {
      user: req.user
    });
  });

  app.get("/", async (req, res) => {
    if (req.user) {
      res.render("app");
    } else {
      res.render("index", {
        env: process.env
      });
    }
  });
};
