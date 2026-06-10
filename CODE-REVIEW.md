# Code & Project Structure Review — 2026-06-10

Scope: full `src/` read (core chain + components), eslint run, `npm audit`, dependency-usage greps, asset audit, git history. Companion to `REVIEW.md` (UX/content review).

**Vitals:** 44 JS/JSX files (~8,000 LOC) + 20 CSS files (~4,350 LOC) · 0 test files · `public/` = 71 MB · repo since 2023-10, 96 commits · react-scripts 5 (CRA) · eslint: 15 warnings · npm audit: 68 vulns (4 critical / 30 high — toolchain, see §3).

---

## 1. The archaeology — three strata

You said it feels like a company legacy codebase. It reads like one, and in a specific way: **three quality strata coexist**, and a reviewer can date any file in seconds.

- **Stratum 1 (oldest, ported-jQuery-era idioms):** `Weather.jsx`, `Typewriter.js`, `SolarSystem.jsx`, `Sustainability.jsx` (direct `classList` mutation), `data.js`. Hand-rolled debounce, DOM-poking, `key={index}`, copy-pasted fetch handlers.
- **Stratum 2 (CRA consolidation):** router setup, `sections/` layout, i18n introduction (`urlLanguageDetector` — whitelist frozen at `en/de`), Bootstrap, the abandoned experiments (`AppOld.jsx`, `HeaderOptimized.jsx`).
- **Stratum 3 (2025–26, current quality bar):** `portfolioData.js` schema, `AccessibleModal` + `useModal`, `Project.jsx` case-study modal, `LanguageHandler`. Documented, accessible, mostly clean.

The pain you feel is **stratum interference**: three i18n mechanisms with two disagreeing language whitelists, two modal systems, two header components, two project-data files. Every new feature has to guess which layer is "current." The fix is not a rewrite — Stratum 3 proves the bar — it's **deleting strata 1–2 remnants and promoting the rest**.

---

## 2. Fix-first: a committed API secret

**`src/sections/weather/Weather.jsx:15`** — `NINJAS_API_KEY = "ZO9a…"` hardcoded and committed. Any client-side key ships in the bundle, but this one is also in git history with the project public-facing.

- **Rotate the key now** (api-ninjas dashboard) — deleting the line does not un-leak it.
- Then choose: drop the geocoding lookup (Open-Meteo has a free geocoding API, keyless: `geocoding-api.open-meteo.com`), or move it to `REACT_APP_…` env var with the understanding that a client key is still public — env vars solve *repo* hygiene, not *exposure*.
- Optional repo hygiene afterwards: history rewrite (`git filter-repo`) is only worth it if the key can't be rotated.

---

## 3. Build platform & dependencies

| Package | State | Verdict |
|---|---|---|
| `react-scripts` 5.0.1 | CRA is deprecated/EOL; pinned old webpack/postcss chain | **Root cause of the 68 audit vulns** (4 critical, 30 high — `nth-check`, `postcss`, `webpack-dev-server`-class advisories). These are build-time, not shipped-runtime, so real exposure is low — but they are **unfixable inside CRA**. Vite migration is the actual `npm audit fix`. |
| `react` 18.2 / `react-router-dom` 6.22 | fine, one major behind | upgrade with Vite move |
| `bootstrap` 5.1 | full CSS imported in `App.jsx:1`; usage is a handful of utility classes (`container`, `btn`, `mt-5`, grid) | replace with ~50 lines of own CSS or import only the grid/utilities you use — your `index.css` + `portfolio.css` already carry a real design system |
| `axios` 1.5 | used in **one** file (`Weather.jsx`) for two GETs | native `fetch` — delete the dep |
| `web-vitals`, `@testing-library/*` | **zero imports in `src/`** | delete |
| `swiper` 11 | only `Learning.jsx` | keep if Learning stays; goes if it goes |
| `three` 0.176, `gsap` 3.13 | current; `three` imported by `Header`, `Astronaut`, dead `SolarSystem`/`HeaderOptimized` | fine — but see bundle note §6 |
| Browserslist DB | outdated (build warning) | `npx update-browserslist-db@latest` |

---

## 4. Dead code & junk inventory (the free win)

Verified by import-graph grep — **no live importers** unless noted:

