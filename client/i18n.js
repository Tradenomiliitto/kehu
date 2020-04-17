import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import backend from "i18next-http-backend";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .use(backend) // backend to fetch localizations
  .init({
    lng: "fi",
    fallbackLng: "fi",

    interpolation: {
      escapeValue: false // react already safes from xss
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
