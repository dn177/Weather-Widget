// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.sparkfit-quant". Case-study (detailedContent) text is
// English by design.
const project = {
  "id": "sparkfit-quant",
  "title": "Designing a 397B MoE Quant to a 121 GiB Budget",
  "category": "ml-systems",
  "featured": true,
  "flagship": true,
  "date": "2026-07-08",
  "sortOrder": -5.2,
  "summary": "A custom 2-bit cut of a self-hosted 397B MoE, designed to a hard 121 GiB budget and sized by arithmetic to within 0.24% of its predicted 106.8 GB — built and size-verified in 37 minutes.",
  "stat": { "value": "0.24%", "label": "predicted vs built size" },
  "media": {
    "type": "image",
    "src": "/Portfolio/sparkfit/sparkfit-hero.svg",
    "alt": "A custom 2-bit cut of a 397B MoE designed to a 121 GiB budget: predicted-vs-built size within 0.24%, the four design moves (read the budget, retune one tensor class from 2.125 to 2.6875 bpw, price it on paper, build it within ±3%), and the reusable price → gate-ladder → verify method — production never disrupted"
  },
  "description": "A custom 2-bit-class cut of a self-hosted 397B mixture-of-experts model, designed to fit a fixed 121 GiB unified-memory box. The recipe changed exactly one line against the served baseline and predicted its own file size by arithmetic — +8.44 GiB, a 106.8 GB target — before spending any compute; the build landed at 106.57 GB, 0.24% off, in 37 minutes. Every step ran behind a pre-declared, cheap-to-expensive gate ladder whose early checks caught two real toolchain blockers in seconds, and the whole design pass ran without disrupting the production service.",
  "detailedContent": {
    "overview": "The serving box holds 121 GiB of unified memory. The production model — a 397B-parameter mixture-of-experts at roughly 2 bits per weight — fills 98 GB of it, and the next quantization tier up doesn't fit at all. This project designs the cut in between: take the served recipe verbatim, change exactly one line (routed-expert down-projections, 2.125 → 2.6875 bits per weight), and predict the result by arithmetic before spending any compute — +0.5625 bpw across 128.85B routed parameters = +8.44 GiB, a 106.8 GB file. The build came out at 106.57 GB, 0.24% off the paper number, in 37 minutes on 16 ARM threads, carried through a cheap-to-expensive gate ladder that de-risks every step and caught two real toolchain blockers in seconds. The through-line is prediction discipline: when you can size a 100 GB-class artifact to a fraction of a percent before building it, every downstream decision — context length, cache budget, serving pairing — inherits that confidence, and the build becomes a confirmation rather than a discovery.",
    "sections": [
      {
        "title": "The Result: A Custom Cut, Sized to 0.24% on Paper",
        "items": [
          "The cut was sized entirely by arithmetic: Σ(params × bits-per-weight) / 8 across the recipe's tensor classes predicted 106.83 GB; the built artifact measured 106.57 GB — 0.24% off. Getting size this exact means every downstream memory decision could be planned before the build existed.",
          "The build ran in 37 minutes on 16 ARM threads and cleared its size gate within ±3% on the first attempt — no iteration, no surprises. The artifact did exactly what the arithmetic said it would, at the byte level.",
          "Prediction at this precision turns building into confirmation rather than discovery: the interesting work — which tensors to spend the budget on, and why — all happens on paper, where it is cheap to be wrong."
        ]
      },
      {
        "title": "Reading the Budget: Why This Cut Exists",
        "items": [
          "121 GiB of unified memory, 98 GB spoken for by the served baseline, and the next mainline quant tier overflowing the box — the useful design space is a narrow band the community's off-the-shelf quants skip entirely. This cut targets exactly that gap.",
          "Spending the spare budget where it buys the most quality means the routed experts, which dominate a mixture-of-experts model's byte footprint (128.85B of its parameters here). One tensor class, chosen deliberately, absorbs the whole increase.",
          "The paired serving config is part of the deliverable: a quant is only meaningful together with the context length and cache budget it leaves room for, so each candidate variant was costed against the memory it forces, not just its file size."
        ]
      },
      {
        "title": "One Recipe Line, Priced Before Any Compute",
        "items": [
          "The recipe changed exactly one line against the served baseline — routed-expert down-projections from 2.125 to 2.6875 bpw across all 60 layers — so any downstream effect stays attributable to a single decision.",
          "Three variants (conservative / recommended / stretch) were priced the same way, each paired with the serving config it forces; the stretch variant was parked on paper because its predicted peak crossed the box's hard memory ceiling before anything was built — a decision made in arithmetic, not after a wasted build.",
          "The importance-matrix calibration was audited up front: all 512 experts sampled with no empty rows, and the matrix's on-disk layout checked against the quantizer's exact indexing arithmetic — coverage confirmed before committing the hours."
        ]
      },
      {
        "title": "The Gate Ladder: De-Risking Cheap to Expensive",
        "items": [
          "Every step ran behind a pre-declared ladder ordered by cost: preflight (disk, box claim, free memory — seconds), toolchain compatibility and importance-matrix coverage (seconds to minutes), and size within ±3% (free at completion), ahead of the heavier quality and memory gates.",
          "The cheap gates earned their place immediately. Compatibility caught that the quantizer refuses already-quantized sources without an explicit flag — a three-second stop instead of a mid-run one — and a guard on server teardown timing (a 397B server takes ~10 minutes to exit) kept two model loads from ever colliding in one memory budget.",
          "Declaring the ladder before any results existed is the point. The stand-in for an infeasible teacher-KLD metric (every big-enough teacher overflows the box) was a perplexity gate on a sha256-pinned held-out corpus, fixed in advance with a clobber-guarded builder, so the quality bar can't drift to fit the outcome. Perplexity, memory-at-config, and a task-suite A/B are the next validation window; the baseline perplexity (3.87 on the pinned corpus) is already measured and waiting."
        ]
      },
      {
        "title": "Operational Discipline: Production Never Disrupted",
        "items": [
          "Every build window ran under a claimed-box protocol with a trap that restores the production server on any exit, with the drafter and decoding parameters pinned explicitly rather than trusting script defaults — a branch-drift incident proved bare defaults could silently boot a stale configuration.",
          "The 98 GB baseline stayed the served model throughout. A quant is only 'shipped' together with its serving config, and the previous pair stays warm until a new one clears every gate; nothing about this design work touched the running service.",
          "The measurement assets are reusable no matter which variant ships: the perplexity baseline, the sha-pinned corpus, the priced recipe variants, and their paired serving configs are all in place for the next window."
        ]
      },
      {
        "title": "Method: What Transfers",
        "items": [
          "Price the artifact on paper first. If prediction and reality disagree at the size gate, something upstream is already wrong; if they agree to a fraction of a percent, every later decision inherits that confidence.",
          "Order gates by cost and declare them before results exist — cheap checks catch the blockers that would otherwise surface expensively, and a pre-registered quality bar can't be moved to fit the answer.",
          "Change one variable at a time. One recipe line against a verbatim baseline keeps every effect attributable, and the same discipline scales from a single quant to a whole experiment program."
        ]
      }
    ]
  },
  "highlights": [
    "Designed a 2-bit cut of a 397B MoE to a hard 121 GiB memory budget and sized it by arithmetic to within 0.24% of the predicted 106.8 GB",
    "Predicted the file size before any compute: +0.5625 bpw × 128.85B routed params = +8.44 GiB, built to 106.57 GB in 37 minutes",
    "Changed exactly one recipe line against the served baseline so every downstream effect stays attributable to a single decision",
    "Pre-declared a cheap-to-expensive gate ladder whose compatibility gate caught two real toolchain blockers in seconds",
    "Substituted an infeasible teacher-KLD metric with a perplexity gate on a sha256-pinned corpus, fixed in advance with a clobber-guarded builder",
    "Held production untouched throughout via trap-restores with explicitly pinned serving configs"
  ],
  "technologies": [
    "ik_llama.cpp",
    "GGUF / custom quantization (--custom-q)",
    "Importance-matrix calibration",
    "Mixture-of-Experts (397B/A17B)",
    "Memory-budget arithmetic",
    "Perplexity gating (sha-pinned corpus)",
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
    "performance",
    "optimization"
  ]
};

export default project;
