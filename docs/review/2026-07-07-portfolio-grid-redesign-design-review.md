# Review: Portfolio Grid Redesign Design

Reviewed: 2026-07-07
Spec: `docs/superpowers/specs/2026-07-07-portfolio-grid-redesign-design.md`
Scope: design-spec review against the current React portfolio implementation.

## Findings

### [P1] The proposed overflow assertion conflicts with the spec's own line clamps

Spec refs: `docs/superpowers/specs/2026-07-07-portfolio-grid-redesign-design.md:43`, `:56`, `:79`

The spec asks for flagship findings to be clamped to two lines and index one-liners to be clamped to two lines as a safety measure, then later requires that no grid element have `scrollHeight > clientHeight`. CSS clamping and hidden overflow are exactly what make `scrollHeight` exceed `clientHeight` when content is longer than the clamp, so a correct implementation of the card anatomy can fail the proposed verification.

Recommendation: either remove the clamps and allow natural height, or narrow the verification to the actual failure mode: no card/container uses internal scrolling (`overflow-y: auto|scroll`, hover-only scrolling, or fixed max-height clipping). If title visibility is the important acceptance criterion, test titles separately.

### [P1] Expanded archive state will be lost if disclosure state is owned by cards/rows

Spec refs: `docs/superpowers/specs/2026-07-07-portfolio-grid-redesign-design.md:68`, `:120`, `:121`
Code refs: `src/sections/portfolio/Projects.jsx:11`, `src/sections/portfolio/Projects.jsx:30`

The spec requires the archive view toggle to preserve each project's expanded/collapsed state by id when switching between ledger rows and card view. The component structure then says `IndexCard` and `ArchiveRow` each own their disclosure. If implemented literally, toggling "Show as cards" unmounts the rows and mounts new cards, so row-owned disclosure state disappears.

Recommendation: make `Projects.jsx` own an `expandedProjectIds` set keyed by project id, and pass `expanded`, `onToggle`, and an id-stable panel id into both `IndexCard` and `ArchiveRow`. Keep `hasOpened` media-mount state keyed by id as well if media should not remount unnecessarily across the view switch.

### [P2] Bare ISO dates can render the wrong month/year

Spec ref: `docs/superpowers/specs/2026-07-07-portfolio-grid-redesign-design.md:74`
Code refs: `src/sections/portfolio/data/projects/quantum-performance.js:11`, `src/sections/portfolio/portfolioData.js:52`

The spec says the shared details panel should format dates with `Intl.DateTimeFormat(i18n.language, { month: 'long', year: 'numeric' })`, but it does not specify how to parse the existing `YYYY-MM-DD` strings. In JavaScript, `new Date("2026-01-01")` is midnight UTC; in western time zones it formats as December 2025. `quantum-performance` currently uses `2026-01-01`, so this bug is reachable.

Recommendation: parse project dates as plain calendar dates, not instants. Either split `YYYY-MM-DD` and format from `{ year, month }`, or use `new Date(project.date + "T00:00:00Z")` with `timeZone: "UTC"` in the formatter.

### [P2] The i18n key plan risks colliding with existing UI copy

Spec ref: `docs/superpowers/specs/2026-07-07-portfolio-grid-redesign-design.md:94`
Code refs: `src/sections/portfolio/ProjectsCategories.jsx:22`, `src/i18n/locales/en.json:21`, `src/sections/portfolio/Project.jsx:424`

The spec introduces `portfolio.projectCategories.*`, `portfolio.closedSource`, and related keys. The current tech filter UI already uses `portfolio.categories.*`, and the case-study modal already uses `portfolio.closedSourceNotice`. Since the modal is explicitly out of scope, replacing the existing notice key with a short badge label would change modal behavior; similarly, moving filter labels from `portfolio.categories.*` would make the current filters render missing-key text.

Recommendation: make the key ownership explicit: keep `portfolio.categories.*` for technology filters, add `portfolio.projectCategories.*` only for project category labels like `ml-systems` and `web-app`, add `portfolio.closedSource` as the short badge label, and preserve `portfolio.closedSourceNotice` for the existing modal notice.

### [P2] The flagship cap is described as comment-enforced, which is not enforcement

Spec refs: `docs/superpowers/specs/2026-07-07-portfolio-grid-redesign-design.md:27`, `:98`, `:132`
Code ref: `src/sections/portfolio/portfolioData.test.js:30`

The tiering model depends on exactly a small number of `flagship: true` projects, but the spec says the 2-4 cap is "enforced by comment in `portfolioData.js`." Comments will not catch a future data edit that creates one flagship or ten. The current data test only checks required fields, known `mainTech`, and media existence.

Recommendation: add a portfolio data integrity test for the new contract: exact flagship ids or `2 <= flagships.length <= 4`, no project is both incorrectly tiered by accident, flagship summaries are `<= 220` chars, index summaries are `<= 110` where present, and `stat` has `{ value, label }` when present.

## Notes

The core direction is coherent and matches the current pain points: the hover-scroll clamp, scroll behavior toggle, duplicated tech pills, and featured glow all exist in the current implementation. The main changes I would make before implementation are to tighten the acceptance tests and clarify the state/i18n ownership so the redesign does not regress during the component split.
