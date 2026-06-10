# Portfolio Review — 2026-06-10

Reviewed: local dev build (`localhost:3199`), desktop 1440×900 + mobile 390×844, all sections, Belay case-study modal, AI/ML filter, `/resources`, DE/EN locales. Belay entry compared against `Belay/Docs/Overview.md` (933 lines). Screenshots in `.review-tmp/` (delete the folder when done).

**Verdict:** The positioning is already right — hero, title, meta description, and project ordering all say "AI engineer with fullstack depth." The case-study modal is genuinely strong work. What holds the site back: (1) the Belay entry is missing its newest, most interview-worthy features, (2) legacy sections (Weather-in-grid, Badges, Hustle, Sustainability) dilute the AI signal and eat ~4,200px of page, (3) a handful of real bugs (mobile hero contrast, i18n language override, `/resources` key warning).

---

## 1. What's already strong

- Hero headline "Fullstack engineer building on-prem AI systems" + matching `<title>`/meta/OG. Exactly the right one-liner for your transition.
- Project ordering leads with Belay → CRM Performance → NutritionRAG. The AI/ML filter returns a coherent 6-project story (Belay, NutritionRAG, AIChat, MCP Servers, Resource Orchestration, SelfHelpRAG).
- The case-study modal design (numbered sections, captioned screenshots, tech chips, cream paper background) reads like a real engineering write-up, not marketing. Best part of the site.
- Write-up honesty is a differentiator: the `contain: strict` pitfall, the IFEval-vs-leaderboard reasoning, "on-device is slower and weaker — remote stays the quality path." Interviewers notice this.
- Clean console on the home page, Escape closes the modal, focus returns correctly.

---

## 2. Belay entry vs. Overview.md — the gap analysis

The entry covers the core loop, state bridge, on-device/utilityProcess story, verify→repair, CSS-sanitizer security, and the 3→80 marketplace well. But the **entire "documents" pillar and the browser pane are absent** — and those are your newest, most security-rich features.

### Missing entirely (high value)

**A. The PDF reader + visual Q&A (Overview §9).** Not one word in the portfolio about: host-rendered pdf.js viewer (bitmap-only, `isEvalSupported:false`, pdf.js as the explicit trust boundary in the renderer, not main), lazy bounded rendering (~17 MB per retina page canvas → eager would be ~1 GB for a 60-page paper, lazy keeps it ~50 MB flat), content-addressed storage (`sha256.pdf`, IndexedDB on web) with a recoverable "PDF not found" state, and drag-a-box-over-a-formula → vision answer. "Read an arXiv paper and ask about the boxed equation" is *the* AI-engineering demo scenario.

**B. Pinned annotations (Overview §9).** The whole annotation layer: PDF pins as normalized-rect on-page markers that re-anchor at any zoom, draggable/resizable re-read popovers, snapshot pins for opaque-origin artifacts (and *why* a live anchor is impossible there — that reasoning is portfolio gold), the notes panel, export as re-importable bundle / self-contained study report, re-import restoring every pin.

**C. In-app browsing / the localhost companion (Overview §18).** Arguably the strongest systems-security story in the app and it's completely absent: native `WebContentsView` pane, two modes with two sessions and two policies, DNS names admitted only if **every** resolved IP is private, the remote proxy dialing the **validated literal IP** to close DNS-rebinding, page text fenced as untrusted data in a **dedicated thread that is never persisted/vaulted/embedded**, region→vision on live pages (opt-in, cloud-only, with disclosure), and `.pdf` navigation routing into your own reader. This maps 1:1 to prompt-injection/agent-security interview questions.

### Missing, worth a bullet each

- **Reviewer beyond exercises (§7):** `reviewTargets` for chat replies + pinned answers, deliberately asymmetric (verify stays exercise-only — prose has no executable test), fail-open, staleness-guarded, skips reviewer==generator. The portfolio still describes the reviewer as exercise-only.
- **Document import/export (§9):** md → prose doc, CSV/TSV → interactive sortable table via a deterministic, model-free conversion through the same verify path; export self-contained `.html`.
- **Proactive tutoring (§8):** stuck detection from live state (idle, rising `attempts`, stuck `lastError`), capped nudges. Fits perfectly in the "Graded Help That Fades" section.
- **KaTeX in chat (§3):** lazy-loaded only when a message contains math.
- **Templates & deep-linking (§16):** `?template=<slug>` opening a seeded lesson in a fresh session — currently only mentioned as a security validation note, not as the "Open in Belay" marketplace feature it powers.
- Minor: shareable themes (sanitizer re-run on import + staged confirm), artifact-theme pinning with sandboxed live preview, finish notifications/practice reminders.

### Suggested edits (ready to adapt)

