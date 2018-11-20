function loginWithNewUser(browser) {
  const { NEW_USER_EMAIL, NEW_USER_PASSWORD } = browser.globals;
  login(browser, NEW_USER_EMAIL, NEW_USER_PASSWORD);
}

function loginWithGenericUser(browser) {
  const { GENERIC_USER_EMAIL, GENERIC_USER_PASSWORD } = browser.globals;
  login(browser, GENERIC_USER_EMAIL, GENERIC_USER_PASSWORD);
}

function login(browser, user, password) {
  browser
    .url(browser.launchUrl)
    .click(".login-nw")
    .waitForElementVisible(".auth0-lock-submit")
    .setValue('.auth0-lock-input[name="email"]', user)
    .setValue('.auth0-lock-input[name="password"]', password)
    .click(".auth0-lock-submit")
    .waitForElementVisible(".home-nw");
}

function logout(browser) {
  browser.url(`${browser.launch_url}/profiili/kirjaudu-ulos`);
}

module.exports = {
  loginWithNewUser,
  loginWithGenericUser,
  logout
};
