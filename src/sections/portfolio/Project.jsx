import { memo, useMemo } from "react";
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
// Exported wrapped in React.memo so toggling one card's disclosure in
// Projects does not re-render its ~30 siblings; language switches still
// reach every card because useTranslation swaps its t state on
// languageChanged inside each instance, bypassing the memo.
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

  // Translate once per project/language, not on every disclosure re-render.
  // t stands in for the language: react-i18next swaps the t state on its
  // languageChanged binding (and on resource loads), so a language switch
  // re-renders this card past the memo AND re-derives here via the new t.
  const { translatedProject, links } = useMemo(() => {
    const translated = getTranslatedProject(project, t);

    // Separate GitHub links, live links, and other links
    return {
      translatedProject: translated,
      links: {
        github: translated.links.filter((link) => link.type === "github"),
        live: translated.links.filter((link) => link.type === "live"),
        other: translated.links.filter(
          (link) => link.type !== "github" && link.type !== "live",
        ),
      },
    };
  }, [project, t]);

  const tier = getTier(project);
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

// Shallow-compare props: project comes by reference from the memoized
// projects array in Portfolio, onToggle is a stable useCallback, and the
// rest are primitives, so only the toggled card re-renders.
export default memo(Project);
