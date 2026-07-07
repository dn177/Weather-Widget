# i18n Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eliminate every English leak on the de/pl/es locales of the portfolio (untranslated flagship cards, untranslated summaries and stat labels, hardcoded UI strings, the CSS-generated modal label) and add a field-level drift-guard test so the leak class cannot recur.

**Architecture:** All fixes ride the existing i18next pipeline. Card fields keep the `t(key, { defaultValue: <English literal> })` convention from `projectTranslations.js`; missing locale keys get filled, hardcoded strings get keys, and a new vitest suite derives the required key paths from the source data shape so any future gap fails CI.

**Tech Stack:** React 18, i18next/react-i18next, Vite 8, vitest 4 (node env).

**Spec:** `docs/superpowers/specs/2026-07-07-i18n-consistency-design.md` (approved on Forgejo issue #5, comment 179).

## Global Constraints

- Branch: `fix/i18n-consistency`. Remote: `forg` (Forgejo `cdtio33/react-portfolio`). Never push `main`.
- **Two sessions share this checkout.** Grid "design round 5" (`companion` renamed to `plate`, interleave replaced by a strict tier hierarchy, flagships now five including nutrition-rag-autonomous) is committed on the unmerged branch `feat/grid-hierarchy` (45570ff). Before EVERY commit, run `git branch --show-current` and confirm it prints `fix/i18n-consistency`; if the checkout is on another branch, stop and coordinate instead of switching it out from under the other session (a temporary `git worktree add` for `fix/i18n-consistency` is the safe alternative). Every `git add` in this plan is path-scoped; never use `git add -A`, `git add .`, or `git commit -a`. Anchor edits on strings, not line numbers, and re-read each file before editing: `fix/i18n-consistency` is based on `main` (32f013a), so if `feat/grid-hierarchy` merges first, rebase onto the result before executing; Project.jsx, IndexCard.jsx, Projects.jsx, and portfolio.css differ between the branches.
- No em dashes in any prose or translation (user style rule). No "not X, but Y" constructions.
- Client anonymity: quantum-performance is "an enterprise CRM", never a client name.
- Decimal numbers in de/pl/es translations use commas (24,3 tok/s), matching the existing locale style. Technical terms (pass@1, tok/s, roofline, self-distillation, MoE, bf16, n_max, INP, MCP, RAG) stay untranslated.
- Locale JSON shape: `projects.<id>` blocks use objects with keys `title`, `description`, `highlights` (numeric-string-keyed object: `"0"`, `"1"`, ...), `links` (same, only when the source project has links), plus the NEW `summary` and `statLabel` string keys this plan introduces.
- Every commit message ends with: `Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>`
- Test command: `npm test` (runs `vitest run`). Single file: `npx vitest run <path>`.

---

### Task 1: Field-level locale-parity drift guard (red)

**Files:**
- Create: `src/i18n/localeParity.test.js`

**Interfaces:**
- Produces: `REQUIRED_UI_KEYS` array inside the test file. Tasks 3, 4, and 5 each append their new key names to it (exact names listed in those tasks).
- Consumes: `portfolioProjects` from `src/sections/portfolio/portfolioData.js` (array of raw English project objects with `id`, `highlights[]`, `links[]`, optional `stat`).

- [ ] **Step 1: Write the test file**

```js
import { describe, it, expect } from "vitest";
import { portfolioProjects } from "../sections/portfolio/portfolioData";
import en from "./locales/en.json";
import de from "./locales/de.json";
import pl from "./locales/pl.json";
import es from "./locales/es.json";

const ALL_LOCALES = { en, de, pl, es };
const TRANSLATED_LOCALES = { de, pl, es };

// Projects whose card fields may stay English on purpose. Must be empty
// after the i18n consistency fix lands; the drift guard exists so a new
// project cannot ship untranslated by accident (Forgejo issue #5).
const ENGLISH_BY_DESIGN = [];

// UI keys introduced by the i18n consistency fix. Grown by later tasks;
// every locale must carry every one of them.
const REQUIRED_UI_KEYS = [];

const flatten = (obj, prefix = "") =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      Object.assign(acc, flatten(value, path));
    } else {
      acc[path] = value;
    }
    return acc;
  }, {});

// Every key path getTranslatedProject() consumes for a project. The
// fallback in projectTranslations.js is PER FIELD, so a partial block
// still leaks English; presence of the block alone proves nothing.
const requiredPathsFor = (project) => {
  const base = `projects.${project.id}`;
  return [
    `${base}.title`,
    `${base}.description`,
    `${base}.summary`,
    ...(project.highlights ?? []).map((_, i) => `${base}.highlights.${i}`),
    ...(project.links ?? []).map((_, i) => `${base}.links.${i}`),
    ...(project.stat ? [`${base}.statLabel`] : []),
  ];
};

describe("locale parity", () => {
  const flat = Object.fromEntries(
    Object.entries(ALL_LOCALES).map(([name, tree]) => [name, flatten(tree)])
  );

  it.each(Object.keys(TRANSLATED_LOCALES))(
    "%s translates every field of every project",
    (locale) => {
      const missing = [];
      for (const project of portfolioProjects) {
        if (ENGLISH_BY_DESIGN.includes(project.id)) continue;
        for (const path of requiredPathsFor(project)) {
          if (!(path in flat[locale])) missing.push(path);
        }
      }
      expect(missing).toEqual([]);
    }
  );

  it.each(Object.keys(TRANSLATED_LOCALES))(
    "%s carries every key en.json has",
    (locale) => {
      const missing = Object.keys(flat.en).filter(
        (key) => !(key in flat[locale])
      );
      expect(missing).toEqual([]);
    }
  );

  it.each(Object.keys(ALL_LOCALES))("%s has no empty values", (locale) => {
    const empty = Object.entries(flat[locale])
      .filter(([, value]) => typeof value === "string" && !value.trim())
      .map(([key]) => key);
    expect(empty).toEqual([]);
  });

  it.each(Object.keys(ALL_LOCALES))(
    "%s carries every UI key referenced by the i18n fix",
    (locale) => {
      const missing = REQUIRED_UI_KEYS.filter((key) => !(key in flat[locale]));
      expect(missing).toEqual([]);
    }
  );
});
```

- [ ] **Step 2: Run it and confirm it fails for the right reason**

Run: `npx vitest run src/i18n/localeParity.test.js`

Expected: FAIL. The per-project assertions for de, pl, and es must each list (at minimum): every `projects.ornith-optimization.*` and `projects.dflash-retrain.*` path, `projects.<id>.summary` for all 30 project ids, and `projects.<id>.statLabel` for belay, quantum-performance, nutrition-rag-autonomous, mcp-servers, and space-studio. The superset, empty-value, and UI-key assertions pass. If the failure list differs materially, stop and reconcile against `git log -1 -- src/i18n/locales` before proceeding.

- [ ] **Step 3: Do NOT commit yet**

The test is red by design. Task 2 commits this file together with the locale data that turns it green, so the branch history never contains a red test.

---

### Task 2: Fill the locale gaps (green)

**Files:**
- Modify: `src/i18n/locales/pl.json`, `src/i18n/locales/de.json`, `src/i18n/locales/es.json`
- Commit together with: `src/i18n/localeParity.test.js` (from Task 1)

**Interfaces:**
- Consumes: `requiredPathsFor()` failure output from Task 1 as the work list.
- Produces: complete `projects.*` coverage; later tasks assume the parity suite passes.

- [ ] **Step 1: Add full blocks for the two untranslated flagships**

Insert into the `projects` object of each locale file (alphabetical/nearby placement consistent with the existing blocks). `highlights` are numeric-string-keyed objects. Neither project has links, so no `links` key.

**pl.json:**

```json
"ornith-optimization": {
  "title": "Optymalizacja LLM 397B na DGX Spark (GB10)",
  "description": "Dwa oparte na pomiarach eksperymenty na self-hostowanym LLM 397B (2-bitowy MoE) na jednym DGX Spark. Analiza roofline i strojenie dekodowania spekulatywnego podniosły przepustowość dekodowania kodu o 31%, do 24,3 tok/s. Prerejestrowane badanie sterowania aktywacjami zwróciło potem czysty wynik zerowy (statyczny wektor kontrolny zmienił coding pass@1 o -2,1 punktu, przedział ufności obejmuje zero), a trójdzielny podział danych wychwycił fałszywy pozytyw; wyniki negatywne raportowane konsekwentnie.",
  "summary": "Dwa oparte na pomiarach eksperymenty na self-hostowanym LLM 397B (2-bitowy MoE) na jednym DGX Spark: strojenie dekodowania spekulatywnego podniosło przepustowość dekodowania kodu o 31%, a prerejestrowane badanie sterowania zwróciło czysty wynik zerowy.",
  "statLabel": "przepustowość dekodowania kodu",
  "highlights": {
    "0": "+31% przepustowości dekodowania kodu (24,3 tok/s), +79% względem wcześniejszej konfiguracji produkcyjnej, przez strojenie dekodowania spekulatywnego bez żadnego retreningu",
    "1": "Zdiagnozowano raportowany 'acceptance rate' jako artefakt logowania; prawdziwa akceptacja pierwszej pozycji ≈ 87%",
    "2": "Zmierzono sufit megakernela na ~0% przerw bezczynności zanim cokolwiek zbudowano, zamieniając potencjalny ślepy zaułek w decyzję podjętą w jeden dzień",
    "3": "Prerejestrowane badanie sterowania aktywacjami zwróciło czysty wynik zerowy: statyczny wektor kontrolny zmienił coding pass@1 o -2,1 punktu, przedział ufności obejmuje zero",
    "4": "Trójdzielny podział się opłacił: wynik +2 punkty na zbiorze dev odwrócił się do -2 punktów na zamrożonym zbiorze dotykanym raz, więc strojenie i raportowanie na jednym zbiorze wypuściłoby regresję"
  }
},
"dflash-retrain": {
  "title": "Retrening spekulatywnego draftera LLM 397B na DGX Spark",
  "description": "Retrening draftera dekodowania spekulatywnego dla self-hostowanego LLM 397B (2-bitowy MoE) metodą self-distillation: przechwycony z serwera produkcyjnego, wytrenowany, przepuszczony przez bramki jakości i odesłany na produkcję w jeden dzień na jednym DGX Spark. Wytrenowany drafter osiąga 25,77 tok/s, +6,0% względem strojonej bazy 24,3 tok/s, a 15-agentowa recenzja adwersarialna wychwyciła błąd treningu, który sfałszowałby wynik zerowy.",
  "summary": "Retrening draftera dekodowania spekulatywnego dla self-hostowanego LLM 397B: przechwycony, wytrenowany, przepuszczony przez bramki i wdrożony z powrotem na produkcję w jeden dzień na jednym DGX Spark: 25,77 tok/s, +6,0% ponad strojoną bazę.",
  "statLabel": "tok/s dekodowania po 12-minutowym retreningu",
  "highlights": {
    "0": "Retrening draftera spekulatywnego 1,29B przez self-distillation i wdrożenie na produkcję tego samego dnia: 24,3 do 25,77 tok/s (+6,0%), przy około 12 minutach treningu na GPU",
    "1": "15-agentowa recenzja adwersarialna wychwyciła czysto-bf16 AdamW zaokrąglający 87,2% aktualizacji parametrów do zera, błąd, który sfałszowałby wniosek 'self-distillation nie pomaga'",
    "2": "Zysk przyszedł z ogona: akceptacja po retreningu spada powoli z głębokością draftu, przesuwając optymalne n_max z 2 na 4 i monetyzując głębokie drafty, których dotychczasowy drafter nie umiał wykorzystać",
    "3": "Całość end-to-end na współdzielonej maszynie produkcyjnej, z 10× większym korpusem zbieranym teraz przez nocne okna crona, które przywracają endpoint do 07:00"
  }
}
```

**de.json:**

```json
"ornith-optimization": {
  "title": "Optimierung eines 397B-LLM auf einem DGX Spark (GB10)",
  "description": "Zwei messgetriebene Experimente an einem self-hosted 397B-LLM (2-Bit-MoE) auf einem einzelnen DGX Spark. Roofline-Analyse und Tuning des spekulativen Decodings hoben den Coding-Decode-Durchsatz um 31% auf 24,3 tok/s. Eine vorregistrierte Activation-Steering-Studie lieferte anschließend ein sauberes Nullergebnis (ein statischer Kontrollvektor verschob coding pass@1 um -2,1 Punkte, das Konfidenzintervall schließt null ein); der dreigeteilte Split fing ein falsch positives Ergebnis ab, negative Resultate wurden durchgehend diszipliniert berichtet.",
  "summary": "Zwei messgetriebene Experimente an einem self-hosted 397B-LLM (2-Bit-MoE) auf einem DGX Spark: Tuning des spekulativen Decodings hob den Coding-Decode-Durchsatz um 31%, eine vorregistrierte Steering-Studie lieferte ein sauberes Nullergebnis.",
  "statLabel": "Coding-Decode-Durchsatz",
  "highlights": {
    "0": "+31% Coding-Decode-Durchsatz (24,3 tok/s), +79% gegenüber der vorherigen Produktionskonfiguration, durch Tuning des spekulativen Decodings ohne Retraining",
    "1": "Die berichtete 'Acceptance Rate' als Logging-Artefakt diagnostiziert; echte Akzeptanz an erster Position ≈ 87%",
    "2": "Die Megakernel-Obergrenze vor dem Bau bei ~0% Idle-Gap gemessen und damit eine potenzielle Sackgasse in eine Ein-Tages-Entscheidung verwandelt",
    "3": "Vorregistrierte Activation-Steering-Studie mit sauberem Nullergebnis: ein statischer Kontrollvektor verschob coding pass@1 um -2,1 Punkte, das Konfidenzintervall schließt null ein",
    "4": "Der dreigeteilte Split hat sich bezahlt gemacht: ein +2-Punkte-Ergebnis auf dem Dev-Set kehrte sich auf dem einmal angefassten Frozen-Set zu -2 Punkten um; Tuning und Reporting auf einem einzigen Set hätte eine Regression ausgeliefert"
  }
},
"dflash-retrain": {
  "title": "Retraining des spekulativen Drafters eines 397B-LLM auf einem DGX Spark",
  "description": "Self-Distillation-Retraining des Speculative-Decoding-Drafters für ein self-hosted 397B-LLM (2-Bit-MoE): vom Produktionsserver mitgeschnitten, trainiert, durch Qualitäts-Gates geprüft und am selben Tag auf einem DGX Spark zurück in Produktion gebracht. Der neu trainierte Drafter läuft mit 25,77 tok/s, +6,0% über der getunten 24,3-tok/s-Baseline, und ein adversariales Review mit 15 Agenten fing einen Trainings-Bug ab, der ein Nullergebnis vorgetäuscht hätte.",
  "summary": "Self-Distillation-Retraining des Speculative-Decoding-Drafters für ein self-hosted 397B-LLM, mitgeschnitten, trainiert, durch Gates geprüft und in einem Tag auf einem DGX Spark zurück in Produktion: 25,77 tok/s, +6,0% über der getunten Baseline.",
  "statLabel": "Decode-tok/s nach 12 Minuten Retraining",
  "highlights": {
    "0": "Den 1,29B-Speculative-Drafter per Self-Distillation neu trainiert und noch am selben Tag in Produktion gebracht: 24,3 auf 25,77 tok/s (+6,0%), mit rund 12 Minuten GPU-Training",
    "1": "Ein adversariales Review mit 15 Agenten fing einen reinen bf16-AdamW ab, der 87,2% der Parameter-Updates auf null rundete, ein Bug, der ein 'Self-Distillation bringt nichts'-Nullergebnis vorgetäuscht hätte",
    "2": "Der Gewinn kam aus dem Tail: die Akzeptanz nach dem Retraining fällt mit der Draft-Tiefe nur langsam ab, verschob das optimale n_max von 2 auf 4 und machte tiefe Drafts nutzbar, die der ausgelieferte Drafter nicht verwerten konnte",
    "3": "End-to-end auf einer geteilten Produktionsmaschine, mit einem 10×-Korpus, den jetzt nächtliche Cron-Fenster einsammeln und den Endpoint per Trap-Restore bis 07:00 wiederherstellen"
  }
}
```

**es.json:**

```json
"ornith-optimization": {
  "title": "Optimización de un LLM de 397B en un DGX Spark (GB10)",
  "description": "Dos experimentos guiados por mediciones sobre un LLM de 397B autoalojado (MoE de 2 bits) en un solo DGX Spark. El análisis roofline y el ajuste del decodificado especulativo elevaron el throughput de decodificado de código un 31%, hasta 24,3 tok/s. Un estudio prerregistrado de activation steering devolvió después un nulo limpio (un vector de control estático movió coding pass@1 en -2,1 puntos, el intervalo de confianza incluye el cero), con la partición triple atrapando un falso positivo y resultados negativos reportados con disciplina.",
  "summary": "Dos experimentos guiados por mediciones sobre un LLM de 397B autoalojado (MoE de 2 bits) en un DGX Spark: el ajuste del decodificado especulativo elevó el throughput de decodificado de código un 31% y un estudio prerregistrado de steering devolvió un nulo limpio.",
  "statLabel": "throughput de decodificado de código",
  "highlights": {
    "0": "+31% de throughput de decodificado de código (24,3 tok/s), +79% sobre la configuración de producción anterior, ajustando el decodificado especulativo sin reentrenar",
    "1": "El 'acceptance rate' reportado se diagnosticó como artefacto de logging; la aceptación real en primera posición ≈ 87%",
    "2": "El techo del megakernel se midió en ~0% de idle-gap antes de construirlo, convirtiendo un posible callejón sin salida en una decisión de un día",
    "3": "El estudio prerregistrado de activation steering devolvió un nulo limpio: un vector de control estático movió coding pass@1 en -2,1 puntos, el intervalo de confianza incluye el cero",
    "4": "La partición triple valió la pena: un resultado de +2 puntos en dev se invirtió a -2 puntos en el conjunto congelado de un solo uso, así que ajustar y reportar sobre un único conjunto habría enviado una regresión"
  }
},
"dflash-retrain": {
  "title": "Reentrenar el drafter especulativo de un LLM de 397B en un DGX Spark",
  "description": "Reentrenamiento por self-distillation del drafter de decodificado especulativo de un LLM de 397B autoalojado (MoE de 2 bits): capturado del servidor de producción, entrenado, validado con gates y devuelto a producción en un día en un solo DGX Spark. El drafter reentrenado corre a 25,77 tok/s, +6,0% sobre la baseline ajustada de 24,3 tok/s, y una revisión adversarial de 15 agentes atrapó un bug de entrenamiento que habría falseado un nulo.",
  "summary": "Reentrenamiento por self-distillation del drafter de decodificado especulativo de un LLM de 397B autoalojado: capturado, entrenado, validado y devuelto a producción en un día en un DGX Spark: 25,77 tok/s, +6,0% sobre la baseline ajustada.",
  "statLabel": "tok/s de decodificado tras un reentrenamiento de 12 minutos",
  "highlights": {
    "0": "Reentrenó el drafter especulativo de 1,29B por self-distillation y lo llevó a producción el mismo día: de 24,3 a 25,77 tok/s (+6,0%), con unos 12 minutos de entrenamiento en GPU",
    "1": "Una revisión adversarial de 15 agentes atrapó un AdamW en bf16 puro que redondeaba a cero el 87,2% de las actualizaciones de parámetros, un bug que habría falseado el nulo de 'la self-distillation no ayuda'",
    "2": "La ganancia vino de la cola: la aceptación reentrenada decae despacio con la profundidad del draft, moviendo el n_max óptimo de 2 a 4 y monetizando drafts profundos que el drafter anterior no podía aprovechar",
    "3": "Corrió end-to-end en una máquina de producción compartida, con un corpus 10× ahora capturado por ventanas nocturnas de cron que restauran el endpoint antes de las 07:00"
  }
}
```

- [ ] **Step 2: Add `summary` translations for the 8 other projects with an explicit source summary**

Add a `"summary"` key inside the existing `projects.<id>` block of each locale:

| id | pl | de | es |
|---|---|---|---|
| belay | Tutor AI, który buduje działającą, odizolowaną przestrzeń ćwiczeń, odczytuje realne postępy przez ustrukturyzowany mostek stanu i udziela stopniowanej pomocy, która zanika w miarę postępów. Dostępny jako aplikacja Electron i webowa wersja bez instalacji. | Ein KI-Tutor, der einen laufenden, isolierten Übungsraum aufbaut, echten Fortschritt über eine strukturierte State-Bridge liest und abgestufte Hilfe gibt, die mit wachsendem Können ausblendet. Erscheint als Electron-App und als Web-Build ohne Installation. | Un tutor de IA que construye un espacio de práctica vivo y aislado, lee tu progreso real a través de un puente de estado estructurado y da ayuda graduada que se desvanece a medida que mejoras. Disponible como app de Electron y build web sin instalación. |
| quantum-performance | Migracja wielodostępnego firmowego CRM z Vue 2 na Vue 3, a następnie skrócenie Interaction to Next Paint z maks. ~2,3 s do średnio 16 ms dzięki profilowaniu reaktywności Vue i JavaScriptu w wątku głównym. | Migration eines mandantenfähigen Unternehmens-CRM von Vue 2 auf Vue 3, danach Interaction to Next Paint von bis zu ~2,3 s auf durchschnittlich 16 ms gesenkt, durch Profiling der Vue-Reaktivität und des Main-Thread-JavaScripts. | Migración de un CRM empresarial multiinquilino de Vue 2 a Vue 3, y luego reducción del Interaction to Next Paint de hasta ~2,3 s a una media de 16 ms perfilando la reactividad de Vue y el JavaScript del hilo principal. |
| nutrition-rag-autonomous | Samoaktualizująca się baza wiedzy o żywieniu: nocny daemon pobiera, streszcza i reindeksuje nowe publikacje. | Eine sich selbst aktualisierende Ernährungs-Wissensbasis: ein nächtlicher Daemon holt, fasst zusammen und reindexiert neue Paper. | Una base de conocimiento nutricional que se actualiza sola: un daemon nocturno trae, resume y reindexa papers nuevos. |
| mcp-servers | Dwa własne serwery MCP do pixel-perfect workflow designu oraz rozszerzenia społecznościowych serwerów MCP. | Zwei eigene MCP-Server für Pixel-perfekte Design-Workflows, plus Erweiterungen für Community-MCP-Server. | Dos servidores MCP propios para flujos de diseño pixel-perfect, más extensiones de servidores MCP de la comunidad. |
| space-studio | Interaktywna aplikacja webowa ucząca inżynierii rakietowej przez symulacje 3D i stopniowe lekcje. | Eine interaktive Web-App, die Raketentechnik über 3D-Simulationen und aufeinander aufbauende Lektionen vermittelt. | Una web app interactiva que enseña ciencia de cohetes con simulaciones 3D y lecciones progresivas. |
| markdown-downloader | Rozszerzenie Raycast, które konwertuje strony WWW na czyste pliki Markdown, z wbudowanym pobieraniem obrazów. | Eine Raycast-Erweiterung, die Webseiten in saubere Markdown-Dateien umwandelt, mit eingebautem Bild-Download. | Una extensión de Raycast que convierte páginas web en archivos Markdown limpios, con descarga de imágenes integrada. |
| mathtron | Edytor LaTeX do notatek matematycznych i ćwiczeń na desktopie. | LaTeX-Editor für Mathe-Notizen und Übungen auf dem Desktop. | Editor LaTeX para tomar apuntes de matemáticas y hacer ejercicios en el escritorio. |
| pictureplatform | Platforma pokazująca zyski wydajności WebAssembly w kosztownych obliczeniowo zadaniach. | Plattform, die die Performance-Gewinne von WebAssembly bei rechenintensiven Aufgaben zeigt. | Plataforma que muestra las mejoras de rendimiento de WebAssembly en tareas computacionalmente costosas. |

- [ ] **Step 3: Derive `summary` for the remaining 20 projects**

For every other project id the Task 1 failure list names, set `projects.<id>.summary` in each locale to the first sentence of that locale's OWN `projects.<id>.description` (text up to and including the first `.` that ends a sentence; mirror `firstSentence()` which splits on `". "`). Do not translate anew and do not copy English. Example (pl, `projects.aichat.description` begins "Aplikacja czatu AI oparta na..."), then `"summary": "Aplikacja czatu AI oparta na..."` up to the first sentence end.

- [ ] **Step 4: Add `statLabel` for the 5 remaining stat-bearing projects**

| id | source label | pl | de | es |
|---|---|---|---|---|
| belay | practice templates across eight domains | szablonów ćwiczeń w ośmiu dziedzinach | Übungsvorlagen in acht Domänen | plantillas de práctica en ocho dominios |
| quantum-performance | average INP, down from up to ~2.3 s | średni INP, spadek z maks. ~2,3 s | mittlerer INP, runter von bis zu ~2,3 s | INP promedio, antes hasta ~2,3 s |
| nutrition-rag-autonomous | papers ingested per run | publikacji pobieranych na przebieg | eingelesene Paper pro Lauf | papers ingeridos por ejecución |
| mcp-servers | MCP tools for design workflows | narzędzi MCP do workflow designu | MCP-Tools für Design-Workflows | herramientas MCP para flujos de diseño |
| space-studio | physics speedup via WebAssembly | przyspieszenie fizyki dzięki WebAssembly | schnellere Physik durch WebAssembly | aceleración de física con WebAssembly |

- [ ] **Step 5: Run the parity suite until green**

Run: `npx vitest run src/i18n/localeParity.test.js`
Expected: PASS (4 test groups, all green). Iterate on missing paths it reports.

- [ ] **Step 6: Run the full suite**

Run: `npm test`
Expected: PASS, including the pre-existing `portfolioData.test.js` (which may carry another session's uncommitted edits; if it fails on something unrelated to locales, report it, do not fix it here).

- [ ] **Step 7: Commit (path-scoped)**

```bash
git add src/i18n/localeParity.test.js src/i18n/locales/pl.json src/i18n/locales/de.json src/i18n/locales/es.json
git commit -m "fix(i18n): translate ornith/dflash cards, add summaries and stat labels across locales

Adds a field-level locale-parity drift guard derived from the key paths
getTranslatedProject() consumes, so partial translation blocks fail CI
instead of silently rendering English (Forgejo #5).

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 3: Visible hardcoded strings through t()

**Files:**
- Modify: `src/sections/portfolio/FlagshipCard.jsx` (kicker, ~line 60)
- Modify: `src/sections/portfolio/Project.jsx` (two "View Live" fallbacks, video fallback)
- Modify: `src/sections/portfolio/ProjectDetailsPanel.jsx` (video fallback)
- Modify: `src/sections/portfolio/Portfolio.jsx` ("Input" heading)
- Modify: `src/sections/learning/Learning.jsx` ("Featured" tag)
- Modify: all four `src/i18n/locales/*.json`
- Modify: `src/i18n/localeParity.test.js` (grow `REQUIRED_UI_KEYS`)

**Interfaces:**
- Consumes: green parity suite from Task 2.
- Produces: keys `portfolio.caseStudyKicker`, `portfolio.inputTitle`, `learning.featured`, `learning.aiSourcesTitle`, `common.videoUnsupported` (Task 5 reuses `portfolio.caseStudyKicker`).

All five components already call `useTranslation()`; no new imports needed.

- [ ] **Step 1: Extend `REQUIRED_UI_KEYS` in `src/i18n/localeParity.test.js`**

```js
const REQUIRED_UI_KEYS = [
  "portfolio.caseStudyKicker",
  "portfolio.inputTitle",
  "learning.featured",
  "learning.aiSourcesTitle",
  "common.videoUnsupported",
];
```

- [ ] **Step 2: Run the suite to see the new keys fail**

Run: `npx vitest run src/i18n/localeParity.test.js`
Expected: FAIL, UI-key assertion lists exactly the five keys for all four locales.

- [ ] **Step 3: Add the keys to all four locale files**

Into the `portfolio`, `learning`, and `common` namespaces respectively:

| key | en | de | pl | es |
|---|---|---|---|---|
| portfolio.caseStudyKicker | Case study | Fallstudie | Studium przypadku | Caso de estudio |
| portfolio.inputTitle | Input | Input | Źródła | Fuentes |
| learning.featured | Featured | Empfohlen | Wyróżnione | Destacado |
| learning.aiSourcesTitle | AI Input Sources | KI-Quellen | Źródła AI | Fuentes de IA |
| common.videoUnsupported | Your browser does not support the video tag. | Dein Browser unterstützt das Video-Tag nicht. | Twoja przeglądarka nie obsługuje tagu wideo. | Tu navegador no soporta la etiqueta de vídeo. |

- [ ] **Step 4: Wire the components**

`FlagshipCard.jsx` (the kicker rail):

```jsx
<span className="pf-kicker pf-kicker--case">
  <span aria-hidden="true">§ </span>
  {t("portfolio.caseStudyKicker")}
</span>
```

`Project.jsx`, both live-link fallbacks (search for `"View Live"`, 2 occurrences):

```jsx
{link.label || t("portfolio.viewLive")}
```

and (sticky toolbar variant):

```jsx
<span>{link.label || t("portfolio.viewLive")}</span>
```

`Project.jsx` and `ProjectDetailsPanel.jsx`, the `<source ... />` fallback line inside each `<video>` (search for `Your browser does not support`):

```jsx
{t("common.videoUnsupported")}
```

`Portfolio.jsx`:

```jsx
<h2 className="h1 mt-row">{t("portfolio.inputTitle")}</h2>
```

`Learning.jsx` featured tag:

```jsx
<span className="ai-sources__featured-text">{t("learning.featured")}</span>
```

(`learning.aiSourcesTitle` is already wired with an inline English default; the new locale entries make the default dead. Leave the call as is.)

- [ ] **Step 5: Run tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 6: Commit (path-scoped)**

```bash
git add src/sections/portfolio/FlagshipCard.jsx src/sections/portfolio/Project.jsx src/sections/portfolio/ProjectDetailsPanel.jsx src/sections/portfolio/Portfolio.jsx src/sections/learning/Learning.jsx src/i18n/locales/en.json src/i18n/locales/de.json src/i18n/locales/pl.json src/i18n/locales/es.json src/i18n/localeParity.test.js
git commit -m "fix(i18n): route visible hardcoded strings through t()

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

Note: Project.jsx and ProjectDetailsPanel.jsx carry another session's uncommitted edits. Path-scoped `git add` on these files WILL include those edits. Before committing, run `git diff --cached src/sections/portfolio/Project.jsx` and confirm with the user how to sequence if foreign hunks appear; if the other session has committed by then (expected), this is moot.

---

### Task 4: aria-labels and alt text (a11y namespace)

**Files:**
- Modify: `src/sections/navbar/Navbar.jsx`, `src/sections/navbar/LanguageSelector.jsx`, `src/components/AccessibleModal.jsx`, `src/sections/portfolio/ProjectsCategories.jsx`, `src/sections/portfolio/Project.jsx`, `src/sections/portfolio/Portfolio.jsx`, `src/sections/badges/Badges.jsx`, `src/sections/learning/Learning.jsx`, `src/sections/contacts/Contact.jsx`, `src/sections/header/data.jsx`, `src/sections/header/Header.jsx`
- Modify: all four `src/i18n/locales/*.json` (new top-level `a11y` namespace, plus `badges.*Alt` and `contact.bgAlt`)
- Modify: `src/i18n/localeParity.test.js`

**Interfaces:**
- Produces: `a11y.*` namespace. `AccessibleModal` gains its own `useTranslation()` call (it had none).
- Deliberately unchanged: language-selector captions (EN/DE/PL/ES), aiSources channel names, book-cover alt titles, PageLoader brand strings, Pixelperfect (already keyed per locale), `techCategories.*.label` dead values (code-health backlog).

- [ ] **Step 1: Append to `REQUIRED_UI_KEYS`**

```js
  "a11y.toggleNavigation",
  "a11y.closeModal",
  "a11y.technologyFilters",
  "a11y.caseStudySections",
  "a11y.quickActions",
  "a11y.shellCommandLink",
  "a11y.aiLearningSources",
  "a11y.stanfordChannel",
  "a11y.switchLanguage.en",
  "a11y.switchLanguage.de",
  "a11y.switchLanguage.pl",
  "a11y.switchLanguage.es",
  "a11y.social.instagram",
  "a11y.social.twitter",
  "a11y.social.dribbble",
  "a11y.social.github",
  "a11y.social.huggingface",
  "badges.frontendBadgeAlt",
  "badges.jqueryBadgeAlt",
  "badges.cssBadgeAlt",
  "contact.bgAlt",
```

Run `npx vitest run src/i18n/localeParity.test.js`; expected FAIL listing exactly these keys.

- [ ] **Step 2: Add the `a11y` namespace to all four locale files (top level, after `common`)**

```json
"a11y": {
  "toggleNavigation": "...",
  "closeModal": "...",
  "technologyFilters": "...",
  "caseStudySections": "...",
  "quickActions": "...",
  "shellCommandLink": "...",
  "aiLearningSources": "...",
  "stanfordChannel": "...",
  "switchLanguage": { "en": "...", "de": "...", "pl": "...", "es": "..." },
  "social": { "instagram": "...", "twitter": "...", "dribbble": "...", "github": "...", "huggingface": "..." }
}
```

Values per locale:

| key | en | de | pl | es |
|---|---|---|---|---|
| toggleNavigation | Toggle navigation | Navigation umschalten | Przełącz nawigację | Alternar navegación |
| closeModal | Close modal | Dialog schließen | Zamknij okno | Cerrar ventana |
| technologyFilters | Technology filters | Technologie-Filter | Filtry technologii | Filtros de tecnología |
| caseStudySections | Case study sections | Abschnitte der Fallstudie | Sekcje studium przypadku | Secciones del caso de estudio |
| quickActions | {{title}} quick actions | Schnellaktionen für {{title}} | Szybkie akcje dla {{title}} | Acciones rápidas de {{title}} |
| shellCommandLink | Shell command explanation link | Link zur Erklärung des Shell-Befehls | Link do wyjaśnienia polecenia powłoki | Enlace a la explicación del comando de shell |
| aiLearningSources | AI learning sources | KI-Lernquellen | Źródła nauki AI | Fuentes de aprendizaje de IA |
| stanfordChannel | Stanford Online YouTube channel | YouTube-Kanal von Stanford Online | Kanał YouTube Stanford Online | Canal de YouTube de Stanford Online |
| switchLanguage.en | Switch to English | Zu Englisch wechseln | Przełącz na angielski | Cambiar a inglés |
| switchLanguage.de | Switch to German | Zu Deutsch wechseln | Przełącz na niemiecki | Cambiar a alemán |
| switchLanguage.pl | Switch to Polish | Zu Polnisch wechseln | Przełącz na polski | Cambiar a polaco |
| switchLanguage.es | Switch to Spanish | Zu Spanisch wechseln | Przełącz na hiszpański | Cambiar a español |
| social.instagram | Instagram profile | Instagram-Profil | Profil na Instagramie | Perfil de Instagram |
| social.twitter | Twitter profile | Twitter-Profil | Profil na Twitterze | Perfil de Twitter |
| social.dribbble | Dribbble profile | Dribbble-Profil | Profil na Dribbble | Perfil de Dribbble |
| social.github | GitHub repositories | GitHub-Repositories | Repozytoria GitHub | Repositorios de GitHub |
| social.huggingface | Hugging Face profile | Hugging-Face-Profil | Profil na Hugging Face | Perfil de Hugging Face |

Plus in existing namespaces:

| key | en | de | pl | es |
|---|---|---|---|---|
| badges.frontendBadgeAlt | Frontend badge | Frontend-Badge | Odznaka Frontend | Insignia de frontend |
| badges.jqueryBadgeAlt | jQuery badge | jQuery-Badge | Odznaka jQuery | Insignia de jQuery |
| badges.cssBadgeAlt | CSS badge | CSS-Badge | Odznaka CSS | Insignia de CSS |
| contact.bgAlt | Ancient stepped pyramid at Zaculeu, Guatemala | Alte Stufenpyramide in Zaculeu, Guatemala | Starożytna piramida schodkowa w Zaculeu w Gwatemali | Antigua pirámide escalonada en Zaculeu, Guatemala |

- [ ] **Step 3: Wire the components**

`Navbar.jsx`: `aria-label={t("a11y.toggleNavigation")}`

`AccessibleModal.jsx`: add `import { useTranslation } from "react-i18next";`, call `const { t } = useTranslation();` inside the component, and set the close button to `aria-label={t("a11y.closeModal")}`.

`LanguageSelector.jsx`: destructure `const { i18n, t } = useTranslation();`, drop the `aria` field from `LANGUAGE_LABELS` (keep `label`), and set `aria-label={t(`a11y.switchLanguage.${lng}`)}`.

`ProjectsCategories.jsx`: `aria-label={t("a11y.technologyFilters")}`

`Project.jsx`: toolbar `aria-label={t("a11y.quickActions", { title: translatedProject.title })}`; TOC nav `aria-label={t("a11y.caseStudySections")}`.

`Portfolio.jsx` and `Badges.jsx`: `aria-label={t("a11y.shellCommandLink")}`

`Badges.jsx`: the three badge `alt` attributes become `alt={t("badges.frontendBadgeAlt")}` / `jqueryBadgeAlt` / `cssBadgeAlt`.

`Learning.jsx`: region wrapper `aria-label={t("a11y.aiLearningSources")}`; the Stanford card link `aria-label={t("a11y.stanfordChannel")}`.

`Contact.jsx`: `alt={t("contact.bgAlt")}`

`src/sections/header/data.jsx`: add a `key` field to each item (`"instagram"`, `"twitter"`, `"dribbble"`, `"github"`, `"huggingface"`); keep `label` as fallback. In `Header.jsx`, where `item.label` feeds the link's `aria-label`, change to `aria-label={t(`a11y.social.${item.key}`, item.label)}` (Header already uses `useTranslation`; if not, add it).

- [ ] **Step 4: Run tests, then lint**

Run: `npm test` -> PASS. Run `npx eslint src --ext .jsx,.js` if configured; fix any unused-variable fallout (e.g. the removed `aria` field).

- [ ] **Step 5: Commit (path-scoped)**

```bash
git add src/sections/navbar/Navbar.jsx src/sections/navbar/LanguageSelector.jsx src/components/AccessibleModal.jsx src/sections/portfolio/ProjectsCategories.jsx src/sections/portfolio/Project.jsx src/sections/portfolio/Portfolio.jsx src/sections/badges/Badges.jsx src/sections/learning/Learning.jsx src/sections/contacts/Contact.jsx src/sections/header/data.jsx src/sections/header/Header.jsx src/i18n/locales/en.json src/i18n/locales/de.json src/i18n/locales/pl.json src/i18n/locales/es.json src/i18n/localeParity.test.js
git commit -m "fix(a11y,i18n): localize aria-labels and alt text under an a11y namespace

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 5: CSS modal kicker and the English-case-study notice

**Files:**
- Modify: `src/components/AccessibleModal.jsx` (new optional `headerKicker` prop)
- Modify: `src/sections/portfolio/Project.jsx` (pass the prop; render the notice)
- Modify: `src/sections/portfolio/portfolio.css` (attr()-driven pseudo-element; notice style)
- Modify: all four `src/i18n/locales/*.json` (`portfolio.caseStudyEnglishNote`)
- Modify: `src/i18n/localeParity.test.js`

**Interfaces:**
- Consumes: `portfolio.caseStudyKicker` key from Task 3.
- Produces: `AccessibleModal` prop `headerKicker?: string` rendered as `data-kicker` on the `.modal-header` div.

- [ ] **Step 1: Append `"portfolio.caseStudyEnglishNote"` to `REQUIRED_UI_KEYS`; run the suite; expected FAIL on exactly that key**

- [ ] **Step 2: Add the key to all four locales**

| en | de | pl | es |
|---|---|---|---|
| Case study available in English. | Fallstudie auf Englisch verfügbar. | Studium przypadku dostępne w języku angielskim. | Caso de estudio disponible en inglés. |

(The en value is never rendered; it exists to keep the parity test simple, per spec.)

- [ ] **Step 3: Thread the kicker attribute through AccessibleModal**

Add `headerKicker` to the destructured props and render it on the header div:

```jsx
<div className="modal-header" data-kicker={headerKicker || undefined}>
```

- [ ] **Step 4: Pass it from Project.jsx and render the notice**

Change the `useTranslation()` destructure to `const { t, i18n } = useTranslation();`. On the case-study `AccessibleModal`, add:

```jsx
headerKicker={t("portfolio.caseStudyKicker")}
```

As the first child inside the modal content (immediately before the overview block):

```jsx
{i18n.resolvedLanguage !== "en" && (
  <p className="detail-modal-lang-note">
    {t("portfolio.caseStudyEnglishNote")}
  </p>
)}
```

- [ ] **Step 5: Switch the CSS rule to attr() and style the notice**

In `portfolio.css`, the `.modal-dialog.portfolio-detail-modal .modal-header::before` rule (search for `content: "§ Case study"`):

```css
content: "§ " attr(data-kicker);
```

(Only the `content` line changes; positioning/typography lines stay.) Then add, near the other `detail-modal-*` rules:

```css
.detail-modal-lang-note {
  margin: 0 0 1.1rem;
  font-size: 0.85rem;
  font-style: italic;
  color: var(--cs-gold-soft);
  opacity: 0.85;
}
```

- [ ] **Step 6: Run tests**

Run: `npm test` -> PASS.

- [ ] **Step 7: Commit (path-scoped; same foreign-hunk check as Task 3 for Project.jsx/portfolio.css)**

```bash
git add src/components/AccessibleModal.jsx src/sections/portfolio/Project.jsx src/sections/portfolio/portfolio.css src/i18n/locales/en.json src/i18n/locales/de.json src/i18n/locales/pl.json src/i18n/locales/es.json src/i18n/localeParity.test.js
git commit -m "fix(i18n): localize the modal case-study label via data-kicker; add English-note

Co-Authored-By: Claude Fable 5 <noreply@anthropic.com>"
```

---

### Task 6: Verification, browser pass, and PR

**Files:** none created; verification and delivery only.

- [ ] **Step 1: Full suite and build**

Run: `npm test` -> PASS. Run: `npm run build` -> completes without errors.

- [ ] **Step 2: Browser verification (preview tools)**

Start the dev server (preview_start). For each of `?lang=pl`, `?lang=de`, `?lang=es`, `?lang=en`:
- Grid: ornith and dflash flagship cards fully in the locale language (title, body, highlights, stat label); kicker reads the localized "Case study" term.
- Any index card: summary line localized.
- Open a case-study modal: header label localized (pseudo-element), notice line present on non-en locales and ABSENT on en, "Overview" heading localized.
- Snapshot the navbar: language-switch aria-labels in the current language.
Take one screenshot per language of the top of the grid as proof.

- [ ] **Step 3: Push and open the PR**

```bash
git push forg fix/i18n-consistency
```

Open a Forgejo PR `fix/i18n-consistency` -> `main` titled `fix(i18n): consistent de/pl/es locales, a11y labels, drift guard (closes #5)`. The body must include:
- Summary of the four workstreams (translations, hardcoded strings, modal kicker/notice, drift guard).
- **Suspect-value review list** for Daniel's judgment (flagged, not changed): `projects.mathtron-vue.title`, `projects.learn2sort.title`, `projects.nextjs-portfolio.title`, `projects.mathtron.title`, `projects.e-commerce.title`, `projects.emmet-demo.title`, `projects.kanban-board.title`, `projects.company-website.links.0`, `projects.company-website.links.1`, `projects.company-website.links.2`, `projects.cdn-manager.title`, `projects.molar.title` (verbatim English in de/pl/es; mostly proper-noun titles, possibly intentional).
- Note that all pl/de/es translations are Claude drafts pending Daniel's native review.
- Screenshots from Step 2.

- [ ] **Step 4: Comment on Forgejo issue #5** linking the PR and stating the drift guard is live and the allowlist is empty.
