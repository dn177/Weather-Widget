// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.contao-website". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "contao-website",
  "title": "Example Contao Website",
  "category": "website",
  "featured": false,
  "date": "2024-12-01",
  "sortOrder": 1,
  "media": {
    "type": "video",
    "src": "/Portfolio/Video16.mp4",
    "poster": "/Portfolio/poster/poster13.png",
    "alt": "Contao CMS website demonstration"
  },
  "description": "Contao CMS with special contact form implementation using grid-template-areas.",
  "highlights": [
    "Background colors outside of container implemented with pseudo elements, not negative margins",
    "Contact form implemented using grid-template-areas"
  ],
  "technologies": [
    "PHP",
    "Contao CMS",
    "jQuery",
    "LESS"
  ],
  "mainTech": "php",
  "links": [
    {
      "type": "live",
      "url": "https://fewo-riesserbaur.de",
      "label": "View the Website"
    }
  ],
  "tags": [
    "cms",
    "php",
    "responsive",
    "form-design"
  ]
};

export default project;
