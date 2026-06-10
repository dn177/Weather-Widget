import { useState } from "react";
import { useTranslation } from 'react-i18next';
import Project from "./Project";
import WeatherGrid from "../weather/Weather";

const Projects = ({ projects, scrollBehavior = "contain" }) => {
  const { t } = useTranslation();
  const INITIAL_PROJECTS_COUNT = 12; // Show 12 projects initially (excluding weather grid)
  const WEATHER_GRID_POSITION = 4; // Weather grid appears as 5th element (index 4), after first row of 4 projects

  const [visibleProjects, setVisibleProjects] = useState(
    INITIAL_PROJECTS_COUNT
  );

  // Calculate total number of project slots (including weather grid position)
  const totalProjectSlots = projects.length + 1; // +1 for weather grid

  // Function to determine what to render at each position
  const renderItem = (position) => {
    // Adjust project index based on weather grid position
    let projectIndex;
    if (position < WEATHER_GRID_POSITION) {
      projectIndex = position;
    } else if (position === WEATHER_GRID_POSITION) {
      return <WeatherGrid key={`weather-grid`} />;
    } else {
      projectIndex = position - 1; // Offset by 1 after weather grid
    }

    // Check if project exists at this index
    if (projectIndex < projects.length) {
      return (
        <Project
          key={projects[projectIndex].id || projectIndex}
          project={projects[projectIndex]}
          scrollBehavior={scrollBehavior}
        />
      );
    }

    return null;
  };

  // Create array of positions to render
  const positions = Array.from(
    { length: Math.min(visibleProjects + 1, totalProjectSlots) },
    (_, i) => i
  );

  const handleLoadMore = () => {
    setVisibleProjects((prev) => Math.min(prev + 12, projects.length));
  };

  // Check if there are more projects to load
  const hasMoreProjects = visibleProjects < projects.length;

  // Add modifier class when there are very few projects
  const gridClassName = `portfolio__projects ${projects.length <= 2 ? 'portfolio__projects--few' : ''}`;

  return (
    <>
      <div className={gridClassName}>
        {positions.map((position) => renderItem(position))}
      </div>

      {hasMoreProjects && (
        <div className="portfolio__load-more">
          <button
            className="btn btn-outline-primary portfolio__load-more-btn mx-auto"
            onClick={handleLoadMore}
            aria-label="Load more projects"
          >
            {t('portfolio.loadMoreProjects')}
          </button>
        </div>
      )}
    </>
  );
};

export default Projects;
