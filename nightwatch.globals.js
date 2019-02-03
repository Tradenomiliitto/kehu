require("dotenv").config({ silent: true });
const password = require("password-generator");

module.exports = {
  before: function(done) {
    this.NEW_USER_EMAIL = `nightwatch+${new Date().getTime()}@test.com`;
    this.NEW_USER_PASSWORD = password(16, false, "[dWwp]", "Ab1-");
    this.GENERIC_USER_EMAIL = process.env.TEST_USER_EMAIL;
    this.GENERIC_USER_PASSWORD = process.env.TEST_USER_PASSWORD;
    this.GENERIC_USER_2_EMAIL = process.env.TEST_USER_2_EMAIL;
    this.GENERIC_USER_2_PASSWORD = process.env.TEST_USER_2_PASSWORD;
    done();
  },
  waitForConditionTimeout: 5000
};
