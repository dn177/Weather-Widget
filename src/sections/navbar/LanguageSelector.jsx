import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import { SUPPORTED_LANGUAGES } from "../../i18n/languages";
import "./languageSelector.css";

const LANGUAGE_LABELS = {
  en: { label: "EN" },
  de: { label: "DE" },
  pl: { label: "PL" },
  es: { label: "ES" },
};

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  // resolvedLanguage is always a supported base code (load: "languageOnly"),
  // so the active state also works when the browser reports e.g. "en-GB".
  const activeLanguage = i18n.resolvedLanguage || i18n.language;

  return (
    <div className="language-selector">
      {SUPPORTED_LANGUAGES.map((lng, index) => (
        <Fragment key={lng}>
          {index > 0 && <span className="lang-separator">|</span>}
          <button
            className={`lang-btn ${activeLanguage === lng ? "active" : ""}`}
            onClick={() => i18n.changeLanguage(lng)}
            aria-label={t(`a11y.switchLanguage.${lng}`)}
          >
            {LANGUAGE_LABELS[lng].label}
          </button>
        </Fragment>
      ))}
    </div>
  );
};

export default LanguageSelector;