1. New section after "Graded Help That Fades": **"Documents: Read, Ask, Annotate"** — combine A + B (4–6 bullets, use `belay-annotate.webp` or a new PDF-pin screenshot).
2. New section near the security material: **"A Bounded Browser Beside the Tutor"** — C in 4–5 bullets, closing with the never-persisted isolated thread.
3. Extend the reviewer bullet in "Verify → Self-Repair" with the prose targets + fail-open design.
4. Add proactive tutoring + KaTeX + import/export as single bullets in existing sections.
5. Hero description: after "…80-template catalog across eight domains", consider "…, imports your own papers and documents for region-pinned Q&A, and can drive the real tool (ComfyUI, Open WebUI) in a bounded in-app browser beside the tutor."
6. `highlights[]` (4 entries) deserves a 5th: e.g. "Reads your PDFs too — region-pinned visual Q&A with annotations that export and re-import" or the DNS-rebinding browse boundary.
7. Date says `2026-06-01`; if you add the new features, bump it.

---

## 3. Projects review (beyond Belay)

- **CRM Performance (quantum):** Excellent depth; the INP decomposition framing is memorable. It's also *very* long — consider leading with a compact metrics row (264–2,288 ms → ~16 ms; 3–5 s → sub-second; 15k LOC removed). The backend/DSGVO sections broaden it nicely. Properly translated (only project with i18n keys — see §5).
- **NutritionRAG:** Your second-best AI asset. Eval-driven tuning (3/8 → 6/8), named-KB A/B variants, graph+vector router, reranker threshold calibration, the reasoning-token-leak fix — this is working-AI-engineer material. Consider `sortOrder` directly after Belay for AI applications.
- **SelfHelpRAG:** Good, compact. The eval harness + injection-aware prompt contract are the selling points; the description could state the eval numbers like NutritionRAG does.
- **AIChat:** Fine as a supporting piece; the SSE state machine is the hook.
- **MCP Servers:** Niche and good. "Tested against real client design files" is a nice touch.
- **Resource Orchestration:** Strong systems signal. The `ai-ml` tag is a stretch — it shows up in the AI/ML filter next to actual LLM systems; consider dropping the tag and letting it live as the systems/Rust entry (it strengthens "infra for AI" indirectly anyway).
- **Space Studio:** Impressive but not AI; at `sortOrder -3.8` it outranks AIChat, MCP, SelfHelpRAG. Suggest moving below the AI cluster.
- **Legacy tier (Kanban, Car Platform, Chart, cdnManager (jQuery), Emmet demo, Molar 2016, Company Website…):** ~14 projects below the fold stretch the page to ~12,300px and dilute. Suggest a collapsed "Earlier work" / archive group, or `featured`-only by default with a "show all" toggle. Keep Molar — "featured on iDownloadBlog in 2016" is a fun closer — but it doesn't need a full card slot by default.
- **Two data files exist** (`data.js` legacy + `portfolioData.js` active). `data.js` appears unused by the current Portfolio section — delete or clearly mark it; it confused this review and will confuse the next reader too.

**Positioning gaps (site-wide):**
- No CV download, no LinkedIn link anywhere (GitHub + Medium icons in hero only). For recruiter flows, add both — hero or contact.
- No about/education line. You have Analysis 1+2, LA 1+2, CoMa 1+2 — for an AI-research trajectory that math background is a real asset and currently invisible.
- The site never says *where the AI work runs*: a one-liner about the self-hosted DGX Spark lab (vLLM, Qdrant, Memgraph, Forgejo CI) would tie NutritionRAG/SelfHelpRAG/AIChat into one coherent "I run my own stack" narrative. Right now that story only emerges if someone reads three modals.

---

## 4. Design review

### High priority
1. **Weather widget sits inside the Projects grid** (between card rows 1 and 2, `03-portfolio-grid.jpeg`). A recruiter scanning projects hits a city-input + 5-day forecast block — it reads as a rendering accident, and its vertical "M-a-x / M-i-n" letter stacking looks broken. Move it to a card like every other demo, or into the archive tier.
2. **Mobile hero contrast** (`12-mobile-hero.jpeg`): "DANIEL MARASS" (purple) and the white headline sit directly on the statue/lantern with no scrim — barely legible. Add a dark gradient overlay behind the text block on small viewports.
3. **Sustainability section** (`09-sustainability.jpeg`): white text on a busy forest photo; the heading disappears entirely where it crosses the purple sun mark. Needs a scrim/panel — or fold the section into a single line, and (better) connect it to something real you do (on-prem efficiency, on-device inference = data-frugal + energy-aware).

