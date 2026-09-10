// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.dflash-retrain". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "dflash-retrain",
  "title": "Retraining a 397B LLM's Speculative Drafter on a DGX Spark",
  "category": "ml-systems",
  "featured": true,
  "flagship": true,
  "date": "2026-07-06",
  "sortOrder": -5.5,
  "summary": "Self-distillation retrain of the speculative-decoding drafter for a self-hosted 397B LLM, captured, trained, gated, and shipped back to production in a day on one DGX Spark: 25.77 tok/s, +6.0% over the tuned baseline.",
  "stat": { "value": "+6.0%", "label": "decode tok/s after a 12-minute retrain" },
  "media": {
    "type": "image",
    "src": "/Portfolio/dflash-retrain/dflash-hero.svg",
    "alt": "Self-distillation retrain of a 397B LLM's speculative-decoding drafter on one DGX Spark: shipped to production at 25.77 tok/s, +6.0% over the tuned 24.3 tok/s baseline"
  },
  "description": "Self-distillation retrain of the speculative-decoding drafter for a self-hosted 397B LLM (2-bit MoE), captured from the production server, trained, gated, and shipped back to production in a day on one DGX Spark. The retrained drafter runs at 25.77 tok/s, +6.0% over the tuned 24.3 tok/s baseline, and a 15-agent adversarial review caught a training bug that would have faked a null.",
  "detailedContent": {
    "overview": "The speculative drafter shipped with this deployment was trained for a different setup: base Qwen3.5 rather than the Ornith finetune, full-precision hidden states rather than the 2-bit deployment, and generic data rather than coding traffic. This project retrains it by self-distillation on one DGX Spark (GB10, 128 GB unified memory): capture what the deployed 397B actually computes, its hidden-state features and its chosen tokens on coding prompts, then train the 1.29B drafter to predict exactly that, so the training distribution is the deployment distribution by construction. The retrained drafter shipped to production the same day at 25.77 tok/s, +6.0% over the tuned 24.3 tok/s baseline. The work ran end-to-end on a shared box that doubles as a daily-driver inference endpoint, so half the discipline is operational: earn trust in the pipeline before spending a GPU window, judge every artifact by the online bench, and never leave production in a bad state.",
    "sections": [
      {
        "title": "The Inefficiency: A Drafter Trained for a Different Model",
        "items": [
          "Ornith-397B serves through ik_llama.cpp with DFlash speculative decoding: a 1.29B drafter proposes a block of up to 15 tokens per step, and the 397B verifies the block in one pass. Decode speed is set by how many drafted tokens the target accepts against what each extra draft position costs to verify.",
          "The shipped drafter was three mismatches away from this deployment, trained on base Qwen3.5, against full-precision hidden states, on generic data. Its measured baseline was 24.3 tok/s at its own optimum (n_max=2), with position-1 acceptance 0.77, against 18.5 tok/s with no drafter at all.",
          "A step-cost model measured on the box, ms/step ≈ 87.5 + 16.2 × (n_max − 1), shows each extra draft position costs real verify time because sparse-MoE expert weights do not amortize across positions. Lifting acceptance toward 0.90 at n_max=2 penciled out to about 27 tok/s. The win eventually arrived by a different route."
        ]
      },
      {
        "title": "Gate Discipline: Earn Trust Before Spending GPU",
        "items": [
          "The box is a live production endpoint, so every experiment time-shared with a serving 397B and each stage was a hard gate, cheap to fail early. A pipeline-trust gate built a feature-export tee into the C++ runtime, replicated the runtime drafter's forward exactly in PyTorch, and served the untrained weights round-tripped back to GGUF: acceptance 0.780 versus 0.771 shipped, so the pipeline neither helps nor hurts and any later delta is attributable to training rather than plumbing.",
          "A stop-rule ran before any training: 24.3 tok/s against 18.5 pure-target is a 1.31× uplift versus a theoretical ceiling near 1.8× at these step costs, enough headroom to justify proceeding.",
          "A rehearsal set the rule that shaped everything. The pipeline gate found the GGUF conversion had been dropping rope_theta, so the runtime ran the drafter at 10000 while it had been trained at 1e7. Fixing it doubled offline whole-block yield (2.90 to 5.97 tokens per step) and still lost end-to-end (22.1 versus 24.3 tok/s), because the deep-tail acceptance it unlocked cost more to verify than it returned. Offline gains are hypotheses; only the online bench ships anything."
        ]
      },
      {
        "title": "Preflight Review: The 15-Agent Pass That Caught a False-Null",
        "items": [
          "The trainer was written but had never executed a GPU step, and the box's serving duty meant it would get roughly one 90-minute window to be right. Before spending that window discovering bugs, a 15-agent adversarial review ran in about 15 minutes: three reviewers with distinct lenses (forward-path equivalence, training-loop correctness, ops and memory), and every finding was then attacked by an independent verifier told to refute it against the real code. Twelve deduplicated claims went in; five came out confirmed and seven refuted with evidence.",
          "The finding that mattered most was a pure-bf16 AdamW optimizer: model, gradients, and both Adam moments all bf16, with no fp32 master weights. Measured on the actual weights, 87.2% of parameter updates rounded to exactly zero at lr=1e-4 (94.0% at the 5e-5 where the schedule spends most of its run), and RMSNorm weights never moved at all. The training curve would have been nearly flat, indistinguishable from a conclusion that self-distillation does not work on this model. The fix was fp32 parameters with a bf16 autocast forward.",
          "Two more were run-killers: checkpoint logic that only saved on eval boundaries (never at the cosine-decay peak) and could have saved an all-NaN model as the best, and a missing non-finite guard that lets a single NaN poison every weight. With the fixes in place, the best checkpoint landed at step 300 of 546, a mid-run peak the original code would never have evaluated or saved."
        ]
      },
      {
        "title": "Training: Cheap Data, Risky Trainer",
        "items": [
          "The training signal is the deployment itself. 320 coding prompts generated greedily through a capture server produced 161,647 feature rows (a 10.6 GB pack, about 2.2 hours of server time). Each row carries the 397B's own hidden-state features and its chosen token, so the drafter learns to reproduce what this exact deployment does.",
          "The recipe is a masked-block cross-entropy over the 15 predicted positions with position-decay weights, the target embedding and head frozen, initialized from the shipped weights. On a held-out pack never trained on, the expected accepted-prefix metric rose from 6.22 (position 1-3 acceptance 0.93/0.86/0.72) to 8.07 (0.98/0.94/0.90) in 546 steps, about 12 minutes of GPU, with loss falling 0.74 to 0.13 and a mild post-peak overfit that the checkpoint floor captured rather than missed."
        ]
      },
      {
        "title": "The Online Gate: +30% Offline Became +3.4% Real",
        "items": [
          "The offline gain of about 30% became +3.4% end-to-end, and only after quantizing away the f16 verify tax. What actually moved was the shape of the acceptance curve: the retrained drafter decays slowly with depth (0.80/0.70/0.64/0.56/0.50 as the n_max ceiling rises from 2 to 6) where the shipped drafter fell off a cliff after position 2. Deep drafts became worth their verify cost, and the optimum n_max moved out from 2 to 4.",
          "A same-day follow-up requantized the checkpoint to the shipped drafter's custom 4-bit mix (Q8_0 base with iq4_kss and iq3_ks FFN tensors, a recipe recovered by tensor census). The 4-bit logit noise clips marginal deep drafts, so acceptance held at n_max=3, and the ship config became q4 at n_max=3: 25.77 tok/s, +6.0% cumulative over the 24.3 baseline, with rollback artifacts kept in the model directory.",
          "Three artifacts produced three different optima (2, 4, 3), so re-sweeping n_max per artifact is now written policy: acceptance is bit-identical between q8 and f16 under greedy decoding, while q4 trades deep-position accuracy for speed."
        ],
        "image": "/Portfolio/dflash-retrain/acceptance-by-depth.svg",
        "imageAlt": "Block acceptance versus n_max ceiling: the retrained drafter holds usable acceptance out to n_max 5-6 while the shipped drafter collapses after n_max 2, which moved the optimum draft depth out and let q4 at n_max=3 ship at 25.77 tok/s."
      },
      {
        "title": "Honest Accounting: Cost, Variance, and What Scales Next",
        "items": [
          "Against the original 27 tok/s hope, +6% fell inside the realistic band written before training (a wash to +15%). The structural result is worth more than the 1.5 tok/s: a trainable tail acceptance is exactly the input the next lever, engine-side verify-batching, needs, since amortizing expert reads across draft positions only pays once the deep positions are worth drafting.",
          "Prompt variance is large and real: at the ship config one prompt runs 29.8 tok/s while another drags at 21.9, so only means over the fixed 8-prompt held-out set are allowed to decide anything. Total cost was one day, about 4 hours of production downtime, 12 minutes of GPU training, and roughly 1.5M tokens of review and verification agents, with no cloud and no second machine.",
          "Scaling is now unattended. The trainer overfit the M1 data by step 300, which marks data as the binding constraint, so a 10× corpus (10,000 prompts, seed-42 reproducible, hash-deduplicated and overlap-checked against the held-out bench) is captured by nightly cron windows that claim the box at 23:00, write to an external SSD, and trap-restore production by 07:00, with guards that refuse to touch prod if the disk is missing or the window is running short."
        ]
      },
      {
        "title": "The Program: One Box, Five Days",
        "items": [
          "This retrain was the second of four pieces of work on one machine over five days in July 2026. The box was the same DGX Spark (GB10) throughout, serving Ornith-397B (2-bit MoE) through ik_llama.cpp. The other three are 'Optimizing a 397B LLM on a DGX Spark (GB10)', 'Designing a 397B MoE Quant to a 121 GiB Budget', and 'Production Observability for a Self-Hosted 397B LLM'.",
          "The decode tuning came the day before. It settled the serving configuration and left the 24.3 tok/s coding baseline that this retrain measures against. The quant design followed two days later and left the running service untouched. The observability stack went in on the last day, with alert rules that cover the nightly capture endpoint alongside production.",
          "Two artifacts from the program are public, at huggingface.co/cdtio33. The Ornith 1.0 drafter model card documents this retrain: the pre-registered A/B across repeated boots, a prompt-level confidence interval, and the SHA-256 of the measured file. The Ornith 1.5 drafter model card documents a follow-up retrain against the Ornith 1.5 target. The quant and the monitoring stack have no public artifact yet."
        ]
      }
    ]
  },
  "highlights": [
    "Retrained the 1.29B speculative drafter by self-distillation and shipped it to production the same day: 24.3 to 25.77 tok/s (+6.0%), on about 12 minutes of GPU training",
    "A 15-agent adversarial review caught a pure-bf16 AdamW that rounded 87.2% of parameter updates to zero, a bug that would have faked a 'self-distillation does not help' null",
    "The win came from the tail: retrained acceptance decays slowly with draft depth, moving the optimum n_max from 2 to 4 and monetizing deep drafts the shipped drafter could not",
    "Ran end-to-end on a shared production box, with a 10× corpus now captured by nightly cron windows that trap-restore the endpoint by 07:00"
  ],
  "technologies": [
    "PyTorch",
    "ik_llama.cpp",
    "CUDA / C++",
    "GGUF / custom quantization",
    "Self-distillation",
    "DFlash speculative decoding",
    "Mixed-precision training (fp32/bf16)",
    "Multi-agent code review",
    "DGX Spark (GB10)"
  ],
  "mainTech": "ai-ml",
  "links": [
    {
      "type": "live",
      "url": "https://huggingface.co/cdtio33/Ornith-1.0-397B-IQ2_KS-DFlash-Drafter-GGUF",
      "label": "Open the Ornith 1.0 drafter on Hugging Face"
    },
    {
      "type": "live",
      "url": "https://huggingface.co/cdtio33/Ornith-1.5-397B-IQ2_XXS-DFlash-Drafter-GGUF",
      "label": "Open the Ornith 1.5 drafter on Hugging Face"
    }
  ],
  "tags": [
    "ai-ml",
    "llm",
    "performance",
    "inference",
    "speculative-decoding",
    "training",
    "distillation",
    "quantization",
    "mlops"
  ]
};

export default project;
