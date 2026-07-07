import { describe, it, expect } from "vitest";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { portfolioProjects, techCategories, getTier } from "./portfolioData";

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

  // Grid redesign contract: tier 1 is a small, deliberate set of flagship
  // case studies, and every flagship carries the fields its wide card needs.
  it("marks exactly the intended flagship projects", () => {
    const flagshipIds = portfolioProjects
      .filter((p) => p.flagship)
      .map((p) => p.id)
      .sort();
    expect(flagshipIds).toEqual(
      [
        "belay",
        "dflash-retrain",
        "nutrition-rag-autonomous",
        "ornith-optimization",
        "quantum-performance",
        "sparkfit-quant",
      ].sort()
    );
  });

  it("keeps the flagship count between 2 and 6", () => {
    const flagships = portfolioProjects.filter((p) => p.flagship);
    expect(flagships.length).toBeGreaterThanOrEqual(2);
    expect(flagships.length).toBeLessThanOrEqual(6);
  });

  it("gives every flagship a summary (<= 220 chars) and a stat", () => {
    const violations = [];
    for (const project of portfolioProjects.filter((p) => p.flagship)) {
      if (typeof project.summary !== "string" || !project.summary.trim())
        violations.push(`${project.id}: missing summary`);
      else if (project.summary.length > 220)
        violations.push(
          `${project.id}: summary is ${project.summary.length} chars (max 220)`
        );
      if (
        typeof project.stat?.value !== "string" ||
        typeof project.stat?.label !== "string"
      )
        violations.push(`${project.id}: missing stat {value, label}`);
    }
    expect(violations).toEqual([]);
  });

  it("keeps non-flagship summaries at one-liner length (<= 110 chars)", () => {
    const violations = portfolioProjects
      .filter((p) => !p.flagship && typeof p.summary === "string")
      .filter((p) => p.summary.length > 110)
      .map((p) => `${p.id}: summary is ${p.summary.length} chars (max 110)`);
    expect(violations).toEqual([]);
  });

  it("gives every stat a non-empty string value and label", () => {
    const violations = [];
    for (const project of portfolioProjects) {
      if (project.stat === undefined) continue;
      const { value, label } = project.stat ?? {};
      if (typeof value !== "string" || !value.trim())
        violations.push(`${project.id}: stat.value is not a non-empty string`);
      if (typeof label !== "string" || !label.trim())
        violations.push(`${project.id}: stat.label is not a non-empty string`);
    }
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

  it("gives every project link a known type and a non-empty url", () => {
    const knownTypes = new Set(["github", "live", "article"]);
    const violations = [];
    for (const project of portfolioProjects) {
      for (const link of project.links ?? []) {
        if (!knownTypes.has(link.type))
          violations.push(`${project.id}: unknown link type "${link.type}"`);
        if (typeof link.url !== "string" || !link.url.trim())
          violations.push(`${project.id}: link "${link.type}" has no url`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("keeps highlights and links as arrays on every project", () => {
    const violations = [];
    for (const project of portfolioProjects) {
      if (!Array.isArray(project.highlights))
        violations.push(`${project.id}: highlights is not an array`);
      if (!Array.isArray(project.links))
        violations.push(`${project.id}: links is not an array`);
    }
    expect(violations).toEqual([]);
  });

  it("resolves every project to a valid grid tier", () => {
    const violations = portfolioProjects
      .filter((p) => ![1, 2, 3].includes(getTier(p)))
      .map((p) => `${p.id}: getTier returned ${getTier(p)}`);
    expect(violations).toEqual([]);
  });

  it("gives every project a numeric sortOrder", () => {
    const violations = portfolioProjects
      .filter(
        (p) => typeof p.sortOrder !== "number" || Number.isNaN(p.sortOrder)
      )
      .map((p) => `${p.id}: sortOrder is not a number`);
    expect(violations).toEqual([]);
  });
});
