import { useTranslation } from "react-i18next";
import { FaGithub, FaExternalLinkAlt, FaBook, FaChevronDown } from "react-icons/fa";
import ProjectDetailsPanel from "./ProjectDetailsPanel";

// Tier 2: uniform vertical index card. Every index card carries a "Details"
// disclosure that expands the shared ProjectDetailsPanel inline; disclosure
// state lives in Projects.jsx (keyed by project id) so it survives the
// archive rows-to-cards view switch. `plate` renders a full-width media
// plate on top (the medium tier); without it the card is the compact stamp
// variant used by the archive's cards view.
const IndexCard = ({
  project,
  translatedProject,
  year,
  categoryLabel,
  firstLink,
  onOpenCaseStudy,
  expanded,
  hasOpened,
  onToggle,
  panelId,
  plate = false,
  ordinal,
}) => {
  const { t } = useTranslation();

  const { media } = translatedProject;
  const stampSrc = media.poster ?? media.src;
  const isSvg = typeof stampSrc === "string" && stampSrc.endsWith(".svg");

  return (
    <article
      className={`pf-card pf-index${plate ? " pf-index--plate" : ""}`}
    >
      {plate && (
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
        {!plate && (
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
        categoryLabel={categoryLabel}
        panelId={panelId}
        expanded={expanded}
        hasOpened={hasOpened}
        showMedia={!plate}
        showCategory={false}
      />
    </article>
  );
};

export default IndexCard;
