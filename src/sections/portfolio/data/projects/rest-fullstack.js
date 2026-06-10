// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.rest-fullstack". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "rest-fullstack",
  "title": "REST Fullstack Code Example",
  "category": "web-app",
  "featured": false,
  "date": "2024-08-10",
  "sortOrder": 9,
  "media": {
    "type": "video",
    "src": "/Portfolio/Video14.mp4",
    "poster": "/Portfolio/poster/poster10.png",
    "alt": "REST API fullstack demonstration"
  },
  "description": "Full-stack application demonstrating clean REST API architecture.",
  "highlights": [
    "Clean REST API design",
    "TypeScript for type safety",
    "SQLite3 for data persistence"
  ],
  "technologies": [
    "React",
    "TypeScript",
    "Express.js",
    "Node.js",
    "SQLite3"
  ],
  "mainTech": "nodejs",
  "links": [
    {
      "type": "github",
      "url": "https://github.com/dn177/BasicREST/tree/main",
      "label": "View on Github"
    }
  ],
  "tags": [
    "fullstack",
    "rest-api",
    "typescript",
    "database"
  ]
};

export default project;
