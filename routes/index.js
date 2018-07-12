const user = require("./user");
const kehu = require("./kehu");
const tags = require("./api/tags");

module.exports = function setupRoutes(app) {
  app.use("/api/v1", tags);
  app.use("/profiili", user);
  app.use("/kehut", kehu);

  app.get("/", (req, res) => {
    res.render("index", {
      user: req.user,
      kehu: {}
    });
  });
};
