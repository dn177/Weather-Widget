// portfolioData.js - Structured approach with clear metadata
// Assets are now in public directory - use direct paths with PUBLIC_URL
const PUBLIC_URL = process.env.PUBLIC_URL || "";
const PORTFOLIO_PATH = PUBLIC_URL + "/Portfolio/";
const POSTER_PATH = PUBLIC_URL + "/Portfolio/poster/";

// Define media asset paths
const contaoVideo = PORTFOLIO_PATH + "Video16.mov";
const inLearning = PORTFOLIO_PATH + "InLearning.png";
const picturePlayground = PORTFOLIO_PATH + "PPP.png";
const learn2Sort = PORTFOLIO_PATH + "Learn2Sort.png";
const nextPortfolioImage = PORTFOLIO_PATH + "NextjsPortfolio.png";
const mathtronVideo = PORTFOLIO_PATH + "Video15.mov";
const mathtronVueImage = PORTFOLIO_PATH + "MathtronVue.png";
const privateBlogVideo = PORTFOLIO_PATH + "Video10.mov";
const restFullstackVideo = PORTFOLIO_PATH + "Video14.mov";
const ecommerceVideo = PORTFOLIO_PATH + "Video12.mov";
const emmetDemoVideo = PORTFOLIO_PATH + "Video13.mp4";
const kanbanBoardVideo = PORTFOLIO_PATH + "Video11.mov";
const carPlatformVideo = PORTFOLIO_PATH + "Video1.mov";
const companyWebsiteVideo = PORTFOLIO_PATH + "Video8.mov";
const chartVideo = PORTFOLIO_PATH + "Video4.mov";
const cdnManagerVideo = PORTFOLIO_PATH + "Video3.mov";
const molarImage = PORTFOLIO_PATH + "Molar.png";
const spaceStudioVideo = PORTFOLIO_PATH + "SpaceStudio.mov";
const markdownDownImage = PORTFOLIO_PATH + "MarkdownDown.png";
const releaseRadarImage = PORTFOLIO_PATH + "ReleaseRadar.jpg";
const project33Image = PORTFOLIO_PATH + "33.jpg";
const quantumPerformanceImage = PORTFOLIO_PATH + "QuantumPerformance.jpg";
const emailVerteilerErd = PORTFOLIO_PATH + "quantum-backend/email-verteiler-erd.svg";
const serialMailSequence = PORTFOLIO_PATH + "quantum-backend/serial-mail-sequence.svg";
const selfHelpRagImage = PORTFOLIO_PATH + "SelfHelpRAG.svg";
const mcpServersImage = PORTFOLIO_PATH + "MCPServers.svg";
const aiChatImage = PORTFOLIO_PATH + "AIChat.gif";
const resourceOrchestrationImage = PORTFOLIO_PATH + "ResourceOrchestration.png";

// Define poster paths
const poster2 = POSTER_PATH + "poster2.png";
const poster3 = POSTER_PATH + "poster3.png";
const poster5 = POSTER_PATH + "poster5.png";
const poster6 = POSTER_PATH + "poster6.png";
const poster7 = POSTER_PATH + "poster7.png";
const poster8 = POSTER_PATH + "poster8.png";
const poster9 = POSTER_PATH + "poster9.png";
const poster10 = POSTER_PATH + "poster10.png";
const poster11 = POSTER_PATH + "poster11.png";
const poster12 = POSTER_PATH + "poster12.png";
const poster13 = POSTER_PATH + "poster13.png";
const spaceStudioPoster = POSTER_PATH + "poster_spacestudio.png";

// Define main technology categories
export const techCategories = {
  all: { label: "All", color: "#6b7280" },
  react: { label: "React", color: "#61DAFB" },
  vue: { label: "Vue.js", color: "#4FC08D" },
  nodejs: { label: "Node.js", color: "#339933" },
  php: { label: "PHP", color: "#777BB4" },
  // typescript: { label: "TypeScript", color: "#3178C6" },
  electron: { label: "Electron", color: "#47848F" },
  nextjs: { label: "Next.js", color: "#000000" },
};

