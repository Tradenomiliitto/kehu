const moment = require("moment");
const { loginWithGenericUser } = require("./lib/utils");

const TEXT = "This is kehu text";
const GIVER_NAME = "Giver Name";
const SITUATION1 = "situation1";
const SITUATION2 = "situation2";
const SITUATION3 = "situation3";
const TAG1 = "tag1";
const TAG2 = "tag2";
const TAG3 = "tag3";

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
  before: function(browser) {
    loginWithGenericUser(browser);
  },
  AddKehu: function(browser) {
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
    browser.click(".submit-kehu-nw");
    expectText(browser, ".modal-title-nw", "Kehu tallennettu!");
    expectText(browser, ".kehu-text-nw", TEXT);
    expectText(browser, ".kehu-giver-name-nw", GIVER_NAME);
    expectTags(browser, [TAG1, TAG2, SITUATION1, SITUATION2]);
    expectCloseButton(browser);
  },
  EditKehu: function(browser) {
    const newKehuText = TEXT + " and something else.";
    navigateToKehuPage(browser);
    browser
      .click(".edit-black-nw")
      .clearValue("#text")
      .setValue("#text", newKehuText)
      .click(".tags-remove-nw")
      .click(".situations-remove-nw");

    addTag(browser, "tags", TAG3);
    addTag(browser, "situations", SITUATION3);

    browser.click(".submit-kehu-nw");

    expectText(browser, ".modal-title-nw", "Kehu tallennettu!");
    expectText(browser, ".kehu-text-nw", newKehuText);
    expectText(browser, ".kehu-giver-name-nw", GIVER_NAME);
    expectTags(browser, [TAG3, TAG2, SITUATION3, SITUATION2]);
    expectCloseButton(browser);
  },
  RemoveKehu: function(browser) {
    browser
      .waitForElementVisible(".kehus-nw")
      .click(".kehus-nw")
      .waitForElementVisible(".kehu-link-nw")
      .click(".kehu-link-nw")
      .waitForElementVisible(".edit-kehu-nw")
      .click(".delete-kehu-nw")
      .acceptAlert();

    browser.expect
      .element(".alert-success")
      .text.to.equal("Kehun poistaminen onnistui.");
  },
  ValidateKehu: function(browser) {
    browser
      .waitForElementVisible(".kehus-nw")
      .click(".kehus-nw")
      .waitForElementVisible(".add-kehu-nw")
      .click(".add-kehu-nw")
      .clearValue("#date_given")
      .click(".submit-kehu-nw");

    browser
      .useXpath()
      .expect.element(
        '//div[@class="form-group"][1]/div[@class="invalid-feedback"]'
      )
      .text.to.equal("Teksti on pakollinen tieto.");
    browser
      .useXpath()
      .expect.element(
        '//div[@class="form-group"][2]/div[@class="invalid-feedback"]'
      )
      .text.to.equal("Kehun antaja on pakollinen tieto.");
    browser
      .useXpath()
      .expect.element(
        '//div[@class="form-group"][3]/div[@class="invalid-feedback"]'
      )
      .text.to.equal("Tilanne on pakollinen tieto.");
    browser
      .useXpath()
      .expect.element(
        '//div[@class="form-group"][4]/div[@class="invalid-feedback"]'
      )
      .text.to.equal("Ajankohta on pakollinen tieto.");
  },
  after: function(browser) {
    browser.closeWindow();
  }
};
