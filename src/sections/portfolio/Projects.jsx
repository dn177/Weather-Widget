import { useState } from "react";
import { useTranslation } from "react-i18next";
import Project from "./Project";
import WeatherGrid from "../weather/Weather";

// Featured projects render by default; everything older lives behind the
// "Earlier work" expander together with the live weather demo widget
// (UX-REVIEW #1/#4 — the widget used to interrupt the grid via index math).
const Projects = ({ projects, scrollBehavior = "contain" }) => {
  const { t } = useTranslation();
  const [showEarlier, setShowEarlier] = useState(false);

  const featured = projects.filter((p) => p.featured);
  const earlier = projects.filter((p) => !p.featured);

  const gridClassName = `portfolio__projects ${
    projects.length <= 2 ? "portfolio__projects--few" : ""
  }`;

  return (
    <>
      <div className={gridClassName}>
        {featured.map((project) => (
          <Project
            key={project.id}
            project={project}
            scrollBehavior={scrollBehavior}
          />
        ))}
        {showEarlier &&
          earlier.map((project) => (
            <Project
              key={project.id}
              project={project}
              scrollBehavior={scrollBehavior}
            />
          ))}
        {showEarlier && <WeatherGrid key="weather-grid" />}
      </div>

      {earlier.length > 0 && (
        <div className="portfolio__load-more">
          <button
            className="btn btn-outline-primary portfolio__load-more-btn mx-auto"
            onClick={() => setShowEarlier((v) => !v)}
            aria-expanded={showEarlier}
          >
            {showEarlier
              ? t("portfolio.hideEarlier")
              : `${t("portfolio.showEarlier")} (${earlier.length})`}
          </button>
        </div>
      )}
    </>
  );
};

export default Projects;
