const logger = require("../logger");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    logger.info(
      `User not authenticated to access ${req.originalUrl}, redirecting to /`
    );
    return res.redirect("/");
  }
}

module.exports = {
  ensureAuthenticated,
};
