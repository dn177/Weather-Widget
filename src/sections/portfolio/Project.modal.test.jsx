// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Project from "./Project";

// Tier-2 project with detailedContent, so the card face carries the
// "Read Case Study" trigger and Project wires useModal to AccessibleModal.
const CASE_STUDY_PROJECT = {
  id: "cs-1",
  title: "Case Study Fixture",
  description: "A fixture project with a full case study.",
  highlights: [],
  links: [],
  technologies: ["Fixture", "Vitest"],
  media: { type: "image", src: "/img/cs.png", alt: "case study hero" },
  category: "web-app",
  date: "2024-03-01",
  mainTech: "react",
  tags: [],
  sortOrder: 2,
  featured: true,
  detailedContent: {
    overview: "Cut render time from 300 ms to 40 ms.",
    sections: [
      {
        title: "Approach",
        items: ["Profiled the hot path.", "Memoized the grid rows."],
      },
    ],
  },
};

// AccessibleModal defers focus by 50ms and animates close over 200ms; fake
// timers make both deterministic. user-event must advance the same clock or
// its internal delays dead-lock against it.
describe("Project case-study modal", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // RTL v16's asyncWrapper (which user-event runs inside) drains its
    // microtask queue with a setTimeout(0), but only advances the clock
    // itself when it detects JEST fake timers via the `jest` global. Under
    // vitest that global is undefined, so without this shim every awaited
    // user-event call dead-locks against the faked setTimeout.
    vi.stubGlobal("jest", {
      advanceTimersByTime: (ms) => vi.advanceTimersByTime(ms),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("moves focus to the close button on open, and Escape restores focus and the scroll lock", async () => {
    const user = userEvent.setup({
      advanceTimers: (ms) => vi.advanceTimersByTime(ms),
    });
    render(
      <Project
        project={CASE_STUDY_PROJECT}
        expanded={false}
        hasOpened={false}
        onToggle={() => {}}
        panelId="pf-panel-cs-1"
        ordinal="07"
      />,
    );

    const trigger = screen.getByRole("button", { name: "Read Case Study" });
    await user.click(trigger);

    // Modal is up: dialog semantics, body scroll locked.
    const dialog = screen.getByRole("dialog", { name: "Case Study Fixture" });
    expect(dialog).toBeInTheDocument();
    expect(document.body.style.overflow).toBe("hidden");
    expect(screen.getByText("Approach")).toBeInTheDocument();

    // aria-describedby points at the short overview paragraph, not the
    // whole case study, and every id in the open modal is unique (issue
    // #10: duplicate id="detail-modal-content" on the modal-body wrapper
    // and the inner content div).
    const describedById = dialog.getAttribute("aria-describedby");
    expect(describedById).toBeTruthy();
    const describedByEl = document.getElementById(describedById);
    expect(describedByEl).toHaveTextContent(
      "Cut render time from 300 ms to 40 ms.",
    );
    expect(describedByEl.textContent.length).toBeLessThan(200);
    const idCounts = {};
    dialog.querySelectorAll("[id]").forEach((el) => {
      idCounts[el.id] = (idCounts[el.id] || 0) + 1;
    });
    Object.values(idCounts).forEach((count) => expect(count).toBe(1));

    // Focus lands on the close button only after the 50ms mount delay.
    const closeButton = screen.getByRole("button", { name: "Close modal" });
    expect(closeButton).not.toHaveFocus();
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(closeButton).toHaveFocus();

    // Escape starts the animated close: still mounted during the 200ms
    // closing transition, gone after it.
    await user.keyboard("{Escape}");
    expect(screen.getByRole("dialog", { name: "Case Study Fixture" })).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    // Unmount cleanup: focus returns to the trigger, scroll lock cleared.
    expect(trigger).toHaveFocus();
    expect(document.body.style.overflow).toBe("");
    expect(document.body.style.paddingRight).toBe("");
  });

  it("keeps the modal subtree out of the DOM until opened, and removes it after close completes (issue #21)", async () => {
    const user = userEvent.setup({
      advanceTimers: (ms) => vi.advanceTimersByTime(ms),
    });
    render(
      <Project
        project={CASE_STUDY_PROJECT}
        expanded={false}
        hasOpened={false}
        onToggle={() => {}}
        panelId="pf-panel-cs-1"
        ordinal="07"
      />,
    );

    // Closed card: no dialog and none of the case-study content is rendered.
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Approach")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Cut render time from 300 ms to 40 ms."),
    ).not.toBeInTheDocument();

    // Open: dialog and case-study content appear.
    await user.click(screen.getByRole("button", { name: "Read Case Study" }));
    expect(
      screen.getByRole("dialog", { name: "Case Study Fixture" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Approach")).toBeInTheDocument();

    // Close via the close button: the subtree stays mounted through the
    // 200ms closing animation, then unmounts entirely.
    await user.click(screen.getByRole("button", { name: "Close modal" }));
    expect(screen.getByText("Approach")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.queryByText("Approach")).not.toBeInTheDocument();
  });
});
