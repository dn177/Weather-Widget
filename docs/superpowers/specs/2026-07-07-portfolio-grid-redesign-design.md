# Portfolio grid redesign: Front Page & Ledger

**Date:** 2026-07-07
**Status:** Approved direction (Option A), user-refined: index cards expand inline; earlier work is an always-visible ledger with a rows-to-cards view toggle.

## Problem (measured in a live browser)

At 1440x900 the grid renders 4 columns of 234px cards, each clamped to `max-height: 450px` with overflow scrollable only on hover. The flagship card shows 21% of its content; the worst cards show 2%. All four first-row titles truncate at the 2-line clamp. The visible card face is: thumbnail, truncated title, one button, and up to 11 purple tech pills. Description, highlights, outcome metrics, category, and date exist in the data for all 30 projects and never surface. A "Scroll: Auto / Contained" toggle exists solely to tune the hover-scroll anti-pattern.

## Goals

- Every card face answers, without interaction: what it is, why it matters, when/where it sits, and how it was built.
- No internal card scrolling, no hover-only content, no truncated titles.
- The grid speaks the same editorial dossier language as the case-study modal (Fraunces/Lora/JetBrains Mono, ivory paper, purple ladder, champagne gold).
- All 30 projects triageable in about two screen heights via the archive ledger.

## Non-goals

- The case-study modal stays as-is (it already executes the identity well).
- No new npm dependencies. No dark-mode pass for the grid in this iteration (scoped tokens make it a follow-up one-block change).
- Site-wide improvements (astronaut rAF, hero LCP, heading semantics, off-palette sections, i18n gaps) are tracked separately, not part of this change.

## Design overview: three tiers

Tier assignment from data: `getTier(p) = p.flagship ? 1 : p.featured ? 2 : 3`.

- **Tier 1, flagship feature cards (4):** `ornith-optimization`, `dflash-retrain`, `belay`, `quantum-performance` get `flagship: true` (cap 2-4, enforced by a data-integrity test in `portfolioData.test.js`, not by comment; review finding P2).
- **Tier 2, index cards (~10):** remaining `featured: true` projects.
- **Tier 3, archive ledger (16):** everything else, under an "Earlier work" group heading.

Ordering is a **static interleave with an alternating rhythm** (F1 i1 / i2 F2 / F3 i3 / i4 F4, then remaining index cards), done in the array, never with CSS `order` or dense flow, and identical at every width; DOM order = visual order = tab order everywhere. The judged-risky breakpoint-dependent DOM interleave (matchMedia hook) stays dropped. The interleave exists because a span-2 flagship plus its paired index card tiles a 3-column row exactly; plain flagships-first left the third column empty beside every flagship (observed in the live build). Design round 2 (user request): every other pair is flipped so flagships zig-zag down the page; right-side flagships also flip internally (media pane outward, `.pf-flagship--reverse`, >=1024px only) so the dark media plates frame the grid edges; the four "companion" index cards that share a flagship row trade their 54px stamp for a full 16:10 media plate, so the equal-height slack reads as imagery rather than whitespace; flagship findings skip highlights that restate the stat value, render first sentences only, and clamp at 3 lines.

### Tier 1: flagship card anatomy

Wide horizontal card spanning 2 of 3 grid columns at >=1024px with the 40% media pane beside the text. Below 1024px the flagship is a single-column card with the media stacked as a 16:9 band (same as mobile), so 2-column tablet rows tile without voids; the gold top rule and the taller anatomy keep it visually distinct from index cards there.

| Slot | Content | Treatment |
| --- | --- | --- |
| Media pane | `media.src`, 40% width at >=700px; 16:9 band stacked on mobile | `--purple-950` bed; `.svg` sources get `object-fit: contain` with inset, rasters `cover` |
| Kicker rail | `§ Case study` left; `{category} · {year}` right | mono 0.68rem, 0.22em tracking, purple-700 / ink-soft |
| Title | full `title`, never clamped (h3) | Fraunces 600, `clamp(1.35rem, 1.1rem + 1vw, 1.7rem)`, left-aligned |
| Standfirst | new `summary` field (<=220 chars, curated) | Lora 1.02rem, ink-soft |
| Findings | `highlights[0]` and `highlights[1]`, each clamped 2 lines | gold `◆` markers, Lora 0.93rem (modal bullet grammar) |
| Key figure | new `stat: {value, label}` field | 2px gold left rule; value mono 1.3rem purple-600; label mono uppercase |
| Footer rail | "Case study" button; at most one link; closed-source badge; `technologies.slice(0,4)` + `+N` as a mono dot-separated line | gold hairline top rule, `margin-top: auto` |
| Featured marker | structural: the 2-column span + a static 3px gold top border | replaces gradient border, glow keyframes, and scale transforms |

### Tier 2: index card anatomy

Uniform vertical cards, natural height, `align-items: stretch` for even rows.

