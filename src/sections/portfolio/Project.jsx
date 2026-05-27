import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/Card";
import { FaGithub, FaExternalLinkAlt, FaBook, FaChevronRight, FaLock } from "react-icons/fa";
import { getTranslatedProject } from "./projectTranslations";
import AccessibleModal from "../../components/AccessibleModal";
import useModal from "../../hooks/useModal";
import "./portfolio.css";

const Project = ({ project, scrollBehavior = "contain" }) => {
  const { t } = useTranslation();
  const imageModal = useModal();
  const detailModal = useModal();

  // Get translated project data
  const translatedProject = getTranslatedProject(project, t);

  const handleImageFullscreen = useCallback((e) => {
    e.currentTarget.requestFullscreen({ navigationUI: "show" });
  }, []);

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

  // Determine if this is an image project (all image projects get modal on click)
  const isImageProject = translatedProject.media.type === "image";

  // Handle image click for image projects
  const handleImageClick = useCallback(
    (e) => {
      if (isImageProject) {
        e.preventDefault();
        imageModal.open();
      }
    },
    [isImageProject, imageModal],
  );

  // Render media based on type
  const renderMedia = () => {
    const { media } = translatedProject;

    if (media.type === "video") {
      const videoElement = (
        <video
          muted
          playsInline
          controls
          loop
          className="videoresource"
          preload="none"
          poster={media.poster}
          aria-label={media.alt || `Video for ${translatedProject.title}`}
        >
          <source src={media.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );

      // Wrap video in clickable container if it's an image project
      if (isImageProject) {
        return (
          <div
            className="portfolio__clickable-image"
            onClick={handleImageClick}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleImageClick(e);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`View ${translatedProject.title} details`}
          >
            {videoElement}
          </div>
        );
      }

      return videoElement;
    } else {
      // Single image
      return (
        <div
          className={isImageProject ? "portfolio__clickable-image" : ""}
          onClick={isImageProject ? handleImageClick : undefined}
          onKeyDown={
            isImageProject
              ? (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleImageClick(e);
                  }
                }
              : undefined
          }
          role={isImageProject ? "button" : undefined}
          tabIndex={isImageProject ? 0 : undefined}
          aria-label={
            isImageProject
              ? `View ${translatedProject.title} in full size`
              : undefined
          }
        >
          <img
            src={media.src}
            alt={media.alt || translatedProject.title}
            onClick={!isImageProject ? handleImageFullscreen : undefined}
            loading="lazy"
            width="100%"
            height="auto"
          />
        </div>
      );
    }
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
      <Card
        className={`portfolio__project ${project.featured ? "portfolio__project--featured" : ""}`}
        style={{ "--overscroll-behavior": scrollBehavior }}
      >
        <div className="portfolio__project-image">{renderMedia()}</div>
        <div className="portfolio__project-text">
          <h3 className="portfolio__project-title">
            {translatedProject.title}
          </h3>

          {/* Compact action row — kept directly under the title so CTAs are
              visible without scrolling the card. */}
          {(project.detailedContent ||
            liveLinks.length > 0 ||
            githubLinks.length > 0 ||
            otherLinks.length > 0) && (
            <div
              className="portfolio__card-actions"
              role="group"
              aria-label={`${translatedProject.title} actions`}
            >
              {project.detailedContent && (
                <button
                  type="button"
                  className="portfolio__card-action portfolio__card-action--primary"
                  onClick={detailModal.open}
                  aria-label={`Read detailed case study about ${translatedProject.title}`}
                >
                  <FaBook
                    aria-hidden="true"
                    className="portfolio__card-action__icon"
                  />
                  <span>{t("portfolio.readMore") || "Read Case Study"}</span>
                  <FaChevronRight
                    aria-hidden="true"
                    className="portfolio__card-action__chevron"
                  />
                </button>
              )}
              {liveLinks.map((link, index) => (
                <a
                  key={`top-live-${index}`}
                  className="portfolio__card-action portfolio__card-action--secondary"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaExternalLinkAlt
                    aria-hidden="true"
                    className="portfolio__card-action__icon"
                  />
                  <span>{link.label || "View Live"}</span>
                </a>
              ))}
              {githubLinks.map((link, index) => (
                <a
                  key={`top-gh-${index}`}
                  className="portfolio__card-action portfolio__card-action--secondary"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub
                    aria-hidden="true"
                    className="portfolio__card-action__icon"
                  />
                  <span>{t("portfolio.viewCode")}</span>
                </a>
              ))}
              {otherLinks.map((link, index) => (
                <a
                  key={`top-other-${index}`}
                  className="portfolio__card-action portfolio__card-action--secondary"
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          )}

          {/* Tech stack as oval buttons */}
          <div className="portfolio__tech-stack">
            {translatedProject.technologies.map((tech, index) => (
              <span key={index} className="tech-pill">
                {tech}
              </span>
            ))}
          </div>

          <p className="portfolio__project-desc">
            {translatedProject.description}
          </p>

          {translatedProject.highlights &&
            translatedProject.highlights.length > 0 && (
              <ul className="portfolio__highlights">
                {translatedProject.highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            )}
        </div>
      </Card>

      {/* Modal for image projects */}
      {isImageProject && (
        <AccessibleModal
          key={`modal-${project.id}`}
          isOpen={imageModal.isOpen}
          onClose={imageModal.close}
          title={translatedProject.title}
          className="portfolio-image-modal"
        >
          <img
            src={
              translatedProject.media.type === "video"
                ? translatedProject.media.poster
                : translatedProject.media.src
            }
            alt={translatedProject.media.alt || translatedProject.title}
            className="modal-image"
          />
          <div className="modal-project-info">
            <p className="modal-description">{translatedProject.description}</p>
            {translatedProject.highlights &&
              translatedProject.highlights.length > 0 && (
                <div className="modal-highlights">
                  <h3>{t("portfolio.highlights") || "Key Features"}</h3>
                  <ul>
                    {translatedProject.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            {(githubLinks.length > 0 || liveLinks.length > 0) && (
              <div className="modal-links">
                {renderLiveLinks()}
                {renderGitHubLinks()}
              </div>
            )}
          </div>
        </AccessibleModal>
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
                {project.detailedContent.overview}
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

            {/* Content Sections */}
            {project.detailedContent.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="detail-modal-section">
                <h3 className="detail-modal-section-title">{section.title}</h3>
                <ul className="detail-modal-section-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
                {section.image && (
                  <img
                    src={section.image}
                    alt={section.imageAlt || section.title}
                    className="detail-modal-section-image"
                    loading="lazy"
                  />
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
