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

function addKehuType(kehus, userId) {
  kehus.forEach((k) => {
    // Kehus added by the user
    if (
      k.giver_id === userId &&
      k.owner_id === userId &&
      k.receiver_email == null
    )
      k.type = "added";
    // Kehus sent by the user
    else if (k.giver_id === userId) k.type = "sent";
    // Public Kehu sent between two other persons in the group
    else if (
      k.owner_id !== null &&
      k.owner_id !== userId &&
      k.group_id !== null &&
      k.is_public === true
    )
      k.type = "others";
    // Kehus user has received
    else k.type = "received";
  });
}

function strToInt(str) {
  const val = parseInt(str, 10);
  if (Number.isNaN(val))
    throw new Error(`String "${str}" is not possible to convert to int`);
  return val;
}

module.exports = {
  setupLocals,
  addKehuType,
  strToInt,
};
