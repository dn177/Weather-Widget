import { normalizeLanguage } from "./languages";

// Custom i18next detector: reads ?lang= from the URL and keeps the param in
// sync when the language changes. It is first in the detection order, so an
// explicit URL always beats the localStorage cache — and region codes like
// "en-GB" normalize to their base language instead of being dropped.
const urlLanguageDetector = {
  name: "urlLanguageDetector",

  lookup() {
    const params = new URLSearchParams(window.location.search);
    return normalizeLanguage(params.get("lang")) || undefined;
  },

  cacheUserLanguage(lng) {
    const url = new URL(window.location);
    if (url.searchParams.get("lang") === lng) return;
    url.searchParams.set("lang", lng);
    // replaceState: language switches shouldn't pile up history entries.
    window.history.replaceState({}, "", url);
  },
};

export default urlLanguageDetector;
