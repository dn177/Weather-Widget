// One-shot migration (2026-06-10): splits the monolithic portfolioData.js
// into per-project modules under data/projects/, resolves the four key-based
// projects back to English literals (source of truth lives in the data;
// locale files only carry translations), prunes the now-redundant card keys
// from en.json, and emits the English card strings as input for translation.
//
// Run from the repo root:  npx vite-node scripts/split-portfolio-data.mjs
// NOTE: expects the ORIGINAL monolithic portfolioData.js — do not re-run
// after portfolioData.js has been slimmed to a barrel.
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import {
  portfolioProjects,
} from "../src/sections/portfolio/portfolioData.js";

const EN_PATH = "src/i18n/locales/en.json";
const PROJECTS_DIR = "src/sections/portfolio/data/projects";
const en = JSON.parse(readFileSync(EN_PATH, "utf8"));

// "projects.quantum-performance.title" -> en.projects["quantum-performance"].title
const resolveKey = (val) => {
  if (typeof val !== "string" || !val.startsWith("projects.")) return val;
  const resolved = val.split(".").reduce((obj, key) => obj?.[key], en);
  if (resolved === undefined) {
    throw new Error(`Unresolvable i18n key in data: ${val}`);
  }
  return resolved;
};

const varName = (id) => `p_${id.replace(/[^a-zA-Z0-9]/g, "_")}`;

mkdirSync(PROJECTS_DIR, { recursive: true });
mkdirSync("scripts", { recursive: true });

const ids = [];
const enFragment = {};

for (const project of portfolioProjects) {
  const resolved = {
    ...project,
    title: resolveKey(project.title),
    description: resolveKey(project.description),
    highlights: (project.highlights ?? []).map(resolveKey),
    links: (project.links ?? []).map((link) => ({
      ...link,
      label: resolveKey(link.label),
    })),
  };
  ids.push(project.id);
  enFragment[project.id] = {
    title: resolved.title,
    description: resolved.description,
    highlights: resolved.highlights,
    links: resolved.links.map((l) => l.label),
  };

  const banner =
    `// Auto-split from portfolioData.js (2026-06-10).\n` +
    `// Card fields (title, description, highlights, link labels) are the\n` +
    `// English source text; locale overrides live in src/i18n/locales/*.json\n` +
    `// under "projects.${project.id}". Case-study (detailedContent) text is\n` +
    `// English by design for now.\n`;
  writeFileSync(
    `${PROJECTS_DIR}/${project.id}.js`,
    `${banner}const project = ${JSON.stringify(resolved, null, 2)};\n\nexport default project;\n`,
  );
}

const imports = ids
  .map((id) => `import ${varName(id)} from "./${id}.js";`)
  .join("\n");
writeFileSync(
  `${PROJECTS_DIR}/index.js`,
  `// Assembled in display-independent source order; the grid sorts by\n// sortOrder (see ../../portfolioData.js helpers).\n${imports}\n\nexport const portfolioProjects = [\n${ids.map((id) => `  ${varName(id)},`).join("\n")}\n];\n`,
);

// English card strings for the translators (temporary working file).
writeFileSync(
  "scripts/_project-cards-en.json",
  JSON.stringify(enFragment, null, 2) + "\n",
);

// Prune the four now-redundant card-key blocks from en.json (English now
// comes from the data literals via getTranslatedProject's defaultValue).
const previouslyKeyed = [
  "quantum-performance",
  "33",
  "release-radar",
  "markdown-downloader",
];
if (en.projects) {
  for (const id of previouslyKeyed) delete en.projects[id];
  if (Object.keys(en.projects).length === 0) delete en.projects;
}
writeFileSync(EN_PATH, JSON.stringify(en, null, 2) + "\n");

console.log(`split ${ids.length} projects -> ${PROJECTS_DIR}`);
