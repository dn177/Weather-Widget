import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const LanguageHandler = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for language parameter in URL
    const params = new URLSearchParams(location.search);
    const urlLang = params.get('lang');
    const supportedLangs = ['en', 'de', 'pl', 'es'];

    // If there's a valid language in URL, use it
    if (urlLang && supportedLangs.includes(urlLang)) {
      if (i18n.language !== urlLang) {
        i18n.changeLanguage(urlLang);
      }
    } else if (!urlLang && i18n.language) {
      // If no language in URL but i18n has a language, add it to URL
      const url = new URL(window.location);
      url.searchParams.set('lang', i18n.language);
      window.history.replaceState({}, '', url);
    }
  }, [location, i18n]);

  return null;
};

export default LanguageHandler;