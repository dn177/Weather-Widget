import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import Project from "./Project";
import WeatherGrid from "../weather/Weather";
import { portfolioProjects, getTier } from "./portfolioData";
import useInView from "../../hooks/useInView";

// Appendix band at the end of the archive. Owns its useInView instance so
// each mount (the band unmounts while a tech filter is active) starts a
// fresh observer; the widget only fetches once the band nears the viewport.
const WeatherAppendix = () => {
  const [weatherRef, weatherInView] = useInView();
  return (
    <div className="pf-weather-band" ref={weatherRef}>
      {weatherInView && <WeatherGrid />}
    </div>
  );
};

// Static interleave with an alternating rhythm: each flagship pairs with one
// index card ("companion") to tile a 3-column row, and every other pair is
// flipped so flagships zig-zag down the page. Shared by the render order and
// the catalog numbering so the unfiltered view reads sequentially.
const interleaveFeatured = (flagships, indexCards) => {
  const order = [];
  const companionIds = new Set();
  const mediaRightIds = new Set();
  for (let i = 0; i < Math.max(flagships.length, indexCards.length); i++) {
    const pair = [];
    if (flagships[i]) pair.push(flagships[i]);
    if (indexCards[i]) pair.push(indexCards[i]);
    if (flagships[i] && indexCards[i]) {
      companionIds.add(indexCards[i].id);
      if (i % 2 === 1) {
        pair.reverse();
        mediaRightIds.add(flagships[i].id);
      }
    }
    order.push(...pair);
  }
  return { order, companionIds, mediaRightIds };
};

// Three tiers; disclosure state lives here, keyed by project id, so the
// archive rows-to-cards view toggle preserves open panels across the
// unmount/remount. `hasOpened` tracks which panels have mounted their media
// at least once.
const Projects = ({ projects, activeTech = "all" }) => {
  const { t } = useTranslation();
  const [expandedProjectIds, setExpandedProjectIds] = useState(() => new Set());
  const [hasOpenedIds, setHasOpenedIds] = useState(() => new Set());
  const [archiveView, setArchiveView] = useState("list");

  const toggleProject = useCallback((id) => {
    setExpandedProjectIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
    setHasOpenedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }, []);

  // Stable catalog ordinals (01-30), computed once from the full unfiltered
  // DISPLAY order (interleaved featured tiers, then the archive), so the
  // default view numbers sequentially down the page and the numbers guide
  // the eye. Filtered views show non-contiguous numbers like a real catalog.
  const ordinals = useMemo(() => {
    const all = [...portfolioProjects].sort(
      (a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0),
    );
    const fullOrder = [
      ...interleaveFeatured(
        all.filter((p) => getTier(p) === 1),
        all.filter((p) => getTier(p) === 2),
      ).order,
      ...all.filter((p) => getTier(p) === 3),
    ];
    const map = new Map();
    fullOrder.forEach((p, i) => map.set(p.id, String(i + 1).padStart(2, "0")));
    return map;
  }, []);

  const flagships = projects.filter((p) => getTier(p) === 1);
  const indexCards = projects.filter((p) => getTier(p) === 2);
  const archive = projects.filter((p) => getTier(p) === 3);

  // Render order: the same interleave over the (possibly filtered) list.
  // The array is identical at every width (DOM = visual = tab order); the
  // flagship left/right flip is CSS-only at >=1024px, and below that
  // flagships drop to one column with stacked media so 2-column rows tile
  // cleanly as well.
  const { order: featuredOrder, companionIds, mediaRightIds } =
    interleaveFeatured(flagships, indexCards);

  const projectProps = (project) => ({
    project,
    expanded: expandedProjectIds.has(project.id),
    hasOpened: hasOpenedIds.has(project.id),
    onToggle: toggleProject,
    panelId: `pf-panel-${project.id}`,
    ordinal: ordinals.get(project.id),
  });

  return (
    <>
      {(flagships.length > 0 || indexCards.length > 0) && (
        <div className="pf-grid">
          {featuredOrder.map((project) => (
            <Project
              key={project.id}
              {...projectProps(project)}
              companion={companionIds.has(project.id)}
              mediaSide={mediaRightIds.has(project.id) ? "right" : "left"}
            />
          ))}
        </div>
      )}

      {archive.length > 0 && (
        <section className="pf-archive" aria-label={t("portfolio.earlierWork")}>
          <div className="pf-archive__head">
            <h3 className="pf-archive__label">
              <span aria-hidden="true">§ </span>
              {t("portfolio.earlierWork")} ·{" "}
              {t("portfolio.entries", { count: archive.length })}
            </h3>
            <span className="pf-archive__rule" aria-hidden="true" />
            {/* Action-style label (flips to name the other view), so no
                aria-pressed: pairing pressed-state with a flipping label
                reads as "Show as list, pressed" and conflates the two. */}
            <button
              type="button"
              className="pf-btn pf-btn--ghost pf-archive__viewtoggle"
              onClick={() =>
                setArchiveView((view) => (view === "list" ? "cards" : "list"))
              }
            >
              {archiveView === "cards"
                ? t("portfolio.showAsList")
                : t("portfolio.showAsCards")}
            </button>
          </div>

          {archiveView === "list" ? (
            <ul className="pf-archive__list">
              {archive.map((project) => (
                <Project
                  key={project.id}
                  {...projectProps(project)}
                  archiveView="list"
                />
              ))}
            </ul>
          ) : (
            <div className="pf-grid pf-grid--archive">
              {archive.map((project) => (
                <Project
                  key={project.id}
                  {...projectProps(project)}
                  archiveView="cards"
                />
              ))}
            </div>
          )}

          {activeTech === "all" && <WeatherAppendix />}
        </section>
      )}
    </>
  );
};

export default Projects;
