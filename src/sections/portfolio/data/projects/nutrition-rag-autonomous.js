// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.nutrition-rag-autonomous". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "nutrition-rag-autonomous",
  "title": "Autonomous Nutrition Knowledge Base: Self-Updating RAG",
  "category": "web-app",
  "featured": true,
  "date": "2026-05-27",
  "sortOrder": -3.9,
  "closedSource": true,
  "media": {
    "type": "image",
    "src": "/Portfolio/NutritionRAG-architecture.png",
    "alt": "Autonomous nutrition KB architecture diagram showing the daily research-ingestion loop, git push to Forgejo, and reindex into OpenWebUI"
  },
  "description": "A self-updating personal nutrition knowledge base. A nightly daemon walks the Obsidian vault, fetches new biomedical literature from Europe PMC for every food/supplement/compound in the stack, summarises each abstract through a local Qwen3.6-35B on vLLM, writes structured Markdown notes, commits and pushes to a private Forgejo repo. A Forgejo Action then diffs the push and reindexes only the changed files into OpenWebUI's BGE-M3 hybrid RAG. End-to-end on-premise; no third-party API except Europe PMC.",
  "detailedContent": {
    "overview": "What started as an Obsidian vault for foods, supplements, and stack notes became a closed-loop system: edits in any direction (human or agent) hit git, the CI re-indexes the vector store, and the chat UI answers grounded questions with citations into the actual notes. The autonomous half (the part that closes the loop) is a daily ingestion daemon that turns the vault's own [[wikilink]] graph into a search plan over Europe PMC, summarises each new paper through a local LLM, and files the result back into the vault as a fully-cross-referenced Markdown note. Three weeks of design + iteration produced something I actually use every morning.",
    "sections": [
      {
        "title": "Autonomous Research Loop",
        "items": [
          "systemd timer fires daily at 03:00 → research_daemon.py walks the vault, derives 113 search topics from every food, supplement, nutrient, and compound note's aliases (incl. German Walnusskerne / Rote Beete / Mandeln) → builds boolean OR queries for Europe PMC",
          "Europe PMC REST API fetches papers from the last 14 days (peer-reviewed only, abstract required); dedup by DOI/PMID against a JSONL state file means subsequent runs only see what's new",
          "Each new abstract is summarised through Qwen3.6-35B-A3B-Claude-Distilled (BF16 on vLLM, 262 K context, MTP speculative decoding) into a strict-JSON schema: TL;DR, population, intervention, outcome, direction, study quality (RCT / cohort / cross-sectional / …), n, duration, key findings, limitations, and relevance to my stack",
          "Notes are written to `60 Research/<date>-<topic>-<title-slug>.md` with YAML frontmatter that auto-cross-references back into the vault: every research note declares its `mentions: [[creatine]], [[stress-cortisol]]` and shows up in Obsidian's graph view next to the food/supplement it discusses",
          "First production-grade run ingested 165 papers in 14 minutes; zero failures, full Slack digest, all summaries DOI-grounded with no fabrication"
        ],
        "image": "/Portfolio/NutritionRAG-cli.png",
        "imageAlt": "Side-by-side terminal panels: the autonomous daemon ingesting papers per topic, and the Forgejo Action log showing the resulting reindex completing in ~30 seconds"
      },
      {
        "title": "Git-Driven CI: Push to KB",
        "items": [
          "The vault lives in a private Forgejo repo. Every push to main triggers `.forgejo/workflows/reindex-owui.yml` which runs in a python:3.12-slim container on the local runner",
          "The job clones the repo, computes `git diff BEFORE..AFTER`, filters to KB-relevant paths (foods / supplements / research / products), and surgically removes + re-uploads only the changed files via OpenWebUI's REST API, with no full re-index and no duplicate entries",
          "Handles all three diff statuses (added / modified / deleted) plus renames; first-commit case (BEFORE_SHA = 000…000) treats every existing file as new",
          "Repo secrets (OWUI_API_KEY, OWUI_KB_ID) provisioned via the Forgejo Actions API; the runner reaches OpenWebUI through `--add-host=host.docker.internal:host-gateway` in the runner's container.options because the two services live on different Docker networks",
          "End-to-end latency: git push → KB updated in ~30 seconds (~7s container pull, ~5s clone + deps, ~4s diff + upload)"
        ],
        "image": "/Portfolio/NutritionRAG-code.png",
        "imageAlt": "Two-column code view: the Forgejo Actions workflow YAML on the left and the daemon's structured-JSON summariser invocation on the right"
      },
      {
        "title": "Hybrid Retrieval Engineering",
        "items": [
          "OpenWebUI as the chat layer with a custom Knowledge Base attached: BGE-M3 dense embeddings + BM25 sparse fused via Reciprocal Rank Fusion (weight 0.5), reranked by BGE-reranker-v2-m3",
          "Built an 8-query evaluation set (English + German, factual + cross-doc) and tuned chunking, BM25 weight, relevance threshold, and enriched-text mode empirically: baseline 3 / 8 queries returning useful context, after tuning 6 / 8 (REDUND-style cross-document questions are intrinsic vector-RAG weaknesses, deliberately deferred to the secondary graph layer)",
          "Discovered that for a small, terse corpus the textbook BGE-reranker thresholds (>0.3) compress the score distribution downward, so I calibrated empirically to 0.05 against actual eval data, which surfaced previously-hidden correct top hits",
          "Engineered a structured `## Index` plaintext block appended to every food/supplement note that mirrors the YAML frontmatter as natural prose. Embedder + reranker now see the structured associations as tokens, lifting the magnesium / walnuts retrieval score from 0.246 to 0.546",
          "Stub-pollution diagnosis: 105 single-line nutrient stubs were dominating top-k with near-identical vectors; surgically removed from the KB while keeping them in the vault as wikilink targets. Top hit quality jumped immediately"
        ],
        "image": "/Portfolio/NutritionRAG-research-note.png",
        "imageAlt": "A research note auto-generated by the daemon, showing YAML frontmatter (DOI, PMID, quality, n, mentions wikilinks back into the vault), badges, structured study-at-a-glance, key findings, and relevance to the user's stack"
      },
      {
        "title": "Named KB Variants: A/B Eval",
        "items": [
          "Each OpenWebUI Knowledge Base collection's name encodes its full retrieval config, so a result is never ambiguous about which index produced it: `Nutrition Bge-M3 C1000-0150-M500_rr5` = 1000-char chunks / 150 overlap / 500-char min / rerank top-5",
          "Ran the same fixed 8-query eval set against side-by-side variants (`C1000-0150-M500_rr5`, `C1000-0150-M150_rr5`, and a finer-grained `C500-075-M150_rr5`), swapping the collection behind the chat model to compare chunk size and min-length empirically rather than by feel",
          "The winning config is the one wired into the daily reindex; losers are kept around as named collections so a regression can be re-checked at any time"
        ],
        "image": "/Portfolio/NutritionRAG-KB.jpg",
        "imageAlt": "OpenWebUI Knowledge Base list showing three named Nutrition BGE-M3 collections whose names encode chunk size, overlap, min-length, and rerank config for A/B comparison"
      },
      {
        "title": "Dual RAG: Graph + Vector",
        "items": [
          "Second indexing path built in parallel: vault → Memgraph as a property graph (Food, Supplement, Nutrient, Compound, Effect, Product nodes; CONTAINS / HAS_EFFECT / IS / INCLUDES edges)",
          "Wrote vault → graph ingestion that walks YAML `[[wikilinks]]` and resolves them to nodes, surfacing typos as :Unresolved placeholders for human review",
          "154 nodes / 231 edges built from 49 source notes, answering structured set queries directly via Cypher: `MATCH (f:Food)-[:CONTAINS]->(:Nutrient {slug:'epa'})` returns the EPA-bearing foods deterministically, no LLM creativity required",
          "Router classifier (LLM with few-shot Cypher examples) decides per question whether to hit the graph (structured filters), the vector store (research mechanism / evidence), or pre-build a CAG context (whole-stack questions where the entire 17 KB curated KB fits in context)",
          "End-user view: a German question („Welche Nahrung und Supplemente, um kognitive Leistungsfähigkeit zu maximieren?“) retrieves 9 sources and comes back as a structured answer (supplements, vitamins, nootropics, foods, plus contraindications), with every claim chipped to the exact vault note it came from (ginkgo.md, creatine.md, walnuts.md …)"
        ],
        "image": "/Portfolio/NutritionRAG-Chat.jpg",
        "imageAlt": "OpenWebUI chat: Qwen3.6 answering a German cognitive-performance nutrition question, citing 9 retrieved vault notes inline, grouped into supplements / vitamins / nootropics / foods with a contraindications section"
      },
      {
        "title": "Self-Hosted On-Premise Stack",
        "items": [
          "Built on an NVIDIA DGX Spark (GB10, 128 GB unified memory, aarch64, CUDA 13), already running vLLM, Memgraph, Qdrant, OpenWebUI, and a Forgejo instance with one runner",
          "Qwen3.6-35B-A3B-Claude-Distilled in BF16 with MTP speculative decoding (~+15% tok/s), chosen over GPT-OSS-120B for the 262 K context window needed by CAG-style whole-vault queries",
          "Diagnosed and patched a Qwen3.6 reasoning-token leak (Cyrillic / Chinese tokens occasionally surfaced in German answers) by enabling vLLM's `--reasoning-parser qwen3` flag. Reasoning channels now route to `reasoning_content` and never leak into `content`",
          "Hardened the Forgejo runner container networking (`--add-host=host.docker.internal:host-gateway`) so jobs on `forgejo_default` can reach OpenWebUI on `openwebui_default`, a real cross-network Docker problem solved cleanly",
          "Optional Slack digest into a `#research` channel after each daemon run; the whole thing runs without my attention"
        ],
        "image": "/Portfolio/NutritionRAG-Runner.jpg",
        "imageAlt": "Forgejo 'Manage runners' panel: a single Docker-labelled local-runner (v6.2.0), Idle and online, that executes the reindex workflow on every push"
      },
      {
        "title": "What Makes It Different",
        "items": [
          "End-to-end autonomy without a human in the loop: daemon writes, git commits, CI deploys, KB updates, chat answers. Sounds simple; the discipline is in keeping every layer idempotent and safe",
          "Vault is the source of truth, not a derived artifact. Edit in Obsidian, push, the KB follows. Edit through the agent, same path. No 'index out of sync' state because there's only one path to the index",
          "Eval-driven tuning, not vibes: every change in chunk size, BM25 weight, threshold, embedder, reranker, and prompt was scored against a fixed 8-query set with before/after diffs",
          "On-premise from day one. No OpenAI, no Anthropic, no third-party. Only Europe PMC's free API leaves the box, and only for biomedical metadata. DSGVO-clean for personal health data"
        ]
      }
    ]
  },
  "highlights": [
    "Daily autonomous research ingestion: 113 topics → Europe PMC → local Qwen3.6 → 165 papers/run",
    "Git-driven CI reindex: push → diff → OpenWebUI KB updated in ~30 seconds",
    "Hybrid retrieval (BGE-M3 + BM25 + BGE-reranker) tuned empirically; 3 / 8 → 6 / 8 queries above threshold"
  ],
  "technologies": [
    "Python 3.12",
    "Qwen3.6-35B",
    "vLLM",
    "BGE-M3",
    "OpenWebUI",
    "Forgejo",
    "Forgejo Actions",
    "Memgraph",
    "Qdrant",
    "Obsidian",
    "systemd",
    "Docker",
    "Europe PMC API"
  ],
  "mainTech": "all",
  "links": [],
  "tags": [
    "ai-ml",
    "rag",
    "llm",
    "autonomous",
    "agents",
    "ci-cd",
    "forgejo",
    "self-hosted",
    "on-premise",
    "knowledge-graph",
    "memgraph",
    "vector-search",
    "python",
    "dsgvo",
    "evals"
  ]
};

export default project;
