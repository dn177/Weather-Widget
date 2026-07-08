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
  year,
  categoryLabel,
  firstLink,
  onOpenCaseStudy,
  mediaSide = "left",
  ordinal,
}) => {
  const { t } = useTranslation();

  const { media, technologies } = translatedProject;
  const isVideo = media.type === "video";
  const mediaSrc = isVideo ? media.poster : media.src;
  const isSvg = typeof mediaSrc === "string" && mediaSrc.endsWith(".svg");

  // The stat block already carries the headline number, and the hero SVGs
  // repeat it too; skip highlights that restate it so the two findings add
  // information. First sentence only: a bullet cut mid-thought by the
  // 2-line clamp reads worse than a shorter complete one.
  const highlights = translatedProject.highlights || [];
  const nonStatHighlights = translatedProject.stat
    ? highlights.filter((h) => !h.includes(translatedProject.stat.value))
    : highlights;
  // Three findings: the floated-figure layout reclaims the old media
  // column, so the card face carries one more piece of evidence.
  const findings = (
    nonStatHighlights.length >= 2 ? nonStatHighlights : highlights
  )
    .slice(0, 3)
    .map(firstSentence);
  const shownTech = technologies.slice(0, 4);
  const extraTech = technologies.length - shownTech.length;

  // At most one link on the flagship face (the firstLink prop from Project);
  // every link stays available in the case-study modal.
  return (
    <article
      className={`pf-card pf-flagship${
        mediaSide === "right" ? " pf-flagship--reverse" : ""
      }`}
    >
      <div className="pf-flagship__body">
        <div className="pf-kicker-rail">
          <span className="pf-kicker pf-kicker--case">
            <span aria-hidden="true">§ </span>
            {t("portfolio.caseStudyKicker")}
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
        {/* Floated figure: the title runs full width above, the standfirst
            and findings wrap around the poster, and the footer clears. */}
        <figure
          className={`pf-flagship__media${isSvg ? " pf-flagship__media--contain" : ""}`}
        >
          {isVideo ? (
            // A real player on the card face: the poster stands in until the
            // viewer presses play, then the demo runs with full controls.
            <video
              src={media.src}
              poster={media.poster}
              controls
              playsInline
              preload="metadata"
              aria-label={media.alt || undefined}
            />
          ) : (
            <img src={mediaSrc} alt={media.alt || ""} loading="lazy" />
          )}
        </figure>
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
