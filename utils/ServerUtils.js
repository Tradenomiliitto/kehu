const moment = require("moment");
moment.locale("fi");

function isAuth0User(user) {
  const prefix = user.auth0_id.split("|")[0];
  return prefix === "auth0";
}

function setupLocals(app) {
  app.locals.isAuth0User = isAuth0User;
  app.locals.moment = moment;
}

module.exports = {
  setupLocals
};
