import "./portfolio.css";
import Projects from "./Projects";
import ProjectsCategories from "./ProjectsCategories";
import data from "./data";
import React, { useState } from "react";

const Portfolio = () => {
  const [projects, setProjects] = useState(data);

  const categories = data.map((item) => item.category);
  const uniqueCategories = ["all", ...new Set(categories)];

  const filterProjectsHandler = (category) => {
    if (category === "all") {
      setProjects(data);
      return;
    }

    const filterProjects = data.filter(
      (project) => project.category === category
    );
    setProjects(filterProjects);
  };

  return (
    <section id="portfolio">
      <h2>Projects</h2>
      <p className="mt-3">
        Check out some of the projects I worked on for my clients who agreed for
        such a represantative usage (or often rather own private projects). The
        buttons below toggle different categories.
        <div className="header_oldportfolio">
          You can also take a look at my
          <a
            className="fst-italic"
            href="https://www.cdtio.com"
            target="_blank"
            rel="noreferrer"
          >
            &nbsp;old playground portfolio&nbsp;
          </a>
          Website.
        </div>
      </p>
      <div className="container portfolio__container">
        <ProjectsCategories
          categories={uniqueCategories}
          onFilterProjects={filterProjectsHandler}
        />
        <Projects projects={projects} />
      </div>
    </section>
  );
};

export default Portfolio;
