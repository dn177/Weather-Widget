import { useEffect, useRef, useState } from "react";
import { useTranslation } from 'react-i18next';
import "./sustainability.css";

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
    console.log(isIntersectingSus);
    observer.observe(intersectionSusRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isIntersectingSus) {
      // const crown = crownRef.current;
      // crown.classlist.add("intersect");
      document.querySelector(".crown").classList.add("intersect");
    } else {
      document.querySelector(".crown").classList.remove("intersect");
    }
  }, [isIntersectingSus]);

  return (
    <section id="sustainability" style={{ 
      backgroundImage: `url(${process.env.PUBLIC_URL}/Nature.jpg)` 
    }}>
      <h1 className="text-center text-white h1">{t('sustainability.title')}</h1>
      <p className="fs-4 mt-4">{t('sustainability.subtitle')}</p>
      <div
        className="sustainability__principles w-100 w-md-75 mx-2 mx-md-auto"
        ref={intersectionSusRef}
      >
        <p className="h4 mb-5 lh-lg">
          {t('sustainability.mainText')}
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
