const user = require("./user");

module.exports = function setupRoutes(app) {
  app.use("/user", user);

  app.get("/", (req, res) => {
    res.render("index", {
      user: req.user,
      kehu: {}
    });
  });
};
