// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.markdown-downloader". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "markdown-downloader",
  "title": "Markdown Downloader - Raycast Extension",
  "category": "desktop-app",
  "featured": false,
  "date": "2025-07-06",
  "sortOrder": -1,
  "media": {
    "type": "image",
    "src": "/Portfolio/MarkdownDown.png",
    "alt": "Markdown Downloader Raycast Extension"
  },
  "description": "A powerful Raycast extension that converts webpages to clean markdown files with advanced content extraction, image downloading, and customizable output options. Built for efficient knowledge management and content archiving.",
  "summary": "A Raycast extension that converts webpages to clean markdown files, with image downloading built in.",
  "highlights": [
    "Intelligent content extraction with regex-based HTML parsing",
    "Local image downloading with automatic path conversion",
    "Medium-specific content cleanup and optimization",
    "Affiliate link cleaning for cleaner markdown output",
    "Native macOS folder picker with recent folders dropdown",
    "Customizable output settings and auto-filename generation",
    "Support for metadata headers and title insertion"
  ],
  "technologies": [
    "TypeScript",
    "React",
    "Raycast API",
    "Node.js",
    "Turndown",
    "fs-extra"
  ],
  "mainTech": "react",
  "links": [
    {
      "type": "github",
      "url": "https://github.com/dn177/MarkdownDownloader",
      "label": "View on GitHub"
    }
  ],
  "tags": [
    "raycast-extension",
    "markdown",
    "content-extraction",
    "typescript",
    "productivity",
    "web-scraping",
    "macos"
  ]
};

export default project;
