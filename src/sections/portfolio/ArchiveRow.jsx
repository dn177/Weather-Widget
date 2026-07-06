import { useTranslation } from "react-i18next";
import { FaGithub, FaExternalLinkAlt, FaChevronDown } from "react-icons/fa";
import ProjectDetailsPanel from "./ProjectDetailsPanel";

// Tier 3: compact ledger row. The title is an h3-wrapped disclosure button
// with a stretched hit area over the row head; aside links keep their own
// z-index so they stay independently clickable.
const ArchiveRow = ({
  project,
  translatedProject,
  links,
  expanded,
  hasOpened,
  onToggle,
  panelId,
  ordinal,
}) => {
  const { t } = useTranslation();

  const year = project.date ? project.date.slice(0, 4) : "";
  const asideLinks = [...links.github, ...links.live].slice(0, 2);

  return (
    <li className="pf-row">
      <div className="pf-row__head">
        <span className="pf-row__ordinal" aria-hidden="true">
          {ordinal}
        </span>
        <h3 className="pf-row__heading">
          <button
            type="button"
            className="pf-row__toggle"
            aria-expanded={expanded}
            aria-controls={panelId}
            onClick={() => onToggle(project.id)}
          >
            {translatedProject.title}
          </button>
        </h3>
        <span className="pf-row__summary">{translatedProject.summary}</span>
        <span className="pf-row__year">{year}</span>
        <span className="pf-row__links">
          {asideLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                link.type === "github"
                  ? `${translatedProject.title}: ${t("portfolio.viewCode")}`
                  : `${translatedProject.title}: ${link.label || t("portfolio.viewLive")}`
              }
            >
              {link.type === "github" ? (
                <FaGithub aria-hidden="true" />
              ) : (
                <FaExternalLinkAlt aria-hidden="true" />
              )}
            </a>
          ))}
        </span>
        <FaChevronDown
          aria-hidden="true"
          className={`pf-chevron${expanded ? " pf-chevron--open" : ""}`}
        />
      </div>
      <ProjectDetailsPanel
        project={project}
        translatedProject={translatedProject}
        panelId={panelId}
        expanded={expanded}
        hasOpened={hasOpened}
      />
    </li>
  );
};

export default ArchiveRow;
