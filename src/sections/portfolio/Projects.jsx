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

// Three tiers, ordered flagships-first in the array at every width (DOM order
// = visual order = tab order). Disclosure state lives here, keyed by project
// id, so the archive rows-to-cards view toggle preserves open panels across
// the unmount/remount. `hasOpened` tracks which panels have mounted their
// media at least once.
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

  // Stable catalog ordinals (01-30), computed once from the full
  // sortOrder-sorted list; filtered views show non-contiguous numbers like a
  // real catalog.
  const ordinals = useMemo(() => {
    const map = new Map();
    [...portfolioProjects]
      .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
      .forEach((p, i) => map.set(p.id, String(i + 1).padStart(2, "0")));
    return map;
  }, []);

  const flagships = projects.filter((p) => getTier(p) === 1);
  const indexCards = projects.filter((p) => getTier(p) === 2);
  const archive = projects.filter((p) => getTier(p) === 3);

  // Static interleave (F1, I1, F2, I2, ..., then the rest): a span-2
  // flagship plus the following index card tile each 3-column row without
  // leaving the third column empty. The array is identical at every width
  // (DOM = visual = tab order); below 1024px flagships drop to one column
  // with stacked media, so 2-column rows tile cleanly as well.
  const featuredOrder = [];
  for (let i = 0; i < Math.max(flagships.length, indexCards.length); i++) {
    if (flagships[i]) featuredOrder.push(flagships[i]);
    if (indexCards[i]) featuredOrder.push(indexCards[i]);
  }

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
            <Project key={project.id} {...projectProps(project)} />
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
