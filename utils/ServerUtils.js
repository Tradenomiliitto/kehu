const moment = require("moment");
moment.locale("fi");

function isAuth0User(user) {
  const prefix = user.auth0_id.split("|")[0];
  return prefix === "auth0";
}

function setupLocals(app, getVersionedPath) {
  app.locals.isAuth0User = isAuth0User;
  app.locals.moment = moment;
  app.locals.getVersionedPath = getVersionedPath;
  app.locals.currentYear = new Date().getFullYear();
}

module.exports = {
  setupLocals
};
