import "./learning.css";
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";

// Assets are now in public directory
const PUBLIC_URL = process.env.PUBLIC_URL || '';
const LEARNING_PATH = PUBLIC_URL + '/Learning/';
const Book1 = LEARNING_PATH + "JSDefGuide.jpeg";
const Book2 = LEARNING_PATH + "EloquentJs.jpeg";
const Book3 = LEARNING_PATH + "CleanCode.jpeg";
const Book4 = LEARNING_PATH + "LearningReact.jpeg";
const Book5 = LEARNING_PATH + "JSPatterns.jpeg";
const Book6 = LEARNING_PATH + "HighPerformance.jpeg";
const Book7 = LEARNING_PATH + "IntroAlgo.jpeg";
const Book8 = LEARNING_PATH + "SQL.jpeg";
const Book9 = LEARNING_PATH + "JavaInsel.jpeg";
const Book10 = LEARNING_PATH + "C++.jpg";
const Book11 = LEARNING_PATH + "Websocket.webp";
const Site1 = LEARNING_PATH + "MediumLogo.png";
const fem = LEARNING_PATH + "frontendmasters.svg";
const ereact = LEARNING_PATH + "EpicReact.png";
// const Site2 = LEARNING_PATH + "dailydev.png";
// const Site3 = LEARNING_PATH + "freecodecamp.png";

const StanfordLogo = PUBLIC_URL + "/AISources/SE-StanfordOnline.png";

const aiSources = [
  {
    id: "mlst",
    label: "ML Street Talk",
    href: "https://www.youtube.com/@MachineLearningStreetTalk",
  },
  {
    id: "jbhuang",
    label: "Jia-Bin Huang",
    href: "https://www.youtube.com/@jbhuang0604",
  },
  {
    id: "3b1b",
    label: "3Blue1Brown",
    href: "https://www.youtube.com/c/3blue1brown",
  },
];

function Learning() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="ai-sources" aria-label="AI learning sources">
        <p className="ai-sources__title">
          {t("learning.aiSourcesTitle", "AI Input Sources")}
        </p>
        <a
          href="https://www.youtube.com/@stanfordonline/featured"
          target="_blank"
          rel="noopener noreferrer"
          className="ai-sources__stanford"
          aria-label="Stanford Online YouTube channel"
        >
          <img
            src={StanfordLogo}
            alt="Stanford Engineering"
            loading="lazy"
            width="280"
            height="100"
          />
        </a>
        <div className="ai-sources__grid">
          {aiSources.map((source) => (
            <a
              key={source.id}
              href={source.href}
              target="_blank"
              rel="noopener noreferrer"
              className="ai-source"
              aria-label={source.label}
            >
              <span className="ai-source__label">{source.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="learning__books d-none d-md-flex">
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"4"}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: true,
          }}
          pagination={true}
          navigation={true}
          modules={[EffectCoverflow, Navigation, Pagination]}
          className="mySwiper"
        >
          <SwiperSlide>
            <img
              src={Book1}
              alt="JavaScript: The Definitive Guide"
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Book2} alt="Eloquent JavaScript" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Book3} alt="Clean Code" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Book4} alt="Learning React" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Book5}
              alt="JavaScript Patterns: Build Better Applications with Coding and Design
              Patterns"
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Book6} alt="High Performance Websites" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Book7} alt="Introduction to Algorithms" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img src={Book11} alt="The WebSocket Handbook" loading="lazy" />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Book8}
              alt="Einführung in SQL: Daten erzeugen, bearbeiten und abfragen"
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Book9}
              alt="Java ist auch eine Insel: Das Standardwerk für Programmierer."
              loading="lazy"
            />
          </SwiperSlide>
          <SwiperSlide>
            <img
              src={Book10}
              alt="C++: Das umfassende Handbuch zu Modern C++ – aktuell zu C++"
              loading="lazy"
            />
          </SwiperSlide>
        </Swiper>
        {/* <img
          src={Book1}
          alt="JavaScript: The Definitive Guide"
          loading="lazy"
        />
        <img src={Book2} alt="Eloquent JavaScript" loading="lazy" />
        <img src={Book3} alt="Clean Code" loading="lazy" />
        <img src={Book4} alt="Learning React" loading="lazy" /> */}
      </div>
      <div className="devcard-wrapper">
        <a href="https://app.daily.dev/cdic">
          <img
            src="https://api.daily.dev/devcards/v2/oLymVhsGvNElARKJey2MR.png?type=default&r=6yt"
            className="devcard-img"
            alt="Daniel Marass's Dev Card"
          />
        </a>
        <a
          href="https://www.google.com/url?sa=t&source=web&rct=j&opi=89978449&url=https://www.epicreact.dev/&ved=2ahUKEwj7gMyJ4PaJAxWlSvEDHfn-LMgQFnoECA8QAQ&usg=AOvVaw1hEflH7Sft3aPkSpsP4vi5"
          rel="noreferrer"
          target="_blank"
        >
          <img src={ereact} alt="Epic React" loading="lazy" />
        </a>
      </div>
      <div className="fem mt-row">
        <a href="https://frontendmasters.com" target="_blank" rel="noreferrer">
          <img src={fem} alt="Frontend Masters" loading="lazy" />
        </a>
      </div>
      <div className="learning_sites mt-row">
        <h3 className="text-center">
          {t('learning.mediumArticlesText')}
        </h3>
        <a
          href="https://medium.com/@cddm/lists"
          rel="noreferrer"
          target="_blank"
        >
          <img src={Site1} alt="Medium" loading="lazy" />
        </a>
      </div>
    </div>
  );
}

export default Learning;
