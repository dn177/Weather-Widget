Here's my comprehensive code review of your React Portfolio Gallery.

---

## Code Review: React Portfolio Gallery

### 1. DESIGN PATTERNS

**Good patterns:**

- **Lazy loading + Suspense** (`Home.jsx`, `App.jsx`) — heavy components (Astronaut/Three.js, Pixelperfect) are code-split and loaded on demand. The Astronaut uses `useInView` to defer loading until scroll — excellent perf pattern.
- **Custom hooks** (`useInView`, `useModal`) — clean abstraction of reusable logic. `useModal` uses `useCallback` for stable references.
- **Portal-based modal** (`AccessibleModal.jsx`) — avoids z-index issues, proper focus trap, Escape handling, body scroll lock, ARIA attributes. This is a well-implemented accessible modal.
- **Data-driven architecture** — portfolio data split into separate files (`portfolioData.js`, `projectTranslations.js`, per-project data files), keeping components declarative.
- **i18n with URL detector** — custom `urlLanguageDetector` with `replaceState` to avoid history pile-up is a thoughtful pattern.

**Areas for improvement:**

- **No Context/Provider for shared state** — `ScrollBehaviorToggle` reads/writes `localStorage` independently, and `Sustainability` reaches into the DOM to manipulate `.crown` rendered by `Header`. A shared context or event bus would eliminate the cross-component coupling.
- **`useCallback` overuse in some places** — `Portfolio.jsx` wraps `filterProjectsHandler` in `useCallback`, but `Projects` and `ProjectsCategories` aren't `React.memo`-wrapped, so the memoization buys nothing. `useCallback` only matters when passed to memoized children.
- **Monolithic component (`Astronaut.jsx`)** — 2360 lines in one file. The scene initialization, material creation, mesh construction, and animation logic should be split into modules (e.g., `initScene.js`, `createAstronaut.js`, `createSpaceship.js`, `animations.js`).

---

### 2. PERFORMANCE

**Strengths:**

- Lazy loading of heavy chunks (Three.js scene, Pixelperfect)
- `loading="lazy"` on images, `preload="none"` on videos
- Responsive image `srcSet`/`sizes` on Contact and Hustle images
- `powerPreference: "high-performance"` on the WebGL renderer
- `logarithmicDepthBuffer` for better depth precision
- IntersectionObserver-based lazy mount for the Three.js scene
- Debounced search in Weather widget (500ms)
- `React.lazy` + `Suspense` for code-splitting

**Issues:**

- **`Astronaut.jsx` creates environment map inside `initScene` on every render** — the `createEnvironmentMap` function creates a `WebGLCubeRenderTarget` (256px cubemap) synchronously on mount. This is fine since it only runs once, but it's hidden deep inside the component.
- **No React.memo on list-heavy components** — `Projects.jsx`, `ProjectsCategories.jsx`, `Learning.jsx` all re-render on parent state changes without memoization.
- **`Home.jsx` re-renders all sections on every state change** — `useInView`'s `inView` state flip causes `Home` to re-render. The sections below are already-rendered static content that don't need to re-render.
- **`Sustainability.jsx` uses `document.querySelector(".crown")`** — direct DOM queries across components are fragile and bypass React's rendering model.
- **Typewriter re-renders on every character** — `currentIndex` state drives a new render per character. This is fine for a small string but would be expensive for long text.
- **Three.js cleanup creates new Vector3/objects in animation loop** — `updateCameraTarget` creates `new THREE.Vector3()` every frame. Should use a persistent vector and `.copy()`.
- **8000+ star particles + 150 asteroids + planets + nebulae + thruster particles** — this is a LOT of draw calls. Consider instanced rendering (`InstancedMesh`) for stars and debris.
- **Vite `test.environment: "node"`** — component tests needing DOM will need per-file `jsdom` overrides, which is cumbersome.

---

### 3. STATE MANAGEMENT

**Current approach:** Per-component `useState` + `useReducer` patterns. No global state management (no Context, no Redux, no Zustand).

**Strengths:**

- `useModal` hook centralizes modal open/close logic with stable `useCallback` refs.
- Portfolio filtering uses a clean derived-state pattern (`getProjectsByTechnology` called inside `useState` initializer, then re-derived on filter change).

**Issues:**

- **`ScrollBehaviorToggle` manages its own localStorage** but the value flows one-way to `Portfolio` via prop — this works, but if any other component needed the scroll behavior, you'd duplicate the logic.
- **No shared language state Context** — `useTranslation()` works fine via i18next's internal subscription, but components that need the _resolved_ language (like `LanguageSelector`) access `i18n.resolvedLanguage` directly. This is fine for i18next but inconsistent.
- **`Sustainability` mutates DOM outside React** (`document.querySelector(".crown")`) — this is the most problematic state pattern in the codebase. It creates a hidden dependency between unrelated components.
- **Weather widget state is local** — `weather`, `city`, `country`, `errorKey` all live in the widget. Good encapsulation, but the error-as-translation-key pattern (`errorKey` stores `"weather.errors.noData"` then translates at render) is clever but opaque.

---

### 4. BAD PRACTICES

