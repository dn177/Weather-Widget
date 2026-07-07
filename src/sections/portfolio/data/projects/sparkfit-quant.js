// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.sparkfit-quant". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "sparkfit-quant",
  "title": "Quantizing a 397B MoE Into a 121 GiB Memory Budget",
  "category": "ml-systems",
  "featured": true,
  "flagship": true,
  "date": "2026-07-07",
  "sortOrder": -5.25,
  "summary": "Custom 2-bit-class quant of a self-hosted 397B MoE on one DGX Spark: priced by arithmetic before any compute, carried through a pre-declared gate ladder, and built to within 0.24% of its predicted size at 106.6 GB.",
  "stat": { "value": "0.24%", "label": "off the paper-predicted size, at 106.6 GB" },
  "media": {
    "type": "image",
    "src": "/Portfolio/sparkfit/sparkfit-hero.svg",
    "alt": "Custom quantization of a 397B MoE into a 121 GiB unified-memory budget: predicted 106.83 GB, built 106.6 GB (0.24% error), with a six-gate ladder showing G0 to G2 passed, the perplexity gate running, and the memory and suite gates next"
  },
  "description": "Design and build of a custom 2-bit-class quant of a self-hosted 397B MoE (SPARKFIT-v2) on one DGX Spark. The served baseline recipe was changed by exactly one line, the whole design was priced by arithmetic before any compute was spent, and the built artifact landed 0.24% off its predicted size at 106.6 GB after 37 minutes on the box's ARM cores. A pre-declared six-gate ladder carries it toward production; the quality and memory gates are running now.",
  "detailedContent": {
    "overview": "Production for this deployment is Ornith-397B-A17B, a 397B-parameter mixture-of-experts served from 121 GiB of unified memory, where model weights, KV cache, compute buffers, and the operating system all draw on one pool. The served quant (IQ2_KS, 97.8 GB) was measured at 115.4 GiB peak against a hard 118 GiB gate, so there is no free headroom: any quality upgrade has to be paid for elsewhere in the budget. SPARKFIT-v2 spends +8.44 GiB on the tensor class with the steepest documented quality sensitivity, the routed down-projection experts, and buys that back by trimming the host prompt cache and serving context. The defining property of the project is that every load-bearing number existed before the build: file size predicted at 106.83 GB from a per-tensor bits-per-weight table, peak memory estimated from a measured 22.8 GiB non-weight anchor, and a six-gate ladder (G0 preflight to G5 frozen-suite A/B) written down with abort criteria in advance. The build passed its cheap gates and landed at 106.6 GB, 0.24% under prediction, after 37.3 minutes of CPU. Three expensive gates are running now: perplexity against a sha-pinned corpus, memory at the paired serving config, and a frozen task-suite A/B. The baseline stays in production until they pass.",
    "sections": [
      {
        "title": "The Budget: One Pool of Memory, One Truthful Metric",
        "items": [
          "The box is a DGX Spark GB10: 20 Grace ARM cores and a Blackwell GPU sharing 121 GiB of unified memory. There is no GPU OOM distinct from system OOM, and the OOM killer has taken the desktop down before, so the standing gate is whole-box: peak usage at or under 118 GiB with zero swap growth across a full replay run.",
          "Two measurement corrections make that gate honest. Per-process RSS metrics like VmHWM read about 2 GiB for a server actually holding over 100 GB of weights, because unified-memory GPU allocations are invisible to per-pid accounting; the gate is therefore expressed as free -g used, nothing else. And mmap-loaded weights get double-booked on unified memory (a page-cache copy plus a GPU-resident copy from the same pool), which makes --no-mmap the single biggest memory lever on the machine.",
          "The budget itself is one calibrated subtraction: measured peak at the served config (115.4 GiB) minus weight file bytes gives a 22.8 GiB non-weight footprint for KV, buffers, prompt cache, and OS floor. Every quant variant was sized on paper against that anchor before any compute was spent, and the method (measure once, predict variants) transfers to any memory-tight deployment."
        ]
      },
      {
        "title": "Where the Bytes Are: 97% of the Model Is Routed Experts",
        "items": [
          "Ornith-397B-A17B routes 386.5B of its 397B parameters through per-layer expert banks: 512 experts per layer, 60 layers, three matrices each (gate, up, down). Attention, SSM, shared experts, and embeddings together hold about 10.5B parameters, a rounding error in bytes, which is why the baseline recipe keeps them at 4 to 8.5 bits per weight and spends all the compression pain on routed experts.",
          "File size is pure arithmetic: bytes = sum of params times bpw over 8, evaluated over the per-tensor type map. With the quant family's bpw table (iq1_kt 1.75 up to q8_0 8.5) any recipe prices to within a few percent before a single CPU-hour, and that arithmetic is what the later size gate checks the build against.",
          "The quality lever hierarchy follows from the same table: down-projection experts are the documented steepest sensitivity in this quant family, and at 128.85B parameters they are half the size of gate+up (257.7B). Upgrading them buys the most quality per gibibyte of any available spend."
        ],
        "image": "/Portfolio/sparkfit/bytes-map.svg",
        "imageAlt": "Parameter map of the 397B MoE by tensor class: routed gate and up experts hold 257.7B parameters at 1.75 bpw, routed down experts hold 128.85B upgraded from 2.125 to 2.6875 bpw (+8.44 GiB), and everything else totals about 10.5B parameters kept at 4 to 8.5 bpw."
      },
      {
        "title": "The Recipe: One Line Changed, Three Variants Priced",
        "items": [
          "SPARKFIT-v2 is the served baseline recipe verbatim except one line: routed down-projection experts move from iq2_kt to iq2_kl, +0.5625 bpw across 128.85B parameters, which is +8.44 GiB by arithmetic. Changing one variable against a served baseline keeps every downstream quality delta attributable; a from-scratch recipe would produce an uninterpretable diff.",
          "Three variants were priced before choosing: v1 upgrades only the early 40 layers (+5.63 GiB, the conservative fallback), v2 upgrades all 60, and v3 additionally raises gate+up on early layers. The v3 estimate breached the 118 GiB gate on the central overhead number, so it was deferred by the budget rather than argued about. Writing the arithmetic down turned a design debate into a lookup.",
          "The +8.44 GiB is paid for in the serving config: host prompt cache trimmed from 8192 to 2048 MiB and context from 200k to 160k tokens, for an estimated peak of 117.2 GiB. A quant is only shipped as a bundle, weights plus their paired serving config, because the old config's memory numbers are stale by construction the moment the weight file grows."
        ]
      },
      {
        "title": "The Gate Ladder: Cheap Questions Before Expensive Ones",
        "items": [
          "Six gates, G0 to G5, each strictly cheaper than the mistake it prevents, each with an abort criterion written before the run: preflight (disk, claim, RAM), compatibility and imatrix coverage, size within 3% of prediction, perplexity against the pinned corpus, whole-box memory at the paired config, and a frozen roughly-20-task suite judged on quality per wall-clock rather than tok/s alone.",
          "G1 earned its place twice in one evening. The quantizer hard-refuses to requantize from an already-quantized source (the 421.6 GB Q8_0, since no BF16 source fits the disk) without --allow-requantize, a flag missing from the design doc, caught in seconds instead of 37 CPU-minutes into the build. The same gate verifies the importance matrix covers all 180 expert tensor bases, because trellis quant types silently degrade without calibration statistics and the failure would only surface as an inexplicably bad perplexity number hours later.",
          "The build itself was undramatic, which is the point: 37.3 minutes at 16 threads, output 106,574,034,240 bytes against a predicted 106.83 GB, 0.24% under, dead-center in the plus-or-minus 3% G2 band. The band exists to catch recipe misapplication, since a regex rule that silently matched nothing would land the file about 8 GiB off. G2 costs one stat call; gates that cheap have no excuse not to exist.",
          "One gate is deliberately absent. KL divergence against a stronger teacher, the textbook quant-quality metric, is structurally impossible on this box: every quant of the 397B at IQ3 or above exceeds usable RAM on its own. The substitution (perplexity plus the frozen suite carry the quality burden) was written down before results arrived, because deciding how to judge an outcome after seeing it is how motivated reasoning ships."
        ]
      },
      {
        "title": "Measurement Hygiene: Pinned Corpora, Guarded Instruments",
        "items": [
          "The perplexity gate compares candidate to baseline on a frozen held-out corpus of own code, chosen to be disjoint from the imatrix calibration set by construction, since scoring a quant on its own calibration data would flatter every candidate. The corpus ships as a manifest with per-file sha256 of the exact bytes used, so any drifted source file is pinpointable and a result row without its pin sha is void.",
          "The pinning proved necessary within a day. A plain rerun of the corpus builder on the box silently clobbered the committed manifest (the box lacks some Mac-side sources, so every regeneration rewrote the reference). The builder now has a verify-only --check mode and refuses to overwrite a frozen manifest without an explicit flag, and the binding policy lives in the issue tracker: one primary pin, one fallback pin, never mixed within a single A/B.",
          "The same discipline applied to the corpus builder's own arithmetic: an earlier audit found its size caps counted characters while claiming bytes. All budgets are now true UTF-8 bytes, truncated on codepoint boundaries. Instruments get audited before their numbers gate a decision, because none of these defects crash anything; they quietly bias a ship call."
        ]
      },
      {
        "title": "Shipping Is a Bundle: Coupling, Restore Pins, and What Runs Now",
        "items": [
          "A new quant changes more than a file. The speculative drafter serving this model reads the target's hidden states at inference and was trained on the target's own tokens, so it is version-coupled to the quant twice over. Before any drafted throughput number is trusted on SPARKFIT-v2, a decision gate runs: capture about a thousand samples on the new target, measure the drafter's position-1 argmax match delta, retrain above 5% degradation, ship as-is below it, and re-sweep the draft width either way.",
          "The serving config migrates by method, never by copied numbers. The new build leaves roughly 9 to 11 GiB of non-weight budget against the old build's 23, so the first boot is deliberately conservative (context 98k, prompt cache 2048 MiB), the server's own boot-log allocation table says where memory actually went, and context is resized to fill what is measured to remain.",
          "The operational cost of the whole build window was about 53 minutes of production downtime, 8 of which were a lesson: a cleanup trap restored the server from a branch whose defaults predated the current drafter, and the misconfiguration was caught only because every restore gets its command line verified against expectations. Restores now pin the known-good config explicitly instead of trusting a script's defaults.",
          "Current status: G0 to G2 passed, and the artifact exists at 106.6 GB. The perplexity gate, the memory gate at the paired config, and the frozen-suite A/B are running now; the served baseline stays in production until they pass, and if they fail, the fallback is the baseline that never left."
        ]
      }
    ]
  },
  "highlights": [
    "Priced a 397B quant recipe on paper from a bits-per-weight table and a measured memory anchor; the built artifact landed at 106.6 GB, 0.24% under prediction, after 37 minutes on 16 ARM threads",
    "Changed exactly one recipe line against the served baseline (down-projection experts, 2.125 to 2.6875 bpw, +8.44 GiB) so every quality delta stays attributable",
    "Pre-declared six-gate ladder ordered cheap to expensive; the compatibility gate caught two real blockers in seconds that would otherwise have cost the build window",
    "Quality gates run against a sha256-pinned held-out corpus with a clobber-guarded builder; the infeasible KLD metric was replaced by a substitution declared before results arrived"
  ],
  "technologies": [
    "ik_llama.cpp",
    "GGUF / custom quantization",
    "Importance-matrix calibration",
    "Mixture-of-experts (397B/A17B)",
    "Unified-memory budgeting",
    "Perplexity gating",
    "Python / Bash tooling",
    "DGX Spark (GB10)"
  ],
  "mainTech": "ai-ml",
  "links": [],
  "tags": [
    "ai-ml",
    "llm",
    "quantization",
    "inference",
    "moe",
    "performance",
    "measurement",
    "mlops"
  ]
};

export default project;
