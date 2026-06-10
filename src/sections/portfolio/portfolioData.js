// portfolioData.js — public API of the portfolio data layer.
// The projects themselves live one-per-file in ./data/projects/ (split from
// the former 1,700-line monolith, 2026-06-10). Card-level text (title,
// description, highlights, link labels) is English source text in the data;
// translations live in src/i18n/locales/*.json under "projects.<id>" and are
// resolved by getTranslatedProject (projectTranslations.js).
import { portfolioProjects } from "./data/projects";

export { portfolioProjects };

// Define main technology categories
export const techCategories = {
  all: { label: "All", color: "#6b7280" },
  "ai-ml": { label: "AI/ML", color: "#9333ea" },
  react: { label: "React", color: "#61DAFB" },
  vue: { label: "Vue.js", color: "#4FC08D" },
  nodejs: { label: "Node.js", color: "#339933" },
  php: { label: "PHP", color: "#777BB4" },
  electron: { label: "Electron", color: "#47848F" },
  nextjs: { label: "Next.js", color: "#000000" },
};

// Helper functions for filtering and sorting
const bySortOrder = (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0);

export const getProjectsByTechnology = (tech) => {
  const filtered =
    tech === "all"
      ? portfolioProjects
      : portfolioProjects.filter((project) => {
          if (project.mainTech === tech) return true;
          if (project.tags && project.tags.includes(tech)) return true;
          return false;
        });
  return [...filtered].sort(bySortOrder);
};

export const getAllTechnologies = () => {
  const techSet = new Set();
  portfolioProjects.forEach((project) => {
    project.technologies.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

export const getProjectsByCategory = (category) =>
  portfolioProjects.filter((project) => project.category === category);

export const getFeaturedProjects = () =>
  portfolioProjects.filter((project) => project.featured);

export const sortProjectsByDate = (projects) =>
  [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));

export default portfolioProjects;
