// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides would live in src/i18n/locales/*.json
// under "projects.monitoring-observability" (none yet, resolves via
// defaultValue, matching the other ml-systems cards). Case-study
// (detailedContent) text is English by design for now.
const project = {
  "id": "monitoring-observability",
  "title": "Production Observability for a Self-Hosted 397B LLM",
  "category": "ml-systems",
  "featured": true,
  "flagship": false,
  "date": "2026-07-09",
  "sortOrder": -5.0,
  "summary": "Prometheus + Grafana watching the serving layer of a self-hosted 397B LLM, not just the OS.",
  "stat": { "value": "10×", "label": "GPU memory the OS process viewer misses" },
  "media": {
    "type": "image",
    "src": "/Portfolio/monitoring/monitoring-hero.svg",
    "alt": "Inference monitoring dashboard for Ornith-397B: decode tok/s timeseries, KV-cache gauge, unified-memory 10x panel, and six incident-tuned alert rules"
  },
  "description": "A Prometheus + Grafana observability stack for a self-hosted 397B-parameter LLM (2-bit MoE) on a single DGX Spark, built on the principle that inference fails at the serving layer before it shows up in the OS. Scrapes the engine's own metrics (KV-cache occupancy, queue depth, decode/prefill throughput) alongside host and per-process GPU memory, with six alert rules whose thresholds and durations are tuned from two real production incidents. Orchestrated end-to-end by a multi-model agent workflow (generate, adversarially review, deploy, verify) against a box that was serving a live training-data run the whole time.",
  "detailedContent": {
    "overview": "Observability for LLM inference, built to answer the questions btop cannot: is a request 4,000 tokens from its context limit, are children starving behind one slot, has a generation been streaming the same paragraph for 51 minutes? The stack is stock and boring on purpose: Prometheus (90-day TSDB) scraping the llama.cpp engine's /metrics, node_exporter for host memory and swap, and a 12-line textfile exporter for per-process GPU memory, feeding a nine-panel Grafana dashboard and six alert rules. What makes it an inference-monitoring story rather than a generic Grafana deployment is the choice of signals and the provenance of the thresholds: every alert encodes a lesson from a real post-mortem on this exact box, and the whole deployment was driven by an agent workflow that had to operate around a live workload it was forbidden to disturb.",
    "sections": [
      {
        "title": "The Premise: Monitor the Serving Layer, Not the OS",
        "items": [
          "On a unified-memory box the process viewer is structurally blind: nvidia-smi showed the server holding 97.7 GiB GPU-side while /proc reported 9.2 GiB RSS; btop reports the 9.2, so the machine's dominant consumer is invisible in its process list, and you can watch 'free' fall with no process appearing to grow.",
          "The signals that actually predict inference failures (KV-cache occupancy, queue depth, per-slot context headroom, decode vs prefill tokens/second) exist only inside the server. The dashboard surfaces exactly these, translated from the SRE golden signals (latency, traffic, errors, saturation) into their serving-layer forms.",
          "Design rule carried throughout: alert on symptoms, diagnose with causes. 'Decode throughput is zero with requests in flight' pages a human; KV %, queue depth, and memory headroom are the diagnostic dashboard you open next, not the thing that wakes you."
        ],
        "image": "/Portfolio/monitoring/monitoring-architecture.svg",
        "imageAlt": "Scrape architecture: llama-server, node_exporter, and a GPU textfile exporter feeding Prometheus, which feeds a Grafana dashboard and six symptom-based alert rules."
      },
      {
        "title": "Six Alerts, Each One a Prior Incident",
        "items": [
          "LlamaServerDown fires on sum(up)==0 across both the prod (:1234) and nightly-capture (:8080) endpoints, for 5m, so a routine window handoff, where one endpoint is briefly down by design, does not page anyone.",
          "GenerationStalled uses for: 20m deliberately: a 100k-token prefill makes both throughput counters read zero for ~7 minutes while a request is in flight (counters advance at step boundaries, not continuously), so a shorter window would false-page on every long prompt. The 20m outlasts any plausible prefill on this box.",
          "HostMemoryLow watches MemAvailable < 8 GiB: the honest red line from an OOM kill where the kernel chose the server because a terminal scope had handed it a positive oom_score_adj. KvCacheSaturated (>90%) is the capacity signal that saturates long before compute does, which is what admission control gates on."
        ]
      },
      {
        "title": "The GPU Exporter: The Standard Escape Hatch",
        "items": [
          "DCGM isn't a given on GB10 and nvidia-smi --query-gpu returns N/A for memory on this box, so per-process GPU memory comes from a 12-line shell script that queries --query-compute-apps and writes node_exporter's textfile format, run every 15s by a systemd user timer (cron can't go below a minute; no passwordless sudo, so system units were out).",
          "The write is atomic (tmp + mv) so Prometheus never scrapes a half-written file, and label cardinality is bounded to pid + process basename: no prompts, no session IDs in metric labels, the discipline that keeps a time-series DB from exploding.",
          "This tiny-script-to-.prom-file pattern is the reusable lesson: it is how you monitor anything that lacks a real exporter, and it is what makes the OS-invisible 10x memory footprint show up as a first-class panel."
        ]
      },
      {
        "title": "Orchestrated Around a Live Workload",
        "items": [
          "The box was mid-run: a capture server was generating a 397B training corpus on :8080 throughout. The deployment was driven by a multi-model agent workflow under a hard constraint (never kill or signal the serving processes, no sudo, hands off ports 1234/8080), so monitoring was added as a pure side-car (containers + scrapes + a user timer), claiming nothing.",
          "Model routing by task: a bulk model generated the config from a byte-exact brief, an independent review model checked it against the playbook and box constraints (promtool included) before anything ran, a deploy model brought the stack up, and a verify pass ran the full acceptance suite including a fire drill (stop node_exporter, watch the target go down and recover).",
          "Verified live against the running workload: all targets green (with :1234 correctly reported down, not failed), decode throughput and KV occupancy flowing from the capture server, the GPU panel showing the server's true 98.8 GiB, and all six alert rules loaded and inactive."
        ]
      },
      {
        "title": "Deliberate Scope: One Box, Not a Fleet",
        "items": [
          "Latency histograms (TTFT/ITL percentiles) are left to the engine that has them: llama.cpp exposes none, so the doc maps every signal 1:1 onto vLLM, where time_to_first_token and time_per_output_token histograms drop in as the main observability upgrade an engine swap buys.",
          "Alertmanager is intentionally absent: on one box, grouping/routing/silencing have nothing to organize, so firing alerts are visible in the Prometheus UI and phone push is one optional Grafana webhook to ntfy. The escalation path (Alertmanager, remote-write to Thanos, distributed tracing) is documented as the growth story, not built prematurely.",
          "Shipped with two detailed companion docs (a Prometheus reference and a Grafana reference), each grounded in this stack's actual queries, panels, and alert expressions rather than generic tutorials, so the dashboards are dashboard-as-code and reproducible after any wipe."
        ]
      },
      {
        "title": "The Program: One Box, Five Days",
        "items": [
          "This stack closed a five-day program on one machine in July 2026. The box was the same DGX Spark (GB10) throughout, serving Ornith-397B (2-bit MoE) through ik_llama.cpp. The three pieces of work before it were 'Optimizing a 397B LLM on a DGX Spark (GB10)', 'Retraining a 397B LLM's Speculative Drafter on a DGX Spark', and 'Designing a 397B MoE Quant to a 121 GiB Budget'.",
          "The decode tuning and the drafter retrain made the served model faster. The quant design priced a larger cut into the box's spare memory. It left the served baseline in place, because that cut still has its quality and memory gates ahead of it. The monitoring went in the day after the quant, as a side-car around the capture server that was generating a training corpus on the box. Its alert rules cover that capture endpoint alongside the production endpoint.",
          "Two artifacts from the program are public, at huggingface.co/cdtio33: the Ornith 1.0 and Ornith 1.5 drafter model cards. The Ornith 1.0 card carries the benchmark protocol and the pre-registered A/B for the drafter retrain. The Ornith 1.5 card documents a follow-up retrain with its own confidence interval. The quant and this monitoring stack have no public artifact yet."
        ]
      }
    ]
  },
  "highlights": [
    "Surfaces the serving-layer signals btop cannot (KV-cache occupancy, queue depth, decode/prefill tok/s), plus per-process GPU memory (the 10x footprint unified memory hides from the OS)",
    "Six symptom-based alert rules whose for: durations are tuned from two real incidents, including a 20m stall window that survives the step-boundary counter trap",
    "Per-process GPU exporter as a 12-line textfile script on a systemd user timer, the standard escape hatch where DCGM and --query-gpu don't work on GB10",
    "Deployed as a non-intrusive side-car around a live 397B training-data run: no sudo, no killed processes, ports 1234/8080 untouched",
    "Orchestrated by a multi-model agent workflow (generate, adversarial review, deploy, verify) with a node_exporter fire drill proving the alert pipeline fires"
  ],
  "technologies": [
    "Prometheus",
    "Grafana",
    "PromQL",
    "node_exporter",
    "Docker Compose",
    "systemd",
    "Bash",
    "nvidia-smi",
    "llama.cpp /metrics",
    "DGX Spark (GB10)"
  ],
  "mainTech": "ai-ml",
  "links": [],
  "tags": [
    "ai-ml",
    "observability",
    "monitoring",
    "prometheus",
    "grafana",
    "sre",
    "mlops",
    "inference",
    "llm",
    "devops"
  ]
};

export default project;
