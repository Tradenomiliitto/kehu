const languages = require("../languages.json");

// Add custom function to get long version of the language (e.g. fi --> fi-FI)
function getLongLanguage(language) {
  const lang = languages.find(lng => lng.value === language);
  return lang && lang.longValue;
}

module.exports = {
  getLongLanguage
};
