// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.release-radar". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "release-radar",
  "title": "Release Reader",
  "category": "web-app",
  "featured": false,
  "date": "2025-12-07",
  "sortOrder": -2,
  "media": {
    "type": "image",
    "src": "/Portfolio/ReleaseRadar.jpg",
    "alt": "Release Reader - GitHub Release Notes Tool"
  },
  "description": "A tool to find relevant changes in GitHub release notes. Filter releases by version range, keywords, and display options.",
  "highlights": [
    "Version range filtering to focus on specific releases",
    "Keyword-based filtering for breaking changes, deprecations, and more",
    "Customizable display options with context lines"
  ],
  "technologies": [
    "React",
    "TypeScript",
    "GitHub API"
  ],
  "mainTech": "react",
  "links": [
    {
      "type": "live",
      "url": "https://www.cdtio.com/release/",
      "label": "Open Release Reader"
    }
  ],
  "tags": [
    "github",
    "release-notes",
    "developer-tools",
    "productivity"
  ]
};

export default project;
