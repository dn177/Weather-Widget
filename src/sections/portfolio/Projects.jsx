import React from "react";
import Project from "./Project";
import WeatherGrid from "../weather/Weather";

function Projects({ projects }) {
  return (
    <div className="portfolio__projects">
      {projects.map((project, index) =>
        index === 3 ? (
          <WeatherGrid key={index} />
        ) : (
          <Project key={project.id} project={project} />
        )
      )}
    </div>
  );
}

export default Projects;
