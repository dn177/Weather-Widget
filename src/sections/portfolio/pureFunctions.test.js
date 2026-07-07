import { describe, it, expect, vi } from "vitest";
import { isValidElement } from "react";
import { getProjectsByTechnology, getTier, firstSentence } from "./portfolioData";
import { emphasizeMetrics } from "./emphasizeMetrics.jsx";
import { getTranslatedProject } from "./projectTranslations";
import { normalizeLanguage } from "../../i18n/languages";

// A small synthetic fixture, deliberately independent from the real project
// data so getProjectsByTechnology's mainTech/tags/sort behavior is verified
// without assuming anything about the current 30 real projects (which may
// not contain a tie today but shouldn't break this test if they gain one).
// vi.hoisted because vi.mock's factory is itself hoisted above regular
// top-level const declarations.
const FIXTURE = vi.hoisted(() => [
  { id: "main-match", mainTech: "solo-tech", tags: [], sortOrder: 5 },
  {
    id: "tag-match",
    mainTech: "other-tech",
    tags: ["solo-tech-2"],
    sortOrder: 5,
  },
  { id: "tie-second", mainTech: "tie-tech", tags: [], sortOrder: 10 },
  { id: "tie-first", mainTech: "tie-tech", tags: [], sortOrder: 10 },
  { id: "unrelated", mainTech: "zzz", tags: [], sortOrder: 1 },
]);

// Hoisted by vitest above the imports, so getProjectsByTechnology (which
// closes over the "./data/projects" export) sees this fixture instead of
// the real 30-project catalog.
vi.mock("./data/projects", () => ({ portfolioProjects: FIXTURE }));

describe("getProjectsByTechnology", () => {
  it("matches on mainTech", () => {
    const result = getProjectsByTechnology("solo-tech");
    expect(result.map((p) => p.id)).toEqual(["main-match"]);
  });

  it("matches on tags when mainTech differs", () => {
    const result = getProjectsByTechnology("solo-tech-2");
    expect(result.map((p) => p.id)).toEqual(["tag-match"]);
  });

  it("passes every project through for 'all'", () => {
    const result = getProjectsByTechnology("all");
    expect(result).toHaveLength(FIXTURE.length);
  });

  it("sorts ascending by sortOrder", () => {
    const result = getProjectsByTechnology("all");
    const orders = result.map((p) => p.sortOrder);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });

  it("keeps original relative order for equal sortOrder (stable sort)", () => {
    // "tie-second" precedes "tie-first" in FIXTURE's source order even
    // though the names suggest otherwise; the sort must not reorder them.
    const result = getProjectsByTechnology("tie-tech");
    expect(result.map((p) => p.id)).toEqual(["tie-second", "tie-first"]);
  });
});

describe("getTier", () => {
  it("puts flagship projects in tier 1", () => {
    expect(getTier({ flagship: true, featured: true })).toBe(1);
    expect(getTier({ flagship: true, featured: false })).toBe(1);
  });

  it("puts featured-not-flagship projects in tier 2", () => {
    expect(getTier({ flagship: false, featured: true })).toBe(2);
  });

  it("puts everything else in tier 3", () => {
    expect(getTier({ flagship: false, featured: false })).toBe(3);
    expect(getTier({})).toBe(3);
  });
});

describe("firstSentence", () => {
  it("returns an empty string for falsy input", () => {
    expect(firstSentence(undefined)).toBe("");
    expect(firstSentence(null)).toBe("");
    expect(firstSentence("")).toBe("");
  });

  it("returns the whole string when there is no '. ' delimiter", () => {
    expect(firstSentence("No period here")).toBe("No period here");
  });

  it("returns the first sentence when one is present", () => {
    expect(firstSentence("First sentence. Second sentence. Third.")).toBe(
      "First sentence"
    );
  });
});

