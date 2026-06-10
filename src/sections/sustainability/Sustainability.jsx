import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import "./sustainability.css";

const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");

function Sustainability() {
  const { t } = useTranslation();
  const intersectionSusRef = useRef(null);
  const [isIntersectingSus, setIsIntersectingSus] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersectingSus(entry.isIntersecting);
      },
      { rootMargin: "-200px 0px" }
    );
    observer.observe(intersectionSusRef.current);
    return () => observer.disconnect();
  }, []);

  // NOTE: cross-component coupling — the .crown element is rendered by
  // Header, and this section animates it while it scrolls into view. Kept
  // for now (null-safe); a shared state/event would be the clean fix.
  useEffect(() => {
    const crown = document.querySelector(".crown");
    if (!crown) return;
    crown.classList.toggle("intersect", isIntersectingSus);
  }, [isIntersectingSus]);

  return (
    <section id="sustainability" style={{ 
      backgroundImage: `url(${PUBLIC_URL}/Nature.jpg)`
    }}>
      <h2 className="text-center text-white h1">{t('sustainability.title')}</h2>
      <p className="fs-4 mt-4">{t('sustainability.subtitle')}</p>
      <div
        className="sustainability__principles w-100 w-md-75 mx-2 mx-md-auto"
        ref={intersectionSusRef}
      >
        <p className="h4 mb-4 lh-lg">
          {t('sustainability.mainText')}
        </p>
        <p className="h6 mb-5 lh-lg fst-italic sustainability__onprem">
          {t('sustainability.onPremNote')}
        </p>
        <div className="sustainability__principles-entry mb-4">
          <p className="h2">{t('sustainability.carbonEfficiency.title')}</p>
          <p>{t('sustainability.carbonEfficiency.description')}</p>
        </div>
        <div className="sustainability__principles-entry mb-4">
          <p className="h2">{t('sustainability.electricityEfficiency.title')}</p>
          <p>{t('sustainability.electricityEfficiency.description')}</p>
        </div>
        <div className="sustainability__principles-entry mb-4">
          <p className="h2">{t('sustainability.carbonAwareness.title')}</p>
          <p>{t('sustainability.carbonAwareness.description')}</p>
        </div>
        <div className="sustainability__principles-entry mb-4">
          <p className="h2">{t('sustainability.hardwareEfficiency.title')}</p>
          <p>{t('sustainability.hardwareEfficiency.description')}</p>
        </div>
        <div className="sustainability__principles-entry mb-4">
          <p className="h2">{t('sustainability.measurement.title')}</p>
          <p>{t('sustainability.measurement.description')}</p>
        </div>
        <div className="sustainability__principles-entry mb-4">
          <p className="h2">{t('sustainability.climateCommitments.title')}</p>
          <p>{t('sustainability.climateCommitments.description')}</p>
        </div>
      </div>
    </section>
  );
}

export default Sustainability;
