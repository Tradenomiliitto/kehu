const logger = require("../logger");

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    const errorMessage = `User not authenticated to access ${req.originalUrl}`;
    logger.info(errorMessage);
    return res.status(401).json({
      message: errorMessage,
      // Provide error also in express-validator format so it will be shown to user
      errors: [{ msg: errorMessage }],
    });
  }
}

module.exports = {
  ensureAuthenticated,
};
