import React from "react";
import { useTranslation } from 'react-i18next';
import "./badges.css";
import Typewriter from "../../lib/Typewriter";

// Assets are now in public directory
const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const BADGES_PATH = PUBLIC_URL + '/Badges/';
const JBadge = BADGES_PATH + "JBadge.png";
const FBadge = BADGES_PATH + "FrontendBadge.png";
const CBadge = BADGES_PATH + "CSSBadge.png";

function Badges() {
  const { t } = useTranslation();
  
  return (
    <section id="badges">
      <div className="container-2 mx-auto">
        <a
          href="https://explainshell.com/explain?cmd=git+reset+--hard+blablabla"
          target="_blank"
          rel="noreferrer"
          className="text-reset text-decoration-none text-center d-block typewriter-wrapper"
          aria-label="Shell command explanation link"
        >
          <Typewriter
            text={t('badges.typewriter')}
            delay={80}
            infinite
            className="typewriter"
          />
        </a>
        <h2 className="text-center h1 mb-headline mt-4">
          {t('badges.title')}
        </h2>
        <p className="text-center fs-4 mt-4">{t('badges.subtitle')}</p>
        <div className="img-wrapper d-flex justify-content-between mx-auto">
          <img
            loading="lazy"
            className="badge-img"
            src={FBadge}
            alt="Frontend Badge"
          />
          <img
            loading="lazy"
            className="badge-img"
            // src={require("../../assets/Badges/jQueryBadge.png")}
            src={JBadge}
            alt="jQuery Badge"
          />
          <img
            loading="lazy"
            className="badge-img"
            src={CBadge}
            alt="CSS Badge"
          />
        </div>
      </div>
    </section>
  );
}

export default Badges;
