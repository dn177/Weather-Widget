// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.mathtron". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "mathtron",
  "title": "Mathtron",
  "category": "desktop-app",
  "featured": false,
  "date": "2024-10-20",
  "sortOrder": 7,
  "media": {
    "type": "video",
    "src": "/Portfolio/Video15.mp4",
    "poster": "/Portfolio/poster/poster11.jpg",
    "alt": "Mathtron LaTeX editor demonstration"
  },
  "description": "Spontaneously made LaTeX editor aiming to give a good experience for taking math notes and doing math exercises on the Desktop.",
  "highlights": [
    "Real-time LaTeX rendering",
    "Intuitive math-focused UI",
    "Cross-platform desktop application"
  ],
  "technologies": [
    "Electron",
    "React",
    "TypeScript",
    "Material-UI"
  ],
  "mainTech": "electron",
  "links": [
    {
      "type": "github",
      "url": "https://github.com/dn177/Mathtron/blob/main/src/renderer/App.tsx",
      "label": "View on Github"
    }
  ],
  "tags": [
    "electron",
    "desktop",
    "latex",
    "education",
    "math"
  ]
};

export default project;
