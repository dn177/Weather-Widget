// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.inlearning". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "inlearning",
  "title": "InLearning Platform",
  "category": "website",
  "featured": true,
  "date": "2025-06-01",
  "sortOrder": 2,
  "media": {
    "type": "image",
    "src": "/Portfolio/InLearning.webp",
    "alt": "InLearning Platform"
  },
  "description": "Learning platform with materials for the topics: AI / ML, Python, React.js, Rust and Vue.js.",
  "highlights": [
    "In-browser code completion and syntax highlighting",
    "Live preview of compiled code"
  ],
  "technologies": [
    "Vue.js",
    "Pinia",
    "TypeScript",
    "Monaco Editor"
  ],
  "mainTech": "vue",
  "links": [
    {
      "type": "live",
      "url": "https://www.cdtio.com/inlearning/",
      "label": "View the Website"
    }
  ],
  "tags": [
    "learning-platform",
    "education",
    "code-editor"
  ]
};

export default project;
