const {
  addTag,
  expectText,
  expectTags,
  navigateToKehuPage,
  loginWithGenericUser,
  logout,
  loginWithGenericUser2
} = require("./lib/utils");

const RECEIVER_NAME = "Receiver Name";
const TEXT = "This is kehu text";
const SITUATION1 = "Situation1";
const SITUATION2 = "Situation2";
const TAG1 = "Tag1";
const TAG2 = "Tag2";

module.exports = {
  before: function(browser) {
    loginWithGenericUser(browser);
  },

  AddSentKehu: function(browser) {
    browser
      .waitForElementVisible(".send-kehu-nw")
      .click(".send-kehu-nw")
      .setValue("#receiver_name", RECEIVER_NAME)
      .setValue("#receiver_email", browser.globals.GENERIC_USER_2_EMAIL)
      .setValue("#text", TEXT)
      .click("#date_given")
      .click(".react-datepicker__day.react-datepicker__day--thu");

    addTag(browser, "tags", TAG1);
    addTag(browser, "tags", TAG2);
    addTag(browser, "situations", SITUATION1);
    addTag(browser, "situations", SITUATION2);
    browser.click(".submit-kehu-nw");

    expectText(browser, ".modal-title-nw", "Lähetä Kehu");
    expectText(browser, ".kehu-text-nw", TEXT);
    expectText(
      browser,
      ".receiver-nw",
      `Lähetetään kehun saajalle:
${RECEIVER_NAME}
${browser.globals.GENERIC_USER_2_EMAIL}`
    );
    expectTags(browser, [TAG1, TAG2, SITUATION1, SITUATION2]);
    browser
      .click(".submit-send-kehu-nw")
      .waitForElementPresent(".success-title-nw");

    expectText(browser, ".success-title-nw", "Kehu lähetetty!");
    browser.click(".modal-close-nw");
  },

  CheckSentKehu: function(browser) {
    navigateToKehuPage(browser);
    browser.click(".toggle-view-nw");
    expectText(browser, ".receiver-nw", RECEIVER_NAME);
    expectText(browser, ".text-nw", TEXT);
  },

  ReceiveSentKehu: function(browser) {
    logout(browser);
    loginWithGenericUser2(browser);
    navigateToKehuPage(browser);
    browser.assert.elementPresent(".kehu-row-nw");
    browser.click(".trash-red-nw").acceptAlert();
    browser.waitForElementNotPresent(".kehu-row-nw");
    browser.assert.not.elementPresent(".kehu-row-nw");
  },

  after: function(browser) {
    browser.closeWindow();
  }
};
