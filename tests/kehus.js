const {
  addTag,
  expectCloseButton,
  expectTags,
  expectText,
  navigateToKehuPage,
  loginWithGenericUser,
} = require("./lib/utils");

const TEXT = "This is kehu text";
const GIVER_NAME = "Giver Name";
const SITUATION1 = "Situation1";
const SITUATION2 = "Situation2";
const SITUATION3 = "Situation3";
const TAG1 = "Tag1";
const TAG2 = "Tag2";
const TAG3 = "Tag3";

module.exports = {
  before: function (browser) {
    loginWithGenericUser(browser);
  },
  AddKehu: function (browser) {
    browser
      .waitForElementVisible(".add-kehu-nw")
      .click(".add-kehu-nw")
      .setValue("#giver_name", GIVER_NAME)
      .setValue("#text", TEXT)
      .click("#date_given")
      .click(".react-datepicker__day.react-datepicker__day--thu");

    addTag(browser, "tags", TAG1);
    addTag(browser, "tags", TAG2);
    addTag(browser, "situations", SITUATION1);
    addTag(browser, "situations", SITUATION2);
    browser.click(".importance-selector-nw:nth-of-type(3)");
    browser.click(".submit-kehu-nw");
    expectText(browser, ".modal-title-nw", "Kehu tallennettu!");
    expectText(browser, ".kehu-text-nw", TEXT);
    expectText(browser, ".kehu-giver-name-nw", GIVER_NAME);
    expectTags(browser, [TAG1, TAG2, SITUATION1, SITUATION2]);
    browser.assert.elementPresent(".stars-important-nw:nth-of-type(3)");
    browser.assert.not.elementPresent(".stars-important-nw:nth-of-type(4)");
    expectCloseButton(browser);
  },
  EditKehu: function (browser) {
    const newKehuText = TEXT + " and something else.";
    navigateToKehuPage(browser);
    browser
      .click(".edit-black-nw")
      .clearValue("#text")
      .setValue("#text", newKehuText)
      .click(".tags-remove-nw")
      .click(".tags-remove-nw")
      .click(".situations-remove-nw")
      .click(".situations-remove-nw");

    addTag(browser, "tags", TAG3);
    addTag(browser, "situations", SITUATION3);

    browser.click(".submit-kehu-nw");

    expectText(browser, ".modal-title-nw", "Kehu tallennettu!");
    expectText(browser, ".kehu-text-nw", newKehuText);
    expectText(browser, ".kehu-giver-name-nw", GIVER_NAME);
    expectTags(browser, [TAG3, SITUATION3]);
    expectCloseButton(browser);
  },
  RemoveKehu: function (browser) {
    navigateToKehuPage(browser);
    browser.assert.elementPresent(".kehu-row-nw");
    browser.click(".trash-red-nw").acceptAlert();
    browser.waitForElementNotPresent(".kehu-row-nw");
    browser.assert.not.elementPresent(".kehu-row-nw");
  },
  ValidateKehu: function (browser) {
    browser
      .url(browser.launch_url)
      .waitForElementVisible(".add-kehu-nw")
      .click(".add-kehu-nw");
    browser.click(".submit-kehu-nw");
    browser.expect
      .element(".error-nw:nth-of-type(1)")
      .text.to.equal("Kehun antaja on pakollinen tieto.");
    browser.expect
      .element(".error-nw:nth-of-type(2)")
      .text.to.equal("Teksti on pakollinen tieto.");
  },
  after: function (browser) {
    browser.closeWindow();
  },
};
