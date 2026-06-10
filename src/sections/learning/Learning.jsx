/* eslint-disable no-script-url -- the core rule false-positives on
   alt="JavaScript: The Definitive Guide" (a book title, not a URL);
   this file contains no actual script URLs. */
import "./learning.css";
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";
import { EffectCoverflow, Navigation, Pagination } from "swiper/modules";

// Assets are now in public directory
const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
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
    number: "01",
    label: "ML Street Talk",
    href: "https://www.youtube.com/@MachineLearningStreetTalk",
  },
  {
    id: "jbhuang",
    number: "02",
    label: "Jia-Bin Huang",
    href: "https://www.youtube.com/@jbhuang0604",
  },
  {
    id: "3b1b",
    number: "03",
    label: "3Blue1Brown",
    href: "https://www.youtube.com/c/3blue1brown",
  },
  {
    id: "karpathy",
    number: "04",
    label: "Andrej Karpathy",
    href: "https://www.youtube.com/andrejkarpathy",
  },
  {
    id: "arxiv-cscl",
    number: "05",
    label: "arXiv · cs.CL",
    href: "https://arxiv.org/list/cs.CL/recent",
  },
];

function Learning() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="ai-sources" aria-label="AI learning sources" role="region">
        <div className="ai-sources__header">
          <span className="ai-sources__rule" aria-hidden="true" />
          <p className="ai-sources__eyebrow">
            <span className="ai-sources__diamond" aria-hidden="true">◆</span>
            {t("learning.aiSourcesTitle", "AI Input Sources")}
            <span className="ai-sources__diamond" aria-hidden="true">◆</span>
          </p>
          <span className="ai-sources__rule" aria-hidden="true" />
        </div>

        <a
          href="https://www.youtube.com/@stanfordonline/featured"
          target="_blank"
          rel="noopener noreferrer"
          className="ai-sources__stanford"
          aria-label="Stanford Online YouTube channel"
        >
          <span className="ai-sources__featured-tag">
            <span className="ai-sources__featured-no">00</span>
            <span className="ai-sources__featured-text">Featured</span>
          </span>
          <img
            src={StanfordLogo}
            alt="Stanford Engineering"
            loading="lazy"
            width="280"
            height="100"
          />
          <span className="ai-sources__featured-meta">
            youtube.com/@stanfordonline
            <span className="ai-sources__arrow" aria-hidden="true">↗</span>
          </span>
        </a>

        <ul className="ai-sources__list">
          {aiSources.map((source) => (
            <li key={source.id} className="ai-source__item">
              <a
                href={source.href}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-source"
                aria-label={source.label}
              >
                <span className="ai-source__number">{source.number}</span>
                <span className="ai-source__name">{source.label}</span>
                <span className="ai-source__arrow" aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>
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
        <a href="https://frontendmasters.com" target="_blank" rel="noreferrer">
          <img src={fem} alt="Frontend Masters" loading="lazy" />
        </a>
      </div>
      <div className="ereact mt-row">
        <a
          href="https://www.epicreact.dev/"
          rel="noreferrer"
          target="_blank"
        >
          <img src={ereact} alt="Epic React" loading="lazy" />
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
      <div className="learning_sites mt-row">
        <a
          href="https://leetcard.jacoblin.cool/cdtio?font=Lora"
          rel="noreferrer"
          target="_blank"
          aria-label="LeetCode stats card"
        >
          <img
            src="https://leetcard.jacoblin.cool/cdtio?font=Lora"
            alt="LeetCode stats"
            loading="lazy"
            width="100%"
            height="auto"
          />
        </a>
      </div>
    </div>
  );
}

export default Learning;
