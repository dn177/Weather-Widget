# UX Review — Open Topics (2026-06-10)

Standalone backlog of everything still open from the original review. Code/structure items are done (see `CODE-REVIEW.md` roadmap, all ticked) and the i18n/content bugs are fixed (`REVIEW.md` §5). This file is only what remains — all of it design/content, none of it blocking.

| # | Topic | Impact | Effort |
|---|-------|--------|--------|
| 1 | Weather widget inside the Projects grid | High | S |
| 2 | Mobile hero headline contrast | High (mobile) | S |
| 3 | Recruiter essentials: CV, LinkedIn, About/education line | High | S |
| 4 | Project ordering + "Earlier work" archive tier | Medium | S |
| 5 | Real footer (incl. Impressum for the DE market) | Medium | S |
| 6 | Section diet: Badges / Hustle / Sustainability | Medium | M |
| 7 | Belay case-study modal: navigation for 12 sections | Medium | M |
| 8 | Card grid consistency (media ratio, CTA count) | Medium | M |
| 9 | "Input" heading + Learning section placement | Low | S |
| 10 | Pixelperfect legibility + blurred-image caption | Low | S |
| 11 | `/resources` page: grow or remove | Low | S |
| 12 | Scroll-behavior toggle placement | Low | S |

---

## 1. Weather widget inside the Projects grid
`Projects.jsx` renders the weather demo as the 5th grid slot via `WEATHER_GRID_POSITION` offset math. A recruiter scanning your strongest AI projects hits a city-input form between row 1 and row 2 — it reads as a layout accident, not a demo.
**Fix options (pick one):** (a) give it a normal project card (media = screenshot, "Read more" opens the live widget in the modal); (b) move it below the grid next to Learning; (c) archive it with the legacy tier. Option (a) preserves the "live demo" charm without breaking the scan flow. Removing the offset math also simplifies `Projects.jsx` and the load-more logic.

## 2. Mobile hero headline contrast
Your kicker fix landed (purple + light halo — works). The white role headline now has a soft `0 2px 16px rgba(0,0,0,.35)` shadow — better, but on the statue/lantern mid-tones at 390px it's still marginal. No scrim exists (`#header::before/::after` are unset).
**Fix:** a bottom-weighted gradient scrim behind the text block, mobile-only:
```css
@media (max-width: 600px) {
  #header { position: relative; }
  #header::after {
    content: ""; position: absolute; inset: 0;
    background: linear-gradient(180deg, transparent 35%, rgba(20, 4, 38, 0.55) 70%);
    pointer-events: none;
  }
  #header .header__container { position: relative; z-index: 1; }
}
```
Tune the stop to taste; the point is text contrast independent of the photo.

## 3. Recruiter essentials
Still absent anywhere on the site: a CV download, a LinkedIn link (GitHub + Medium exist in the hero only), and any mention of your math background (Analysis 1+2, LA 1+2, CoMa 1+2) — a real asset for the AI-research trajectory, currently invisible. Also missing: the one-liner that ties NutritionRAG/SelfHelpRAG/AIChat into a coherent story ("I run my own lab: DGX Spark, vLLM, Qdrant, Memgraph, Forgejo CI").
**Fix:** a short "About" block (hero or above Contact): 2–3 sentences (fullstack→AI path + math + the self-hosted lab), CV button, LinkedIn/GitHub icons. This is the highest ratio of recruiter-value to effort on the list.

## 4. Project ordering + archive tier
`sortOrder` puts Space Studio (−3.8, education/3D) above AIChat, MCP Servers, and SelfHelpRAG. For AI applications, the AI cluster should be unbroken: Belay → NutritionRAG → SelfHelpRAG/AIChat/MCP → CRM → Space Studio. Resource Orchestration still carries the `ai-ml` tag and appears in the AI/ML filter next to actual LLM systems — defensible, but it dilutes; consider dropping the tag.
The ~14 legacy projects stretch the page; "Load more" exists but the default view still mixes eras.
**Fix:** adjust `sortOrder` values; show `featured` only by default with an "Earlier work (14)" expander; keep Molar as the charming closer inside it.

## 5. Real footer (Impressum!)
The template footer was deleted as dead code (placeholder links to instagram.com etc.). The page now ends on the 3D scene with no footer at all. For a German commercial-adjacent site, **an Impressum (+ Datenschutzerklärung) is a legal expectation (§5 TMG/DDG)** — worth confirming your obligation, but most German freelancer portfolios carry one.
**Fix:** small footer: copyright, Impressum/Datenschutz links, GitHub/LinkedIn/Medium, "Built with React + Vite, self-hosted CI on a DGX Spark" flex line. (`footer.*` i18n keys still exist in the locale files — reusable.)

## 6. Section diet: Badges / Hustle / Sustainability
Unchanged from the original review: ~3,300px of LinkedIn quiz badges (German screenshots in every locale), hustle-culture imagery, and white-on-forest-photo text between your projects and the contact CTA.
**Fix directions:** Badges → one compact row or into the archive expander. Hustle → halve the height, or reframe as a short "since 2016" timeline. Sustainability → add a scrim panel (same pattern as #2) *and* connect it to something real — your on-device/on-prem work is genuinely the efficient-AI story; one sentence makes the section earn its place. If you don't want to invest: fold it into the footer as a single line.

## 7. Belay modal: 12 sections need navigation
The case study is now ~16k characters across 12 sections — excellent depth, zero wayfinding. Recruiters skim; engineers jump.
**Fix:** sticky mini-TOC (chips or numbered list) at the top of the modal body, anchor-scrolling within the scroll container; optionally collapse sections 4+ behind "Read the full engineering story". Also consider surfacing the demo video earlier — it's the strongest 37 seconds in the modal and currently sits in section 3.

## 8. Card grid consistency
Belay's card stacks 3 CTAs + a 3-line title next to single-button cards → uneven heights; dark app thumbnails are illegible at ~180px.
**Fix:** fixed 16:9 media area, `-webkit-line-clamp: 2` titles, max 2 visible CTAs (rest live in the modal), brighter/cropped thumbnails for dark UIs (zoom into a recognizable detail rather than full-window shots).

## 9. "Input" heading + Learning placement
`Portfolio.jsx` renders `<Learning />` under a hardcoded, untranslated `"Input"` h2 inside `#portfolio`. The books carousel is nice personal texture but sits oddly mid-page and inflates the portfolio section.
**Fix:** own `<section id="learning">` with a translated heading ("What I learn from" / "Lesestoff"), or move it near Badges in a condensed personal block.

## 10. Pixelperfect legibility
Heading is low-contrast on the parchment; the blurred client screenshots read as broken images at first glance.
**Fix:** text scrim or solid plate behind the heading; one-line caption "Client work — intentionally blurred (NDA)" under the comparison.

## 11. `/resources`
One accordion entry, not linked from the nav, English-only title in DE.
**Fix:** either grow it into a real "Notes/TIL" page (could be fed from your Obsidian vault — you have the pipeline for that…) or remove the route + add `noindex` until it has content.

## 12. Scroll-behavior toggle
Developer jargon ("Scroll: Auto / Contained") in prime real estate above the filters — and since the doctype fix restored native viewport scrolling, its original raison d'être is worth re-testing. If the contained-scroll cards still need it, move it behind the info icon or to the footer.

---

**Suggested batches:** #2+#3+#5 are one styling/content session (the recruiter-facing essentials). #1+#4+#9+#12 are one structural session in the portfolio section. #6+#7+#8+#10 are the visual-polish session. #11 is a rainy afternoon.
