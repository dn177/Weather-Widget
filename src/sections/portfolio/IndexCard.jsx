import { useTranslation } from "react-i18next";
import { FaGithub, FaExternalLinkAlt, FaBook, FaChevronDown } from "react-icons/fa";
import ProjectDetailsPanel from "./ProjectDetailsPanel";

// Tier 2: uniform vertical index card. Every index card carries a "Details"
// disclosure that expands the shared ProjectDetailsPanel inline; disclosure
// state lives in Projects.jsx (keyed by project id) so it survives the
// archive rows-to-cards view switch. A "companion" card shares its row with
// a tall flagship, so it trades the 54px stamp for a full media plate: the
// equal-height slack becomes evidence instead of whitespace.
const IndexCard = ({
  project,
  translatedProject,
  links,
  onOpenCaseStudy,
  expanded,
  hasOpened,
  onToggle,
  panelId,
  companion = false,
  ordinal,
}) => {
  const { t } = useTranslation();

  const { media } = translatedProject;
  const stampSrc = media.poster ?? media.src;
  const isSvg = typeof stampSrc === "string" && stampSrc.endsWith(".svg");

  const categoryLabel = t(`portfolio.projectCategories.${project.category}`, {
    defaultValue: project.category,
  });
  const year = project.date ? project.date.slice(0, 4) : "";

  const firstLink = [...links.live, ...links.github, ...links.other][0];

  return (
    <article
      className={`pf-card pf-index${companion ? " pf-index--plate" : ""}`}
    >
      {companion && (
        <div
          className={`pf-index__plate${
            isSvg ? " pf-index__plate--contain" : ""
          }`}
        >
          <img src={stampSrc} alt="" loading="lazy" />
        </div>
      )}
      <div className="pf-index__head">
        <span className="pf-kicker pf-kicker--meta">
          {categoryLabel} · {year}
        </span>
        {!companion && (
          <img
            className="pf-index__stamp"
            src={stampSrc}
            alt=""
            loading="lazy"
            width="54"
            height="54"
          />
        )}
      </div>
      <h3 className="pf-index__title">
        {ordinal && (
          <span className="pf-ordinal" aria-hidden="true">
            {ordinal}
          </span>
        )}
        {translatedProject.title}
      </h3>
      {translatedProject.summary && (
        <p className="pf-index__summary">{translatedProject.summary}</p>
      )}
      {translatedProject.stat && (
        <p className="pf-index__stat">
          <span className="pf-stat__value">{translatedProject.stat.value}</span>{" "}
          {translatedProject.stat.label}
        </p>
      )}
      <div className="pf-footer">
        {onOpenCaseStudy ? (
          <button
            type="button"
            className="pf-btn pf-btn--primary"
            onClick={onOpenCaseStudy}
          >
            <FaBook aria-hidden="true" />
            <span>{t("portfolio.readMore")}</span>
          </button>
        ) : (
          firstLink && (
            <a
              className="pf-btn pf-btn--ghost"
              href={firstLink.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              {firstLink.type === "github" ? (
                <FaGithub aria-hidden="true" />
              ) : (
                <FaExternalLinkAlt aria-hidden="true" />
              )}
              <span>
                {firstLink.type === "github"
                  ? t("portfolio.viewCode")
                  : firstLink.label || t("portfolio.viewLive")}
              </span>
            </a>
          )
        )}
        <button
          type="button"
          className="pf-btn pf-btn--disclosure"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onToggle(project.id)}
        >
          <span>{t("portfolio.details")}</span>
          <FaChevronDown
            aria-hidden="true"
            className={`pf-chevron${expanded ? " pf-chevron--open" : ""}`}
          />
        </button>
        {project.closedSource && (
          <span className="pf-badge">{t("portfolio.closedSource")}</span>
        )}
      </div>
      <ProjectDetailsPanel
        project={project}
        translatedProject={translatedProject}
        panelId={panelId}
        expanded={expanded}
        hasOpened={hasOpened}
      />
    </article>
  );
};

export default IndexCard;
