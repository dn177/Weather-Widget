import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import urlLanguageDetector from './urlLanguageDetector';

// Import translations
import enTranslations from './locales/en.json';
import deTranslations from './locales/de.json';
import plTranslations from './locales/pl.json';
import esTranslations from './locales/es.json';

// Create a new language detector instance with our custom detector
const languageDetector = new LanguageDetector();
languageDetector.addDetector(urlLanguageDetector);

i18n
  // Detect user language
  .use(languageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    debug: false,
    fallbackLng: 'en',
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
      order: ['urlLanguageDetector', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;