export const portfolioProjects = [
  {
    id: "quantum-performance",
    title: "projects.quantum-performance.title",
    category: "web-app",
    featured: true,
    date: "2026-01-01",
    sortOrder: -4,

    media: {
      type: "image",
      src: quantumPerformanceImage,
      alt: "Enterprise CRM Performance Metrics - 16ms INP",
    },

    description: "projects.quantum-performance.description",

    // Detailed content for the modal
    detailedContent: {
      overview:
        "Spearheaded a major framework migration and performance optimization initiative for Opal/Quantum, a multi-tenant enterprise CRM application serving multiple customers across German and English markets. The application manages complex business workflows including event management, document handling, and customer relationship data.",
      sections: [
        {
          title: "Performance Optimization",
          items: [
            'Achieved 16ms average Interaction to Next Paint (INP) – significantly outperforming Google\'s "good" threshold of 200ms',
            "Reduced page load times from 3-5 seconds to sub-second response through systematic performance auditing and optimization",
            "Identified and resolved memory leaks that previously caused DOM node counts to exceed 10,000+ during navigation",
          ],
        },
        {
          title: "Virtual Scrolling with Fuzzy Search",
          items: [
            "Implemented virtualized rendering for datasets containing 7,000+ categories, maintaining smooth 60fps scrolling",
            "Integrated FlexSearch for instant fuzzy search capabilities across large datasets",
            "Designed efficient data structures to support real-time filtering without UI blocking",
          ],
        },
        {
          title: "Framework Migration",
          items: [
            "Migrated complete codebase from Vue 2.7 to Vue 3.4, converting Options API to Composition API",
            "Upgraded from Vuetify 2 to Vuetify 3, adapting to breaking changes in component APIs and theming",
            "Converted Vuex state management to Pinia, improving type safety and developer experience",
            "Maintained feature parity across all customer-specific feature flags during migration",
          ],
        },
        {
          title: "Architecture & Code Quality",
          items: [
            "Reduced component code bloat by identifying and removing 15,000+ lines of unnecessary migration artifacts",
            "Implemented systematic cleanup composables for proper resource management (event listeners, observers, timers)",
            "Established comprehensive backup protocols and change logging practices for safe iterative development",
          ],
        },
        {
          title: "Technical Challenges Solved",
          items: [
            "Diagnosed and fixed complex memory leaks specific to Vue 3's reactivity system",
            "Worked around Vuetify 3 framework limitations (label clipping bug #17762) with custom wrapper solutions",
            "Optimized Core Web Vitals from initial scores of 300-400ms INP down to 16ms through targeted refactoring",
          ],
        },
        {
          title: "Backend & Data Architecture",
          items: [
            "Designed and shipped a normalized two-table schema for a new email distribution list feature, with proper referential integrity — chosen after a schema-discovery audit confirmed no existing table fit the use case",
            "Built the corresponding WCF service layer in C# .NET with explicit SqlParameter arrays — the codebase uses direct ADO.NET, not an ORM",
            "Integrated with the existing VB.NET service layer and the legacy communications-history audit table for bulk-insert tracking of every dispatched message",
            "Followed the established naming conventions of the existing schema for consistency with adjacent features",
          ],
          image: emailVerteilerErd,
          imageAlt: "ER-Diagramm: two-table distribution list schema, 1-to-many relationship via foreign key",
        },
        {
          title: "Serial Mail Integration · Override Pattern",
          items: [
            "Implemented the serial-mail dispatch flow with an `out Dictionary<long, string>` override map keyed by contact id — per-recipient address substitution at send-time without bloating the canonical recipient list",
            "Persisted recipient lists stay normalised (one row per address); deviations are an ephemeral, per-send concern handled in C# memory",
            "Bulk-INSERT to the communications-history audit table via batched DataTable to keep round-trips low even with thousands of recipients",
            "Server-side search, exclusion-based selection, and collection-based recipient loading complete the newsletter feature end-to-end",
          ],
          image: serialMailSequence,
          imageAlt: "Sequenzdiagramm: Vue Client → .NET API → mail dispatcher → SQL Server mit emailOverrides Override-Pattern",
        },
        {
          title: "DSGVO-conformant Duplicate Cleanup",
          items: [
            "Stored-procedure approach to potential-companies deduplication, with a paired dry-run variant that returns the exact deletion preview without mutating data",
            "Anchored the DSGVO basis on the contact's juridical creation timestamp rather than category-assignment dates — prevents compliance gaps where a re-categorised contact would appear newer than it is",
            "Caught a configuration error in test: the dry-run preview showed >99% of records in a target category would have been deleted in production — averted a faulty mass-delete before release",
            "Established the dry-run-first protocol for further data-cleanup operations on the system",
          ],
        },
      ],
    },

    highlights: [
      "projects.quantum-performance.highlights.0",
      "projects.quantum-performance.highlights.1",
      "projects.quantum-performance.highlights.2",
    ],

    technologies: [
      "Vue 3.4",
      "Vuetify 3",
      "Pinia",
      "TypeScript",
      "C# .NET",
      "WCF",
      "VB.NET",
      "SQL Server",
      "FlexSearch",
    ],
    mainTech: "vue",

    links: [],

    tags: [
      "performance",
      "vue3",
      "migration",
      "enterprise",
      "crm",
      "optimization",
    ],
  },
  {
    id: "selfhelp-rag",
    title: "SelfHelpRAG — On-Premise RAG with Hybrid Retrieval",
    category: "web-app",
    featured: true,
    date: "2026-04-15",
    sortOrder: -3.8,

    media: {
      type: "image",
      src: selfHelpRagImage,
      alt: "SelfHelpRAG — hybrid retrieval RAG pipeline architecture",
    },

    description:
      "A retrieval-augmented Q&A system for an enterprise ERP knowledge base. German-language, runs entirely on-premise against a self-hosted LLM — built with DSGVO-sensitive data in mind from day one.",

    detailedContent: {
      overview:
        "End-to-end RAG pipeline for self-help on the COMDOK ERP documentation. The system retrieves from a hybrid dense + sparse index, assembles an injection-aware prompt with explicit citation and refusal rules, and generates the answer on a local LLM endpoint (LM Studio on NVIDIA DGX Spark). A separate eval harness scores retrieval and citation quality against a labelled question set.",
      sections: [
        {
          title: "Hybrid Retrieval Pipeline",
          items: [
            "Indexing splits documents on heading boundaries with overlap, embeds with a locally hosted model, and writes both dense vectors (Qdrant) and sparse postings (BM25) per chunk",
            "Query time fuses both signals and reranks top-k — recall comes from dense, precision from sparse",
            "Corpus covers configuration docs, FAQ, how-tos, glossary, release notes, and troubleshooting — each chunk carries its source title for citation",
          ],
        },
        {
          title: "Prompt Design as Engineering",
          items: [
            "System prompt enforces machine-checkable rules: cite as '[Quelle: <Dokumenttitel>]' or return the verbatim refusal sentence if no answer is grounded in the chunks",
            "Explicit rule against following instructions embedded in retrieved documents — prompt-injection defence baked into the contract, not bolted on",
            "User message keeps retrieved chunks clearly delimited and numbered so the model can reference them; system role and user role are ruthlessly separated",
          ],
        },
        {
          title: "Eval Harness",
          items: [
            "Labelled eval set (questions + expected answer + source document) checked into the repo alongside the eval runner",
            "Scores both the answer text (refusal correctness, citation format) and the retrieval (whether the right chunk was even fetched)",
            "Result snapshots persist under evals/results — regression-friendly when prompt or chunker changes",
          ],
        },
        {
          title: "On-Premise & DSGVO Posture",
          items: [
            "No data leaves the network: embeddings, retrieval, and generation all run against local endpoints",
            "Designed for the COMDOK enterprise ERP domain where contact and customer data must stay on-premise",
            "LM Studio on NVIDIA DGX Spark — same hardware used for experimentation, vLLM, and llama.cpp exploration",
          ],
        },
      ],
    },

    highlights: [
      "Hybrid retrieval — dense (Qdrant) + sparse (BM25) with rerank",
      "Eval harness with labelled question set scoring retrieval + citation",
      "Injection-aware system prompt with explicit refusal sentence",
    ],

    technologies: [
      "Python",
      "Qdrant",
      "BM25",
      "LM Studio",
      "OpenAI SDK",
      "NVIDIA DGX",
    ],
    mainTech: "all",

    links: [],

    tags: [
      "rag",
      "llm",
      "ai",
      "qdrant",
      "python",
      "on-premise",
      "dsgvo",
      "evals",
    ],
  },
  {
    id: "aichat",
    title: "AIChat — On-Premise LLM Chat Frontend",
    category: "web-app",
    featured: true,
    date: "2026-03-20",
    sortOrder: -3.6,

    media: {
      type: "image",
      src: aiChatImage,
      alt: "AIChat — React 19 LLM chat client with LM Studio + MCP integration",
    },

    description:
      "A self-hosted chat frontend for LM Studio endpoints with first-class MCP tool-calling. Streaming SSE with proper state separation between pre-tool narration and final answer. Runs over Tailscale to a private DGX Spark.",

    detailedContent: {
      overview:
        "React 19 + TypeScript chat client built specifically for self-hosted LLM workflows. Speaks LM Studio's native /api/v1/chat with full MCP integration support, falls back to the OpenAI-compatible /v1/chat/completions endpoint when MCP isn't needed. The non-trivial work sits in the streaming layer.",
      sections: [
        {
          title: "Streaming SSE State Machine",
          items: [
            "Custom async generator parses the named SSE event format: message.start, message.delta, tool_call.start/arguments/success/failure, reasoning.delta, chat.end",
            "State machine distinguishes pre-tool narration (the model thinking out loud before calling a tool) from the final answer text after tool calls finish",
            "Falls through to OpenAI-style data: chunks if no event: prefix is present — handles mixed-spec endpoints gracefully",
          ],
        },
        {
          title: "MCP Integration",
          items: [
            "Plugin shorthand (named server ID) and full ephemeral_mcp config with server_url + allowed_tools filtering",
            "Multi-turn context is stateful server-side via previous_response_id — only the latest user message is sent each round",
            "Reasoning, tool start, tool arguments, tool success, and tool failure all surface as distinct events in the UI",
          ],
        },
        {
          title: "Self-Hosted Posture",
          items: [
            "Connects to an OpenAI-compatible endpoint at runtime — model list auto-discovered via /v1/models",
            "Designed to talk to a DGX Spark over Tailscale — no third-party API in the loop",
            "Settings include temperature, max tokens, system prompt, theme, and MCP integration list",
          ],
        },
      ],
    },

    highlights: [
      "Streaming SSE state machine separating narration / tool calls / final answer",
      "First-class MCP integration with plugin + ephemeral_mcp support",
      "Runs over Tailscale to a self-hosted DGX Spark — no cloud dependency",
    ],

    technologies: [
      "React 19",
      "TypeScript",
      "Vite 6",
      "Tailwind 4",
      "MCP",
      "LM Studio",
    ],
    mainTech: "react",

    links: [],

    tags: [
      "llm",
      "ai",
      "react",
      "mcp",
      "streaming",
      "on-premise",
      "tailscale",
    ],
  },
  {
    id: "mcp-servers",
    title: "MCP Server Development",
    category: "desktop-app",
    featured: true,
    date: "2026-02-10",
    sortOrder: -3.4,

    media: {
      type: "image",
      src: mcpServersImage,
      alt: "MCP server development — design-perfect-mcp and adobe-xd-mcp custom tools",
    },

    description:
      "Two custom Model Context Protocol servers for pixel-perfect design workflows, plus extensions to several community MCP servers. TypeScript + Node, stdio transport, designed to plug into MCP clients like Claude Desktop and LM Studio.",

    detailedContent: {
      overview:
        "MCP exposes capabilities to LLM clients as discoverable tools. These servers cover a niche the community didn't: tight feedback loops between an LLM-generated UI and a target design — measure, compare, overlay, and extract colours, all from inside the model's tool list.",
      sections: [
        {
          title: "design-perfect-mcp",
          items: [
            "capture-artifact: screenshot an HTML artifact at a configurable viewport for diffing",
            "compare-design: pixel-level diff between an implementation and a target design image with a configurable threshold",
            "extract-measurements: returns computed CSS values (position, dimensions, spacing, typography, colors) for any selector",
            "generate-overlay: alpha-blends the implementation on top of the design for visual debugging",
            "extract-colors: samples exact color values at given coordinates on a design image",
          ],
        },
        {
          title: "adobe-xd-mcp",
          items: [
            "Extracts measurements directly from .xd files — no need to round-trip through PNG exports",
            "Enhanced measurement tooling: positioning, spacing, typography, and component-level metadata",
            "Tested against real client design files (millwood, labor) used during freelance work",
          ],
        },
        {
          title: "Extensions to Community Servers",
          items: [
            "Forked and extended chrome-devtools-mcp with additional CSS introspection tools",
            "Patched browser-tools-mcp, webpage-screenshot-mcp, and an automation-mcp variant for personal workflow integration",
          ],
        },
      ],
    },

    highlights: [
      "design-perfect-mcp — 5 tools for pixel-perfect design implementation",
      "adobe-xd-mcp — extract measurements directly from .xd files",
      "Multiple community MCP servers forked and extended",
    ],

    technologies: ["TypeScript", "Node.js", "MCP", "Puppeteer"],
    mainTech: "nodejs",

    links: [],

    tags: [
      "mcp",
      "ai-tooling",
      "typescript",
      "developer-tools",
      "design-systems",
    ],
  },
  {
    id: "resource-orchestration",
    title: "Resource Orchestration Simulator",
    category: "web-app",
    featured: true,
    date: "2026-01-15",
    sortOrder: -3.2,

    media: {
      type: "image",
      src: resourceOrchestrationImage,
      alt: "Resource Orchestration Simulator — live dashboard with nodes, tasks, and scheduling metrics",
    },

    description:
      "Datacenter scheduling simulator with a Rust backend (~2,900 LOC) and a Vue 3 dashboard. Strategy-pattern scheduler, task state machine, heterogeneous node tracking (CPU, memory, GPU). REST API over Tokio + axum.",

    detailedContent: {
      overview:
        "A from-scratch resource orchestrator modeling how datacenters allocate compute across heterogeneous hardware. Built to understand the design tradeoffs behind systems like Kubernetes — scheduling strategies, node failure handling, multi-resource constraints — at a level of detail you can't get from reading docs.",
      sections: [
        {
          title: "Rust Backend (~2,900 LOC)",
          items: [
            "Async API on Tokio + axum: /api/nodes, /api/tasks, /api/schedule, /api/metrics, /api/reset",
            "Strategy pattern over a SchedulingStrategy trait — First-Fit, Best-Fit, Load-Balancing, Bin-Packing, Priority-Based all share the same placement interface",
            "Task state machine modelled with Rust enums (Queued → Running → Completed/Failed) — invalid states are unrepresentable",
            "Heterogeneous resource tracking: CPU cores, memory, GPU count per node, with per-node utilization metrics",
          ],
        },
        {
          title: "Vue 3 Dashboard",
          items: [
            "Live metrics bar (nodes, pending, running, average utilisation, active strategy)",
            "Node cards with real-time CPU and memory utilisation bars updated after each schedule run",
            "Task submission form, one-click 'Schedule All', and reset — exercises the API surface end-to-end",
          ],
        },
        {
          title: "Why It Exists",
          items: [
            "Forcing function for going deeper in Rust beyond CRUD — borrow checker on a non-trivial async codebase, trait objects for strategy polymorphism, channels for failure events",
            "Foundation for adding the harder bits (node failures with rescheduling, preemption, affinity rules) as separate, testable phases",
          ],
        },
      ],
    },

    highlights: [
      "Tokio + axum REST API with strategy-pattern scheduler",
      "Task state machine modelled with Rust enums — invalid states unrepresentable",
      "Live Vue 3 dashboard for submission, scheduling, and metrics",
    ],

    technologies: ["Rust", "Tokio", "axum", "Vue 3", "TypeScript"],
    mainTech: "vue",

    links: [],

    tags: [
      "systems",
      "rust",
      "scheduling",
      "distributed",
      "simulation",
      "infrastructure",
    ],
  },
  {
    id: "33",
    title: "projects.33.title",
    category: "web-app",
    featured: true,
    date: "2025-12-07",
    sortOrder: -3,

    media: {
      type: "image",
      src: project33Image,
      alt: "33 - The Master Number",
    },

    description: "projects.33.description",

    highlights: [
      "projects.33.highlights.0",
      "projects.33.highlights.1",
      "projects.33.highlights.2",
    ],

    technologies: ["React", "Three.js", "React Three Fiber", "GSAP"],
    mainTech: "react",

    links: [
      {
        type: "live",
        url: "https://www.cdtio.com/33",
        label: "projects.33.links.0",
      },
    ],

    tags: ["3d", "interactive", "three.js", "animation"],
  },
  {
    id: "release-radar",
    title: "projects.release-radar.title",
    category: "web-app",
    featured: true,
    date: "2025-12-07",
    sortOrder: -2,

    media: {
      type: "image",
      src: releaseRadarImage,
      alt: "Release Reader - GitHub Release Notes Tool",
    },

    description: "projects.release-radar.description",

    highlights: [
      "projects.release-radar.highlights.0",
      "projects.release-radar.highlights.1",
      "projects.release-radar.highlights.2",
    ],

    technologies: ["React", "TypeScript", "GitHub API"],
    mainTech: "react",

    links: [
      {
        type: "live",
        url: "https://www.cdtio.com/release/",
        label: "projects.release-radar.links.0",
      },
    ],

    tags: ["github", "release-notes", "developer-tools", "productivity"],
  },
  {
    id: "markdown-downloader",
    title: "projects.markdown-downloader.title",
    category: "desktop-app",
    featured: true,
    date: "2025-07-06",
    sortOrder: -1,

    media: {
      type: "image",
      src: markdownDownImage,
      alt: "Markdown Downloader Raycast Extension",
    },

    description: "projects.markdown-downloader.description",

    highlights: [
      "projects.markdown-downloader.highlights.0",
      "projects.markdown-downloader.highlights.1",
      "projects.markdown-downloader.highlights.2",
      "projects.markdown-downloader.highlights.3",
      "projects.markdown-downloader.highlights.4",
      "projects.markdown-downloader.highlights.5",
      "projects.markdown-downloader.highlights.6",
    ],

    technologies: [
      "TypeScript",
      "React",
      "Raycast API",
      "Node.js",
      "Turndown",
      "fs-extra",
    ],
    mainTech: "react",

    links: [
      {
        type: "github",
        url: "https://github.com/dn177/MarkdownDownloader",
        label: "projects.markdown-downloader.links.0",
      },
    ],

    tags: [
      "raycast-extension",
      "markdown",
      "content-extraction",
      "typescript",
      "productivity",
      "web-scraping",
      "macos",
    ],
  },
  {
    id: "space-studio",
    title: "Space Studio - Interactive Rocket Science Education",
    category: "web-app",
    featured: true,
    date: "2025-06-12",
    sortOrder: 0,

    media: {
      type: "video",
      src: spaceStudioVideo,
      poster: spaceStudioPoster,
      alt: "Space Studio interactive rocket science education platform",
    },

    description:
      "An interactive web application for teaching rocket science and engineering concepts through engaging 3D simulations, hands-on learning experiences, and progressive lessons from basic rocketry to advanced orbital mechanics.",

    highlights: [
      "60+ interactive 3D simulations including rocket launches, orbital mechanics, and black hole physics",
      "WebAssembly-powered physics calculations achieving 10-50x performance improvements",
      "24 comprehensive lessons covering topics from Newton's Laws to advanced propulsion systems",
      "Real-time physics engine with Matter.js for realistic simulations",
      "Gamification features including progress tracking, achievements, and assessments",
    ],

    technologies: [
      "React",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "WebAssembly",
      "Rust",
      "Matter.js",
      "Tailwind CSS",
      "Framer Motion",
      "Vite",
    ],
    mainTech: "react",

    links: [
      {
        type: "live",
        url: "https://www.cdtio.com/space/",
        label: "Launch Space Studio",
      },
      // Add GitHub link if the repo is public:
      // {
      //   type: "github",
      //   url: "https://github.com/yourusername/spacestudio",
      //   label: "View on GitHub",
      // },
    ],

    tags: [
      "education",
      "3d-graphics",
      "physics-simulation",
      "webassembly",
      "interactive",
      "typescript",
      "space-science",
      "gamification",
    ],
  },
  {
    id: "contao-website",
    title: "Example Contao Website",
    category: "website",
    featured: false,
    date: "2024-12-01",
    sortOrder: 1,

    media: {
      type: "video",
      src: contaoVideo,
      poster: poster13,
      alt: "Contao CMS website demonstration",
    },

    description:
      "Contao CMS with special contact form implementation using grid-template-areas.",
    highlights: [
      "Background colors outside of container implemented with pseudo elements, not negative margins",
      "Contact form implemented using grid-template-areas",
    ],

    technologies: ["PHP", "Contao CMS", "jQuery", "LESS"],
    mainTech: "php",

    links: [
      {
        type: "live",
        url: "https://fewo-riesserbaur.de",
        label: "View the Website",
      },
    ],

    tags: ["cms", "php", "responsive", "form-design"],
  },
  {
    id: "inlearning",
    title: "InLearning Platform",
    category: "website",
    featured: true,
    date: "2025-06-01",
    sortOrder: 2,

    media: {
      type: "image",
      src: inLearning,
      alt: "InLearning Platform",
    },

    description:
      "Learning platform with materials for the topics: AI / ML, Python, React.js, Rust and Vue.js.",
    highlights: [
      "In-browser code completion and syntax highlighting",
      "Live preview of compiled code",
    ],

    technologies: ["Vue.js", "Pinia", "TypeScript", "Monaco Editor"],
    mainTech: "Vue.js",

    links: [
      {
        type: "live",
        url: "https://www.cdtio.com/inlearning/",
        label: "View the Website",
      },
    ],

    tags: ["vue.js", "php"],
  },
  {
    id: "pictureplatform",
    title: "Picture Playground Platform",
    category: "website",
    featured: false,
    date: "2025-06-01",
    sortOrder: 3,

    media: {
      type: "image",
      src: picturePlayground,
      alt: "Picture Playground Platform",
    },

    description:
      "Platform initially developed for showcasing performance improvements by using Webassembly for computationally expensive tasks, later on added C++, Java and Scala.",
    highlights: ["Comparison of Rust, C++, Java and Scala and JS Performance"],

    technologies: ["React.js", "Rust", "Webassembly", "C++", "Java", "Scala"],
    mainTech: "React",

    links: [
      {
        type: "live",
        url: "https://www.cdtio.com/ppp/",
        label: "View the Website",
      },
    ],

    tags: ["React.js", "Rust"],
  },

  {
    id: "mathtron-vue",
    title: "Mathtron Vue Migration",
    category: "desktop-app",
    featured: false,
    date: "2025-05-30",
    sortOrder: 4,

    media: {
      type: "image",
      src: mathtronVueImage,
      alt: "Mathtron Vue migration screenshot",
    },

    description:
      "Vue.js migration of Mathtron with Vuetify UI framework. Desktop app built with Electron.",
    highlights: [
      "Migrated from React to Vue.js",
      "Modern Material Design with Vuetify",
      "Improved performance and user experience",
      "Sanitized user input, don't try your luck",
    ],

    technologies: ["Vue.js", "Vuetify", "Electron", "JavaScript"],
    mainTech: "vue",

    links: [
      {
        type: "live",
        url: "https://cdtio.com/mathtron",
        label: "Open the project",
      },
    ],

    tags: ["vue", "electron", "desktop", "migration", "material-design"],
  },
  {
    id: "learn2sort",
    title: "Learn2Sort",
    category: "website",
    featured: false,
    date: "2026-06-01",
    sortOrder: 5,

    media: {
      type: "image",
      src: learn2Sort,
      alt: "Learn2Sort",
    },

    description:
      "App build with React.js mainly to visualize sorting algorithms.",
    highlights: [
      "Shows important information about the respective algirthm at the bottom.",
      "Adjustable speed for learning purposes",
    ],

    technologies: ["React.js"],
    mainTech: "react",

    links: [
      {
        type: "live",
        url: "https://cdtio.com/l2s",
        label: "Open the project",
      },
    ],

    tags: ["vue", "electron", "desktop", "migration", "material-design"],
  },
  {
    id: "nextjs-portfolio",
    title: "Next.js Portfolio Website",
    category: "portfolio",
    featured: true,
    date: "2024-11-15",
    sortOrder: 6,

    media: {
      type: "image",
      src: nextPortfolioImage,
      alt: "Next.js portfolio website screenshot",
    },

    description:
      "Alternative portfolio built with Next.js, featuring static export optimizations.",
    highlights: [
      "Created custom static export path fix script as byproduct",
      "Optimized for performance and SEO",
    ],

    technologies: ["Next.js", "React", "JavaScript"],
    mainTech: "nextjs",

    links: [
      {
        type: "github",
        url: "https://github.com/dn177/Next.js-static-export-path-fix-script",
        label: "Open the script code in Github",
      },
      {
        type: "live",
        url: "https://www.cdtio.com/next",
        label: "Open the Next Portfolio",
      },
    ],

    tags: ["nextjs", "portfolio", "static-site", "optimization"],
  },
  {
    id: "mathtron",
    title: "Mathtron",
    category: "desktop-app",
    featured: false,
    date: "2024-10-20",
    sortOrder: 7,

    media: {
      type: "video",
      src: mathtronVideo,
      poster: poster11,
      alt: "Mathtron LaTeX editor demonstration",
    },

    description:
      "Spontaneously made LaTeX editor aiming to give a good experience for taking math notes and doing math exercises on the Desktop.",
    highlights: [
      "Real-time LaTeX rendering",
      "Intuitive math-focused UI",
      "Cross-platform desktop application",
    ],

    technologies: ["Electron", "React", "TypeScript", "Material-UI"],
    mainTech: "electron",

    links: [
      {
        type: "github",
        url: "https://github.com/dn177/Mathtron/blob/main/src/renderer/App.tsx",
        label: "View on Github",
      },
    ],

    tags: ["electron", "desktop", "latex", "education", "math"],
  },

  {
    id: "private-blog",
    title: "Private Blog",
    category: "web-app",
    featured: false,
    date: "2024-09-15",
    sortOrder: 8,

    media: {
      type: "video",
      src: privateBlogVideo,
      poster: poster12,
      alt: "Private blog demonstration",
    },

    description:
      "Selfmade Blog with authentication and rich text editing capabilities.",
    highlights: [
      "Full authentication system with NextAuth",
      "Rich text editor with syntax highlighting",
      "Real-time data updates with SWR",
    ],

    technologies: [
      "React",
      "Next.js",
      "NextAuth",
      "Node.js",
      "MongoDB",
      "Prisma",
      "Firebase",
      "Quill",
      "Highlight.js",
      "SWR",
    ],
    mainTech: "nextjs",

    links: [
      {
        type: "article",
        url: "https://cddm.medium.com",
        label: "My Medium Blog Posts",
      },
    ],

    tags: ["blog", "fullstack", "authentication", "database"],
  },
  {
    id: "rest-fullstack",
    title: "REST Fullstack Code Example",
    category: "web-app",
    featured: false,
    date: "2024-08-10",
    sortOrder: 9,

    media: {
      type: "video",
      src: restFullstackVideo,
      poster: poster10,
      alt: "REST API fullstack demonstration",
    },

    description:
      "Full-stack application demonstrating clean REST API architecture.",
    highlights: [
      "Clean REST API design",
      "TypeScript for type safety",
      "SQLite3 for data persistence",
    ],

    technologies: ["React", "TypeScript", "Express.js", "Node.js", "SQLite3"],
    mainTech: "nodejs",

    links: [
      {
        type: "github",
        url: "https://github.com/dn177/BasicREST/tree/main",
        label: "View on Github",
      },
    ],

    tags: ["fullstack", "rest-api", "typescript", "database"],
  },

  {
    id: "e-commerce",
    title: "E-Commerce",
    category: "web-app",
    featured: false,
    date: "2024-07-20",
    sortOrder: 10,

    media: {
      type: "video",
      src: ecommerceVideo,
      poster: poster9,
      alt: "E-commerce platform demonstration",
    },

    description:
      "Modern e-commerce platform with secure authentication and REST API.",
    highlights: [
      "Secure authentication with NextAuth",
      "Pre-hashed passwords with base64 and bcrypt",
      "Modern UI with Tailwind CSS and shadcn/ui",
      "Strapi Backend with REST API",
    ],

    technologies: [
      "Next.js",
      "NextAuth",
      "React",
      "TypeScript",
      "TailwindCSS",
      "shadcn/ui",
      "Strapi",
    ],
    mainTech: "nextjs",

    links: [],

    tags: ["ecommerce", "authentication", "typescript", "tailwind"],
  },
  {
    id: "emmet-demo",
    title: "Emmet Live Coding Demo",
    category: "demo",
    featured: false,
    date: "2024-06-15",
    sortOrder: 11,

    media: {
      type: "video",
      src: emmetDemoVideo,
      poster: poster8,
      alt: "Emmet live coding demonstration",
    },

    description:
      "Live coding demonstration showing proficiency with Emmet and CSS shortcuts.",
    highlights: ["Efficient HTML/CSS workflow", "Advanced Emmet techniques"],

    technologies: ["HTML", "CSS", "Emmet"],
    mainTech: "all",

    links: [],

    tags: ["demo", "productivity", "workflow"],
  },

  {
    id: "kanban-board",
    title: "Kanban Board",
    category: "web-app",
    featured: false,
    date: "2024-05-10",
    sortOrder: 12,

    media: {
      type: "video",
      src: kanbanBoardVideo,
      poster: poster7,
      alt: "Kanban board demonstration",
    },

    description:
      "Kanban Board implementation with drag-and-drop functionality.",
    highlights: [
      "Drag-and-drop interface",
      "REST API backend",
      "Real-time updates",
    ],

    technologies: ["Vue.js", "Express.js", "Node.js", "Bootstrap"],
    mainTech: "vue",

    links: [],

    tags: ["kanban", "vue", "productivity", "rest-api"],
  },
  {
    id: "car-platform",
    title: "Car Selling Platform",
    category: "web-app",
    featured: false,
    date: "2024-04-05",
    sortOrder: 13,

    media: {
      type: "video",
      src: carPlatformVideo,
      poster: poster6,
      alt: "Car selling platform demonstration",
    },

    description:
      "Initial prototype for a car selling platform with advanced filtering.",
    highlights: [
      "Advanced filter functionality",
      "Considers all input values simultaneously",
      "Responsive design with Bootstrap",
    ],

    technologies: ["React", "Bootstrap", "Strapi"],
    mainTech: "react",

    links: [],

    tags: ["prototype", "filtering", "ecommerce"],
  },
  {
    id: "company-website",
    title: "Company Website",
    category: "website",
    featured: false,
    date: "2024-03-20",
    sortOrder: 14,

    media: {
      type: "video",
      src: companyWebsiteVideo,
      poster: poster5,
      alt: "Company website demonstration",
    },

    description:
      "Multi-site company web presence with contact form functionality.",
    highlights: [
      "Three separate themed websites",
      "PHP contact form functionality",
      "AOS.js animations",
    ],

    technologies: ["Bootstrap", "AOS.js", "PHP"],
    mainTech: "php",

    links: [
      {
        type: "live",
        url: "https://strukturia-solar.de",
        label: '"Solar" Website',
      },
      {
        type: "live",
        url: "https://www.strukturia-galabau.de",
        label: '"Gala" Website',
      },
      {
        type: "live",
        url: "https://www.strukturia-bau.de",
        label: '"Bau" Website',
      },
    ],

    tags: ["bootstrap", "company", "multi-site"],
  },
  {
    id: "chart",
    title: "Chart",
    category: "component",
    featured: false,
    date: "2024-02-15",
    sortOrder: 15,

    media: {
      type: "video",
      src: chartVideo,
      poster: poster3,
      alt: "Chart component demonstration",
    },

    description:
      "Interactive chart with options to redraw with different time units.",
    highlights: [
      "Interactive time unit switching",
      "Chart.js implementation",
      "Responsive design",
    ],

    technologies: ["Chart.js", "JavaScript", "Bootstrap Studio"],
    mainTech: "all",

    links: [],

    tags: ["visualization", "charts", "interactive"],
  },

  {
    id: "cdn-manager",
    title: "cdnManager jQuery Version",
    category: "desktop-app",
    featured: false,
    date: "2024-01-10",
    sortOrder: 16,

    media: {
      type: "video",
      src: cdnManagerVideo,
      poster: poster2,
      alt: "cdnManager demonstration",
    },

    description: "Private project that manages and stores CDNs.",
    highlights: [
      "CDN management functionality",
      "Built for private usage",
      "Electron desktop app",
    ],

    technologies: ["jQuery", "Electron"],
    mainTech: "electron",

    links: [],

    tags: ["tools", "productivity", "desktop"],
  },

  {
    id: "molar",
    title: "Molar",
    category: "mobile-app",
    featured: false,
    date: "2016-04-12",
    sortOrder: 17,

    media: {
      type: "image",
      src: molarImage,
      alt: "Molar app screenshot",
    },

    description:
      "Enhanced bluetooth keyboard experience with iOS devices. For example ability to launch applications with keyboard shortcuts. Initially simply was a port of the iPad App Switcher to the iPhone.",
    highlights: ["Featured in iDownloadBlog article"],

    technologies: ["Mobile Development"],
    mainTech: "Misc",

    links: [
      {
        type: "article",
        url: "https://www.idownloadblog.com/2016/04/12/molar/",
        label: "View Article",
      },
    ],

    tags: ["mobile", "featured", "article"],
  },
];

// Helper functions for filtering and sorting
export const getProjectsByTechnology = (tech) => {
  if (tech === "all") return portfolioProjects;
  return portfolioProjects.filter((project) => project.mainTech === tech);
};

export const getAllTechnologies = () => {
  const techSet = new Set();
  portfolioProjects.forEach((project) => {
    project.technologies.forEach((tech) => techSet.add(tech));
  });
  return Array.from(techSet).sort();
};

export const getProjectsByCategory = (category) =>
  portfolioProjects.filter((project) => project.category === category);

export const getFeaturedProjects = () =>
  portfolioProjects.filter((project) => project.featured);

export const sortProjectsByDate = (projects) =>
  [...projects].sort((a, b) => new Date(b.date) - new Date(a.date));

export default portfolioProjects;
