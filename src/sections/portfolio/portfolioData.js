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
  all: { label: "All" },
  "ai-ml": { label: "AI/ML" },
  react: { label: "React" },
  vue: { label: "Vue.js" },
  nodejs: { label: "Node.js" },
  php: { label: "PHP" },
  electron: { label: "Electron" },
  nextjs: { label: "Next.js" },
};

// Grid tiers: 1 = flagship feature card, 2 = index card, 3 = archive ledger.
export const getTier = (p) => (p.flagship ? 1 : p.featured ? 2 : 3);

// First sentence of a text, used as the card one-liner fallback when a
// project has no curated summary. Falls back to the whole string when
// there is no ". " delimiter.
export const firstSentence = (text) => {
  if (!text) return "";
  return text.split(". ")[0];
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
