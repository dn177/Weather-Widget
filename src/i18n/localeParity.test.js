import { describe, it, expect } from "vitest";
import { portfolioProjects } from "../sections/portfolio/portfolioData";
import en from "./locales/en.json";
import de from "./locales/de.json";
import pl from "./locales/pl.json";
import es from "./locales/es.json";

const ALL_LOCALES = { en, de, pl, es };
const TRANSLATED_LOCALES = { de, pl, es };

// Projects whose card fields may stay English on purpose. Must be empty
// after the i18n consistency fix lands; the drift guard exists so a new
// project cannot ship untranslated by accident (Forgejo issue #5).
const ENGLISH_BY_DESIGN = [];

// UI keys introduced by the i18n consistency fix. Grown by later tasks;
// every locale must carry every one of them.
const REQUIRED_UI_KEYS = [
  "portfolio.caseStudyKicker",
  "portfolio.inputTitle",
  "learning.featured",
  "learning.aiSourcesTitle",
  "common.videoUnsupported",
  "a11y.toggleNavigation",
  "a11y.closeModal",
  "a11y.technologyFilters",
  "a11y.caseStudySections",
  "a11y.quickActions",
  "a11y.shellCommandLink",
  "a11y.aiLearningSources",
  "a11y.stanfordChannel",
  "a11y.switchLanguage.en",
  "a11y.switchLanguage.de",
  "a11y.switchLanguage.pl",
  "a11y.switchLanguage.es",
  "a11y.social.instagram",
  "a11y.social.twitter",
  "a11y.social.dribbble",
  "a11y.social.github",
  "a11y.social.huggingface",
  "badges.frontendBadgeAlt",
  "badges.jqueryBadgeAlt",
  "badges.cssBadgeAlt",
  "contact.bgAlt",
];

const flatten = (obj, prefix = "") =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      Object.assign(acc, flatten(value, path));
    } else {
      acc[path] = value;
    }
    return acc;
  }, {});

// Every key path getTranslatedProject() consumes for a project. The
// fallback in projectTranslations.js is PER FIELD, so a partial block
// still leaks English; presence of the block alone proves nothing.
const requiredPathsFor = (project) => {
  const base = `projects.${project.id}`;
  return [
    `${base}.title`,
    `${base}.description`,
    `${base}.summary`,
    ...(project.highlights ?? []).map((_, i) => `${base}.highlights.${i}`),
    ...(project.links ?? []).map((_, i) => `${base}.links.${i}`),
    ...(project.stat ? [`${base}.statLabel`] : []),
  ];
};

describe("locale parity", () => {
  const flat = Object.fromEntries(
    Object.entries(ALL_LOCALES).map(([name, tree]) => [name, flatten(tree)])
  );

  it.each(Object.keys(TRANSLATED_LOCALES))(
    "%s translates every field of every project",
    (locale) => {
      const missing = [];
      for (const project of portfolioProjects) {
        if (ENGLISH_BY_DESIGN.includes(project.id)) continue;
        for (const path of requiredPathsFor(project)) {
          if (!(path in flat[locale])) missing.push(path);
        }
      }
      expect(missing).toEqual([]);
    }
  );

  it.each(Object.keys(TRANSLATED_LOCALES))(
    "%s carries every key en.json has",
    (locale) => {
      const missing = Object.keys(flat.en).filter(
        (key) => !(key in flat[locale])
      );
      expect(missing).toEqual([]);
    }
  );

  it.each(Object.keys(ALL_LOCALES))("%s has no empty values", (locale) => {
    const empty = Object.entries(flat[locale])
      .filter(([, value]) => typeof value === "string" && !value.trim())
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it.each(Object.keys(ALL_LOCALES))(
    "%s carries every UI key referenced by the i18n fix",
    (locale) => {
      const missing = REQUIRED_UI_KEYS.filter((key) => !(key in flat[locale]));
      expect(missing).toEqual([]);
    }
  );
});