| Item | LOC | Note |
|---|---|---|
| `src/AppOld.jsx` | ~45 | superseded by `App.jsx` |
| `src/components/Modal.jsx` | 46 | replaced by `AccessibleModal` |
| `src/components/ModalExamples.jsx` | 279 | demo file |
| `src/sections/header/HeaderOptimized.jsx` | 154 | abandoned experiment; still references `1.jpg`/`1-desktop.jpg` |
| `src/components/SolarSystem.jsx` | 662 | import commented out in `Home.jsx:31`; drags `three`/`gsap` greps along |
| `src/sections/performance/` | 61 + css | only importer is dead `AppOld.jsx` |
| `src/sections/portfolio/data.js` | 161 | pre-2024 data layer, fully superseded by `portfolioData.js` |
| `src/context/` | 0 | empty since 2023-07 |
| `Footer` (lazy import, `Home.jsx:16`) | — | imported, never rendered — render it or delete it (eslint flags it) |
| Root junk: `MIGRATION_COMPLETE.md`, `PORTFOLIO_UPDATE_COMPLETE.md`, `AI_TRACKING_GUIDE.md`, `PORTFOLIO_REVIEW.md`, stray `Belay/` folder | — | untracked leftovers in repo root — archive or delete |

**≈ 1,400+ LOC of JS plus paired CSS deletable in one sitting, zero risk.** This single step removes most of the stratum confusion: one modal, one header, one app shell, one data file.

---

## 5. Architecture findings

**a) The weather widget lives inside the project grid by index arithmetic.** `Projects.jsx:8–27`: `WEATHER_GRID_POSITION = 4` plus offset math woven through `renderItem`. A layout/content decision is hard-coded into list rendering; the load-more count silently interacts with it (`projects.length + 1` slots). This is the code-level cause of the UX issue in `REVIEW.md` §4.1. Fix: render sections explicitly, or make "demo widgets" first-class data entries with their own grid slot.

**b) `Learning` is secretly part of `Portfolio`.** `Portfolio.jsx:54–57` renders `<Learning />` under a hardcoded, untranslated `"Input"` heading inside `<section id="portfolio">`. Surprising nesting, invisible in the nav, and it makes `#portfolio` 5,400 px tall. Promote to its own section (or cut it).

**c) Three i18n mechanisms, two disagreeing whitelists.** This is the root cause of the `?lang=en-GB` bug found in the UX review:

- `i18n.js:43` — detector order `url → localStorage → navigator` (correct);
- `urlLanguageDetector.js:10` — accepts **only `['en','de']`**, so `pl`, `es`, and any region code (`en-GB`) return `null` and lose to cached `localStorage`;
- `LanguageHandler.jsx:15` — a *second* URL-lang implementation with a *different* whitelist (`['en','de','pl','es']`, exact codes only), which also rewrites the URL.

Consolidate to **one** mechanism: a single exported `SUPPORTED_LANGUAGES`, normalize region codes (`en-GB → en`), let the i18next detector own URL handling, delete `LanguageHandler`, and add `i18n.on('languageChanged', l => document.documentElement.lang = l)` — that also fixes the `<html lang>` desync.

**d) Derived state stored as state.** `Portfolio.jsx:14–25` keeps `projects` in `useState` alongside `activeTech` and syncs them in a handler. One `useMemo(() => getProjectsByTechnology(activeTech), [activeTech])` removes the sync hazard. (Also: `portfolioProjects` import unused — eslint.)

**e) `/react` route duplicates `/`.** `App.jsx:24–30` — legacy path. Redirect or drop.

**f) `body` is the scroll container** (`index.css`, `overflow: hidden auto`). It breaks native scroll restoration and `window.scrollTo` expectations — `ScrollBehaviorToggle` (74 LOC + 241 CSS) exists to patch symptoms of this choice. Worth reconsidering at the root.

**g) Half-implemented ARIA tabs.** `ProjectsCategories.jsx:13–27` declares `role="tablist"/"tab"` + `aria-selected`, `Projects.jsx:62` declares `role="tabpanel"` — but there's no `id`/`aria-controls` linkage and no arrow-key navigation, so it announces as tabs without behaving like them. Either complete the WAI-ARIA tabs pattern or drop the roles (buttons + region is honest and simpler).

**h) Naming drift.** CSS file casing is mixed (`Weather.css` vs `weather.css` convention), `Typewriter.js` contains JSX in a `.js` file (CRA tolerates it; Vite's default config won't — rename to `.jsx` during migration), and `components/` mixes one-file components with section-folder conventions.

---

## 6. Component-level findings

