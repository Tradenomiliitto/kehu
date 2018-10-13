const password = require("password-generator");

module.exports = {
  before: function(done) {
    this.USER_EMAIL = `nightwatch+${new Date().getTime()}@test.com`;
    this.PASSWORD = password(16, false, "[dWwp]", "Ab1-");
    done();
  },
  waitForConditionTimeout: 5000
};
