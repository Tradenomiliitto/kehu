module.exports = {
  Registration: function(browser) {
    const { USER_EMAIL, PASSWORD } = browser.globals;
    browser
      .url(browser.launchUrl)
      .click(".register-nw")
      .waitForElementVisible(".auth0-lock-submit")
      .setValue('.auth0-lock-input[name="email"]', USER_EMAIL)
      .setValue('.auth0-lock-input[name="password"]', PASSWORD)
      .setValue('.auth0-lock-input[name="first_name"]', "FirstName")
      .setValue('.auth0-lock-input[name="last_name"]', "LastName")
      .click('input[type="checkbox"]')
      .click(".auth0-lock-submit")
      .waitForElementVisible("#authorize-modal")
      .click("#allow")
      .waitForElementVisible(".jumbotron")
      .expect.element(".auth-title-nw")
      .text.to.equal("Sinulla ei ole vielä kehuja");

    browser.click(".logout-nw").expect.element(".login-nw").to.be.present;
  }
};
