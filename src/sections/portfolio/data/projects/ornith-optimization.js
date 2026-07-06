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
    "alt": "Ornith-397B inference optimization on a DGX Spark: +31% coding decode throughput (24.3 tok/s) via speculative-decode tuning"
  },
  "description": "Two measurement-driven experiments on a self-hosted 397B LLM (2-bit MoE) on one DGX Spark. Roofline analysis and speculative-decoding tuning lifted coding decode throughput by 31% to 24.3 tok/s. A pre-registered activation-steering study then returned a clean null (a static control vector moved coding pass@1 by -2.1 points, CI includes zero), with the three-way split catching a false positive and disciplined negative results throughout.",
  "detailedContent": {
    "overview": "Two experiments on the same box, unified by one method. The box is a single DGX Spark (GB10, 128 GB unified memory) running Ornith-397B (a Qwen3.5-397B mixture-of-experts model, 2-bit quantized: IQ2_KS, ~91 GiB) through a patched ik_llama.cpp. The first experiment made it faster at coding: roofline analysis and speculative-decoding tuning, with several obvious-looking optimizations profiled and abandoned before a line of kernel code was written. The second asked whether a ~1 MB control vector could make the same model write better code without training it (training is ruled out by memory arithmetic), and returned a clean pre-registered null: a static reasoning-care vector moved coding correctness by -2.1 points pass@1, with the confidence interval including zero. The discipline was identical across both: measure the governing wall first, gate on a cheap signal before spending real effort, believe the numbers, and report the honest negatives. In the throughput work a roofline gate killed three levers early; in the steering work a pre-registered three-way split caught a +2 point dev result that reversed to -2 points on the touch-once frozen set.",
    "sections": [
      {
        "title": "The Result: +31% Coding Decode, and Knowing Where to Stop",
        "items": [
          "Coding decode throughput raised from 18.5 tok/s (raw model) to 24.3 tok/s (+31%) and +79% over the previous production configuration (13.6 tok/s), purely by tuning speculative decoding. No retraining, no new hardware.",
          "The win came from a full parameter sweep, not a guess: draft-tokens-per-step (n_max) measured across 0–12, peak at n_max=2, replicating to within ±0.4 tok/s across reps.",
          "Equally valuable: three plausible optimizations were measured to be near-worthless on this machine and deliberately not built, saving the real cost of optimization: engineering time."
        ]
      },
      {
        "title": "The Governing Constraint: Memory Bandwidth, Not Compute",
        "items": [
          "Single-stream decode is memory-bandwidth-bound: ~19 tok/s is ~69% of the machine's measured ~210 GB/s roofline, and every hot kernel already runs at ~76–82% of its own peak.",
          "That one fact reframes everything: you cannot win single-token latency with a faster kernel, because the limit is how many bytes of weights cross the bus per token. The only levers that beat the wall are speculative decoding (more useful tokens per weight-load) and prompt caching (no load at all).",
          "Prefill is the opposite regime, compute-bound GEMM, and the only place a faster kernel could help throughput. Correctly out of scope for a single-user coding box."
        ]
      },
      {
        "title": "The Win: Tuning Speculative Decoding",
        "items": [
          "Built a small benchmark harness (8 greedy coding prompts, per-request n_max overrides, two reps) and measured the full throughput-vs-n_max curve rather than trusting the shipped default.",
          "Derived a step-cost model that fits the whole curve: ms/step ≈ 54 (the token itself) + 33.5 (fixed speculation overhead) + 16.2 × (n_max − 1) per extra draft token. On a sparse-MoE target every verified position routes to different experts, so speculation does not amortize the expert weights; marginal accepted value drops below marginal cost right after n_max ≈ 2–3, which is exactly where the measured peak sits.",
          "Discovered the deployment's 'production' autotune mode was actually a 23% regression versus the raw model on coding, and disabled it. Shipped n_max=2 with autotune off as the new default, with a per-request override kept as an escape hatch."
        ],
        "image": "/Portfolio/ornith/nmax-curve.svg",
        "imageAlt": "Measured throughput vs n_max: rises from 18.5 tok/s (spec off) to a 24.3 tok/s peak at n_max=2, then declines as each extra draft token costs more than it returns on a sparse-MoE target."
      },
      {
        "title": "Reading Past the Instruments: A Logging Artifact",
        "items": [
          "The engine reported an ~18–33% draft 'acceptance rate,' which looked poor and would have pointed the whole effort at the drafter. Decomposing it showed the printed number divides by the drafter's full generated width, not by the tokens actually submitted for verification.",
          "True first-position acceptance is ~87%: the drafter is genuinely good at short-range prediction. The apparent weakness was a measurement artifact; the real ceiling is the mixture-of-experts verify economics above.",
          "Trusting the instrument at face value would have sent the optimization at the wrong problem entirely."
        ]
      },
      {
        "title": "Honest Negative Results (What Was Deliberately Not Built)",
        "items": [
          "Megakernel: profiling showed total GPU kernel time (7.79 s) already exceeding the decode compute wall (7.44 s), so the GPU is saturated, idle-gap ≈ 0%. A megakernel removes launch overhead that isn't there; it would have been weeks of work for a ~0% gain. Kept as a learning exercise, not a deliverable.",
          "Hand-written kernel ILP: an attempt to add instruction-level parallelism to the 2-bit expert GEMV regressed 8%; the compiler already extracted it. Reverted and logged.",
          "Weight-training the 397B: memory arithmetic rules it out on this box (full RL ≈ 3.2 TB; even 4-bit QLoRA ≈ 198 GB > 128 GB). The feasible capability levers are inference-time or a smaller trainable model, scoped for later, not chased now."
        ]
      },
      {
        "title": "Method: Measure, Gate on the Roofline, Believe the Numbers",
        "items": [
          "A reusable loop, written up as a playbook: frame the regime (compute- vs memory-bound) → measure both walls before touching code → if the op is already ≥80% of its wall, stop → profile by bound-type → if the estimated payoff is <5%, skip → build only in isolation, with a correctness oracle and an A/B against baseline.",
          "One hard-won operational rule: never run the per-kernel profiler against the full 91 GiB model; it OOM-killed the machine twice before the work was isolated to a single-op harness.",
          "The output is as much a map of dead ends as a set of wins, and that is the value. The cheapest optimization is the one you prove you don't need to build."
        ]
      },
      {
        "title": "The Second Question: Can a Control Vector Make It Write Better Code?",
        "items": [
          "Same box, same model. The one lever that plausibly changes model behavior under a 128 GB ceiling is a control vector: training is ruled out by arithmetic (the weights alone are 91 GiB, and gradients plus optimizer state run several times that). The vector is a ~1 MB direction added to the residual stream at inference, applied live, fully reversible, never touching the weights.",
          "The framing was elicitation: a control vector can bias the model toward reasoning it already has, and cannot add capability the 2-bit weights do not contain. The realistic ceiling for a static difference-of-means vector, the weakest steering primitive, was pre-registered as a small held-out +1 to +2 point gain, with a style shift and flat-or-worse correctness the most likely outcome.",
          "A static reasoning-care vector, built and tuned by the book, moved coding correctness by -2.1 points pass@1 (95% CI includes zero): a clean, well-measured null. This was off-the-map territory from the start, since almost every published steering result is on 16-bit dense models and this is a 2-bit MoE.",
          "The value was never the headline number. The setup was designed so a null would be trustworthy, and so the mechanics would produce transferable findings whichever way it landed."
        ],
        "image": "/Portfolio/ornith/steering-reversal.svg",
        "imageAlt": "The best dev-tuned operating point scores +2 points pass@1 on the set it was tuned on, and the same point reverses to -2 points on the frozen set touched once: the three-way split catching a false positive before it could ship."
      },
      {
        "title": "The Guardrails: Why the Null Is Trustworthy",
        "items": [
          "Pre-registered before a single number existed: the hypothesis, the exact metrics, the rejection thresholds, the statistical tests, and four decision rules fixed in advance. Three amendments were logged as deviations, each before the affected data was generated, so a heavily-adjusted experiment stayed honest.",
          "A three-way split (construct the vector, tune on a dev set, touch a frozen set exactly once) plus 25 private held-out tasks written for this experiment, contamination-proof since a 2-bit model may have seen HumanEval and MBPP in pretraining. The only endpoint was functional pass@1, code run against hidden tests, because the entire risk is output that looks careful without being correct.",
          "The best dev cell showed +2 points (0.78 to 0.80); at that same operating point the frozen set reversed it to -2 points (0.9312 to 0.9101, McNemar p=0.29, 95% CI [-.053, +.005], 2 problems fixed and 6 broken). Tuning and reporting on one set would have shipped a +2 point improvement that was really a -2 point regression.",
          "Paired McNemar statistics over matched per-problem outcomes kept the flip distribution visible, since a mean hides +8/-6 fragility behind +3/-1 signal. An amendment cut the frozen set from 517 to 189 tasks under a time constraint, raising the minimum detectable effect from ~2 to ~4 points; stated plainly, a true effect below 4 points cannot be ruled in or out, so the -2.1 with 2 up and 6 down is directional evidence against deployment rather than proof of harm."
        ]
      },
      {
        "title": "Findings Beyond the Null: A Dose Law and a Real-but-Inert Direction",
        "items": [
          "The care direction is geometrically real and behaviorally inert. A cheap geometric pre-flight, the ~1-hour kill switch, passed decisively: all 37 layers in the 12-48 band separable, sign-consistency 0.97-1.00, so every one of 40 contrast pairs agreed on the direction of care. Negating the vector hurt (-4 points on dev), which confirms the axis exists; adding its mean still did not raise the probability of correct code. A separable direction is necessary for the method and does not guarantee it.",
          "A dose law for coherence collapse: the governing quantity is cumulative dose (scale times number-of-steered-layers) rather than per-layer scale, and it transfers across bands. Usable dose stayed at or below ~1.0, with collapse by 1.4-1.9. Published per-layer scales of 0.4-0.8 sit 15-30x past the cliff when applied across a 37-layer band on a 2-bit MoE, so the literature's typical operating scales landed entirely inside the gibberish zone here.",
          "Correctness dies before fluency. Degeneration metrics read 0.0 in every dev cell, including the collapse cell that lost 10 points of pass@1 and produced fluent, wrong code. A fluency-based safety check would have missed the damage completely, which is exactly why a cosmetic 'does it look rigorous' metric is worthless and functional pass@1 is mandatory.",
          "Speculative decoding is untaxed at usable doses: DFlash draft acceptance held at 0.89-0.92 across every healthy cell versus 0.906 baseline, so the predicted throughput tax appears only in the already-broken high-dose regime, tying directly back to the DFlash tuning above."
        ]
      },
      {
        "title": "The Verdict: Do Not Deploy, but the Assets Survive",
        "items": [
          "Recommendation: do not deploy the static vector. The decision rule that settles it is the frozen-test CI including zero with a negative point estimate; the collateral panel passing (MMLU-100 0.83 to 0.84, format suite 12/12, degeneration 0.0) and the style negative-control not reproducing the effect are moot once that rule fires.",
          "Cost was roughly a day of wall-clock on one desktop, zero training, and zero new C++ beyond a throwaway 54-line activation-dump patch, across two 91-GiB model loads. Determinism held throughout: 10/10 byte-identical baseline regenerations under greedy decoding, so the paired comparisons are exact.",
          "What survives the null: the two vectors, 12.4 GB of per-pair per-layer activation dumps (enough to build and test better static variants entirely offline with no further GPU load), the full paired-statistics eval harness, and the 25 private tasks. The honest next step is an RL-trained per-layer steering vector optimized against the unit-test reward, for which this harness already provides the reward signal."
        ]
      }
    ]
  },
  "highlights": [
    "+31% coding decode throughput (24.3 tok/s), +79% over the prior production config, by tuning speculative decoding with no retraining",
    "Diagnosed the reported 'acceptance rate' as a logging artifact; true first-position acceptance ≈ 87%",
    "Measured the megakernel ceiling at ~0% idle-gap before building it, turning a potential dead end into a one-day decision",
    "Pre-registered activation-steering study returned a clean null: a static control vector moved coding pass@1 by -2.1 points, CI includes zero",
    "The three-way split earned its keep: a +2 point dev result reversed to -2 points on the touch-once frozen set, so tuning and reporting on one set would have shipped a regression"
  ],
  "technologies": [
    "ik_llama.cpp",
    "CUDA",
    "C++",
    "Nsight (nsys / ncu)",
    "Python",
    "GGUF / 2-bit quantization",
    "Speculative decoding",
    "DGX Spark (GB10)",
    "Activation steering / control vectors",
    "Paired statistics (McNemar)",
    "pass@1 / HumanEval+ / MBPP+"
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
    "profiling",
    "interpretability",
    "evaluation",
    "steering"
  ]
};

export default project;