| #   | File                      | Issue                                                                                                                                                                                                                                                                 | Severity |
| --- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | `Sustainability.jsx:27`   | `document.querySelector(".crown")` — cross-component DOM coupling                                                                                                                                                                                                     | High     |
| 2   | `Astronaut.jsx`           | 2360-line monolith — needs module splitting                                                                                                                                                                                                                           | High     |
| 3   | `Header.jsx:67`           | Inline SVG path is ~2000 chars of inline XML in JSX — should be a separate `.svg` import or component                                                                                                                                                                 | Medium   |
| 4   | `Project.jsx:15-16`       | `METRIC_RE` regex applied inline during render — `emphasizeMetrics` creates new React elements on every render, defeating reconciliation                                                                                                                              | Medium   |
| 5   | `Portfolio.jsx:4`         | `useState(() => getProjectsByTechnology("all"))` initializer is fine, but `filterProjectsHandler` calls `setProjects(getProjectsByTechnology(technology))` — the derived state pattern means `projects` is redundant; it could be computed directly from `activeTech` | Medium   |
| 6   | `Weather.jsx:28`          | Error stored as translation key string, not as a structured error object — fragile if translation keys change                                                                                                                                                         | Low      |
| 7   | `Astronaut.jsx:88-91`     | `eslint-disable react-hooks/exhaustive-deps` — the `initScene` function is defined inside the component, so it's not actually stable. Should be moved outside or wrapped in `useRef`                                                                                  | Medium   |
| 8   | `Header.jsx:14-19`        | Image preloading in `useEffect` with empty deps — fine, but `imageLoaded` state causes re-render. Could use a CSS `load` event on the `<img>` element instead                                                                                                         | Low      |
| 9   | `Astronaut.jsx`           | Multiple `createEmissiveMaterial` and `silverMetal`/`goldMetal` materials recreated inside `createEnhancedSpaceship` — these should be shared or memoized                                                                                                             | Low      |
| 10  | `index.jsx:6`             | `ReactDOM.createRoot` without `StrictMode` — missing `<React.StrictMode>` wrapper means no double-render detection for finding side-effect bugs                                                                                                                       | Medium   |
| 11  | `Astronaut.jsx:1777-1811` | Thruster particles created as individual `Mesh` objects (not `Points`/`BufferGeometry`) — 40+ meshes per engine × 5 engines = 200+ draw calls just for particles                                                                                                      | High     |
| 12  | `Learning.jsx:1`          | `eslint-disable no-script-url` — the comment claims false-positives on book titles, but the rule is disabled file-wide                                                                                                                                                | Low      |
| 13  | `Projects.jsx:38`         | `<WeatherGrid key="weather-grid" />` rendered conditionally inside the `showEarlier` block — the key is unnecessary and the conditional rendering pattern is unusual                                                                                                  | Low      |

---

### 5. PROPOSED TESTS

You already have `portfolioData.test.js` covering data integrity. Here's what's missing:

**A. Hook tests (pure logic, easy to test):**

```
hooks/useInView.test.js   — mock IntersectionObserver, verify inView flips
hooks/useModal.test.js    — verify open/close/toggle/isOpen state transitions
```

**B. Component tests (need jsdom):**

```
components/AccessibleModal.test.jsx  — focus trap, Escape closes, click-outside closes, ARIA attributes
components/Card.test.jsx             — renders children, passes className/onClick
ui/PageLoader.test.jsx               — renders with label, has aria-live
sections/navbar/LanguageSelector.test.jsx — renders all language buttons, active state
sections/portfolio/CategoryButton.test.jsx — renders label, aria-pressed
sections/portfolio/ScrollBehaviorToggle.test.jsx — localStorage read/write, button toggle
```

**C. Integration tests:**

```
sections/portfolio/Projects.test.jsx       — featured/earlier split, showEarlier toggle
sections/portfolio/ProjectsCategories.test.jsx — renders all categories, active state
sections/contacts/Contact.test.jsx         — renders contact links with correct hrefs
```

**D. i18n tests:**

```
i18n/urlLanguageDetector.test.js  — lookup() reads ?lang=, cacheUserLanguage writes URL
i18n/languages.test.js            — normalizeLanguage handles variants (en-GB → en)
sections/portfolio/projectTranslations.test.js — getTranslatedProject resolves keys
```

**E. Astronaut/Three.js** — skip unit tests; this needs visual regression testing (Playwright screenshots) since the output is a canvas. Your existing Playwright setup is perfect for this.

---

### 6. SUMMARY

**What's really good:** The accessibility work (`AccessibleModal`), the lazy-loading strategy, the i18n setup with URL-based language detection, the data integrity tests, and the thoughtful UX patterns (scroll behavior toggle, metric highlighting, case-study modals with mini-TOC).

**What needs work:** The `Astronaut.jsx` monolith (split into modules), the `Sustainability → Header` DOM coupling (use a shared context or custom event), missing `React.memo` on list components, the inline SVG path in `Header`, and adding `StrictMode` to `index.jsx`.

**Test coverage gap:** You have data integrity tests but no component or hook tests. The proposed test files above would give you meaningful coverage of the interactive parts of the app.
