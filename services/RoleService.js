const Role = require("../models/Role");

async function getRoles() {
  return await Role.query();
}

module.exports = {
  getRoles
};
