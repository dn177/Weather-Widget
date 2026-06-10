import { useTranslation } from "react-i18next";
import "./pixelperfect.css";
import AccessibleModal from "../../components/AccessibleModal";
import useModal from "../../hooks/useModal";

// Assets are now in public directory
const PUBLIC_URL = import.meta.env.BASE_URL.replace(/\/$/, "");
const PIXELPERFECT_PATH = PUBLIC_URL + "/Pixelperfect/";
const Design = PIXELPERFECT_PATH + "Design.png";
const Realized = PIXELPERFECT_PATH + "Website.jpeg";
// const Figma = PIXELPERFECT_PATH + "Figma.png";
const AdobeXD = PIXELPERFECT_PATH + "XD.png";
const Chrome = PIXELPERFECT_PATH + "browser1-chrome.png";
// const Firefox = PIXELPERFECT_PATH + "browser2-firefox.jpeg";
// const Safari = PIXELPERFECT_PATH + "browser3-safari.jpeg";

function Pixelperfect() {
  const { t } = useTranslation();
  const designModal = useModal();
  const realizedModal = useModal();

  return (
    <section
      id="pixelperfect"
      style={{
        background: `url(${PUBLIC_URL}/Vitruv.webp) no-repeat 10% 10% / cover`,
      }}
    >
      <div className="container-2 mx-auto">
        <h2 className="text-center text-white mb-headline h1">
          {t("pixelperfect.title")}
        </h2>
        <div className="pixelperfect__grid mx-auto">
          <div className="iconbox">
            <img
              loading="lazy"
              className="img-fluid"
              src={AdobeXD}
              alt="Adobe XD Logo"
            />
            {/* <img className="img-fluid" src={Figma} alt="Figma Logo" /> */}
          </div>

          <div className="iconbox">
            <img
              loading="lazy"
              className="img-fluid"
              src={Chrome}
              alt="Chrome Logo"
            />
            {/* <img src={Firefox} alt="Firefox Logo" />
          <img src={Safari} alt="Safari Logo" /> */}
          </div>

          {/* Design Image - Clickable */}
          <div
            className="holder"
            onClick={designModal.open}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                designModal.open();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={
              t("pixelperfect.viewDesign") || "View design mockup in full size"
            }
          >
            <img
              loading="lazy"
              className="min-vh-50"
              src={Design}
              alt={t("pixelperfect.designAlt") || "Design mockup"}
            />
          </div>

          {/* Realized Website Image - Clickable */}
          <div
            className="holder"
            onClick={realizedModal.open}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                realizedModal.open();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={
              t("pixelperfect.viewRealized") ||
              "View realized website in full size"
            }
          >
            <img
              loading="lazy"
              className="min-vh-50"
              src={Realized}
              alt={t("pixelperfect.realizedAlt") || "Realized website"}
            />
          </div>
        </div>
      </div>

      {/* Design Modal */}
      <AccessibleModal
        isOpen={designModal.isOpen}
        onClose={designModal.close}
        title={t("pixelperfect.designModalTitle") || "Design Mockup"}
        className="pixelperfect-modal"
      >
        <img
          loading="lazy"
          className="img-fluid modal-image"
          src={Design}
          alt={
            t("pixelperfect.designModalAlt") ||
            "Full size design mockup showing the original design concept"
          }
        />
      </AccessibleModal>

      {/* Realized Website Modal */}
      <AccessibleModal
        isOpen={realizedModal.isOpen}
        onClose={realizedModal.close}
        title={t("pixelperfect.realizedModalTitle") || "Realized Website"}
        className="pixelperfect-modal"
      >
        <img
          loading="lazy"
          className="img-fluid modal-image"
          src={Realized}
          alt={
            t("pixelperfect.realizedModalAlt") ||
            "Full size screenshot of the realized website implementation"
          }
        />
      </AccessibleModal>
    </section>
  );
}

export default Pixelperfect;
