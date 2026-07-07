# i18n Consistency Design

Date: 2026-07-07
Branch: `fix/i18n-consistency` (based on `main` after the Front Page & Ledger merge)
Review issue: Forgejo `cdtio33/react-portfolio` #5
Status: awaiting spec review

## Problem

The site ships four languages (en, de, pl, es) via i18next, but a Polish or Spanish
visitor sees a mix of languages on the portfolio grid:

1. **Two projects render fully in English.** `ornith-optimization` and
   `dflash-retrain` are the only 2 of 30 project ids with zero pl/de/es keys.
   `getTranslatedProject()` in `src/sections/portfolio/projectTranslations.js`
   calls `t(key, { defaultValue: <English literal> })` for every field, so a
   missing locale key silently renders the English source with no warning.
2. **Hardcoded strings bypass i18n.** The "Case study" kicker in
   `FlagshipCard.jsx`, "View Live" and "Overview" fallbacks and the video
   fallback line in `Project.jsx` / `ProjectDetailsPanel.jsx`, the "Featured"
   tag and "Input" heading, and roughly 15 aria-labels and alt texts
   (Navbar toggle, Close modal, Technology filters, social links, badge and
   book covers). Issue #5 lists a subset; part of it is stale because the grid
   redesign already added `portfolio.readMore` / `overview` / `highlights` to
   all locales.
3. **Case-study bodies are English only.** Nine projects carry
   `detailedContent` (about 11,500 words, 240 to 4,000 words each) that never
   passes through `t()`.
4. **Nothing guards against drift.** No missing-key handler, no locale parity
   test. English source text is split between `en.json` (18 projects) and
   literals in `data/projects/*.js` (12 projects).

Locale files are otherwise healthy: pl/de/es are strict key supersets of en;
the extra keys are translations for the literal-source projects plus Polish
plural forms, not stale entries.

## Decisions

Settled with Daniel on 2026-07-07:

- Case studies stay English by design, with a localized notice in the modal.
- All i18n work lands on `fix/i18n-consistency` on top of the merged redesign.
  `old-design` preserves the pre-merge main.
- Forgejo issue #5 is extended to cover this scope and serves as the review issue.
- Claude drafts the pl/de/es translations; Daniel reviews them in the PR.

## Design

### 1. Translate the two flagship projects

Add `projects.ornith-optimization.*` and `projects.dflash-retrain.*` blocks to
`pl.json`, `de.json`, `es.json`: title, description, highlights, summary,
stat label, and link labels (about 40 keys per locale). The English source
stays as literals in the data files, matching the convention used by the ten
other newer projects. No `en.json` blocks are added.

Technical terms follow the conventions already visible in the existing
translations of the other ml-systems entries (for example "coding decode
throughput" style metrics stay recognisable rather than being translated word
for word).

### 2. Route hardcoded strings through t()

Visible text:

- `FlagshipCard.jsx` "Case study" kicker: `t("portfolio.caseStudyKicker")`
- `Project.jsx` "View Live" fallbacks (2x), "Overview" literal fallback,
  "quick actions" aria suffix, video fallback line
- `ProjectDetailsPanel.jsx` video fallback line
- `Learning.jsx` "Featured" tag
- `Portfolio.jsx` "Input" heading

Aria-labels and alt text, under a shared `a11y.*` namespace as issue #5
proposes: Navbar "Toggle navigation", AccessibleModal "Close modal",
ProjectsCategories "Technology filters", the case-study modal navigation
label, LanguageSelector switch labels, Learning section source and badge
labels, Badges and Pixelperfect alt texts, Header social labels, Contact
image alt.

Deliberately untranslated: the language selector captions (EN/DE/PL/ES),
brand strings in PageLoader, and the dead `techCategories.*.label` values in
`portfolioData.js` (the rendered text already comes from
`t("portfolio.categories.*")`; the dead labels get a follow-up in the
code-health backlog, not here).

### 3. Case studies: English with a localized notice

A single new key, `portfolio.caseStudyEnglishNote`, rendered in the
case-study modal header area only when `i18n.resolvedLanguage !== "en"`.
The key exists in all four locales (the en value is never rendered but keeps
the parity test simple). Polish value: "Studium przypadku dostępne w języku
angielskim." The modal is plain DOM text, so browser translation
(Chrome, Edge) works on it today; the notice makes that path obvious.

Rejected alternatives:

- **Google Translate API**: the site is static on Strato (`/react` subpath,
  no backend), so an API key would ship to the client and cost per character.
- **transformers.js on-the-fly translation**: shipping a 40 to 100+ MB model
  per language pair for mediocre quality on dense technical prose does not fit
  the load budget.
- **Full human-reviewed translation of all nine studies**: about 34,500 words
  of review burden across three languages; can be revisited per study later.

### 4. Drift-guard test

Extend the existing vitest setup (`portfolioData.test.js` runs in node env)
with a locale-parity suite:

- every project id exported by the data layer has `projects.<id>` keys in
  pl, de, and es, except ids on an explicit `ENGLISH_BY_DESIGN` allowlist
  (empty after this fix lands);
- pl/de/es remain key supersets of `en.json` for shared namespaces
  (allowing plural-form variants);
- no locale value is an empty string;
- every `a11y.*` and `portfolio.*` key referenced by the fix exists in all
  four locales.

This turns the silent-English-fallback class of bug into a CI failure.

### 5. Suspect-value review list

Twelve locale values are verbatim English (mostly proper-noun titles such as
"Kanban Board", "Mathtron Vue Migration", plus three company-website link
labels). They are listed in the PR description for Daniel's judgment and are
not changed by this work.

## Out of scope

- Per-locale lazy loading of translation bundles (all four locales are
  eagerly bundled today; minor payload concern, separate issue).
- URL-path locale routing (`?lang=` query param stays).
- The Weather geocoding request hardcoding `language=en`.
- Case-study routes / shareable URLs (modal-only stays).
- Deleting the dead `techCategories.*.label` values.

## Testing

- New locale-parity vitest suite (section 4) plus the existing data-layer tests.
- Manual pass over the four languages in the dev preview: grid, flagship
  cards, details panels, case-study modal, learning section, navbar.
