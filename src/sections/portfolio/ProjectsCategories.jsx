import { useCallback } from "react";
import { useTranslation } from 'react-i18next';
import CategoryButton from "./CategoryButton";

const ProjectsCategories = ({ categories, techCategories, onFilterProjects, activeTech }) => {
  const { t } = useTranslation();

  const changeCategoryHandler = useCallback((tech) => {
    onFilterProjects(tech);
  }, [onFilterProjects]);

  return (
    <div className="portfolio__categories" role="tablist" aria-label="Technology filters">
      {categories.map((tech) => {
        const techInfo = techCategories[tech];
        return (
          <CategoryButton
            key={tech}
            category={t(`portfolio.categories.${tech}`)}
            techColor={techInfo.color}
            onChangeCategory={() => changeCategoryHandler(tech)}
            className={`btn tech__btn ${
              activeTech === tech ? "active" : ""
            }`}
            aria-selected={activeTech === tech}
            role="tab"
          />
        );
      })}
    </div>
  );
};

export default ProjectsCategories;