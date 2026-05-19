import React from 'react';
import { useTranslation } from 'react-i18next';
import './languageSelector.css';

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng);
    
    // Update URL with the new language
    const url = new URL(window.location);
    url.searchParams.set('lang', lng);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="language-selector">
      <button
        className={`lang-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="lang-separator">|</span>
      <button
        className={`lang-btn ${i18n.language === 'de' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('de')}
        aria-label="Switch to German"
      >
        DE
      </button>
      <span className="lang-separator">|</span>
      <button
        className={`lang-btn ${i18n.language === 'pl' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('pl')}
        aria-label="Switch to Polish"
      >
        PL
      </button>
      <span className="lang-separator">|</span>
      <button
        className={`lang-btn ${i18n.language === 'es' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('es')}
        aria-label="Switch to Spanish"
      >
        ES
      </button>
    </div>
  );
};

export default LanguageSelector;