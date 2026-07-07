import { useTranslation } from 'react-i18next';
import "./hustle.css";

// Assets are now in public directory
const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const HUSTLE_PATH = PUBLIC_URL + '/Hustle/';

function Hustle() {
  const { t } = useTranslation();
  
  return (
    <section id="hustle">
      <div className="container-2 mx-auto">
        <h2 className="text-center text-white h1">
          {t('hustle.title')}
        </h2>
        <p className="text-center text-white fs-4 mt-4 mb-headline">{t('hustle.subtitle')}</p>
        <div className="row mb-row">
          <div className="flip-wrapper">
            {/* <img
              loading="lazy"
              src={HustleImg}
              className="mh-100vh flip-frontside"
              alt="Hustle"
            /> */}
            <img
              loading="lazy"
              className="mh-100vh flip-frontside"
              src={HUSTLE_PATH + "Hustle800w.webp"}
              srcSet={`${HUSTLE_PATH}Hustle400w.png 400w, 
             ${HUSTLE_PATH}Hustle800w.webp 800w, 
             ${HUSTLE_PATH}Hustle1200w.webp 1200w`}
              sizes="(max-width: 400px) 400px, 
            (max-width: 800px) 800px, 
            1200px"
              alt="Hustle"
            />
            <img
              loading="lazy"
              src={HUSTLE_PATH + "Hustle2.jpg"}
              className="mh-100vh flip-backside"
              alt="Modern Hustle"
            />
          </div>
        </div>
        {/* <div className="row mb-2 fs-4">
          <p className="text-white mb-0">
            While the equipment changed, the motivation didn't:
          </p>
        </div> */}
        <div className="row"></div>
      </div>
    </section>
  );
}

export default Hustle;
