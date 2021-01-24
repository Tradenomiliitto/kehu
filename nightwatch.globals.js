require("dotenv").config({ silent: true });
const password = require("password-generator");

module.exports = {
  NEW_USER_EMAIL: `nightwatch+${new Date().getTime()}@test.com`,
  NEW_USER_PASSWORD: password(16, false, "[dWwp]", "Ab1-"),
  GENERIC_USER_EMAIL: process.env.TEST_USER_EMAIL,
  GENERIC_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
  GENERIC_USER_2_EMAIL: process.env.TEST_USER_2_EMAIL,
  GENERIC_USER_2_PASSWORD: process.env.TEST_USER_2_PASSWORD,
  waitForConditionTimeout: 5000
};
