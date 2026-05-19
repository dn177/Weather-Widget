import { useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Card from "../../components/Card";
import ImageGallery from "react-image-gallery";
import { FaGithub, FaExternalLinkAlt, FaBook } from "react-icons/fa";
import { getTranslatedProject } from "./projectTranslations";
import AccessibleModal from "../../components/AccessibleModal";
import useModal from "../../hooks/useModal";
import "./portfolio.css";

const Project = ({ project, scrollBehavior = "contain" }) => {
  const { t } = useTranslation();
  const gallery = useRef(null);
  const imageModal = useModal();
  const detailModal = useModal();

  // Get translated project data
  const translatedProject = getTranslatedProject(project, t);

  const handleClick = useCallback(() => {
    if (gallery.current) {
      gallery.current.toggleFullScreen();
    }
  }, []);

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
    } else if (Array.isArray(media.src)) {
      // For image galleries (if needed in future)
      return (
        <ImageGallery
          items={media.src}
          additionalClass="galleryimg"
          showThumbnails={false}
          ref={gallery}
          onClick={handleClick}
          lazyLoad={true}
        />
      );
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

  // Render non-GitHub links
  const renderOtherLinks = () => {
    if (!otherLinks || otherLinks.length === 0) return null;

    return (
      <div className="portfolio__project-links">
        {otherLinks.map((link, index) => (
          <a
            key={index}
            className="portfolio__link"
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {link.label}
          </a>
        ))}
      </div>
    );
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
          <h4 className="portfolio__project-title">
            {translatedProject.title}
          </h4>

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

          {renderOtherLinks()}
          {renderLiveLinks()}
          {renderGitHubLinks()}

          {/* Read More button for projects with detailed content */}
          {project.detailedContent && (
            <button
              className="portfolio__read-more-btn"
              onClick={detailModal.open}
              aria-label={`Read detailed case study about ${translatedProject.title}`}
            >
              <FaBook className="portfolio__read-more-icon" />
              {t("portfolio.readMore") || "Read Case Study"}
            </button>
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

            {/* Content Sections */}
            {project.detailedContent.sections?.map((section, sectionIndex) => (
              <div key={sectionIndex} className="detail-modal-section">
                <h3 className="detail-modal-section-title">{section.title}</h3>
                <ul className="detail-modal-section-list">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>{item}</li>
                  ))}
                </ul>
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
