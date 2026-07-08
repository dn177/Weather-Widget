// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.sparkfit-quant" (to be added on the i18n branch — see
// PR fix/i18n-consistency). Case-study (detailedContent) text is English
// by design.
const project = {
  "id": "sparkfit-quant",
  "title": "Quantizing a 397B MoE Into a 121 GiB Memory Budget",
  "category": "ml-systems",
  "featured": true,
  "flagship": true,
  "date": "2026-07-08",
  "sortOrder": -5.2,
  "summary": "A custom 2-bit quant sized on paper and built to 0.24% of its predicted 106.8 GB — with a pre-declared gate ladder that caught a silent toolchain fault before deployment and cleared the recipe in five experiments.",
  "stat": { "value": "0.24%", "label": "predicted-vs-built size error" },
  "media": {
    "type": "image",
    "src": "/Portfolio/sparkfit/sparkfit-hero.svg",
    "alt": "SPARKFIT quant of a 397B MoE: 0.24% predicted-vs-built size error; the gate ladder passes G0–G2 and catches a silent toolchain fault at the first-token semantic gate; a five-experiment fault-isolation chain ends in a clean 1B control — recipe cleared, baseline protected"
  },
  "description": "A custom 2-bit-class cut of a self-hosted 397B MoE for one DGX Spark: priced by Δ-bpw arithmetic before any compute, built in 37 minutes to within 0.24% of its paper-predicted size, and carried through a pre-declared gate ladder. The ladder earned its keep twice — first by catching two hard blockers in seconds, then by catching, at its first semantic gate, a silent toolchain fault that every static check had missed. Five controlled experiments (two alternate target types, the baseline's own type map, an imatrix-free build, and a clean 1B dense control) isolated the fault to the toolchain's requantization path and cleared the recipe, while the served baseline stayed protected throughout. The corrected build inherits everything already banked: the recipe, the pinned evaluation corpus, the perplexity baseline, and the paired serving configs.",
  "detailedContent": {
    "overview": "The serving box holds 121 GiB of unified memory. The production model — a 397B-parameter mixture-of-experts, quantized to roughly 2 bits per weight — occupies 98 GB of it, leaving budget on the table; the next quant size up doesn't fit at all. This project designed the cut in between: take the served recipe verbatim, change exactly one line (the routed experts' down-projections, from 2.125 to 2.6875 bits per weight), and predict the outcome by arithmetic before spending any compute: +8.44 GiB, a 106.8 GB file. The build came out at 106.57 GB — 0.24% off the paper number — after 37 minutes on 16 ARM threads. Then the interesting part happened. A pre-declared six-gate ladder, ordered cheap to expensive, had passed the build through preflight, compatibility, and size checks; at the first gate that actually reads the model's output, the model produced degenerate token loops. Every static property was perfect and the artifact was useless. What followed is the real case study: a fault-isolation chain of five controlled experiments — each changing exactly one variable — that eliminated the CUDA kernel, both candidate quant types, both source models, and the importance matrix, until only the toolchain's requantization path remained, with a 1B dense model requanted on the same binary as the clean control. The recipe was innocent. The baseline never stopped being servable. And the gate ladder, designed for failures nobody had imagined, is the reason a bit-level toolchain fault cost an evening instead of a deployment.",
    "sections": [
      {
        "title": "The Result: Predicted to 0.24%, and a Gate That Earned Its Keep",
        "items": [
          "The cut was sized entirely on paper: Σ(params × bits-per-weight) / 8 across the recipe's tensor classes predicted 106.83 GB; the built artifact measured 106.57 GB. Getting size arithmetic this exact means every downstream memory decision (context length, cache budget, serving pairing) could be planned before the build existed.",
          "At the first semantic gate, the ladder caught what mattered: greedy decoding produced degenerate repetition loops on both CUDA and CPU backends. The telling instrument: the speculative decoder reported 99.8% draft acceptance — only a repetition loop drafts that well. An anomalously good metric was the first symptom of a broken artifact.",
          "Prediction discipline and validation discipline are different skills, and this project needed both. Every static gate passed; only a gate that reads actual model output could catch what was wrong — which is exactly the failure class semantic gates exist for."
        ]
      },
      {
        "title": "Designing Inside the Budget: One Recipe Line, Priced in Advance",
        "items": [
          "The recipe changed exactly one line against the served baseline — routed-expert down-projections from 2.125 to 2.6875 bpw across all 60 layers (+0.5625 bpw × 128.85B routed parameters = +8.44 GiB) — so any quality delta would be attributable to a single decision.",
          "Three variants (conservative / recommended / stretch) were priced the same way, each paired with the serving configuration it forces: the stretch variant was parked on paper because its estimated peak crossed the box's hard memory gate before anything was built.",
          "The quality gates were budgeted too: the standard KLD-vs-teacher metric is infeasible on this box (every ≥3-bit teacher exceeds usable memory), so a perplexity gate on a sha256-pinned held-out corpus was declared as the substitute before any results existed — with a clobber-guarded corpus builder after a regeneration incident proved the pin could be silently overwritten."
        ]
      },
      {
        "title": "The Gate Ladder: Cheap Checks First, Each One Falsifiable",
        "items": [
          "Six gates ordered by cost: G0 preflight (disk, box claim, free memory — seconds), G1 toolchain compatibility + importance-matrix coverage (seconds to minutes), G2 size within ±3% of paper (free at completion), G3 first-token semantics and perplexity (minutes), G4 peak memory at the paired serving config (tens of minutes), G5 task-suite A/B (a full window).",
          "G1 caught two real blockers before they could cost anything: the quantizer refuses already-quantized sources without an explicit flag (a three-second failure that a doc-trusting run would have hit mid-window), and a 397B server takes ~10 minutes to tear down after SIGTERM — a wrapper with a shorter timeout aborted safely instead of stacking two servers into one memory budget.",
          "The ladder's real yield came at G3. Ladders are usually praised for saving compute; this one's value was epistemic — it localized 'something is wrong' to 'the first semantic property, after all static properties passed', which is precisely the shape of a toolchain bug rather than a recipe bug."
        ]
      },
      {
        "title": "Fault Isolation: One Variable Per Experiment",
        "items": [
          "Hypothesis 1 — CUDA kernel bug at 512-expert scale: killed by reproducing the garbage on the CPU backend, a fully independent implementation. Same degeneracy on both backends means the data is wrong, not one kernel.",
          "Hypotheses 2–3 — the new quant type is broken: killed by rebuilding with a different, long-proven type (also garbage), then with the baseline's own type map through the same pipeline (also garbage — while the baseline artifact itself, byte-for-byte the same nominal recipe from the original author's pipeline, runs perfectly). The comparison everyone trusts — 'same recipe, only one type changed' — was quietly comparing pipelines, not types.",
          "Hypotheses 4–5 — the source file or the importance matrix: killed by rebuilding from a second, independently-produced source model (garbage) and with no importance matrix at all (garbage). The imatrix had already survived a coverage audit (all 512 experts sampled, no zero rows) and a file-format audit against the loader's exact indexing arithmetic.",
          "The control that closed the case: a 1B dense model requantized through the identical binary and flags came out clean. The fault is the toolchain's requantization path, specifically for this hybrid-architecture model — and the minimal reproduction for the upstream report falls directly out of the experiment table.",
          "Cost of the whole chain: four ~40-minute rebuilds and six short CPU probes, run in two claimed windows. Every hypothesis died by experiment; none died by argument."
        ]
      },
      {
        "title": "What the Instruments Almost Hid",
        "items": [
          "The quantize log was flawless for every broken build: correct types applied to all 60 expert tensors, uniform sizes at the right bits-per-weight, zero fallback warnings, clean exit. A log-reading review would have shipped it.",
          "The runtime's NaN validator passed the broken artifact — the corrupted values were well-formed, finite numbers that happened to be wrong. Checks verify the properties they were written for, and silent corruption lives in the gap between them.",
          "The GGUF metadata of a broken build and the working baseline are equivalent where it matters — the divergence is purely in tensor data. Three audits (log, validator, metadata) all said 'fine' about an artifact that could not complete a sentence; only executing the model told the truth. That asymmetry is the argument for semantic gates in any artifact pipeline."
        ]
      },
      {
        "title": "Operational Discipline: The Baseline Never Stopped Being Servable",
        "items": [
          "Every build window ran under a claimed-box protocol with a trap that restores the production server on any exit — including failures — with the drafter and decoding parameters pinned explicitly rather than trusting script defaults (a branch-drift incident during the window proved bare defaults could silently boot a stale configuration).",
          "The broken build's brief production exposure was caught the same evening — flagged by that 99.8% acceptance signature and user-visible silence — and rolled back to the 98 GB baseline within the same claim. The fallback artifact was never deleted: a quant is only 'shipped' together with its serving config, and the previous pair stays warm until the new one passes every gate.",
          "The measurement assets carry straight into the corrected build: the perplexity baseline (3.87 on the pinned corpus), the pinned corpus itself, the recipes, and the paired serving configs are all in place for the corrected build — the only thing the incident consumed was one evening and ~500 GB of evidence artifacts kept for the upstream report."
        ]
      },
      {
        "title": "Method: What Transfers Beyond This Box",
        "items": [
          "Price the artifact on paper first. If prediction and reality disagree at the size gate, something upstream is already wrong; if they agree to a fraction of a percent, every later decision inherits that confidence.",
          "Order gates by cost and let them fire. The ladder's cheap gates saved minutes; its semantic gate saved the deployment. Gates exist for the failure modes you didn't imagine — the ones you imagined, you already coded around.",
          "When a gate fires, bisect with experiments, not arguments. One variable per rebuild, controls included (the 1B dense model was the single most informative experiment in the chain), and write the exoneration list as you go — what you've ruled out is as valuable as what you suspect.",
          "Distrust green dashboards around a red outcome: a clean log, a passing validator, and equivalent metadata described an artifact that produced 'a , a a, a a' forever. The only instrument that cannot be fooled by well-formed garbage is the task itself."
        ]
      }
    ]
  },
  "highlights": [
    "Sized a 2-bit-class cut of a 397B MoE entirely on paper and built it to within 0.24% of the predicted 106.8 GB in 37 minutes",
    "Changed exactly one recipe line against the served baseline so every downstream delta stayed attributable to a single decision",
    "Pre-declared six-gate ladder caught two hard blockers in seconds — then caught a silent toolchain fault at its first semantic gate, after every static check had passed",
    "Read 99.8% draft acceptance as a symptom, not a success: only degenerate repetition drafts that well",
    "Five-experiment fault-isolation chain (two target types, the baseline's type map, a second source, no imatrix, 1B dense control) pinned the fault on the toolchain's requant path and cleared the recipe",
    "The served baseline stayed protected throughout; the perplexity baseline, pinned corpus, and recipes are banked and carry straight into the corrected build"
  ],
  "technologies": [
    "ik_llama.cpp",
    "GGUF / custom quantization (--custom-q)",
    "Importance-matrix calibration",
    "Mixture-of-Experts (397B/A17B)",
    "Perplexity gating (sha-pinned corpus)",
    "Toolchain forensics / controlled bisection",
    "Bash / Python",
    "DGX Spark (GB10, unified memory)"
  ],
  "mainTech": "ai-ml",
  "links": [],
  "tags": [
    "ai-ml",
    "llm",
    "quantization",
    "inference",
    "evaluation",
    "debugging",
    "performance",
    "optimization"
  ]
};

export default project;
