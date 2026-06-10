// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.pictureplatform". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "pictureplatform",
  "title": "Picture Playground Platform",
  "category": "website",
  "featured": false,
  "date": "2025-06-01",
  "sortOrder": 3,
  "media": {
    "type": "image",
    "src": "/Portfolio/PPP.webp",
    "alt": "Picture Playground Platform"
  },
  "description": "Platform initially developed for showcasing performance improvements by using Webassembly for computationally expensive tasks, later on added C++, Java and Scala.",
  "highlights": [
    "Comparison of Rust, C++, Java and Scala and JS Performance"
  ],
  "technologies": [
    "React.js",
    "Rust",
    "Webassembly",
    "C++",
    "Java",
    "Scala"
  ],
  "mainTech": "react",
  "links": [
    {
      "type": "live",
      "url": "https://www.cdtio.com/ppp/",
      "label": "View the Website"
    }
  ],
  "tags": [
    "webassembly",
    "performance",
    "polyglot",
    "benchmarks"
  ]
};

export default project;
