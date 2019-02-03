function loginWithNewUser(browser) {
  const { NEW_USER_EMAIL, NEW_USER_PASSWORD } = browser.globals;
  login(browser, NEW_USER_EMAIL, NEW_USER_PASSWORD);
}

function loginWithGenericUser(browser) {
  const { GENERIC_USER_EMAIL, GENERIC_USER_PASSWORD } = browser.globals;
  login(browser, GENERIC_USER_EMAIL, GENERIC_USER_PASSWORD);
}

function loginWithGenericUser2(browser) {
  const { GENERIC_USER_2_EMAIL, GENERIC_USER_2_PASSWORD } = browser.globals;
  login(browser, GENERIC_USER_2_EMAIL, GENERIC_USER_2_PASSWORD);
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

function addTag(browser, id, text) {
  browser
    .pause(100)
    .setValue(`#${id}`, text)
    .pause(100)
    .click(`.${id}-add-nw`);
}

function navigateToKehuPage(browser) {
  browser
    .waitForElementVisible('a[href="/kehut"]')
    .click('a[href="/kehut"]')
    .waitForElementVisible(".kehus-title-nw")
    .expect.element(".kehus-title-nw")
    .text.to.equal("Saadut Kehut");
}

function expectText(browser, selector, text) {
  browser.expect.element(selector).text.to.equal(text);
}

function expectTags(browser, tags) {
  tags.forEach(tag => {
    browser.expect.element(".kehu-tags-nw").text.to.contain(tag);
  });
}

function expectCloseButton(browser) {
  browser.click(".close-button-nw");
  browser.expect.element(".modal-title-nw").to.be.not.present;
}

module.exports = {
  addTag,
  expectTags,
  navigateToKehuPage,
  expectText,
  expectCloseButton,
  loginWithNewUser,
  loginWithGenericUser,
  loginWithGenericUser2,
  logout
};
