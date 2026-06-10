// Single source of truth for the languages this site supports.
// Everything language-related (the i18next config, the URL detector, the
// navbar selector) derives from this list — see CODE-REVIEW.md §5c for the
// three-implementations history this file replaces.
export const SUPPORTED_LANGUAGES = ["en", "de", "pl", "es"];

// Normalizes any BCP-47-ish tag ("en-GB", "de_AT", "EN") to a supported
// base code, or null when the language isn't supported.
export const normalizeLanguage = (lng) => {
  if (!lng) return null;
  const base = String(lng).toLowerCase().split(/[-_]/)[0];
  return SUPPORTED_LANGUAGES.includes(base) ? base : null;
};
