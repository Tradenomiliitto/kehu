const user = require("./user");
const kehu = require("./kehu");
const tags = require("./api/tags");
const { ensureAuthenticated } = require("../utils/Middlewares");
const { getRandomKehu } = require("../services/KehuService");

module.exports = function setupRoutes(app) {
  app.use("/api/v1", ensureAuthenticated, tags);
  app.use("/kehut", ensureAuthenticated, kehu);
  app.use("/profiili", user);

  app.get("/", async (req, res) => {
    const kehu = req.isAuthenticated() ? await getRandomKehu(req.user.id) : {};
    res.render("index", {
      user: req.user,
      kehu
    });
  });
};
