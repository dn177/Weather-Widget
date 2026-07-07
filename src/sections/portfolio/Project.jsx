import { useTranslation } from "react-i18next";
import { getTranslatedProject } from "./projectTranslations";
import { getTier } from "./portfolioData";
import useModal from "../../hooks/useModal";
import FlagshipCard from "./FlagshipCard";
import IndexCard from "./IndexCard";
import ArchiveRow from "./ArchiveRow";
import CaseStudyModal from "./CaseStudyModal";
import "./portfolio.css";

// Thin dispatcher: picks the card presentation by tier (1 flagship, 2 index,
// 3 archive row; archive projects render as index cards when the archive view
// toggle is set to "cards"). Owns the modal open/close state; the case-study
// modal itself lives in CaseStudyModal and is shared by every tier.
const Project = ({
  project,
  expanded,
  hasOpened,
  onToggle,
  panelId,
  ordinal,
  archiveView = "list",
  plate = false,
  mediaSide = "left",
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
  const links = { github: githubLinks, live: liveLinks, other: otherLinks };
  const cardProps = {
    project,
    translatedProject,
    links,
    onOpenCaseStudy: project.detailedContent ? detailModal.open : null,
    expanded,
    hasOpened,
    onToggle,
    panelId,
    ordinal,
  };

  return (
    <>
      {tier === 1 ? (
        <FlagshipCard {...cardProps} mediaSide={mediaSide} />
      ) : tier === 2 || archiveView === "cards" ? (
        <IndexCard {...cardProps} plate={plate} />
      ) : (
        <ArchiveRow {...cardProps} ordinal={ordinal} />
      )}

      {/* Detailed Case Study Modal */}
      {project.detailedContent && (
        <CaseStudyModal
          key={`detail-modal-${project.id}`}
          translatedProject={translatedProject}
          links={links}
          isOpen={detailModal.isOpen}
          onClose={detailModal.close}
        />
      )}
    </>
  );
};

export default Project;
