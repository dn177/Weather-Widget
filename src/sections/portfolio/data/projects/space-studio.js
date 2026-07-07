// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.space-studio". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "space-studio",
  "title": "Space Studio - Interactive Rocket Science Education",
  "category": "web-app",
  "featured": true,
  "date": "2025-06-12",
  "sortOrder": -3.8,
  "media": {
    "type": "video",
    "src": "/spacestudio/space-studio-tour.mp4",
    "poster": "/spacestudio/poster.jpg",
    "alt": "Space Studio interactive rocket science education platform"
  },
  "description": "An interactive web application for teaching rocket science and engineering concepts through engaging 3D simulations, hands-on learning experiences, and progressive lessons from basic rocketry to advanced orbital mechanics.",
  "summary": "An interactive web app teaching rocket science through 3D simulations and progressive lessons.",
  "stat": { "value": "10-50x", "label": "physics speedup via WebAssembly" },
  "highlights": [
    "60+ interactive 3D simulations including rocket launches, orbital mechanics, and black hole physics",
    "WebAssembly-powered physics calculations achieving 10-50x performance improvements",
    "24 comprehensive lessons covering topics from Newton's Laws to advanced propulsion systems",
    "Real-time physics engine with Matter.js for realistic simulations",
    "Gamification features including progress tracking, achievements, and assessments"
  ],
  "technologies": [
    "React",
    "TypeScript",
    "Three.js",
    "React Three Fiber",
    "WebAssembly",
    "Rust",
    "Matter.js",
    "Tailwind CSS",
    "Framer Motion",
    "Vite"
  ],
  "mainTech": "react",
  "links": [
    {
      "type": "live",
      "url": "https://www.cdtio.com/space/",
      "label": "Launch Space Studio"
    }
  ],
  "tags": [
    "education",
    "3d-graphics",
    "physics-simulation",
    "webassembly",
    "interactive",
    "typescript",
    "space-science",
    "gamification"
  ]
};

export default project;
