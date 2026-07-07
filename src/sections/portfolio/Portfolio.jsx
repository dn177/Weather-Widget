import "./portfolio.css";
import Projects from "./Projects";
import ProjectsCategories from "./ProjectsCategories";
import { techCategories, getProjectsByTechnology } from "./portfolioData";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import { useSearchParams } from "react-router-dom";
import Typewriter from "../../lib/Typewriter";
// Assets are now in public directory

// Get unique technologies for filtering
const technologies = Object.keys(techCategories);

const Portfolio = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  // ?tech= backs the active filter so a filtered view survives a reload or
  // share; an unrecognized value falls back to "all" (mirrors ?lang=, see
  // src/i18n/urlLanguageDetector.js).
  const requestedTech = searchParams.get("tech");
  const activeTech = technologies.includes(requestedTech) ? requestedTech : "all";

  const projects = useMemo(
    () => getProjectsByTechnology(activeTech),
    [activeTech],
  );

  const filterProjectsHandler = useCallback(
    (technology) => {
      // Functional update preserves other params (e.g. ?lang=) already in
      // the URL. "all" is the default, so omit the param entirely for it.
      setSearchParams((params) => {
        if (technology === "all") {
          params.delete("tech");
        } else {
          params.set("tech", technology);
        }
        return params;
      });
    },
    [setSearchParams],
  );

  return (
    <section id="portfolio">
      <a
        href="https://explainshell.com/explain?cmd=curl+-sv+https%3A%2F%2Fwww.cdtio.com%2F+--stderr+-+%7C+grep+Portfolio"
        target="_blank"
        rel="noreferrer"
        className="text-center d-block typewriter-wrapper"
        aria-label={`${t('portfolio.typewriter')} (${t('a11y.opensExplainshell')})`}
      >
        <Typewriter
          text={t('portfolio.typewriter')}
          delay={80}
          infinite
          className="typewriter"
        />
      </a>
      <h2 className="h1 mt-5">{t('portfolio.title')}</h2>
      <div className="container portfolio__container">
        <ProjectsCategories
          categories={technologies}
          onFilterProjects={filterProjectsHandler}
          activeTech={activeTech}
        />
        {/* Live filter feedback: entry count as a catalog colophon with
            flanking gold hairlines (mirrors the archive group row) */}
        <p className="pf-count" aria-live="polite">
          <span>
            <span className="pf-count__mark" aria-hidden="true">
              §{" "}
            </span>
            {t('portfolio.entries', { count: projects.length })}
          </span>
        </p>
        <Projects projects={projects} activeTech={activeTech} />
      </div>
    </section>
  );
};

export default Portfolio;
