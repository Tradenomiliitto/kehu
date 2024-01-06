const path = require("path");
const i18next = require("i18next");
const i18nextMiddleware = require("i18next-http-middleware");
const i18nextBackend = require("i18next-node-fs-backend");

const languages = require("../languages.json");
const { getLongLanguage } = require("./LongLanguage");

function initializeI18n(app) {
  const langWhitelist = languages.map((lang) => lang.value);

  i18next
    .use(i18nextBackend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      compatibilityJSON: "v3",
      fallbackLng: "fi",
      supportedLngs: langWhitelist,
      preload: langWhitelist,
      ns: "translation-public", // Namespace to load
      defaultNS: "translation-public", // Default namespace (if not defined)

      backend: {
        loadPath: path.resolve(
          path.join("public", "locales", "{{ns}}-{{lng}}.json"),
        ),
      },
      detection: {
        // order and from where user language should be detected
        order: ["path", "querystring", "header", "localStorage", "navigator"],

        // only detect languages that are in the whitelist
        checkWhitelist: true,
      },
      interpolation: {
        skipOnVariables: false, // default value changed in i18next upgrade, use existing value since not sure if this can be changed
        escapeValue: false, // pug already safe from xss
      },
    });

  app.use(
    i18nextMiddleware.handle(i18next, {
      removeLngFromUrl: true,
    }),
  );

  app.use((req, res, next) => {
    res.locals.language = req.language;
    res.locals.longLanguage = getLongLanguage(req.language);
    res.locals.languages = languages;
    next();
  });
}

module.exports = {
  initializeI18n,
};