### Medium
4. **Badges section** (`07-badges.jpeg`): LinkedIn jQuery/CSS quiz badges are junior signals that contradict the senior-AI story, and the screenshots are German inside the EN locale. The self-aware caption helps, but ~950px for this is too much. Condense to one row or move to archive.
5. **Hustle section** (`08-hustle.jpeg`): personal and charming, but ~1,200px of hustle-culture imagery (4 AM clock, "Winning" books) between your projects and contact. Consider shrinking; some reviewers read this framing as a red flag rather than dedication.
6. **Pixelperfect** (`06-pixelperfect.jpeg`): the heading is low-contrast on the parchment, and the blurred client screenshots read as "broken image" at first glance. A caption like "client work, intentionally blurred" would fix the ambiguity cheaply.
7. **Card grid**: title wraps to 3 lines next to 3 stacked CTA buttons (Belay) vs 1 button elsewhere → uneven card heights; thumbnails of dark app UIs are illegible at ~180px. Consider 16:9 media at consistent height + max 2 visible CTAs (move the rest into the modal).

### Low / polish
8. "Scroll: Auto / Contained" toggle above the filters is developer jargon in prime real estate. Move to footer or behind the info icon.
9. The page ends on the 3D astronaut scene with no footer: the lazy `Footer` import in `Home.jsx` is never rendered (matching the eslint warning, with unused `SolarSystem` import). Either render it (imprint/links belong there in DE markets) or delete the dead code.
10. Mobile modal: close button slightly overlaps the title text (`14-mobile-belay-modal.jpeg`).
11. `body` is the scroll container (`overflow: hidden auto` + smooth-scroll). It already cost this review some scripted scrolling; it also breaks browsers' native scroll restoration and `window.scrollTo` expectations. Worth revisiting.

---

## 5. Bugs & technical findings

1. **i18n override bug:** ✅ *fixed 2026-06-10* — root cause was `urlLanguageDetector`'s whitelist frozen at `['en','de']`; now normalizes region codes against a shared `SUPPORTED_LANGUAGES` (see CODE-REVIEW.md roadmap #3).
2. **`<html lang>` stays "en":** ✅ *fixed 2026-06-10* — synced via `languageChanged` listener in `i18n.js`.
3. **Mixed-language cards:** Belay and all newer AI projects are hardcoded English while UI chrome + CRM project translate (DE shows "Fallstudie lesen" next to "Try the live demo"). Either run them through `projectTranslations.js` like quantum-performance, or deliberately keep all project content English in every locale — current half-half looks unpolished, especially for DE recruiters.
4. **`/resources`:** React "unique key prop" warning (`Resources` render, the `<details>` list); page contains a single accordion entry, isn't linked from the nav, and renders an English-only title in DE. Grow it, or remove/noindex.
5. Build warnings: unused `SolarSystem`/`Footer` in `Home.jsx`; deprecated `color-adjust` (Bootstrap), `end` value in `Weather.css`; outdated browserslist DB.
6. CRA (`react-scripts 5`) is EOL-adjacent and slow; Vite migration is the obvious infra refresh whenever you touch this next (you already use Vite everywhere else — it's also consistency of story).
7. SEO basics are good: one `h1`, OG/Twitter cards, canonical `cdtio33.com`, descriptive title/meta. The OG image URL (`/1-desktop.jpg`) — verify it still exists and shows the current hero.

---

## 6. Prioritized action list

| # | Action | Effort | Impact |
|---|--------|--------|--------|
| 1 | ~~Add missing Belay sections (PDF/annotations, browser pane, reviewer-prose, proactive)~~ ✅ Done 2026-06-10 (incl. ResearchPapers video, pinned-explanations + Unsloth-browse media, section-video renderer support) | M | High — your strongest project currently undersells its newest work |
| 2 | Move weather widget out of the Projects grid | S | High |
| 3 | Mobile hero scrim | S | High |
| 4 | CV download + LinkedIn link; one-line math/education + DGX-lab "my stack" blurb | S | High for recruiter flows |
| 5 | i18n: URL override, `<html lang>` sync, decide EN-only vs translated project content | S–M | Medium-High |
| 6 | Reorder: NutritionRAG + SelfHelpRAG up, Space Studio down; drop `ai-ml` tag from Resource Orchestration; archive legacy tier | S | Medium |
| 7 | Condense Badges / Hustle / Sustainability (or restyle with scrims) | M | Medium |
| 8 | Fix `/resources` key warning + decide page's fate; clean dead code (`data.js`, `Footer`, `SolarSystem`) | S | Low-Medium |
| 9 | Card grid consistency (media ratio, CTA count) | M | Medium |
| 10 | Longer term: CRA → Vite | L | Low (DX) |

---

*Screenshots referenced: `.review-tmp/*.jpeg` (hero, grid, weather-in-grid, Belay modal ×2, pixelperfect, badges, hustle, sustainability, astronaut/footer, AI/ML filter, mobile ×3, resources, contact). The folder is temporary — delete it whenever.*
