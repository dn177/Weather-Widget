// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.private-blog". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "private-blog",
  "title": "Private Blog",
  "category": "web-app",
  "featured": false,
  "date": "2024-09-15",
  "sortOrder": 8,
  "media": {
    "type": "video",
    "src": "/Portfolio/Video10.mp4",
    "poster": "/Portfolio/poster/poster12.png",
    "alt": "Private blog demonstration"
  },
  "description": "Selfmade Blog with authentication and rich text editing capabilities.",
  "highlights": [
    "Full authentication system with NextAuth",
    "Rich text editor with syntax highlighting",
    "Real-time data updates with SWR"
  ],
  "technologies": [
    "React",
    "Next.js",
    "NextAuth",
    "Node.js",
    "MongoDB",
    "Prisma",
    "Firebase",
    "Quill",
    "Highlight.js",
    "SWR"
  ],
  "mainTech": "nextjs",
  "links": [
    {
      "type": "article",
      "url": "https://cddm.medium.com",
      "label": "My Medium Blog Posts"
    }
  ],
  "tags": [
    "blog",
    "fullstack",
    "authentication",
    "database"
  ]
};

export default project;
