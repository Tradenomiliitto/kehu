const user = require("./user");
const kehu = require("./kehu");

module.exports = function setupRoutes(app) {
  app.use("/user", user);
  app.use("/kehut", kehu);

  app.get("/", (req, res) => {
    res.render("index", {
      user: req.user,
      kehu: {}
    });
  });
};
