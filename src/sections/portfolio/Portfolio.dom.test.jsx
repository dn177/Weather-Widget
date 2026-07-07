// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useSearchParams } from "react-router-dom";
import Portfolio from "./Portfolio";

// Portfolio backs its active filter with useSearchParams, which requires a
// router context; a bare MemoryRouter (no route config) is enough since the
// component never navigates by path, only by search params.
//
// LocationDisplay renders the current search string so tests can assert on
// URL params (e.g. that ?lang= survives a filter change) without reaching
// into router internals.
const LocationDisplay = () => {
  const [searchParams] = useSearchParams();
  return <div data-testid="location-search">{searchParams.toString()}</div>;
};

const renderPortfolio = (initialEntries = ["/"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <Portfolio />
      <LocationDisplay />
    </MemoryRouter>,
  );

// Synthetic catalog (same technique as pureFunctions.test.js): two react
// projects and one vue project, all tier 2 (featured, no flagship), so the
// section renders a single grid with exactly one "entries" count and no
// archive band. vi.hoisted because vi.mock's factory is hoisted above
// regular top-level const declarations.
const FIXTURE = vi.hoisted(() => {
  const base = {
    highlights: [],
    links: [],
    technologies: ["Fixture"],
    media: { type: "image", src: "/img/fixture.png", alt: "" },
    category: "web-app",
    date: "2024-01-01",
    tags: [],
    featured: true,
  };
  return [
    {
      ...base,
      id: "react-alpha",
      title: "React Alpha",
      description: "First react fixture project.",
      mainTech: "react",
      sortOrder: 1,
    },
    {
      ...base,
      id: "react-beta",
      title: "React Beta",
      description: "Second react fixture project.",
      mainTech: "react",
      sortOrder: 2,
    },
    {
      ...base,
      id: "vue-gamma",
      title: "Vue Gamma",
      description: "The lone vue fixture project.",
      mainTech: "vue",
      sortOrder: 3,
    },
  ];
});

vi.mock("./data/projects", () => ({ portfolioProjects: FIXTURE }));

// Out-of-scope siblings that Portfolio always renders: Learning pulls the
// whole Swiper stack, Typewriter re-renders on a timer loop forever. Both
// are irrelevant to the filter behavior under test.
vi.mock("../learning/Learning", () => ({ default: () => null }));
vi.mock("../../lib/Typewriter", () => ({
  default: ({ text, className }) => <span className={className}>{text}</span>,
}));

describe("Portfolio category filter", () => {
  it("shows the full catalog and its entry count by default", () => {
    renderPortfolio();

    expect(
      screen.getByRole("heading", { name: /React Alpha/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /React Beta/ }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Vue Gamma/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 entries/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "All" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("clicking a category swaps the visible projects and the entry count", async () => {
    const user = userEvent.setup();
    renderPortfolio();

    await user.click(screen.getByRole("button", { name: "Vue.js" }));

    expect(
      screen.getByRole("heading", { name: /Vue Gamma/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /React Alpha/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /React Beta/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vue.js" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );

    // The aria-live colophon (the <p> wrapper) announces the new count.
    const colophon = screen.getByText(
      (_, element) =>
        element?.tagName === "P" && /1 entry/.test(element.textContent ?? ""),
    );
    expect(colophon).toHaveAttribute("aria-live", "polite");
    expect(screen.queryByText(/3 entries/)).not.toBeInTheDocument();

    // Back to "all" restores the full set.
    await user.click(screen.getByRole("button", { name: "All" }));
    expect(
      screen.getByRole("heading", { name: /React Alpha/ }),
    ).toBeInTheDocument();
    expect(screen.getByText(/3 entries/)).toBeInTheDocument();
  });

  it("preselects the filter from an existing ?tech= param", () => {
    renderPortfolio(["/?tech=vue"]);

    expect(
      screen.getByRole("heading", { name: /Vue Gamma/ }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /React Alpha/ }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vue.js" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("writes ?tech= on filter and preserves an existing ?lang= param", async () => {
    const user = userEvent.setup();
    renderPortfolio(["/?lang=de"]);

    await user.click(screen.getByRole("button", { name: "Vue.js" }));

    const search = new URLSearchParams(
      screen.getByTestId("location-search").textContent,
    );
    expect(search.get("tech")).toBe("vue");
    expect(search.get("lang")).toBe("de");

    // Back to "all" drops ?tech= but keeps ?lang=.
    await user.click(screen.getByRole("button", { name: "All" }));
    const searchAfterReset = new URLSearchParams(
      screen.getByTestId("location-search").textContent,
    );
    expect(searchAfterReset.has("tech")).toBe(false);
    expect(searchAfterReset.get("lang")).toBe("de");
  });
});
