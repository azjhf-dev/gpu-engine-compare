// GPU x inference-engine comparison data. Every row carries a source id (see SOURCES).
// Models differ per row - compare within a GPU section, not across sections.
const SOURCES = {
  rocm_xtx:   {label: "fintip, r/ROCm dual-7900-XTX engine shootout (Nov 2026)", url: "https://www.reddit.com/r/ROCm/comments/1y0n9zg/"},
  basalt7:    {label: "Basalt showcase: 7 engines on one RTX 5090 (vendor-run, Oct 2026)", url: "https://basalt.jgulfo.com/showcase/engine-comparison/"},
  twt:        {label: "Thomas Wilde Tech: Basalt vs Strata on the 5090 (Nov 2026)", url: "https://thomaswildetech.com/blog/2026-11-11/two-engines-one-model-basalt-versus-strata-on-the-5090/"},
  strata5906: {label: "Strata issue #5906 community bench (Windows, 5090)", url: "https://github.com/Niko1221/Strata/issues/5906"},
  r9700blog:  {label: "Damian Sromek: 4 engines, 7 models on Radeon AI PRO R9700 (Nov 2026)", url: "https://www.damiansromek.pl/en/tech/blog/local-llm-benchmarks-r9700/"},
  r9700thread:{label: "r/LocalLLaMA R9700 thread (self-reports)", url: "https://www.reddit.com/r/LocalLLaMA/comments/1y0i8ww/"},
  dual3090:   {label: "strata-dual-3090 fork author, r/LocalLLM (NVLink, exactness gate)", url: "https://www.reddit.com/r/LocalLLM/comments/1wytq4f/"},
  llamapiguide:{label: "llmapiguide: Flash-Next on 1-4x RTX 3090", url: "https://llmapiguide.com/en/posts/qwen3-8-flash-next-benchmark"},
  inovello:   {label: "inovello.dev: 2x3090 expert-cache writeup (Q6_K_XL route)", url: "https://inovello.dev/writeups/qwen3-flash-next-2x3090-expert-cache/"},
  c42:        {label: "c42.ro: RTX 5060 Ti 16 GB as an LLM server (Aug 2026, corrected Oct 2026)", url: "https://blog.c42.ro/2026/08/rtx-5060-ti-llm-throughput/"},
  ind5090:    {label: "Independent r/LocalLLaMA run: popular Flash-Next engines on one 5090 + 128 GB RAM", url: "https://www.reddit.com/r/LocalLLaMA/comments/1xdlunp/"},
  gistxtx:    {label: "ojus1 gist: Qwen3.8-27B Q3/Q4 at 150K on RX 7900 XTX (llama.cpp ROCm + Pi)", url: "https://gist.github.com/ojus1/f7b77c8f032a5895fc3e3f5849ae5bd4"},
  hipfire100: {label: "r/ROCm: Qwen3.8-27B at ~100 tok/s on a single 7900 XTX (patched hipfire)", url: "https://www.reddit.com/r/ROCm/comments/1xdu4mu/"},
  hipfire95:  {label: "r/LocalLLM: ~95 t/s decode, ~1500 t/s prefill on a single 7900 XTX (hipfire fork)", url: "https://www.reddit.com/r/LocalLLM/comments/1xeag0w/"},
  avalonxt:   {label: "r/ROCm: Avalon on RX 7900 XT, 92 t/s at 4.29 bpw (XT, not XTX)", url: "https://www.reddit.com/r/ROCm/comments/1xdwk8z/"},
  ninferrepo: {label: "ninfer long-context curves (author's own measurements)", url: "https://github.com/Neroued/ninfer"},
  capyrepo:   {label: "capy-flash agentic replay bench (2x RTX 5070 Ti)", url: "https://github.com/ValerioDolci/capy-flash-mirror"},
};

