// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.e-commerce". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "e-commerce",
  "title": "E-Commerce",
  "category": "web-app",
  "featured": false,
  "date": "2024-07-20",
  "sortOrder": 10,
  "media": {
    "type": "video",
    "src": "/Portfolio/Video12.mp4",
    "poster": "/Portfolio/poster/poster9.png",
    "alt": "E-commerce platform demonstration"
  },
  "description": "Modern e-commerce platform with secure authentication and REST API.",
  "highlights": [
    "Secure authentication with NextAuth",
    "Pre-hashed passwords with base64 and bcrypt",
    "Modern UI with Tailwind CSS and shadcn/ui",
    "Strapi Backend with REST API"
  ],
  "technologies": [
    "Next.js",
    "NextAuth",
    "React",
    "TypeScript",
    "TailwindCSS",
    "shadcn/ui",
    "Strapi"
  ],
  "mainTech": "nextjs",
  "links": [],
  "tags": [
    "ecommerce",
    "authentication",
    "typescript",
    "tailwind"
  ]
};

export default project;