- **`Weather.jsx`** — the densest stratum-1 file: broken debounce at `:30` (`debounce(fetchCity(), 1000)` *invokes* `fetchCity` immediately and debounces nothing) and at `:105/:114` (debounced handlers recreated every render, so the closure timer resets and never debounces); `event.preventDefault()` in change handlers (no-op); `Object.keys(city).length` on a *string* (counts characters); `key={index}`; unused `production` flag; two eslint hook-deps warnings. If the widget survives the UX review, it deserves a rewrite at stratum-3 quality (~60 lines, `fetch`, `useDebouncedValue`).
- **`Typewriter.js:10–14`** — off-by-one: at `currentIndex === text.length`, `text[currentIndex]` is `undefined` and gets string-appended, flashing `…undefined` for one tick before the infinite-loop reset. Condition should be `<`, with the reset in the `else`.
- **`Sustainability.jsx:26–28`** — `document.querySelector(".crown").classList.add/remove` from a React component; use a ref + state/class toggle. Plus a hook-deps warning.
- **`Astronaut.jsx`** — genuinely good Three.js hygiene (full disposal walk at `:35–101`, `cancelAnimationFrame`, gsap context cleanup) — but it's a **2,355-LOC single component**, eagerly imported in `Home.jsx` while *lighter* things are lazy. Lazy-load it (it's below the fold) and split scene-building into plain modules (`createEnvironmentMap`, `initScene`, …) so the component is mount/cleanup glue. Two eslint warnings (ref-in-cleanup, missing dep).
- **`AccessibleModal.jsx`** — the best component in the repo (focus trap, scroll-lock with scrollbar-width compensation, portal, focus restore). Two nits: stringly-typed variant logic at `:107` (`className.includes("pixelperfect")…` — pass an explicit `variant` prop); static `id="modal-title"` would collide if two modals ever stack.
- **eslint (15 warnings total):** unused vars (`Home.jsx` ×2, `Portfolio.jsx`, `Weather.jsx`, `Astronaut.jsx`, `SolarSystem.jsx`), hook-deps (×6 across Astronaut/SolarSystem/Sustainability/Weather), `no-script-url` in `Learning.jsx:145`, anonymous default export in `ModalExamples.jsx`. Worth driving to zero and enforcing in CI — half disappear with the §4 deletions.

---

## 7. Assets (71 MB `public/`)

- `public/Portfolio` = 38 MB: posters are full-size PNGs (`poster/` = 6.8 MB; `poster_spacestudio.png` alone 1.2 MB → webp/jpg at display size ≈ 100–200 KB), `Bild6/7.png` ~900 KB each, `NextjsPortfolio.png` 1.2 MB, `Video13.mp4` (Emmet demo) 6.2 MB.
- `public/spacestudio` = 17 MB for one project's video+poster.
- `public/1.jpg` (2.6 MB): live `Header.jsx` uses `1-desktop.webp`; only dead `HeaderOptimized` references `1.jpg` → likely orphaned, verify and delete.
- Realistic target after webp/poster pass + orphan cleanup: **< 30 MB** without losing anything visible. (Your OG image is referenced absolutely at `cdtio33.com/1-desktop.jpg` in `index.html` — confirm it exists on the server, since the local `1.jpg` may go.)

---

## 8. Testing & CI — currently zero

No test files; testing deps installed but unused; no CI config in the repo. For a content-heavy portfolio the highest-value tests are **data-integrity, not UI**, and they're cheap:

1. `portfolioData` schema test — unique ids, required fields, valid `mainTech`/`category`, `sortOrder` sanity.
2. **Referenced-asset existence** — every `media.src` / `section.image` / `video` / `poster` path resolves to a file in `public/`. This catches the classic broken-thumbnail-after-rename bug at commit time.
3. i18n parity — `en/de/pl/es` JSON key sets match (catches half-translated locales).
4. One render smoke test per route.

Plus a GitHub Action: install → lint (`--max-warnings 0`) → test → build. That's an afternoon, and it's the difference between "old codebase" and "old codebase under control."

---

## 9. Refactoring roadmap (strangler-fig order, no rewrite)

