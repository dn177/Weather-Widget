// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.company-website". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "company-website",
  "title": "Company Website",
  "category": "website",
  "featured": false,
  "date": "2022-03-20",
  "sortOrder": 14,
  "media": {
    "type": "video",
    "src": "/Portfolio/Video8.mp4",
    "poster": "/Portfolio/poster/poster5.jpg",
    "alt": "Company website demonstration"
  },
  "description": "Multi-site company web presence with contact form functionality.",
  "highlights": [
    "Three separate themed websites",
    "PHP contact form functionality",
    "AOS.js animations"
  ],
  "technologies": [
    "Bootstrap",
    "AOS.js",
    "PHP"
  ],
  "mainTech": "php",
  "links": [
    {
      "type": "live",
      "url": "https://strukturia-solar.de",
      "label": "\"Solar\" Website"
    },
    {
      "type": "live",
      "url": "https://www.strukturia-galabau.de",
      "label": "\"Gala\" Website"
    },
    {
      "type": "live",
      "url": "https://www.strukturia-bau.de",
      "label": "\"Bau\" Website"
    }
  ],
  "tags": [
    "bootstrap",
    "company",
    "multi-site"
  ]
};

export default project;