// decode/prefill in tok/s as text (measured formats vary: single / ranges per context).
const ROWS = [
 // ---------- RTX 5090 (32 GB) ----------
 {gpu:"5090", engine:"Basalt 5b0eaeb8", model:"Qwen3.8-Flash-Next NVFP4", decode:"354 struct / 188 conv / 180 prose; 190 @25k -> 160 @200k", prefill:"6,492-8,666", ctx:"200k", quality:"Fastest decode of 7 engines tested (vendor bench)", src:"basalt7"},
 {gpu:"5090", engine:"Infernix 7dbe99a3", model:"Flash-Next NVFP4 (Recipe Dense8)", decode:"349 / 170 / 163; 158 @200k", prefill:"~6,436-6,630", ctx:"200k", quality:"2nd of 7", src:"basalt7"},
 {gpu:"5090", engine:"capy-flash 4e45286a", model:"Flash-Next NVFP4", decode:"292 / 165 / 152; 135 @200k", prefill:"4,026-5,458", ctx:"200k", quality:"Single-GPU NVFP4 not an upstream-documented path", src:"basalt7"},
 {gpu:"5090", engine:"Strata main 011c9e60", model:"Flash-Next NVFP4-based", decode:"204 / 146 / 123; 130 @25k -> 114 @200k", prefill:"3,530-4,245", ctx:"200k", quality:"Mid-pack of 7", src:"basalt7"},
 {gpu:"5090", engine:"ninfer-ext", model:"Flash-Next NVFP4", decode:"140 / 101 / 95; 66 @200k", prefill:"3,552-4,588", ctx:"200k", quality:"", src:"basalt7"},
 {gpu:"5090", engine:"ninfer", model:"Flash-Next NVFP4", decode:"54 / 77 / 45; 44 @200k", prefill:"2,080-2,308", ctx:"200k", quality:"Weakest perplexity of the 7 (3.519 vs ~3.29)", src:"basalt7"},
 {gpu:"5090", engine:"llama.cpp 36cbf415", model:"Flash-Next NVFP4 (Magnitude GGUF)", decode:"39 flat; 32 @200k", prefill:"1,257-1,420", ctx:"200k", quality:"Reference slow path", src:"basalt7"},
 {gpu:"5090", engine:"Basalt 0.3.2", model:"Flash-Next UD-IQ4_XS (same pack as Strata row)", decode:"174.6 (1k cold) -> 268.2 (64k warm); 296-297 on converted IQ3_S", prefill:"~1,340 -> ~11,500", ctx:"64k", quality:"+55-86% decode vs Strata on identical weights; warm resume flat 8.2-8.4 ms", src:"twt"},
 {gpu:"5090", engine:"Strata 0.2.13 (engine 0.1.59)", model:"Flash-Next UD-IQ4_XS", decode:"98.4 (1k cold) -> 192.7 (64k warm)", prefill:"~1,330 -> ~8,900", ctx:"64k", quality:"Warm resume costs 135-511 ms (grows with context)", src:"twt"},
 {gpu:"5090", engine:"Strata 0.1.58 / engine 0.1.59 (Windows)", model:"Flash-Next IQ3_S", decode:"173.6 chat; 222.9 agent follow-up turns", prefill:"5,117 @4k / 6,674 @16k", ctx:"262k", quality:"Community bench; speed only, no correctness check", src:"strata5906"},
 {gpu:"5090", engine:"Independent re-run (3 engines)", model:"Flash-Next NVFP4", decode:"Basalt 176-265; capy-flash 138-198; ninfer-ext 73-106", prefill:"-", ctx:"262k", quality:"Independent of vendor; same ordering as Basalt's own table", src:"ind5090"},
 {gpu:"5090", engine:"ninfer long-context curve (MTP off)", model:"Qwen3.8-27B NVFP4 (dense, not Flash-Next)", decode:"74 @7.7k / 68 @64k / 63 @130k / 53 @260k", prefill:"TTFT 0.6s @7.7k -> 65s @260k", ctx:"260k", quality:"MTP3 on: 133-146 decode, TTFT 9s @64k / 24s @128k", src:"ninferrepo"},
 {gpu:"5090", engine:"llama.cpp / ninfer + DFlash2", model:"Qwen3.8-27B NVFP4 + Qwen-Sharp (dense)", decode:"289.2 mean (175.9 with MTP3)", prefill:"-", ctx:"-", quality:"Measured by the R9700 blogger as a contrast row", src:"r9700blog"},
 {gpu:"5090", engine:"Basalt c531c21a (5090 + 5060 Ti 16GB)", model:"Flash-Next NVFP4-DQ6_K, int8 KV", decode:"306.5 prose / 334.9 conv / 601.2 struct", prefill:"8,367 @16.7k / 10,320 @66.8k", ctx:"67k", quality:"Adding a 5060 Ti roughly doubles structured decode", src:"basalt7"},

 // ---------- RX 7900 XTX (24 GB; most MoE data is dual-card, 48 GB) ----------
 {gpu:"xtx", engine:"Strata 0.2.13.1 upstream (2x XTX)", model:"Flash-Next GSQ-RCO IQ3_XXS (76 GB)", decode:"79 / 100 / 84 (112 / 3.5k / 34k ctx)", prefill:"1,440 / 2,496", ctx:"34k", quality:"Quality baseline; strongest Flash-Next config on a paired private coding bench (~8,000 scored runs)", src:"rocm_xtx"},
 {gpu:"xtx", engine:"Strata-rdna3 fork, NaN-free variant (2x XTX)", model:"Flash-Next GSQ-RCO IQ3_XXS", decode:"~95-125 bench; 119-127 in agent runs", prefill:"2,418 / 3,346", ctx:"34k", quality:"~16% less wall time but ~2-5 pts weaker on hardest problems (98% conf.); NaN root-caused to fork refill settings, not ROCm", src:"rocm_xtx"},
 {gpu:"xtx", engine:"Avalon 1200934a7 (1 card)", model:"Flash-Next Avalon IQ3_KS", decode:"87 / 90 / 90", prefill:"1,051 / 2,385", ctx:"34k", quality:"Not quality-tested at scale by OP", src:"rocm_xtx"},
 {gpu:"xtx", engine:"Avalon 1200934a7 (2 cards, split)", model:"Flash-Next Avalon IQ3_KS", decode:"64 / 75 / 64", prefill:"1,741 / 2,434", ctx:"34k", quality:"Second card made it slower at batch 1", src:"rocm_xtx"},
 {gpu:"xtx", engine:"EXL3 fork 4.05 bpw (2x XTX)", model:"Flash-Next EXL3 4.05 (111 GB)", decode:"26 / 31 / 29", prefill:"686 / 1,122", ctx:"34k", quality:"Quality tie with IQ3_XXS but ~2.3x wall time", src:"rocm_xtx"},
 {gpu:"xtx", engine:"EXL3 fork 3.05 bpw (2x XTX)", model:"Flash-Next EXL3 3.05", decode:"49 / 50 / 50", prefill:"876 / 1,349", ctx:"34k", quality:"Within noise of the quality plateau; still slower than Strata", src:"rocm_xtx"},
 {gpu:"xtx", engine:"llama.cpp (2x XTX)", model:"Flash-Next GGUF", decode:"31-36", prefill:"-", ctx:"-", quality:"Reference slow path", src:"rocm_xtx"},
 {gpu:"xtx", engine:"hipfire (Flash-Next 2-bit)", model:"Flash-Next 2-bit build", decode:"~15", prefill:"-", ctx:"-", quality:"Only runs 1 card on 64 GB; on dense 27B hipfire is ~2x llama.cpp (94-98 vs 45-63 t/s)", src:"rocm_xtx"},
 {gpu:"xtx", engine:"llama.cpp HIP, ROCm 7.2.4 (1 card)", model:"Qwen3.8-27B Q3_K_M + MTP + Pi LoRA (dense)", decode:"52.6 plain; 42-61 on Pi agent turns @153.6k ctx", prefill:"540-815", ctx:"153.6k (190k prompt validated)", quality:"Proven single-card config; Q4_K_M + MTP + 150K KV spills -> 5-9 t/s", src:"gistxtx"},
 {gpu:"xtx", engine:"hipfire, patched (1 card)", model:"Qwen3.8-27B (dense)", decode:"~100 t/s class; ~95 avg in a second report", prefill:"~1,500", ctx:"-", quality:"Two independent single-card reports, Nov 2026", src:"hipfire100", src2:"hipfire95"},
 {gpu:"xtx", engine:"Avalon (RX 7900 XT, not XTX)", model:"Flash-Next 4.29 bpw", decode:"92", prefill:"-", ctx:"-", quality:"Older DDR4 box; shows Avalon runs Flash-Next well on RDNA3", src:"avalonxt"},
 {gpu:"xtx", engine:"vLLM (2x XTX, TP2)", model:"Qwen3.8-27B (dense)", decode:"52-64 single stream", prefill:"-", ctx:"-", quality:"Worth it only for concurrent serving; short-context worse than llama.cpp. No published Flash-Next-on-vLLM gfx1100 run", src:"rocm_xtx", gap:true},

 // ---------- RTX 3090 (24 GB; data is dual NVLink unless noted) ----------
 {gpu:"3090", engine:"strata-dual-3090 fork v0.1.38+29 (2x NVLink)", model:"Flash-Next IQ3_S", decode:"116 / 113 / 111 (8k / 32k / 128k); ~102-104 with official sampling", prefill:"2,908 / 3,231 / 3,186", ctx:"262k", quality:"Answers word-for-word identical to 1-card run (shipped exactness gate); ~0.98 expert-cache hit", src:"dual3090"},
 {gpu:"3090", engine:"stock Strata 0.1.13 (1 card)", model:"Flash-Next IQ3_S", decode:"51 / 46 / 41", prefill:"1,376 / 1,361 / 1,223", ctx:"262k", quality:"Fork author's own baseline", src:"dual3090"},
 {gpu:"3090", engine:"vLLM (2 cards)", model:"Flash-Next", decode:"81 flat", prefill:"2,000-2,219", ctx:"128k", quality:"Older comparison from the same author", src:"dual3090"},
 {gpu:"3090", engine:"llama.cpp (1/2/3/4 cards)", model:"Flash-Next IQ3_S", decode:"88.3 (1x) / 122.6 @32k (2x) / 115.5 (3x) / 118.2 (4x)", prefill:"-", ctx:"130k", quality:"2 cards is the batch-1 sweet spot; 3rd/4th card slightly slower (PCIe sync)", src:"llamapiguide"},
 {gpu:"3090", engine:"llama.cpp + expert-cache PR #27861 (2x, PCIe 3.0 DDR4 box)", model:"Flash-Next UD-Q6_K_XL (157.5 GB)", decode:"17 baseline -> 25-29 (cache) -> 37-41 (quant+spec)", prefill:"392 @26k pinned", ctx:"261k", quality:"Higher-quality Q6 route; much slower than IQ3_S builds", src:"inovello"},
 {gpu:"3090", engine:"Basalt / capy-flash / ninfer", model:"-", decode:"GAP", prefill:"-", ctx:"-", quality:"All three require Blackwell sm_120 (RTX 50). No 3090 build exists", src:"basalt7", gap:true},

 // ---------- RTX 5060 Ti 16 GB ----------
 {gpu:"5060ti", engine:"llama.cpp b10318", model:"Qwen3.5-9B Q4_K_M (dense)", decode:"69.4 single stream", prefill:"TTFT ~430 ms", ctx:"32k", quality:"Best single-user result on the card; 5.3 GiB weights", src:"c42"},
 {gpu:"5060ti", engine:"llama.cpp b10318", model:"Qwen3.5-9B Q6_K", decode:"55.6; 105 aggregate @4 streams", prefill:"1,853.8 @32k", ctx:"32k", quality:"Quality reference; decode 45.1 with 28.5k cached", src:"c42"},
 {gpu:"5060ti", engine:"Ollama 0.32.6 (byte-identical Q6_K)", model:"Qwen3.5-9B Q6_K", decode:"48.1", prefill:"TTFT 1,399 ms", ctx:"32k", quality:"~13% wrapper tax vs raw llama.cpp", src:"c42"},
 {gpu:"5060ti", engine:"vLLM 0.26.0 (CUDA graphs)", model:"Qwen3.5-9B AWQ 4-bit", decode:"65.2 single; 407 aggregate @32 streams", prefill:"TTFT 203 ms", ctx:"32k", quality:"Concurrency engine: 181 @4, 384.9 @16; knee at 16 streams. Eager mode: 23.1", src:"c42"},
 {gpu:"5060ti", engine:"Basalt (as 2nd card next to a 5090)", model:"Flash-Next NVFP4-DQ6_K", decode:"601 struct combined", prefill:"10,320 @66.8k", ctx:"67k", quality:"Works as an add-on MoE card under Basalt", src:"basalt7"},
 {gpu:"5060ti", engine:"Strata / Avalon / Maya / Basalt standalone", model:"Flash-Next class", decode:"GAP", prefill:"-", ctx:"-", quality:"No published standalone 5060 Ti 16GB numbers for the MoE engines; 16 GB VRAM means heavy RAM offload for 125B-class models", src:"c42", gap:true},

 // ---------- Radeon AI PRO R9700 (32 GB) ----------
 {gpu:"r9700", engine:"Paiton vLLM (ROCm 10 plugin)", model:"Qwen3.8-27B W3A4 + DFlash2 drafter, 4-bit KV", decode:"173.8 median single; 684 aggregate @8 streams", prefill:"~4,078 @12k; 2,158 @245k", ctx:"262k", quality:"2.07x Strata's decode on the same card+model; 0.58-0.61 tok/W single, 2.3-2.4 @8 streams", src:"r9700blog"},
 {gpu:"r9700", engine:"Strata 0.2.13 (engine 0.1.59)", model:"Qwen3.8-27B UD-IQ4_XS (dense)", decode:"83.8 (103.6 @4 streams)", prefill:"3,289 @23k", ctx:"32k", quality:"GAP: no published Flash-Next-on-Strata R9700 number; this row is dense 27B", src:"r9700blog", gap:true},
 {gpu:"r9700", engine:"Strata 0.2.13 (strata-dsv41 0.1.59)", model:"DeepSeek-V4.1-Flash ISTA-DAS 2.25 bpw (274 GB)", decode:"26-27 chat / 21 code (140 GiB VM)", prefill:"370-390 @6k; 655-695 @25k", ctx:"512k", quality:"RAM decides decode: 7.5-9.7 t/s at 64 GiB. Strata 0.2.14 removed the DeepSeek engine - do not update a working 0.2.13", src:"r9700blog"},
 {gpu:"r9700", engine:"Project Maya v1.1.65", model:"GLM-5.3-Flash Maya-M / DeepSeek Maya-XS v2 / CYBER-FROST Q5_K_M", decode:"15.7 / 23.9 / 30.3", prefill:"255-475 short", ctx:"256k", quality:"Maya-XS v2 (116.8 GB) within ~3 t/s of Strata's 274 GB set; Maya-S (347.5 GB) 10.6 t/s", src:"r9700blog"},
 {gpu:"r9700", engine:"llama.cpp", model:"Qwen3.8-27B Q4_K_M + MTP", decode:"~40 avg", prefill:"-", ctx:"-", quality:"Thread self-report", src:"r9700thread"},
 {gpu:"r9700", engine:"Radiance", model:"-", decode:"GAP", prefill:"-", ctx:"-", quality:"Claimed fastest for RDNA4 by a commenter; untested by either OP. IQR quants praised (exl3-level KLD, no prefill penalty)", src:"r9700thread", gap:true},
];

