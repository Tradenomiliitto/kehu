const Role = require("../models/Role");

async function getRoles() {
  return await Role.query().orderBy("id");
}

module.exports = {
  getRoles
};
