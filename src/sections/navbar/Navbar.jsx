import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguageSelector from "./LanguageSelector";
import "./navbar.css";

const Navbar = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  // Close menu when a link is tapped
  const handleLinkClick = () => setOpen(false);

  // Close menu on Escape and on resize up to desktop
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => {
      if (window.innerWidth >= 992) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <nav
      id="navbar"
      className={`navbar fixed-top navbar-expand-lg navbar-dark bg-dark${
        open ? " navbar--open" : ""
      }`}
    >
      <a
        className="navbar-brand"
        href="https://www.cdtio.com/react/"
        onClick={handleLinkClick}
      >
        {t("navbar.brand")}
      </a>
      <button
        className="navbar-toggler"
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-controls="navbarSupportedContent"
        aria-expanded={open}
        aria-label={t("a11y.toggleNavigation")}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        className={`collapse navbar-collapse ml-2${open ? " show" : ""}`}
        id="navbarSupportedContent"
      >
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <a
              className="nav-link text-white"
              href="#portfolio"
              onClick={handleLinkClick}
            >
              {t("navbar.portfolio")},
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-white"
              href="#pixelperfect"
              onClick={handleLinkClick}
            >
              {t("navbar.pixelperfect")},
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link text-white"
              href="#contact"
              onClick={handleLinkClick}
            >
              {t("navbar.contact")}
            </a>
          </li>
        </ul>
        <LanguageSelector />
      </div>
    </nav>
  );
};

export default Navbar;
