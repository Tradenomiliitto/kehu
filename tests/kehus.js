const moment = require("moment");
const { loginWithGenericUser } = require("./lib/utils");

const TEXT = "This is kehu text";
const GIVER_NAME = "Giver Name";
const SITUATION1 = "situation1";
const SITUATION2 = "situation2";
const SITUATION3 = "situation3";
const DATE_GIVEN = moment(new Date()).format("D.M.YYYY");
const TAG1 = "tag1";
const TAG2 = "tag2";
const TAG3 = "tag3";

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
      .click(".react-datepicker__day.react-datepicker__day--thu")
      .pause(100)
      .setValue("#tags", TAG1)
      .pause(100)
      .click(".tags-add-nw")
      .pause(100)
      .setValue("#tags", TAG2)
      .pause(100)
      .click(".tags-add-nw")
      .pause(100)
      .setValue("#situations", SITUATION1)
      .pause(100)
      .click(".situations-add-nw")
      .pause(100)
      .setValue("#situations", SITUATION2)
      .pause(100)
      .click(".situations-add-nw")
      .pause(100)
      .click(".submit-kehu-nw");

    browser.expect
      .element(".modal-title-nw")
      .text.to.equal("Kehu tallennettu!");
    browser.expect.element(".kehu-text-nw").text.to.equal(TEXT);
    browser.expect.element(".kehu-giver-name-nw").text.to.equal(GIVER_NAME);
    browser.expect
      .element(".kehu-tags-nw")
      .text.to.equal(`${TAG1}${TAG2}${SITUATION1}${SITUATION2}`);
    browser.click(".close-button-nw");
    browser.expect.element(".modal-title-nw").to.be.not.present;
  },
  EditKehu: function(browser) {
    const newKehuText = TEXT + " and something else.";
    browser
      .waitForElementVisible(".kehus-nw")
      .click(".kehus-nw")
      .waitForElementVisible(".kehu-link-nw")
      .click(".kehu-link-nw")
      .waitForElementVisible(".edit-kehu-nw")
      .click(".edit-kehu-nw")
      .click('.badge-info:nth-child(2) > span[data-role="remove"]')
      .setValue(".tt-input", TAG3)
      .keys(browser.Keys.ENTER)
      .clearValue("#text")
      .setValue("#text", newKehuText)
      .click(".submit-kehu-nw");

    browser.expect
      .element(".alert-success")
      .text.to.equal("Kehun tallennus onnistui.");
    browser.expect.element(".kehu-text-nw").text.to.equal(newKehuText);
    browser.expect.element(".kehu-giver-name-nw").text.to.equal(GIVER_NAME);
    browser.expect.element(".kehu-situation-nw").text.to.equal(SITUATION1);
    browser.expect.element(".kehu-date-given-nw").text.to.equal(DATE_GIVEN);
    browser.expect.element(".kehu-tags-nw").text.to.equal(`#${TAG1} #${TAG3}`);
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
