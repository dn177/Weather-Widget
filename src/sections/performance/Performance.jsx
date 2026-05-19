import { useTranslation } from 'react-i18next';
import "./performance.css";
// Assets are now in public directory
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const PERFORMANCE_PATH = PUBLIC_URL + '/Performance/';
const Lazy = PERFORMANCE_PATH + "Lazy.jpg";
const NoLazy = PERFORMANCE_PATH + "Nolazy.jpg";
const Lighthouse = PERFORMANCE_PATH + "Lighthouse.png";

function Performance() {
  const { t } = useTranslation();
  
  return (
    <section id="performance">
      <div className="container-2 mx-auto">
        <h4 className="text-center text-white h1 mb-headline">{t('performance.title')}</h4>

        <div className="row mb-2 fs-4">
          <p className="text-white mb-0 px-0">{t('performance.before')}</p>
        </div>
        <div className="row mb-row">
          <img
            loading="lazy"
            class="px-0"
            src={NoLazy}
            alt="Before Performance Optimization"
          />
        </div>
        <div className="row mb-2 fs-4">
          <p className="text-white mb-0 px-0">{t('performance.afterOptimization')}</p>
        </div>
        <div className="row mb-row">
          <img
            loading="lazy"
            class="px-0"
            src={Lazy}
            alt="After 1h of Performance Optimization"
          />
        </div>
        <div className="row mb-2 fs-4">
          <p className="text-white mb-0 px-0">
            {t('performance.measuredWith')}
          </p>
        </div>
        <div className="row mb-row">
          <img
            loading="lazy"
            class="px-0"
            src={Lighthouse}
            alt="Website performance measured with Google Lighthouse"
          />
        </div>
        <div className="row justify-content-end">
          <small class="w-fit-content">{t('performance.measuredNote')}</small>
        </div>
      </div>
    </section>
  );
}

export default Performance;
