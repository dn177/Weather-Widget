// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.resource-orchestration". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "resource-orchestration",
  "title": "Resource Orchestration Simulator",
  "category": "web-app",
  "featured": true,
  "date": "2026-01-15",
  "sortOrder": -3.3,
  "media": {
    "type": "image",
    "src": "/Portfolio/ResourceOrchestration.png",
    "alt": "Resource Orchestration Simulator — live dashboard with nodes, tasks, and scheduling metrics"
  },
  "description": "Datacenter scheduling simulator with a Rust backend (~2,900 LOC) and a Vue 3 dashboard. Strategy-pattern scheduler, task state machine, heterogeneous node tracking (CPU, memory, GPU). REST API over Tokio + axum.",
  "detailedContent": {
    "overview": "A from-scratch resource orchestrator modeling how datacenters allocate compute across heterogeneous hardware. Built to understand the design tradeoffs behind systems like Kubernetes — scheduling strategies, node failure handling, multi-resource constraints — at a level of detail you can't get from reading docs.",
    "sections": [
      {
        "title": "Rust Backend (~2,900 LOC)",
        "items": [
          "Async API on Tokio + axum: /api/nodes, /api/tasks, /api/schedule, /api/metrics, /api/reset",
          "Strategy pattern over a SchedulingStrategy trait — First-Fit, Best-Fit, Load-Balancing, Bin-Packing, Priority-Based all share the same placement interface",
          "Task state machine modelled with Rust enums (Queued → Running → Completed/Failed) — invalid states are unrepresentable",
          "Heterogeneous resource tracking: CPU cores, memory, GPU count per node, with per-node utilization metrics"
        ]
      },
      {
        "title": "Vue 3 Dashboard",
        "items": [
          "Live metrics bar (nodes, pending, running, average utilisation, active strategy)",
          "Node cards with real-time CPU and memory utilisation bars updated after each schedule run",
          "Task submission form, one-click 'Schedule All', and reset — exercises the API surface end-to-end"
        ]
      },
      {
        "title": "Why It Exists",
        "items": [
          "Forcing function for going deeper in Rust beyond CRUD — borrow checker on a non-trivial async codebase, trait objects for strategy polymorphism, channels for failure events",
          "Foundation for adding the harder bits (node failures with rescheduling, preemption, affinity rules) as separate, testable phases"
        ]
      }
    ]
  },
  "highlights": [
    "Tokio + axum REST API with strategy-pattern scheduler",
    "Task state machine modelled with Rust enums — invalid states unrepresentable",
    "Live Vue 3 dashboard for submission, scheduling, and metrics"
  ],
  "technologies": [
    "Rust",
    "Tokio",
    "axum",
    "Vue 3",
    "TypeScript"
  ],
  "mainTech": "vue",
  "links": [],
  "tags": [
    "ai-ml",
    "systems",
    "rust",
    "scheduling",
    "distributed",
    "simulation",
    "infrastructure"
  ]
};

export default project;
