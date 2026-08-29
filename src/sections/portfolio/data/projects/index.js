// Assembled in display-independent source order; the grid sorts by
// sortOrder (see ../../portfolioData.js helpers).
import p_ornith_optimization from "./ornith-optimization.js";
import p_dflash_retrain from "./dflash-retrain.js";
import p_sparkfit_quant from "./sparkfit-quant.js";
import p_monitoring_observability from "./monitoring-observability.js";
import p_belay from "./belay.js";
import p_quantum_performance from "./quantum-performance.js";
import p_selfhelp_rag from "./selfhelp-rag.js";
import p_nutrition_rag_autonomous from "./nutrition-rag-autonomous.js";
import p_aichat from "./aichat.js";
import p_mcp_servers from "./mcp-servers.js";
import p_resource_orchestration from "./resource-orchestration.js";
import p_33 from "./33.js";
import p_release_radar from "./release-radar.js";
import p_markdown_downloader from "./markdown-downloader.js";
import p_space_studio from "./space-studio.js";
import p_contao_website from "./contao-website.js";
import p_inlearning from "./inlearning.js";
import p_pictureplatform from "./pictureplatform.js";
import p_mathtron_vue from "./mathtron-vue.js";
import p_nextjs_portfolio from "./nextjs-portfolio.js";
import p_rest_fullstack from "./rest-fullstack.js";
import p_company_website from "./company-website.js";
import p_molar from "./molar.js";

// Retired from the visible lineup on 2026-07-25: car-platform.js, cdn-manager.js,
// chart.js, kanban-board.js, mathtron.js, private-blog.js. Their data files,
// locale blocks and assets are kept, so restoring one is an import plus an entry
// in rawProjects below.

// Each per-project file references its public assets by root-absolute path
// (e.g. "/Portfolio/belay/belay-hero.webp"). The site deploys under a subpath
// (Vite base "/react/"), so those paths must be prefixed with the base or they
// 404 against the bare domain root. Unlike the section components, this data is
// plain strings that never pass through import.meta.env.BASE_URL — so we apply
// it here, once, at the single point every project funnels through. External
// URLs (http…) and anything not starting with "/" are left untouched.
const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const withBase = (value) => {
  if (typeof value === "string") {
    return value.startsWith("/") ? BASE + value : value;
  }
  if (Array.isArray(value)) return value.map(withBase);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, v]) => [key, withBase(v)])
    );
  }
  return value;
};

const rawProjects = [
  p_ornith_optimization,
  p_dflash_retrain,
  p_sparkfit_quant,
  p_monitoring_observability,
  p_belay,
  p_quantum_performance,
  p_selfhelp_rag,
  p_nutrition_rag_autonomous,
  p_aichat,
  p_mcp_servers,
  p_resource_orchestration,
  p_33,
  p_release_radar,
  p_markdown_downloader,
  p_space_studio,
  p_contao_website,
  p_inlearning,
  p_pictureplatform,
  p_mathtron_vue,
  p_nextjs_portfolio,
  p_rest_fullstack,
  p_company_website,
  p_molar,
];

export const portfolioProjects = rawProjects.map(withBase);
