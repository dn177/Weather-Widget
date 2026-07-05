// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.ornith-optimization". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "ornith-optimization",
  "title": "Optimizing a 397B LLM on a DGX Spark (GB10)",
  "category": "ml-systems",
  "featured": true,
  "date": "2026-07-05",
  "sortOrder": -6,
  "media": {
    "type": "image",
    "src": "/Portfolio/ornith/ornith-hero.svg",
    "alt": "Ornith-397B inference optimization on a DGX Spark — +31% coding decode throughput (24.3 tok/s) via speculative-decode tuning"
  },
  "description": "Measurement-driven inference optimization of a self-hosted 397B-parameter LLM (2-bit MoE) on a single DGX Spark. Roofline analysis and speculative-decoding tuning lifted coding decode throughput by 31% to 24.3 tok/s — with disciplined negative results on the optimizations that weren't worth building.",
  "detailedContent": {
    "overview": "A local deployment of Ornith-397B — a Qwen3.5-397B mixture-of-experts model, 2-bit quantized (IQ2_KS, ~91 GiB) — running on one DGX Spark (GB10, 128 GB unified memory) via a patched ik_llama.cpp. The goal was to make it genuinely faster at coding without new hardware. The discipline that drove everything: measure the roofline first, and let the numbers decide which levers are worth building. Several obvious-looking optimizations were profiled and abandoned before a line of kernel code was written — which was the point.",
    "sections": [
      {
        "title": "The Result: +31% Coding Decode, and Knowing Where to Stop",
        "items": [
          "Coding decode throughput raised from 18.5 tok/s (raw model) to 24.3 tok/s — +31% — and +79% over the previous production configuration (13.6 tok/s), purely by tuning speculative decoding. No retraining, no new hardware.",
          "The win came from a full parameter sweep, not a guess: draft-tokens-per-step (n_max) measured across 0–12, peak at n_max=2, replicating to within ±0.4 tok/s across reps.",
          "Equally valuable: three plausible optimizations were measured to be near-worthless on this machine and deliberately not built — saving the real cost of optimization, which is engineering time."
        ]
      },
      {
        "title": "The Governing Constraint: Memory Bandwidth, Not Compute",
        "items": [
          "Single-stream decode is memory-bandwidth-bound: ~19 tok/s is ~69% of the machine's measured ~210 GB/s roofline, and every hot kernel already runs at ~76–82% of its own peak.",
          "That one fact reframes everything — you cannot win single-token latency with a faster kernel, because the limit is how many bytes of weights cross the bus per token. The only levers that beat the wall are speculative decoding (more useful tokens per weight-load) and prompt caching (no load at all).",
          "Prefill is the opposite regime — compute-bound GEMM — and the only place a faster kernel could help throughput. Correctly out of scope for a single-user coding box."
        ]
      },
      {
        "title": "The Win: Tuning Speculative Decoding",
        "items": [
          "Built a small benchmark harness (8 greedy coding prompts, per-request n_max overrides, two reps) and measured the full throughput-vs-n_max curve rather than trusting the shipped default.",
          "Derived a step-cost model that fits the whole curve: ms/step ≈ 54 (the token itself) + 33.5 (fixed speculation overhead) + 16.2 × (n_max − 1) per extra draft token. On a sparse-MoE target every verified position routes to different experts, so speculation does not amortize the expert weights — marginal accepted value drops below marginal cost right after n_max ≈ 2–3, which is exactly where the measured peak sits.",
          "Discovered the deployment's 'production' autotune mode was actually a 23% regression versus the raw model on coding, and disabled it. Shipped n_max=2 with autotune off as the new default, with a per-request override kept as an escape hatch."
        ],
        "image": "/Portfolio/ornith/nmax-curve.svg",
        "imageAlt": "Measured throughput vs n_max: rises from 18.5 tok/s (spec off) to a 24.3 tok/s peak at n_max=2, then declines as each extra draft token costs more than it returns on a sparse-MoE target."
      },
      {
        "title": "Reading Past the Instruments: A Logging Artifact",
        "items": [
          "The engine reported an ~18–33% draft 'acceptance rate,' which looked poor and would have pointed the whole effort at the drafter. Decomposing it showed the printed number divides by the drafter's full generated width, not by the tokens actually submitted for verification.",
          "True first-position acceptance is ~87% — the drafter is genuinely good at short-range prediction. The apparent weakness was a measurement artifact; the real ceiling is the mixture-of-experts verify economics above.",
          "Trusting the instrument at face value would have sent the optimization at the wrong problem entirely."
        ]
      },
      {
        "title": "Honest Negative Results (What Was Deliberately Not Built)",
        "items": [
          "Megakernel: profiling showed total GPU kernel time (7.79 s) already exceeding the decode compute wall (7.44 s) — the GPU is saturated, idle-gap ≈ 0%. A megakernel removes launch overhead that isn't there; it would have been weeks of work for a ~0% gain. Kept as a learning exercise, not a deliverable.",
          "Hand-written kernel ILP: an attempt to add instruction-level parallelism to the 2-bit expert GEMV regressed 8% — the compiler already extracted it. Reverted and logged.",
          "Weight-training the 397B: memory arithmetic rules it out on this box (full RL ≈ 3.2 TB; even 4-bit QLoRA ≈ 198 GB > 128 GB). The feasible capability levers are inference-time or a smaller trainable model — scoped for later, not chased now."
        ]
      },
      {
        "title": "Method: Measure, Gate on the Roofline, Believe the Numbers",
        "items": [
          "A reusable loop, written up as a playbook: frame the regime (compute- vs memory-bound) → measure both walls before touching code → if the op is already ≥80% of its wall, stop → profile by bound-type → if the estimated payoff is <5%, skip → build only in isolation, with a correctness oracle and an A/B against baseline.",
          "One hard-won operational rule: never run the per-kernel profiler against the full 91 GiB model — it OOM-killed the machine twice before the work was isolated to a single-op harness.",
          "The output is as much a map of dead ends as a set of wins — and that is the value. The cheapest optimization is the one you prove you don't need to build."
        ]
      }
    ]
  },
  "highlights": [
    "+31% coding decode throughput (24.3 tok/s), +79% over the prior production config — by tuning speculative decoding, no retraining",
    "Diagnosed the reported 'acceptance rate' as a logging artifact — true first-position acceptance ≈ 87%",
    "Measured the megakernel ceiling at ~0% idle-gap before building it — turned a potential dead end into a one-day decision"
  ],
  "technologies": [
    "ik_llama.cpp",
    "CUDA",
    "C++",
    "Nsight (nsys / ncu)",
    "Python",
    "GGUF / 2-bit quantization",
    "Speculative decoding",
    "DGX Spark (GB10)"
  ],
  "mainTech": "ai-ml",
  "links": [],
  "tags": [
    "ai-ml",
    "performance",
    "llm",
    "cuda",
    "inference",
    "optimization",
    "quantization",
    "profiling"
  ]
};

export default project;
