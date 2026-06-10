import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import urlLanguageDetector from "./urlLanguageDetector";
import { SUPPORTED_LANGUAGES } from "./languages";

// Import translations
import enTranslations from "./locales/en.json";
import deTranslations from "./locales/de.json";
import plTranslations from "./locales/pl.json";
import esTranslations from "./locales/es.json";

// Create a new language detector instance with our custom detector
const languageDetector = new LanguageDetector();
languageDetector.addDetector(urlLanguageDetector);

i18n.use(languageDetector).use(initReactI18next);

// Keep <html lang> in sync with the active language (a11y + SEO).
// Attached before init so it also fires for the initially detected language.
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.lang = lng;
  }
});

i18n.init({
  debug: false,
  fallbackLng: "en",
  supportedLngs: SUPPORTED_LANGUAGES,
  // Resolve region variants ("en-GB", "de-AT") to their base language —
  // both for resource loading and for the reported i18n.language.
  load: "languageOnly",
  nonExplicitSupportedLngs: true,
  interpolation: {
    escapeValue: false, // not needed for react as it escapes by default
  },
  resources: {
    en: {
      translation: enTranslations,
    },
    de: {
      translation: deTranslations,
    },
    pl: {
      translation: plTranslations,
    },
    es: {
      translation: esTranslations,
    },
  },
  detection: {
    order: ["urlLanguageDetector", "localStorage", "navigator", "htmlTag"],
    // urlLanguageDetector in caches keeps ?lang= in the URL up to date on
    // every switch — this replaces the URL-writing that previously lived in
    // LanguageHandler and LanguageSelector.
    caches: ["localStorage", "urlLanguageDetector"],
  },
});

export default i18n;