const ENGINES = [
 {name:"Basalt", url:"https://github.com/jesdga95/basalt", note:"Blackwell-only (sm_120, CUDA 13), Linux + Windows. Flash-Next, DeepSeek-V4.1-Flash, Qwen3.8-27B; MoE experts overflow to RAM. Fastest decode on 5090 in both vendor and independent runs. No AMD build."},
 {name:"Strata", url:"https://github.com/Niko1221/Strata", note:"MoE expert-streaming engine; runs on NVIDIA and AMD (HIP), with community forks for dual-3090 NVLink and rdna3. 0.2.14 removed the DeepSeek engine - keep 0.2.13 if you use it."},
 {name:"Avalon", url:"https://github.com/freriadoc/Avalon", note:"llama.cpp fork purpose-built for Qwen3.8-Flash-Next. RDNA3/4 focus; runs 177B MoE on a single 24 GB card + DDR4 at ~90 t/s class."},
 {name:"Project Maya", url:"https://github.com/mw00/project-maya", note:"MIT, open-source. GLM-5.3-Flash and DeepSeek-V4.1-Flash on consumer GPUs incl. R9700 (ROCm); web UI with model switching. The maintained route for DeepSeek after Strata dropped it."},
 {name:"Infernix", url:"https://github.com/Wallawalla47/Infernix", note:"NVFP4 Flash-Next on RTX 50. 2nd fastest of 7 on the 5090 vendor bench."},
 {name:"capy-flash", url:"https://github.com/ValerioDolci/capy-flash-mirror", note:"ninfer fork tuned for 2x RTX 50 (TP2). Agentic replay bench: ~155 t/s median over 53-turn coding sessions on 2x 5070 Ti."},
 {name:"ninfer / ninfer-ext", url:"https://github.com/Neroued/ninfer", note:"NVFP4 Qwen3.8-27B/Flash-Next, Blackwell sm_120+. Best-documented long-context curves (74 -> 53 t/s, 7.7k -> 260k)."},
 {name:"llama.cpp", url:"https://github.com/ggml-org/llama.cpp", note:"Universal baseline (CUDA, ROCm/HIP, Vulkan, Metal). Slowest on Flash-Next MoE, but the proven dense-27B path on a single 7900 XTX and the best single-user engine on the 5060 Ti."},
 {name:"vLLM", url:"https://github.com/vllm-project/vllm", note:"Serving/concurrency engine. Weak single-stream on consumer cards, ~4x llama.cpp aggregate under load. Paiton is its ROCm 10 plugin - current leader on R9700."},
 {name:"hipfire", url:"https://www.reddit.com/r/ROCm/comments/1xdu4mu/", note:"RDNA3-focused fork. ~2x llama.cpp on dense 27B on one XTX; Flash-Next 2-bit build exists but single-card only."},
 {name:"Radiance", url:"https://www.reddit.com/r/LocalLLaMA/comments/1y0i8ww/", note:"Rumored fastest on RDNA4. No published numbers - treat as a gap to watch."},
 {name:"EXL3 (ExLlamaV3 forks)", url:"https://www.reddit.com/r/ROCm/comments/1y0n9zg/", note:"Quality ties IQ3_XXS at 4.05 bpw but ~2.3x wall time on dual XTX. Not competitive on speed here."},
];