| Slot | Content | Treatment |
| --- | --- | --- |
| Kicker + stamp | `{category} · {year}`; 52-56px thumbnail from `media.poster ?? media.src`, `alt=""` | mono kicker purple-700; stamp on purple-950 bed, 4px radius |
| Title | full `title`, never clamped (h3) | Fraunces 600 ~1.12rem |
| One-liner | `summary` field, fallback first sentence of `description` | Lora 0.92rem, 2-line clamp as safety only |
| Metric line | `stat` when present; slot omitted when absent | mono 0.78rem, value purple-600 |
| Footer | "Case study" button (when `detailedContent`) + "Details" disclosure (always); or first link + "Details"; closed-source badge when `closedSource` | hairline top rule, `margin-top: auto` |

**Every index card expands.** The "Details" disclosure toggles an inline `ProjectDetailsPanel` under the card footer (chevron rotates, `aria-expanded`/`aria-controls`, panel toggled via `hidden`). Cards with a case study have both: the modal for the deep read, the panel for the quick scan.

### Tier 3: earlier work, always-visible ledger + view toggle

The current "Show earlier (16)" hide/show expander is replaced:

- The archive is **always visible** as a ledger: a `§ Earlier work · 16 entries` group row with flanking gold hairlines, then one compact row per project: stable catalog ordinal, title, one-line summary (>=768px), year, link icons, expand chevron.
- Each row expands inline into the same `ProjectDetailsPanel` (media, full description, all highlights, tech line, all links).
- **The former "Load more" button becomes a view toggle** for this section only: "Show as cards" re-renders the 16 archive projects as regular tier-2 index cards in the grid; "Show as list" collapses them back to ledger rows. Toggle state is component state (not persisted); default is the ledger. `aria-pressed` on the toggle.
- **Disclosure state is owned by `Projects.jsx`, not by cards/rows** (review finding P1): an `expandedProjectIds` set keyed by project id, plus `hasOpened` media-mount state keyed by id, passed down as `expanded`/`onToggle` with id-stable panel ids. This is what lets the rows-to-cards view switch preserve open panels across the unmount/remount.
- Catalog ordinals are computed once from the full sortOrder-sorted list (01-30) and stay stable under filters and view modes, so filtered views show non-contiguous numbers like a real catalog.
- The weather demo widget renders as a full-width "appendix" band at the end of the archive section, only while no tech filter is active, lazy-mounted via the existing `useInView` hook so it does not fetch on page load.

### Shared ProjectDetailsPanel

One component serves tier-2 disclosures and tier-3 row expansions: media block (img, or `video controls preload="none" poster` for the 12 legacy videos) beside text at >=768px, stacked below; full `description` through the existing `emphasizeMetrics()`; all `highlights` with gold diamond markers; `technologies` joined as a mono dot-separated line (kills the pill wall); all links; date via `Intl.DateTimeFormat(i18n.language, {month: 'long', year: 'numeric', timeZone: 'UTC'})` over `new Date(project.date + "T00:00:00Z")` so `YYYY-MM-DD` strings parse as calendar dates and never shift a month across time zones (review finding P2). Media mounts only after first open (`hasOpened` state, owned by `Projects.jsx`) with `loading="lazy"`, so 16 collapsed rows fetch nothing.

### Grid and responsive behavior

- `.pf-grid`: 1 column below 700px (gap 1.25rem), 2 columns 700-1023px (gap 1.5rem), 3 columns >=1024px (gap 2rem). Flagships `grid-column: span 2` at >=700px. No 4-column tier; cards never drop below ~320px.
- Card heights are natural; `align-items: stretch` + `margin-top: auto` footers align rows. **No card or container inside the grid may use internal scrolling**: no `overflow-y: auto|scroll`, no hover-conditional overflow, no fixed `max-height` clipping. (Line clamps on summaries/findings are allowed; the old scrollHeight assertion was wrong because clamping legitimately makes `scrollHeight > clientHeight`; review finding P1. Titles are never clamped and are asserted separately.)
- Filters: tiers persist (a filtered flagship keeps its wide card; a filtered archive project stays a ledger row). The `§ Earlier work` group row renders whenever at least one archive project is visible, with its count reflecting the active filter. A live entry count near the filters ("{n} entries", mono colophon style) gives filter feedback.

### Visual language

Component-scoped tokens on `#portfolio`, consumed by every new rule: `--pf-surface: var(--ivory)`, `--pf-ink: var(--ink)`, `--pf-body: var(--ink-soft)`, `--pf-kicker: var(--purple-700)`, `--pf-accent: var(--purple-600)`, `--pf-gold: var(--gold-500)`, `--pf-deep: var(--purple-950)`, `--pf-line: color-mix(in srgb, var(--gold-500) 35%, transparent)` (with rgba fallback). Ivory card surfaces, 10px radius, the modal's exact shadow, at most two gold hairline moments per card. No hardcoded `#9333ea`-family hexes anywhere in new CSS.

### Interaction and accessibility

- Click targets are explicit controls only, never the whole card. Disclosures are `<button aria-expanded aria-controls>`; panels use the `hidden` attribute; ledger row titles are h3-wrapped disclosure buttons with a stretched hit area; aside links stay independently clickable (`position: relative; z-index: 1`).
- Chevron rotation and panel transitions removed under `prefers-reduced-motion`. No infinite animations anywhere in the grid.
- Filter buttons: fix the audited contrast failure (`opacity: 0.6` -> `opacity: 1` with `color: var(--ink-soft)`).

