import { useTranslation } from "react-i18next";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import emphasizeMetrics from "./emphasizeMetrics";

// Shared expanded panel for tier-2 index cards and tier-3 archive rows.
// Visibility is driven by the `hidden` attribute (state lives in Projects.jsx
// so it survives the archive rows-to-cards view switch); media mounts only
// after the panel has been opened once (`hasOpened`), so collapsed rows fetch
// nothing. `showMedia`/`showCategory` let the host card suppress what its
// face already displays (a companion card's plate is this same image, and
// every index card's kicker already names the category).
const ProjectDetailsPanel = ({
  project,
  translatedProject,
  panelId,
  expanded,
  hasOpened,
  showMedia = true,
  showCategory = true,
}) => {
  const { t, i18n } = useTranslation();

  // Parse YYYY-MM-DD as a UTC calendar date and format in UTC, so the month
  // never shifts across time zones (e.g. "2026-01-01" in a western zone).
  const dateLabel = project.date
    ? new Intl.DateTimeFormat(i18n.language, {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(project.date + "T00:00:00Z"))
    : null;

  const categoryLabel = t(`portfolio.projectCategories.${project.category}`, {
    defaultValue: project.category,
  });

  const { media } = translatedProject;

  return (
    <div className="pf-panel" id={panelId} hidden={!expanded}>
      <div className="pf-panel__inner">
        {showMedia && hasOpened && (
          <div className="pf-panel__media">
            {media.type === "video" ? (
              <video
                controls
                muted
                playsInline
                preload="none"
                poster={media.poster}
                aria-label={media.alt || translatedProject.title}
              >
                <source src={media.src} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img
                src={media.src}
                alt={media.alt || translatedProject.title}
                loading="lazy"
              />
            )}
          </div>
        )}
        <div className="pf-panel__text">
          <p className="pf-panel__meta">
            {showCategory && categoryLabel}
            {showCategory && dateLabel && <> · </>}
            {dateLabel}
          </p>
          <p className="pf-panel__desc">
            {emphasizeMetrics(translatedProject.description)}
          </p>
          {translatedProject.highlights &&
            translatedProject.highlights.length > 0 && (
              <ul className="pf-panel__highlights">
                {translatedProject.highlights.map((highlight, index) => (
                  <li key={index}>{emphasizeMetrics(highlight)}</li>
                ))}
              </ul>
            )}
          <p className="pf-panel__tech">
            {translatedProject.technologies.join(" · ")}
          </p>
          {translatedProject.links.length > 0 && (
            <div className="pf-panel__links">
              {translatedProject.links.map((link, index) => (
                <a
                  key={index}
                  className="pf-btn pf-btn--ghost"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.type === "github" ? (
                    <FaGithub aria-hidden="true" />
                  ) : (
                    <FaExternalLinkAlt aria-hidden="true" />
                  )}
                  <span>
                    {link.type === "github"
                      ? t("portfolio.viewCode")
                      : link.label || t("portfolio.viewLive")}
                  </span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailsPanel;
