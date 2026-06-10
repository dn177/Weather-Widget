// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.nextjs-portfolio". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "nextjs-portfolio",
  "title": "Next.js Portfolio Website",
  "category": "portfolio",
  "featured": true,
  "date": "2024-11-15",
  "sortOrder": 6,
  "media": {
    "type": "image",
    "src": "/Portfolio/NextjsPortfolio.png",
    "alt": "Next.js portfolio website screenshot"
  },
  "description": "Alternative portfolio built with Next.js, featuring static export optimizations.",
  "highlights": [
    "Created custom static export path fix script as byproduct",
    "Optimized for performance and SEO"
  ],
  "technologies": [
    "Next.js",
    "React",
    "JavaScript"
  ],
  "mainTech": "nextjs",
  "links": [
    {
      "type": "github",
      "url": "https://github.com/dn177/Next.js-static-export-path-fix-script",
      "label": "Open the script code in Github"
    },
    {
      "type": "live",
      "url": "https://www.cdtio.com/next",
      "label": "Open the Next Portfolio"
    }
  ],
  "tags": [
    "nextjs",
    "portfolio",
    "static-site",
    "optimization"
  ]
};

export default project;
