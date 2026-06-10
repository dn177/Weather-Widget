import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { portfolioProjects, techCategories } from "./portfolioData";

const here = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(here, "..", "..", "..", "public");

// Every media path a project can reference (card media + case-study figures).
const collectMediaPaths = (project) => {
  const paths = [];
  if (project.media?.src) paths.push(project.media.src);
  if (project.media?.poster) paths.push(project.media.poster);
  for (const section of project.detailedContent?.sections ?? []) {
    if (section.image) paths.push(section.image);
    if (section.video) paths.push(section.video);
    if (section.videoPoster) paths.push(section.videoPoster);
  }
  return paths;
};

describe("portfolioData integrity", () => {
  it("has unique project ids", () => {
    const ids = portfolioProjects.map((p) => p.id);
    const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
    expect(duplicates).toEqual([]);
  });

  it("gives every project the required fields", () => {
    const violations = [];
    for (const project of portfolioProjects) {
      if (!project.id) violations.push("missing id");
      if (!project.title) violations.push(`${project.id}: missing title`);
      if (!project.description)
        violations.push(`${project.id}: missing description`);
      if (!Array.isArray(project.technologies) || !project.technologies.length)
        violations.push(`${project.id}: missing technologies`);
      if (!project.media?.src)
        violations.push(`${project.id}: missing media.src`);
    }
    expect(violations).toEqual([]);
  });

  it("uses a known mainTech for every project", () => {
    const known = Object.keys(techCategories);
    const violations = portfolioProjects
      .filter((p) => !known.includes(p.mainTech))
      .map((p) => `${p.id}: unknown mainTech "${p.mainTech}"`);
    expect(violations).toEqual([]);
  });

  // The classic broken-thumbnail-after-rename bug, caught at test time:
  // every referenced media path must resolve to a real file in public/.
  it("references only media files that exist in public/", () => {
    const missing = [];
    for (const project of portfolioProjects) {
      for (const mediaPath of collectMediaPaths(project)) {
        if (/^https?:\/\//.test(mediaPath)) continue;
        const onDisk = join(PUBLIC_DIR, mediaPath.replace(/^\//, ""));
        if (!existsSync(onDisk)) {
          missing.push(`${project.id}: ${mediaPath}`);
        }
      }
    }
    expect(missing).toEqual([]);
  });
});