| # | Step | Effort | Pays off |
|---|---|---|---|
| 0 | ✅ **Done 2026-06-10** — key removed from code; Weather now uses keyless Open-Meteo geocoding + native `fetch` (axios import gone). **⚠️ Still rotate the key at api-ninjas — it remains in git history.** | 15 min | closes the leak |
| 1 | ✅ **Done 2026-06-10** — deleted `AppOld`, `Modal`+`ModalExamples`, `HeaderOptimized`, `SolarSystem`, `sections/performance/`, `sections/footer/` (template boilerplate with placeholder links), `portfolio/data.js`, empty `context/`; root junk (`MIGRATION_COMPLETE.md` etc. + stray `Belay/`) moved to gitignored `_archive/` | ~1 h | −1,400 LOC, one-of-everything architecture |
| 2 | ✅ **Done 2026-06-10** — Typewriter off-by-one fixed, Weather debounce rewritten (effect-timer), Sustainability `console.log` removed + `.crown` toggle made null-safe (cross-component coupling documented), Astronaut ref-cleanup/unused-var fixed, Learning `no-script-url` false positive documented; **eslint 15 → 0 warnings** (`--max-warnings 0` passes); `Weather.css` `end`→`flex-end` build warning fixed | 2–3 h | trust in the floor |
| 3 | ✅ **Done 2026-06-10** — new `i18n/languages.js` is the single source of truth (`SUPPORTED_LANGUAGES` + `normalizeLanguage`); `urlLanguageDetector` accepts all four languages with region normalization (`en-GB → en`); `supportedLngs` + `load:"languageOnly"` in i18next config; `<html lang>` synced via `languageChanged`; URL writing centralized in the detector's cache (`LanguageHandler` deleted, `LanguageSelector` simplified to map over the shared list — it was a 4th URL-writing site). Verified: `?lang=en-GB` beats a cached `de`, `?lang=pl`/`es` work, selector click updates URL+cache+`<html lang>`. | ~2 h | fixes the user-visible language bug |
| 4 | ✅ **Done 2026-06-10** — react-scripts removed (−1,281 packages, audit 68 → 14 vulns, remainder dev-only); Vite 8 + vitest + autoprefixer; `index.html` moved to root (+ missing `<!DOCTYPE html>` fixed); 4 JSX files renamed `.js→.jsx`; `process.env.PUBLIC_URL` → `import.meta.env.BASE_URL` in 9 files; `"type": "module"`; first 4 data-integrity tests added (unique ids, schema, mainTech validity, referenced-media-exists). Dev server 30s → 0.5s, prod build 1.6s. Found for step 6: Bootstrap loads twice (CDN 5.0.1 in index.html + bundled 5.1.3), Home chunk 850 kB (eager Astronaut/three). | 1–2 days | kills the 68-vuln audit, ~10× dev-server speed, removes EOL platform |
| 5 | ✅ **Done 2026-06-10** — `portfolioData.js` 1,766 → 55 lines: projects now live one-per-file in `data/projects/` (scripted split via `scripts/split-portfolio-data.mjs`); the four key-based projects resolved back to English literals (data = EN source of truth, locale files = translations only, `getTranslatedProject`'s defaultValue bridges). Correction to §5: locale files already covered 22/28 projects — the real gap was the six new AI projects, now translated into DE/PL/ES (`scripts/merge-ai-project-translations.mjs`). Card layer is fully localized in all four languages; case-study modal bodies stay English by design (as before). | ~1 day | editing a project stops being a scroll hunt |
| 6 | Bundle diet: lazy-load `Astronaut`, drop axios/web-vitals/testing-library, replace Bootstrap with own utilities, complete-or-remove ARIA tabs | 0.5–1 day | faster first paint, honest a11y |
| 7 | Asset diet (§7) + CI with the §8 tests | 0.5 day | regression safety net |

Steps 0–3 are a weekend and require no architectural decisions. Step 4 is the only "project."

---

## 10. What's already at the bar

`AccessibleModal` + `useModal`, the disposal discipline in `Astronaut`, the `portfolioData` schema idea (typed-ish, media-aware, translation-capable), `.gitignore` hygiene (incl. AI-tooling state), conventional and descriptive recent commits, near-zero `console.log`, BEM-ish CSS naming, and four real locales. Stratum 3 is good engineering — the job is to make it the *only* stratum.

**One closing thought for the transition story:** this modernization is itself portfolio material. "Inherited a 3-year, 3-strata React codebase; rotated a leaked credential, deleted 1.4k dead LOC, consolidated three i18n systems, migrated CRA→Vite killing 68 audit findings, added data-integrity CI" — that's the same shape as your Quantum Performance case study, demonstrable on a public repo. Worth a short write-up when you do it.
