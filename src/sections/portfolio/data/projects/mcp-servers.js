// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.mcp-servers". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "mcp-servers",
  "title": "MCP Server Development",
  "category": "desktop-app",
  "featured": true,
  "date": "2026-02-10",
  "sortOrder": -3.4,
  "closedSource": true,
  "media": {
    "type": "image",
    "src": "/Portfolio/MCPServers.svg",
    "alt": "MCP server development: design-perfect-mcp and adobe-xd-mcp custom tools"
  },
  "description": "Two custom Model Context Protocol servers for pixel-perfect design workflows, plus extensions to several community MCP servers. TypeScript + Node, stdio transport, designed to plug into MCP clients like Claude Desktop and LM Studio.",
  "summary": "Two custom MCP servers for pixel-perfect design workflows, plus extensions to community MCP servers.",
  "stat": { "value": "5", "label": "MCP tools for design workflows" },
  "detailedContent": {
    "overview": "MCP exposes capabilities to LLM clients as discoverable tools. These servers cover a niche the community didn't: tight feedback loops between an LLM-generated UI and a target design, letting you measure, compare, overlay, and extract colours, all from inside the model's tool list.",
    "sections": [
      {
        "title": "design-perfect-mcp",
        "items": [
          "capture-artifact: screenshot an HTML artifact at a configurable viewport for diffing",
          "compare-design: pixel-level diff between an implementation and a target design image with a configurable threshold",
          "extract-measurements: returns computed CSS values (position, dimensions, spacing, typography, colors) for any selector",
          "generate-overlay: alpha-blends the implementation on top of the design for visual debugging",
          "extract-colors: samples exact color values at given coordinates on a design image"
        ]
      },
      {
        "title": "adobe-xd-mcp",
        "items": [
          "Extracts measurements directly from .xd files, with no need to round-trip through PNG exports",
          "Enhanced measurement tooling: positioning, spacing, typography, and component-level metadata",
          "Tested against real client design files (millwood, labor) used during freelance work"
        ]
      },
      {
        "title": "Extensions to Community Servers",
        "items": [
          "Forked and extended chrome-devtools-mcp with additional CSS introspection tools",
          "Patched browser-tools-mcp, webpage-screenshot-mcp, and an automation-mcp variant for personal workflow integration"
        ]
      }
    ]
  },
  "highlights": [
    "design-perfect-mcp: 5 tools for pixel-perfect design implementation",
    "adobe-xd-mcp: extract measurements directly from .xd files",
    "Multiple community MCP servers forked and extended"
  ],
  "technologies": [
    "TypeScript",
    "Node.js",
    "MCP",
    "Puppeteer"
  ],
  "mainTech": "nodejs",
  "links": [],
  "tags": [
    "ai-ml",
    "mcp",
    "ai-tooling",
    "typescript",
    "developer-tools",
    "design-systems"
  ]
};

export default project;
