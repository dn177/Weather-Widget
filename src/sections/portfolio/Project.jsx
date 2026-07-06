import { useTranslation } from "react-i18next";
import { FaGithub, FaExternalLinkAlt, FaLock } from "react-icons/fa";
import { getTranslatedProject } from "./projectTranslations";
import { getTier } from "./portfolioData";
import AccessibleModal from "../../components/AccessibleModal";
import useModal from "../../hooks/useModal";
import emphasizeMetrics from "./emphasizeMetrics";
import FlagshipCard from "./FlagshipCard";
import IndexCard from "./IndexCard";
import ArchiveRow from "./ArchiveRow";
import "./portfolio.css";

// Thin dispatcher: picks the card presentation by tier (1 flagship, 2 index,
// 3 archive row; archive projects render as index cards when the archive view
// toggle is set to "cards"). Owns the case-study modal, which is shared by
// every tier.
const Project = ({
  project,
  expanded,
  hasOpened,
  onToggle,
  panelId,
  ordinal,
  archiveView = "list",
}) => {
  const { t } = useTranslation();
  const detailModal = useModal();

  // Get translated project data
  const translatedProject = getTranslatedProject(project, t);

  // Separate GitHub links, live links, and other links
  const githubLinks = translatedProject.links.filter(
    (link) => link.type === "github",
  );
  const liveLinks = translatedProject.links.filter(
    (link) => link.type === "live",
  );
  const otherLinks = translatedProject.links.filter(
    (link) => link.type !== "github" && link.type !== "live",
  );

  const tier = getTier(project);
  const cardProps = {
    project,
    translatedProject,
    links: { github: githubLinks, live: liveLinks, other: otherLinks },
    onOpenCaseStudy: project.detailedContent ? detailModal.open : null,
    expanded,
    hasOpened,
    onToggle,
    panelId,
  };

  // Render GitHub links section
  const renderGitHubLinks = () => {
    if (!githubLinks || githubLinks.length === 0) return null;

    return (
      <div className="portfolio__github-section">
        <FaGithub className="portfolio__github-icon" />
        {githubLinks.map((link, index) => (
          <a
            key={index}
            className="portfolio__github-link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("portfolio.viewCode")}
          </a>
        ))}
      </div>
    );
  };

  // Render Live links section
  const renderLiveLinks = () => {
    if (!liveLinks || liveLinks.length === 0) return null;

    return (
      <div className="portfolio__live-section">
        <FaExternalLinkAlt className="portfolio__live-icon" />
        {liveLinks.map((link, index) => (
          <a
            key={index}
            className="portfolio__live-link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label || "View Live"}
          </a>
        ))}
      </div>
    );
  };

  return (
    <>
      {tier === 1 ? (
        <FlagshipCard {...cardProps} />
      ) : tier === 2 || archiveView === "cards" ? (
        <IndexCard {...cardProps} />
      ) : (
        <ArchiveRow {...cardProps} ordinal={ordinal} />
      )}

      {/* Detailed Case Study Modal */}
      {project.detailedContent && (
        <AccessibleModal
          key={`detail-modal-${project.id}`}
          isOpen={detailModal.isOpen}
          onClose={detailModal.close}
          title={translatedProject.title}
          className="portfolio-detail-modal"
          ariaDescribedBy="detail-modal-content"
        >
          {(githubLinks.length > 0 || liveLinks.length > 0) && (
            <div
              className="detail-modal-actions"
              role="toolbar"
              aria-label={`${translatedProject.title} quick actions`}
            >
              {liveLinks.map((link, index) => (
                <a
                  key={`sticky-live-${index}`}
                  className="detail-modal-action detail-modal-action--live"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt
                    aria-hidden="true"
                    className="detail-modal-action__icon"
                  />
                  <span>{link.label || "View Live"}</span>
                </a>
              ))}
              {githubLinks.map((link, index) => (
                <a
                  key={`sticky-gh-${index}`}
                  className="detail-modal-action detail-modal-action--code"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub
                    aria-hidden="true"
                    className="detail-modal-action__icon"
                  />
                  <span>{t("portfolio.viewCode")}</span>
                </a>
              ))}
            </div>
          )}
          <div className="detail-modal-content" id="detail-modal-content">
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

            {/* Overview Section */}
            <div className="detail-modal-overview">
              <h3 className="detail-modal-section-title">
                {t("portfolio.overview") || "Overview"}
              </h3>
              <p className="detail-modal-overview-text">
                {emphasizeMetrics(project.detailedContent.overview)}
              </p>
            </div>

            {/* Closed-source / NDA notice */}
            {project.closedSource && (
              <div className="detail-modal-notice" role="note">
                <FaLock
                  className="detail-modal-notice-icon"
                  aria-hidden="true"
                />
                <span>{t("portfolio.closedSourceNotice")}</span>
              </div>
            )}

            {/* Mini-TOC for long case studies (UX-REVIEW #7) */}
            {project.detailedContent.sections?.length >= 4 && (
              <nav className="detail-modal-toc" aria-label="Case study sections">
                {project.detailedContent.sections.map((section, i) => (
                  <button
                    key={i}
                    type="button"
                    className="detail-modal-toc__chip"
                    onClick={(e) => {
                      // Scroll the modal body directly — scrollIntoView is
                      // unreliable inside this nested scroll container.
                      const target = document.getElementById(
                        `cs-${project.id}-${i}`,
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
            {project.detailedContent.sections?.map((section, sectionIndex) => (
              <div
                key={sectionIndex}
                id={`cs-${project.id}-${sectionIndex}`}
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
                      Your browser does not support the video tag.
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
                {renderLiveLinks()}
                {renderGitHubLinks()}
              </div>
            )}
          </div>
        </AccessibleModal>
      )}
    </>
  );
};

export default Project;
