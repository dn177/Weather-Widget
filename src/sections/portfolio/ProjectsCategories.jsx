import { useTranslation } from 'react-i18next';
import CategoryButton from "./CategoryButton";

const ProjectsCategories = ({ categories, onFilterProjects, activeTech }) => {
  const { t } = useTranslation();

  // Deliberately NOT the ARIA tabs pattern: these buttons filter a grid
  // rather than switching panels, so they are toggle buttons in a group
  // (aria-pressed) — simpler and honest to assistive tech.
  return (
    <div className="portfolio__categories" role="group" aria-label="Technology filters">
      {categories.map((tech) => {
        return (
          <CategoryButton
            key={tech}
            category={t(`portfolio.categories.${tech}`)}
            techKey={tech}
            onChangeCategory={onFilterProjects}
            className={`btn tech__btn ${
              activeTech === tech ? "active" : ""
            }`}
            isActive={activeTech === tech}
          />
        );
      })}
    </div>
  );
};

export default ProjectsCategories;