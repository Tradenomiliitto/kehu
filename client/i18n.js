import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import languages from "../languages.json";

const langWhitelist = languages.map(lang => lang.value);

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(LanguageDetector)
  .use(backend) // backend to fetch localizations
  .init({
    fallbackLng: "fi",
    whitelist: langWhitelist,

    interpolation: {
      escapeValue: false // react already safes from xss
    },

    detection: {
      // order and from where user language should be detected
      order: ["path"],

      // only detect languages that are in the whitelist
      checkWhitelist: true
    },

    // Serve translation files from /locales
    backend: { loadPath: "/locales/{{ns}}-{{lng}}.json" },

    // We already have a <Spinner /> element in App.js when loading Kehus,
    // let's use that
    react: {
      useSuspense: false
    }
  });

export default i18n;
