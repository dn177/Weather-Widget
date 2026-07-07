import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "../sections/navbar/Navbar";

const AppLayout = () => {
  const { t } = useTranslation();

  return (
    <div>
      <a href="#main-content" className="skip-link">
        {t("a11y.skipToContent")}
      </a>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
