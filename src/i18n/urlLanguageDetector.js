// Custom language detector for URL parameters
const urlLanguageDetector = {
  name: 'urlLanguageDetector',
  lookup() {
    // Get language from URL parameter
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    
    // Return the language if it's valid (en or de)
    if (lang && ['en', 'de'].includes(lang)) {
      return lang;
    }
    
    return null;
  },
  cacheUserLanguage(lng) {
    // Update URL with the selected language
    const url = new URL(window.location);
    url.searchParams.set('lang', lng);
    
    // Update URL without reloading the page
    window.history.replaceState({}, '', url);
  }
};

export default urlLanguageDetector;