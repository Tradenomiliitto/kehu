const user = require("./user");

module.exports = function setupRoutes(app) {
  app.use("/", user);
};
