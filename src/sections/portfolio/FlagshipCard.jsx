import { useTranslation } from "react-i18next";
import { FaGithub, FaExternalLinkAlt, FaBook } from "react-icons/fa";
import { firstSentence } from "./portfolioData";

// Tier 1: wide horizontal feature card. Spans two grid columns at >=1024px;
// the featured marker is structural (span + static gold top border), no
// gradient borders or glow animations. `mediaSide` flips the pane to the
// right edge on alternating rows so the dark plates frame the grid.
const FlagshipCard = ({
  project,
  translatedProject,
  links,
  onOpenCaseStudy,
  mediaSide = "left",
  ordinal,
}) => {
  const { t } = useTranslation();

  const { media, technologies } = translatedProject;
  const mediaSrc = media.type === "video" ? media.poster : media.src;
  const isSvg = typeof mediaSrc === "string" && mediaSrc.endsWith(".svg");

  const categoryLabel = t(`portfolio.projectCategories.${project.category}`, {
    defaultValue: project.category,
  });
  const year = project.date ? project.date.slice(0, 4) : "";

  // The stat block already carries the headline number, and the hero SVGs
  // repeat it too; skip highlights that restate it so the two findings add
  // information. First sentence only: a bullet cut mid-thought by the
  // 2-line clamp reads worse than a shorter complete one.
  const highlights = translatedProject.highlights || [];
  const nonStatHighlights = translatedProject.stat
    ? highlights.filter((h) => !h.includes(translatedProject.stat.value))
    : highlights;
  const findings = (
    nonStatHighlights.length >= 2 ? nonStatHighlights : highlights
  )
    .slice(0, 2)
    .map(firstSentence);
  const shownTech = technologies.slice(0, 4);
  const extraTech = technologies.length - shownTech.length;

  // At most one link on the flagship face; every link stays available in the
  // case-study modal.
  const firstLink = [...links.live, ...links.github, ...links.other][0];

  return (
    <article
      className={`pf-card pf-flagship${
        mediaSide === "right" ? " pf-flagship--reverse" : ""
      }`}
    >
      <div
        className={`pf-flagship__media${isSvg ? " pf-flagship__media--contain" : ""}`}
      >
        <img src={mediaSrc} alt={media.alt || ""} loading="lazy" />
      </div>
      <div className="pf-flagship__body">
        <div className="pf-kicker-rail">
          <span className="pf-kicker pf-kicker--case">
            <span aria-hidden="true">§ </span>
            Case study
          </span>
          <span className="pf-kicker pf-kicker--meta">
            {categoryLabel} · {year}
          </span>
        </div>
        <h3 className="pf-flagship__title">
          {ordinal && (
            <span className="pf-ordinal" aria-hidden="true">
              {ordinal}
            </span>
          )}
          {translatedProject.title}
        </h3>
        {translatedProject.summary && (
          <p className="pf-flagship__summary">{translatedProject.summary}</p>
        )}
        {findings.length > 0 && (
          <ul className="pf-findings">
            {findings.map((finding, index) => (
              <li key={index}>{finding}</li>
            ))}
          </ul>
        )}
        {translatedProject.stat && (
          <div className="pf-stat">
            <span className="pf-stat__value">{translatedProject.stat.value}</span>
            <span className="pf-stat__label">{translatedProject.stat.label}</span>
          </div>
        )}
        <div className="pf-footer">
          {onOpenCaseStudy && (
            <button
              type="button"
              className="pf-btn pf-btn--primary"
              onClick={onOpenCaseStudy}
            >
              <FaBook aria-hidden="true" />
              <span>{t("portfolio.readMore")}</span>
            </button>
          )}
          {firstLink && (
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
          )}
          {project.closedSource && (
            <span className="pf-badge">{t("portfolio.closedSource")}</span>
          )}
          <span className="pf-techline">
            {shownTech.join(" · ")}
            {extraTech > 0 && ` · +${extraTech}`}
          </span>
        </div>
      </div>
    </article>
  );
};

export default FlagshipCard;
