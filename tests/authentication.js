const { loginWithNewUser, logout } = require("./lib/utils");

module.exports = {
  Registration: function(browser) {
    const { NEW_USER_EMAIL, NEW_USER_PASSWORD } = browser.globals;
    browser
      .url(browser.launchUrl)
      .click(".register-nw")
      .waitForElementVisible(".auth0-lock-submit")
      .setValue('.auth0-lock-input[name="email"]', NEW_USER_EMAIL)
      .setValue('.auth0-lock-input[name="password"]', NEW_USER_PASSWORD)
      .setValue('.auth0-lock-input[name="first_name"]', "FirstName")
      .setValue('.auth0-lock-input[name="last_name"]', "LastName")
      .click('input[type="checkbox"]')
      .click(".auth0-lock-submit")
      .waitForElementVisible("#authorize-modal")
      .click("#allow")
      .waitForElementVisible(".home-nw")
      .expect.element(".add-kehu-nw")
      .text.to.equal("Lisää Kehu");

    logout(browser);
  },

  Login: function(browser) {
    loginWithNewUser(browser);

    browser.expect.element(".add-kehu-nw").text.to.equal("Lisää Kehu");

    logout(browser);
  },

  after: function(browser) {
    browser.closeWindow();
  }
};
