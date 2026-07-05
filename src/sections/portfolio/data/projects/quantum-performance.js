// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.quantum-performance". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "quantum-performance",
  "title": "Enterprise CRM Performance Optimization & Vue 3 Migration",
  "category": "web-app",
  "featured": true,
  "date": "2026-01-01",
  "sortOrder": -4,
  "closedSource": true,
  "media": {
    "type": "image",
    "src": "/Portfolio/QuantumPerformance.jpg",
    "alt": "Enterprise CRM Performance Metrics - 16ms INP"
  },
  "description": "Migrated a multi-tenant CRM application from Vue 2 to Vue 3 with exceptional performance results.",
  "detailedContent": {
    "overview": "A deep frontend-performance optimization on a production, multi-tenant Vue 3 enterprise CRM serving customers across German and English markets, alongside the framework migration that preceded it. Interaction to Next Paint (INP) was cut from 264–2,288 ms, depending on the interaction, down to ~16 ms. The realization that drove everything: the bottleneck was processing duration (main-thread blocking), not input delay. The real leverage was in Vue reactivity and JavaScript, not CSS.",
    "sections": [
      {
        "title": "The Result: From up to ~2.3 s down to ~16 ms",
        "items": [
          "Interaction to Next Paint (INP) reduced from a range of 264–2,288 ms (depending on the interaction) to ~16 ms average, comfortably inside Google's \"good\" threshold of 200 ms, with an order of magnitude of headroom",
          "Worst offenders first: the sidebar toggle alone went from 264 ms to 30–40 ms once its redundant route-watchers were consolidated",
          "Page load times dropped from 3–5 seconds to sub-second through systematic auditing",
          "Eliminated memory leaks that had let DOM node counts climb past 10,000 during navigation"
        ]
      },
      {
        "title": "The Key Realization: Processing Duration, Not Input Delay",
        "items": [
          "INP decomposes into input delay, processing duration, and presentation delay. Profiling showed the problem was overwhelmingly processing duration: the main thread was blocked running JavaScript, not waiting on input",
          "That reframed the whole effort: the largest lever was Vue reactivity and JS execution, not CSS. CSS-level work (GPU layers, containment) still mattered, but it addressed presentation delay, a smaller slice of the budget",
          "Every optimization below was chosen by measuring which phase of INP it actually moved, rather than applying performance folklore blindly"
        ]
      },
      {
        "title": "The Highest-Impact Levers (Vue / JavaScript)",
        "items": [
          "Watcher consolidation: several redundant route-watchers (auth on route.name, init on route.path, sidebar visibility on route.name) merged into one unified watcher that batches its state updates via nextTick() and flush: 'post', the single biggest win",
          "Input debouncing (300 ms) on search, filter, and autocomplete fields; a wrapper component keeps local state for instant UI feedback and emits to the parent only on idle (requestIdleCallback)",
          "Deferred / progressive data loading: large lookup tables with thousands of entries were loading synchronously at login and blocking the main thread, so they were split into critical-tables-first, then the heavy tables in requestIdleCallback",
          "shallowRef instead of ref for large arrays, markRaw for non-reactive static config objects, and v-memo on list rows: Vue stops deep-tracking data that never needs reactivity",
          "A Web Worker pool offloads heavy JSON (de)serialization and large-dataset filtering off the main thread, with a graceful fallback when workers are unavailable"
        ]
      },
      {
        "title": "Rendering Levers: Plus an Honest Pitfall",
        "items": [
          "GPU acceleration (transform: translateZ(0), will-change) to push transitions onto their own compositor layer, using will-change: auto on permanent drawers, since a standing GPU layer there would only waste memory",
          "CSS paint containment (contain: layout style paint) plus content-visibility on long offscreen lists to shrink the area the browser has to repaint",
          "The pitfall, kept here because it's real: contain: strict collapsed the navbar to 0 px, because strict silently includes size containment. The fix was contain: layout style paint (without size) plus an explicit min-height. Living through that is different from reading about it",
          "Virtual scrolling (TanStack Virtual) for long lists, with instant fuzzy search (FlexSearch) over multi-thousand-row datasets",
          "Vuetify tree-shaking (dropping wildcard imports in favour of auto-import) and font-display: swap on the icon font to kill render-blocking CSS, with the gotcha that auto-import misses dynamic <component :is> components, which must be imported explicitly"
        ]
      },
      {
        "title": "Sustaining It: A Development-Time Performance Guard",
        "items": [
          "To stop regressions, a performance logger tracks component and view load times and warns in the console when they exceed defined thresholds",
          "Deliberately a development-time guard, not production telemetry: zero overhead in production builds, and nothing leaves the user's machine. The point is to catch a slow component in review, before it ever reaches a user"
        ]
      },
      {
        "title": "Virtual Scrolling with Fuzzy Search",
        "items": [
          "Implemented virtualized rendering for datasets with thousands of categories, maintaining smooth 60fps scrolling",
          "Integrated FlexSearch for instant fuzzy search capabilities across large datasets",
          "Designed efficient data structures to support real-time filtering without UI blocking"
        ]
      },
      {
        "title": "Framework Migration",
        "items": [
          "Migrated complete codebase from Vue 2.7 to Vue 3.4, converting Options API to Composition API",
          "Upgraded from Vuetify 2 to Vuetify 3, adapting to breaking changes in component APIs and theming",
          "Converted Vuex state management to Pinia, improving type safety and developer experience",
          "Maintained feature parity across all customer-specific feature flags during migration"
        ]
      },
      {
        "title": "Architecture & Code Quality",
        "items": [
          "Reduced component code bloat by identifying and removing 15,000+ lines of unnecessary migration artifacts",
          "Implemented systematic cleanup composables for proper resource management (event listeners, observers, timers)",
          "Established comprehensive backup protocols and change logging practices for safe iterative development"
        ]
      },
      {
        "title": "Technical Challenges Solved",
        "items": [
          "Diagnosed and fixed complex memory leaks specific to Vue 3's reactivity system",
          "Worked around Vuetify 3 framework limitations (label clipping bug #17762) with custom wrapper solutions"
        ]
      },
      {
        "title": "Backend & Data Architecture",
        "items": [
          "Designed and shipped a normalized two-table schema for a new email distribution list feature, with proper referential integrity, chosen after a schema-discovery audit confirmed no existing table fit the use case",
          "Built the corresponding WCF service layer in C# .NET with explicit SqlParameter arrays: the codebase uses direct ADO.NET, not an ORM",
          "Integrated with the existing VB.NET service layer and the legacy communications-history audit table for bulk-insert tracking of every dispatched message",
          "Followed the established naming conventions of the existing schema for consistency with adjacent features"
        ],
        "image": "/Portfolio/quantum-backend/email-verteiler-erd.svg",
        "imageAlt": "ER diagram: the two-table distribution-list schema, a one-to-many relationship via foreign key."
      },
      {
        "title": "Serial Mail Integration · Override Pattern",
        "items": [
          "Implemented the serial-mail dispatch flow with an `out Dictionary<long, string>` override map keyed by contact id, giving per-recipient address substitution at send-time without bloating the canonical recipient list",
          "Persisted recipient lists stay normalised (one row per address); deviations are an ephemeral, per-send concern handled in C# memory",
          "Bulk-INSERT to the communications-history audit table via batched DataTable to keep round-trips low even with thousands of recipients",
          "Server-side search, exclusion-based selection, and collection-based recipient loading complete the newsletter feature end-to-end"
        ],
        "image": "/Portfolio/quantum-backend/serial-mail-sequence.svg",
        "imageAlt": "Sequence diagram: Vue client → .NET API → mail dispatcher → SQL Server, with the emailOverrides override pattern."
      },
      {
        "title": "DSGVO-conformant Duplicate Cleanup",
        "items": [
          "Stored-procedure approach to potential-companies deduplication, with a paired dry-run variant that returns the exact deletion preview without mutating data",
          "Anchored the DSGVO basis on the contact's juridical creation timestamp rather than category-assignment dates, which prevents compliance gaps where a re-categorised contact would appear newer than it is",
          "Caught a configuration error in test: the dry-run preview showed >99% of records in a target category would have been deleted in production, averting a faulty mass-delete before release",
          "Established the dry-run-first protocol for further data-cleanup operations on the system"
        ]
      }
    ]
  },
  "highlights": [
    "16ms average INP (vs 200ms \"good\" threshold)",
    "Vue 2 → Vue 3 complete migration",
    "7,000+ item virtual scrolling implementation"
  ],
  "technologies": [
    "Vue 3.4",
    "Vuetify 3",
    "Pinia",
    "TypeScript",
    "C# .NET",
    "WCF",
    "VB.NET",
    "SQL Server",
    "FlexSearch"
  ],
  "mainTech": "vue",
  "links": [],
  "tags": [
    "performance",
    "vue3",
    "migration",
    "enterprise",
    "crm",
    "optimization"
  ]
};

export default project;
