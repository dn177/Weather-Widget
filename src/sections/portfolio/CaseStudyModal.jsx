import { useTranslation } from "react-i18next";
import { FaGithub, FaExternalLinkAlt, FaLock } from "react-icons/fa";
import AccessibleModal from "../../components/AccessibleModal";
import emphasizeMetrics from "./emphasizeMetrics";

// One live/github anchor row, shared by the sticky toolbar and the bottom
// links section. Both map the same links to the same href/target/rel; only
// the wrapper, class names, and icon placement differ, so `variant` picks
// the shell ("toolbar" puts an icon inside each anchor, "section" puts one
// icon before the anchors).
const CaseStudyLinkRow = ({ variant, type, links }) => {
  const { t } = useTranslation();

  if (!links || links.length === 0) return null;

  const Icon = type === "github" ? FaGithub : FaExternalLinkAlt;
  const labelFor = (link) =>
    type === "github"
      ? t("portfolio.viewCode")
      : link.label || t("portfolio.viewLive");

  if (variant === "toolbar") {
    const modifier = type === "github" ? "code" : "live";
    const keyPrefix = type === "github" ? "sticky-gh" : "sticky-live";
    return links.map((link, index) => (
      <a
        key={`${keyPrefix}-${index}`}
        className={`detail-modal-action detail-modal-action--${modifier}`}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon aria-hidden="true" className="detail-modal-action__icon" />
        <span>{labelFor(link)}</span>
      </a>
    ));
  }

  return (
    <div className={`portfolio__${type}-section`}>
      <Icon className={`portfolio__${type}-icon`} />
      {links.map((link, index) => (
        <a
          key={index}
          className={`portfolio__${type}-link`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {labelFor(link)}
        </a>
      ))}
    </div>
  );
};

// Detailed case-study modal, shared by every tier's card. Owns the whole
// modal body (hero, tech pills, overview, TOC, sections, link rows); the
// open/close state stays with the parent's useModal instance.
const CaseStudyModal = ({ translatedProject, links, isOpen, onClose }) => {
  const { t, i18n } = useTranslation();

  const githubLinks = links.github;
  const liveLinks = links.live;
  const { detailedContent } = translatedProject;
  // Per-project id: the dialog description should point at the short
  // overview paragraph, not the whole (often thousands-of-words) case
  // study, and must stay unique if several project cards each mount their
  // own modal instance.
  const overviewTextId = `detail-modal-overview-text-${translatedProject.id}`;

  return (
    <AccessibleModal
      isOpen={isOpen}
      onClose={onClose}
      title={translatedProject.title}
      className="portfolio-detail-modal"
      ariaDescribedBy={overviewTextId}
      headerKicker={t("portfolio.caseStudyKicker")}
    >
      {(githubLinks.length > 0 || liveLinks.length > 0) && (
        <div
          className="detail-modal-actions"
          role="toolbar"
          aria-label={t("a11y.quickActions", {
            title: translatedProject.title,
          })}
        >
          <CaseStudyLinkRow variant="toolbar" type="live" links={liveLinks} />
          <CaseStudyLinkRow
            variant="toolbar"
            type="github"
            links={githubLinks}
          />
        </div>
      )}
      <div className="detail-modal-content">
        {/* Hero Image */}
        <div className="detail-modal-hero">
          <img
            src={
              translatedProject.media.type === "video"
                ? translatedProject.media.poster
                : translatedProject.media.src
            }
            alt={translatedProject.media.alt || translatedProject.title}
            className="detail-modal-image"
          />
        </div>

        {/* Tech Stack Pills */}
        <div className="detail-modal-tech">
          {translatedProject.technologies.map((tech, index) => (
            <span key={index} className="tech-pill tech-pill--modal">
              {tech}
            </span>
          ))}
        </div>

        {/* English case-study notice */}
        {i18n.resolvedLanguage !== "en" && (
          <p className="detail-modal-lang-note">
            {t("portfolio.caseStudyEnglishNote")}
          </p>
        )}

        {/* Overview Section */}
        <div className="detail-modal-overview">
          <h3 className="detail-modal-section-title">
            {t("portfolio.overview") || "Overview"}
          </h3>
          <p className="detail-modal-overview-text" id={overviewTextId}>
            {emphasizeMetrics(detailedContent.overview)}
          </p>
        </div>

        {/* Closed-source / NDA notice */}
        {translatedProject.closedSource && (
          <div className="detail-modal-notice" role="note">
            <FaLock className="detail-modal-notice-icon" aria-hidden="true" />
            <span>{t("portfolio.closedSourceNotice")}</span>
          </div>
        )}

        {/* Mini-TOC for long case studies (UX-REVIEW #7) */}
        {detailedContent.sections?.length >= 4 && (
          <nav
            className="detail-modal-toc"
            aria-label={t("a11y.caseStudySections")}
          >
            {detailedContent.sections.map((section, i) => (
              <button
                key={i}
                type="button"
                className="detail-modal-toc__chip"
                onClick={(e) => {
                  // Scroll the modal body directly; scrollIntoView is
                  // unreliable inside this nested scroll container.
                  const target = document.getElementById(
                    `cs-${translatedProject.id}-${i}`,
                  );
                  const scroller = e.currentTarget.closest(".modal-body");
                  if (!target || !scroller) return;
                  scroller.scrollTo({
                    top:
                      scroller.scrollTop +
                      target.getBoundingClientRect().top -
                      scroller.getBoundingClientRect().top -
                      12,
                    behavior: "smooth",
                  });
                }}
              >
                <span aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {section.title.split(": ")[0]}
              </button>
            ))}
          </nav>
        )}

        {/* Content Sections */}
        {detailedContent.sections?.map((section, sectionIndex) => (
          <div
            key={sectionIndex}
            id={`cs-${translatedProject.id}-${sectionIndex}`}
            className="detail-modal-section"
            style={{ "--cs-i": sectionIndex }}
          >
            <h3 className="detail-modal-section-title">{section.title}</h3>
            <ul className="detail-modal-section-list">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex}>{emphasizeMetrics(item)}</li>
              ))}
            </ul>
            {section.video && (
              <figure className="detail-modal-figure">
                <video
                  className="detail-modal-section-image"
                  controls
                  muted
                  playsInline
                  loop
                  preload="none"
                  poster={section.videoPoster}
                  aria-label={section.videoAlt || section.title}
                >
                  <source src={section.video} type="video/mp4" />
                  {t("common.videoUnsupported")}
                </video>
                {section.videoAlt && (
                  <figcaption className="detail-modal-figcaption">
                    {section.videoAlt}
                  </figcaption>
                )}
              </figure>
            )}
            {section.image && (
              <figure className="detail-modal-figure">
                <img
                  src={section.image}
                  alt={section.imageAlt || section.title}
                  className="detail-modal-section-image"
                  loading="lazy"
                />
                {section.imageAlt && (
                  <figcaption className="detail-modal-figcaption">
                    {section.imageAlt}
                  </figcaption>
                )}
              </figure>
            )}
          </div>
        ))}

        {/* Links Section */}
        {(githubLinks.length > 0 || liveLinks.length > 0) && (
          <div className="detail-modal-links">
            <CaseStudyLinkRow variant="section" type="live" links={liveLinks} />
            <CaseStudyLinkRow
              variant="section"
              type="github"
              links={githubLinks}
            />
          </div>
        )}
      </div>
    </AccessibleModal>
  );
};

export default CaseStudyModal;
