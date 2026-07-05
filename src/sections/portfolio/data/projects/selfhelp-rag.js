// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.selfhelp-rag". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "selfhelp-rag",
  "title": "SelfHelpRAG: On-Premise RAG with Hybrid Retrieval",
  "category": "web-app",
  "featured": true,
  "date": "2026-04-15",
  "sortOrder": -3.2,
  "closedSource": true,
  "media": {
    "type": "image",
    "src": "/Portfolio/SelfHelpRAG.svg",
    "alt": "SelfHelpRAG, hybrid retrieval RAG pipeline architecture"
  },
  "description": "A retrieval-augmented Q&A system for an enterprise ERP knowledge base. German-language, runs entirely on-premise against a self-hosted LLM. Built with DSGVO-sensitive data in mind from day one.",
  "detailedContent": {
    "overview": "End-to-end RAG pipeline for self-help on a production enterprise ERP's documentation. The system retrieves from a hybrid dense + sparse index, assembles an injection-aware prompt with explicit citation and refusal rules, and generates the answer on a local LLM endpoint (LM Studio on NVIDIA DGX Spark). A separate eval harness scores retrieval and citation quality against a labelled question set.",
    "sections": [
      {
        "title": "Hybrid Retrieval Pipeline",
        "items": [
          "Indexing splits documents on heading boundaries with overlap, embeds with a locally hosted model, and writes both dense vectors (Qdrant) and sparse postings (BM25) per chunk",
          "Query time fuses both signals and reranks top-k: recall comes from dense, precision from sparse",
          "Corpus covers configuration docs, FAQ, how-tos, glossary, release notes, and troubleshooting; each chunk carries its source title for citation"
        ]
      },
      {
        "title": "Prompt Design as Engineering",
        "items": [
          "System prompt enforces machine-checkable rules: cite as '[Quelle: <Dokumenttitel>]' or return the verbatim refusal sentence if no answer is grounded in the chunks",
          "Explicit rule against following instructions embedded in retrieved documents (prompt-injection defence baked into the contract, not bolted on)",
          "User message keeps retrieved chunks clearly delimited and numbered so the model can reference them; system role and user role are ruthlessly separated"
        ]
      },
      {
        "title": "Eval Harness",
        "items": [
          "Labelled eval set (questions + expected answer + source document) checked into the repo alongside the eval runner",
          "Scores both the answer text (refusal correctness, citation format) and the retrieval (whether the right chunk was even fetched)",
          "Result snapshots persist under evals/results, regression-friendly when prompt or chunker changes"
        ]
      },
      {
        "title": "On-Premise & DSGVO Posture",
        "items": [
          "No data leaves the network: embeddings, retrieval, and generation all run against local endpoints",
          "Designed for a production enterprise ERP domain where contact and customer data must stay on-premise",
          "LM Studio on NVIDIA DGX Spark: same hardware used for experimentation, vLLM, and llama.cpp exploration"
        ]
      }
    ]
  },
  "highlights": [
    "Hybrid retrieval: dense (Qdrant) + sparse (BM25) with rerank",
    "Eval harness with labelled question set scoring retrieval + citation",
    "Injection-aware system prompt with explicit refusal sentence"
  ],
  "technologies": [
    "Python",
    "Qdrant",
    "BM25",
    "LM Studio",
    "OpenAI SDK",
    "NVIDIA DGX"
  ],
  "mainTech": "all",
  "links": [],
  "tags": [
    "ai-ml",
    "rag",
    "llm",
    "ai",
    "qdrant",
    "python",
    "on-premise",
    "dsgvo",
    "evals"
  ]
};

export default project;
