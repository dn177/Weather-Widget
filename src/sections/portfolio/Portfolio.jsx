import "./portfolio.css";
import Projects from "./Projects";
import ProjectsCategories from "./ProjectsCategories";
import ScrollBehaviorToggle from "./ScrollBehaviorToggle";
import { techCategories, getProjectsByTechnology } from "./portfolioData";
import React, { useState, useCallback } from "react";
import { useTranslation } from 'react-i18next';
import Learning from "../learning/Learning";
import Typewriter from "../../lib/Typewriter";
// Assets are now in public directory

const Portfolio = () => {
  const { t } = useTranslation();
  const [projects, setProjects] = useState(() => getProjectsByTechnology("all"));
  const [activeTech, setActiveTech] = useState("all");
  const [scrollBehavior, setScrollBehavior] = useState("contain");

  // Get unique technologies for filtering
  const technologies = Object.keys(techCategories);

  const filterProjectsHandler = useCallback((technology) => {
    setActiveTech(technology);
    const filteredProjects = getProjectsByTechnology(technology);
    setProjects(filteredProjects);
  }, []);

  return (
    <section id="portfolio">
      <a
        href="https://explainshell.com/explain?cmd=curl+-sv+https%3A%2F%2Fwww.cdtio.com%2F+--stderr+-+%7C+grep+Portfolio"
        target="_blank"
        rel="noreferrer"
        className="text-reset text-decoration-none text-center d-block typewriter-wrapper"
        aria-label="Shell command explanation link"
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
        <ScrollBehaviorToggle onChange={setScrollBehavior} />
        <ProjectsCategories
          categories={technologies}
          techCategories={techCategories}
          onFilterProjects={filterProjectsHandler}
          activeTech={activeTech}
        />
        <Projects projects={projects} scrollBehavior={scrollBehavior} />
      </div>
      <h2 className="h1 mt-row">Input</h2>
      <div className="container portfolio__container">
        <Learning />
      </div>
    </section>
  );
};

export default Portfolio;