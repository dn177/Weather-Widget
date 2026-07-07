// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import i18n from "i18next";

// Render probe for the memoized Project card (issue #17): Project calls
// getTier(project) once per render at the top of its body, while Projects
// only calls it inside useMemos keyed on the projects array. So after the
// initial mount, every getTier call maps 1:1 to a Project card render and
// the spied ids tell us exactly which cards re-rendered on a toggle.
const { tierProbe } = vi.hoisted(() => ({ tierProbe: vi.fn() }));

vi.mock("./portfolioData", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getTier: (p) => {
      tierProbe(p.id);
      return actual.getTier(p);
    },
  };
});

// Import after vi.mock so Projects/Project resolve the wrapped getTier.
const { default: Projects } = await import("./Projects");

const archiveProject = (id, title) => ({
  id,
  title,
  description: `${title} description. Second sentence for the panel.`,
  highlights: ["Shipped a thing."],
  links: [],
  technologies: ["Fixture"],
  media: {
    type: "image",
    src: `/img/${id}.png`,
    alt: `${title} screenshot`,
  },
  category: "web-app",
  date: "2019-06-01",
  mainTech: "react",
  tags: [],
  sortOrder: 30,
});

const PROJECTS = [
  archiveProject("memo-a", "Memo Alpha"),
  archiveProject("memo-b", "Memo Beta"),
  archiveProject("memo-c", "Memo Gamma"),
];

// Ids the probe saw, deduplicated. The toggled card can legitimately render
// twice per click in this dev/act environment (React flushes the discrete
// click at sync priority, then replays the remaining update lane in a no-op
// concurrent pass with identical state), so the assertion is about WHICH
// cards render, not how often.
const renderedIds = () => [...new Set(tierProbe.mock.calls.map(([id]) => id))];

describe("Project memoization", () => {
  it("re-renders only the toggled card, not its siblings", async () => {
    const user = userEvent.setup();
    render(<Projects projects={PROJECTS} activeTech="react" />);

    // Mount renders every card (plus the Projects tier passes); from here
    // on the probe should only ever see the card being toggled.
    tierProbe.mockClear();

    await user.click(screen.getByRole("button", { name: "Memo Beta" }));
    expect(renderedIds()).toEqual(["memo-b"]);

    // Collapse touches the same single card again.
    tierProbe.mockClear();
    await user.click(screen.getByRole("button", { name: "Memo Beta" }));
    expect(renderedIds()).toEqual(["memo-b"]);
  });

  it("still re-renders every card on a language switch", async () => {
    render(<Projects projects={PROJECTS} activeTech="react" />);
    tierProbe.mockClear();

    // languageChanged makes useTranslation swap its t state inside each
    // card, so the update originates in the card itself and React.memo
    // cannot block it; the new t also re-derives the translated project.
    await act(() => i18n.changeLanguage("de"));
    expect(renderedIds().sort()).toEqual(["memo-a", "memo-b", "memo-c"]);

    // Restore the setup default for any test that runs after this file.
    await act(() => i18n.changeLanguage("en"));
  });
});
