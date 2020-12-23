const Role = require("../models/Role");

async function getRoles(t) {
  return Role.query()
    .context({ t })
    .orderBy("id");
}

module.exports = {
  getRoles
};
