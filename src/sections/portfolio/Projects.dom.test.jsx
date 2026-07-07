// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Projects from "./Projects";

// One tier-3 archive project (no flagship/featured flag), rendered directly
// through Projects so the disclosure state machine is exercised end to end:
// expandedProjectIds toggles, hasOpenedIds is monotonic, and both live in
// Projects (not the card) so they survive the archive list/cards view
// switch. activeTech is not "all" so the weather appendix stays out of the
// tree.
// Two sentences on purpose: the row head shows firstSentence(description)
// as the summary, so the full description below is unique to the panel and
// its visibility tracks the panel's hidden attribute.
const PANEL_TEXT = "An early ledger fixture. It proves the disclosure invariants.";

const ARCHIVE_PROJECT = {
  id: "arch-1",
  title: "Archive Fixture",
  description: PANEL_TEXT,
  highlights: ["Shipped a thing."],
  links: [],
  technologies: ["Fixture"],
  media: {
    type: "image",
    src: "/img/arch.png",
    alt: "archive fixture screenshot",
  },
  category: "web-app",
  date: "2019-06-01",
  mainTech: "react",
  tags: [],
  sortOrder: 30,
};

const MEDIA_ALT = "archive fixture screenshot";

describe("Projects expand/collapse", () => {
  it("opens on toggle, closes on second toggle, and keeps once-opened media mounted", async () => {
    const user = userEvent.setup();
    render(<Projects projects={[ARCHIVE_PROJECT]} activeTech="react" />);

    const toggle = screen.getByRole("button", { name: "Archive Fixture" });

    // Collapsed by default: hidden panel, media never mounted.
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(PANEL_TEXT)).not.toBeVisible();
    expect(screen.queryByAltText(MEDIA_ALT)).not.toBeInTheDocument();

    // First toggle: panel opens and the media mounts.
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(PANEL_TEXT)).toBeVisible();
    expect(screen.getByAltText(MEDIA_ALT)).toBeInTheDocument();

    // Second toggle: panel closes, but hasOpenedIds is monotonic, so the
    // media stays mounted inside the hidden panel (no refetch on reopen).
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(PANEL_TEXT)).not.toBeVisible();
    expect(screen.getByAltText(MEDIA_ALT)).toBeInTheDocument();
  });

  it("preserves an open panel and its media across the list/cards view switch", async () => {
    const user = userEvent.setup();
    render(<Projects projects={[ARCHIVE_PROJECT]} activeTech="react" />);

    await user.click(screen.getByRole("button", { name: "Archive Fixture" }));
    expect(screen.getByAltText(MEDIA_ALT)).toBeInTheDocument();

    // Switch the archive to cards: the row unmounts and an index card
    // remounts, but disclosure state is keyed by project id in Projects,
    // so the panel is still open and the media is still there.
    await user.click(screen.getByRole("button", { name: "Show as cards" }));
    const details = screen.getByRole("button", { name: "Details" });
    expect(details).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(PANEL_TEXT)).toBeVisible();
    expect(screen.getByAltText(MEDIA_ALT)).toBeInTheDocument();

    // Collapse in cards view, switch back to the list: still closed, media
    // still mounted (the hasOpenedIds invariant holds across views too).
    await user.click(details);
    await user.click(screen.getByRole("button", { name: "Show as list" }));
    expect(
      screen.getByRole("button", { name: "Archive Fixture" }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(screen.getByText(PANEL_TEXT)).not.toBeVisible();
    expect(screen.getByAltText(MEDIA_ALT)).toBeInTheDocument();
  });
});