describe("emphasizeMetrics", () => {
  it("returns non-strings unchanged", () => {
    expect(emphasizeMetrics(42)).toBe(42);
    expect(emphasizeMetrics(null)).toBe(null);
    expect(emphasizeMetrics(undefined)).toBe(undefined);
  });

  it("returns a string unchanged when nothing matches", () => {
    const text = "Built with Vue 3 and BGE-M3, no measurements here";
    expect(emphasizeMetrics(text)).toBe(text);
  });

  it("wraps a number+unit token", () => {
    const result = emphasizeMetrics("A retina page costs 17 MB per view.");
    const wrapped = result.filter((seg) => isValidElement(seg));
    expect(wrapped).toHaveLength(1);
    expect(wrapped[0].props.className).toBe("cs-metric");
    expect(wrapped[0].props.children).toBe("17 MB");
  });

  it("wraps a comma-grouped count", () => {
    const result = emphasizeMetrics("Served 1,234,567 requests last month.");
    const wrapped = result.filter((seg) => isValidElement(seg));
    expect(wrapped).toHaveLength(1);
    expect(wrapped[0].props.children).toBe("1,234,567");
  });

  it("never highlights tech names like 'Vue 3' or 'BGE-M3'", () => {
    const result = emphasizeMetrics(
      "Vue 3 and BGE-M3 render a page in 17 MB, not more."
    );
    const wrappedText = result
      .filter((seg) => isValidElement(seg))
      .map((seg) => seg.props.children);
    expect(wrappedText).toEqual(["17 MB"]);
    expect(wrappedText).not.toContain("Vue 3");
    expect(wrappedText).not.toContain("BGE-M3");
  });
});

describe("getTranslatedProject", () => {
  // Stub t() that just echoes defaultValue, matching the documented
  // "literal strings pass through unchanged" contract.
  const echoT = (key, opts) => opts.defaultValue;

  it("keeps a literal-string project's fields unchanged", () => {
    const project = {
      id: "literal-project",
      title: "Title Text",
      description: "A description.",
      highlights: ["h1", "h2"],
      links: [{ type: "github", url: "https://example.test", label: "Code" }],
      summary: "Curated summary.",
    };

    const result = getTranslatedProject(project, echoT);

    expect(result.title).toBe("Title Text");
    expect(result.description).toBe("A description.");
    expect(result.highlights).toEqual(["h1", "h2"]);
    expect(result.links).toEqual([
      { type: "github", url: "https://example.test", label: "Code" },
    ]);
    expect(result.summary).toBe("Curated summary.");
  });

  it("falls back the summary to firstSentence(description) when summary is absent", () => {
    const project = {
      id: "no-summary-project",
      title: "T",
      description: "First sentence here. Second sentence.",
      highlights: [],
      links: [],
    };

    const result = getTranslatedProject(project, echoT);

    expect(result.summary).toBe("First sentence here");
  });

  it("only includes stat when the source project has one", () => {
    const withoutStat = {
      id: "no-stat",
      title: "T",
      description: "Text.",
      highlights: [],
      links: [],
    };
    const withStat = {
      ...withoutStat,
      id: "with-stat",
      stat: { value: "42", label: "things measured" },
    };

    expect(getTranslatedProject(withoutStat, echoT).stat).toBeUndefined();
    expect(getTranslatedProject(withStat, echoT).stat).toEqual({
      value: "42",
      label: "things measured",
    });
  });
});

describe("normalizeLanguage", () => {
  it("folds region-tagged codes to their base code", () => {
    expect(normalizeLanguage("en-GB")).toBe("en");
    expect(normalizeLanguage("de_AT")).toBe("de");
  });

  it("lowercases before matching", () => {
    expect(normalizeLanguage("EN")).toBe("en");
  });

  it("returns null for unsupported languages", () => {
    expect(normalizeLanguage("fr")).toBe(null);
  });

  it("returns null for falsy input", () => {
    expect(normalizeLanguage(undefined)).toBe(null);
    expect(normalizeLanguage(null)).toBe(null);
    expect(normalizeLanguage("")).toBe(null);
  });
});
