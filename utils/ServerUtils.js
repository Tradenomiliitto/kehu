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

function addKehuType(kehus, sentOrReceived, userId) {
  if (sentOrReceived === "sent") kehus.forEach((k) => (k.type = "sent"));
  if (sentOrReceived === "received")
    kehus.forEach((k) => {
      // Kehus added by the user
      if (k.giver_id === k.owner_id && k.receiver_email == null)
        k.type = "added";
      // Public Kehu sent between two persons in the group user is
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

module.exports = {
  setupLocals,
  addKehuType,
};
