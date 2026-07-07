// Shared vitest setup (vite.config.js `test.setupFiles`). Runs for every
// test file, including the node-environment data tests, so everything here
// must be safe without a DOM.
import { afterEach } from "vitest";
import "@testing-library/jest-dom/vitest";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslations from "../i18n/locales/en.json";

// Minimal i18n instance for component tests. Deliberately NOT src/i18n/i18n.js:
// that module wires the browser language detector (localStorage, navigator,
// URL) and mutates document.documentElement on import, none of which belongs
// in tests. Real English resources keep assertions honest ("3 entries",
// "Read Case Study") instead of echoing raw keys.
i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
  resources: { en: { translation: enTranslations } },
});

// Testing-library's automatic cleanup hooks into a GLOBAL afterEach, which
// this project doesn't have (vitest globals are off; tests import from
// "vitest" explicitly), so successive renders would pile up in one document.
// Register it by hand, and only where a DOM exists.
if (typeof window !== "undefined") {
  const { cleanup } = await import("@testing-library/react");
  afterEach(cleanup);
}

// jsdom ships no IntersectionObserver. useInView (weather appendix lazy
// mount) needs the constructor to exist; a stub that never intersects keeps
// below-the-fold widgets unmounted, which is exactly what the grid tests
// want (no weather fetches).
if (typeof window !== "undefined" && !window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  };
}
