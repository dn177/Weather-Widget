// Performance metrics — number+unit tokens, ranges, and large counts — are
// wrapped in <span class="cs-metric"> so the data points pop and a content-heavy
// case study stays scannable. Conservative on purpose: matches measurement units
// (ms, s, fps, %, KB/MB/px) and comma-grouped counts, so tech names like "Vue 3"
// or "BGE-M3" are never falsely highlighted.
// Shared by the case-study modal (Project.jsx) and the inline details panel
// (ProjectDetailsPanel.jsx).
const METRIC_RE =
  /(~?\d[\d.,]*\s*(?:–|—|-|→|to)\s*~?\d[\d.,]*\s*(?:ms|seconds?|fps|s|%)|~?\d[\d.,]*\s*(?:ms|seconds?|fps|%|KB|MB|GB|px)|\d{1,3}(?:,\d{3})+)/gi;

export const emphasizeMetrics = (text) => {
  if (typeof text !== "string") return text;
  const segments = text.split(METRIC_RE);
  if (segments.length <= 1) return text;
  return segments.map((seg, i) =>
    i % 2 === 1 && seg ? (
      <span key={i} className="cs-metric">
        {seg}
      </span>
    ) : (
      seg
    ),
  );
};

export default emphasizeMetrics;