### i18n

New keys (en/de/pl/es, `defaultValue` fallback so EN-first is safe): `portfolio.projectCategories.*` (8 labels), `portfolio.details`, `portfolio.closedSource`, `portfolio.earlierWork`, `portfolio.entries` ("{{count}} entries"), `portfolio.showAsCards` / `portfolio.showAsList`, `portfolio.viewLive`. `getTranslatedProject` gains `summary` and `stat.label` lookups: `t('projects.<id>.summary', { defaultValue: project.summary || firstSentence(project.description) })`.

Key ownership is explicit (review finding P2): `portfolio.categories.*` stays owned by the technology filter buttons and is not touched; `portfolio.projectCategories.*` is new and only for project category labels (`ml-systems`, `web-app`, ...); `portfolio.closedSource` is the new short badge label; `portfolio.closedSourceNotice` keeps serving the case-study modal unchanged.

## Data changes

- 4 flagship files: add `flagship: true`, `summary` (<=220 chars, no em dashes, no "not X, but Y"), `stat: {value, label}` (ornith `+31%` / coding decode throughput; dflash `+6.0%` / decode tok/s after a 12-minute retrain; quantum `16 ms` / average INP; belay `80` / practice templates across eight domains).
- Tier-2/3 files: optional `summary` (<=110 chars) where the first sentence is long or weak (belay-style essays); optional `stat` only where an honest number exists (~9/30). Slots collapse when fields are absent.
- Reorder `technologies` tools-first on `dflash-retrain` and `ornith-optimization` so `slice(0,4)` shows tools, not concept tags.

## Deletions (the point of the exercise)

- The 450px clamp + hover-scroll block and card scrollbar styles (`portfolio.css` 118-148).
- `ScrollBehaviorToggle.jsx`, `scrollBehaviorToggle.css`, the localStorage key, and the `scrollBehavior` state/prop plumbing through `Portfolio.jsx` / `Projects.jsx` / `Project.jsx`.
- `animateProject` and its `:not(:hover)` re-trigger (184-186, 212-219).
- All three `.portfolio__project--featured` definitions and the `featured-glow` keyframes (6-22, 663-694).
- Both card `.tech-pill` definitions (448-464, 541-557); **same commit** folds the box properties into `.tech-pill--modal` so modal chips keep their padding.
- `src/components/Card.jsx` + `card.css` (verified: `Project.jsx` is the only importer).
- Dead CSS: `.portfolio__read-more-btn`, `.portfolio__project-links`, `.portfolio__project-cta`, `.leetcode__solution`, `.fullscreen .image-gallery-slide`, `portfoliovideo` blocks; scope or remove the global `video { object-fit: contain !important }`.
- The image quick-view modal path in `Project.jsx` (hover-magnifier emoji, `isImageProject` branches): superseded by the Details panel. The case-study modal keeps its hero imagery.

## Component structure

```
sections/portfolio/
  Portfolio.jsx        (drop toggle state; pass filtered projects; entry count)
  Projects.jsx         (tiering, ordering, archive view toggle, group row, weather band)
  FlagshipCard.jsx     (tier 1)
  IndexCard.jsx        (tier 2, owns its Details disclosure)
  ArchiveRow.jsx       (tier 3 ledger row, owns its disclosure)
  ProjectDetailsPanel.jsx (shared expanded panel, lazy media)
  Project.jsx          (thin dispatcher by tier; keeps detailModal hook + case-study modal JSX)
```

## Verification

- Preview at 375/768/1024/1440, light scheme, reduced-motion on and off.
- Keyboard-only walk: filters, tier-2 disclosure, ledger row disclosure, view toggle, case-study modal in and out.
- Assert no grid element uses internal scrolling (`overflow-y: auto|scroll`, hover-conditional overflow, `max-height` clipping); assert titles render untruncated (no clamp style on title elements).
- Assert the archive view toggle preserves open panels: expand a row, switch to cards, the same project's panel is open.
- Diff `.detail-modal-*` / `.modal-dialog` CSS blocks for zero changes before merge (the deletion pass shares the file).
- `npm test`: existing data-integrity tests plus new contract tests: `2 <= flagships.length <= 4` (exact ids asserted), flagship `summary` <= 220 chars and `stat: {value, label}` present, tier-2/3 `summary` <= 110 chars where present, `stat` shape valid where present.

## Risks and mitigations

- **CSS deletion volume (~700 lines) near modal styles:** diff-check the modal blocks; land deletions and additions in reviewable commits.
- **Legacy copy becomes prominent in expanded panels** ("algirthm", "App build with", jokey mathtron-vue highlight, Release Radar/Reader naming): flagged for a separate human copy pass; not auto-rewritten.
- **`color-mix()` support:** ship literal rgba fallbacks on hairline declarations.
- **Filtered sparse rows** (one span-2 flagship + one card): acceptable; verified visually during QA.
- **Untranslated summaries initially:** `defaultValue` fallback keeps non-EN UIs functional; translation keys can land incrementally.