const VERDICTS = [
 {gpu:"5090", title:"RTX 5090 32 GB", text:"Basalt leads (vendor + independent agree), ~1.7-1.9x Strata's decode on identical weights. Strata's niche is warm-resume caching. llama.cpp is 5-9x slower on Flash-Next."},
 {gpu:"xtx", title:"RX 7900 XTX 24 GB", text:"Two games. Flash-Next MoE: upstream Strata IQ3_XXS on 2 cards is the quality-tested pick (fork is faster but weaker on hard problems). Dense 27B on 1 card: patched hipfire (~95-100 t/s) or llama.cpp Q3_K_M + MTP (52.6 t/s at 153k ctx)."},
 {gpu:"3090", title:"RTX 3090 24 GB (pair)", text:"strata-dual-3090 fork: 116 t/s with a shipped exactness gate. llama.cpp 2-card is the cheap sweet spot (122.6 @32k). Basalt/capy-flash/ninfer can't run here at all (Blackwell-only)."},
 {gpu:"5060ti", title:"RTX 5060 Ti 16 GB", text:"Single user: llama.cpp Q4_K_M (69.4 t/s, 9B class). Serving: vLLM CUDA graphs (407 t/s aggregate @32 streams). Watch thermals in server chassis (81 C, hardware throttle). Big-MoE engines are a gap on this card alone."},
 {gpu:"r9700", title:"Radeon AI PRO R9700 32 GB", text:"Paiton vLLM leads dense 27B (173.8 t/s, 2.07x Strata). Project Maya is the maintained DeepSeek route after Strata 0.2.14 dropped it. Flash-Next on Strata here is an open gap."},
];
