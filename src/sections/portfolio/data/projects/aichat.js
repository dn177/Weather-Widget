// Auto-split from portfolioData.js (2026-06-10).
// Card fields (title, description, highlights, link labels) are the
// English source text; locale overrides live in src/i18n/locales/*.json
// under "projects.aichat". Case-study (detailedContent) text is
// English by design for now.
const project = {
  "id": "aichat",
  "title": "AIChat: On-Premise LLM Chat Frontend",
  "category": "web-app",
  "featured": true,
  "date": "2026-03-20",
  "sortOrder": -3.6,
  "closedSource": true,
  "media": {
    "type": "image",
    "src": "/Portfolio/AIChat.gif",
    "alt": "AIChat: React 19 LLM chat client with LM Studio + MCP integration"
  },
  "description": "A self-hosted chat frontend for LM Studio endpoints with first-class MCP tool-calling. Streaming SSE with proper state separation between pre-tool narration and final answer. Runs over Tailscale to a private DGX Spark.",
  "detailedContent": {
    "overview": "React 19 + TypeScript chat client built specifically for self-hosted LLM workflows. Speaks LM Studio's native /api/v1/chat with full MCP integration support, falls back to the OpenAI-compatible /v1/chat/completions endpoint when MCP isn't needed. The non-trivial work sits in the streaming layer.",
    "sections": [
      {
        "title": "Streaming SSE State Machine",
        "items": [
          "Custom async generator parses the named SSE event format: message.start, message.delta, tool_call.start/arguments/success/failure, reasoning.delta, chat.end",
          "State machine distinguishes pre-tool narration (the model thinking out loud before calling a tool) from the final answer text after tool calls finish",
          "Falls through to OpenAI-style data: chunks if no event: prefix is present, so mixed-spec endpoints are handled gracefully"
        ]
      },
      {
        "title": "MCP Integration",
        "items": [
          "Plugin shorthand (named server ID) and full ephemeral_mcp config with server_url + allowed_tools filtering",
          "Multi-turn context is stateful server-side via previous_response_id; only the latest user message is sent each round",
          "Reasoning, tool start, tool arguments, tool success, and tool failure all surface as distinct events in the UI"
        ]
      },
      {
        "title": "Self-Hosted Posture",
        "items": [
          "Connects to an OpenAI-compatible endpoint at runtime. The model list is auto-discovered via /v1/models",
          "Designed to talk to a DGX Spark over Tailscale, with no third-party API in the loop",
          "Settings include temperature, max tokens, system prompt, theme, and MCP integration list"
        ]
      }
    ]
  },
  "highlights": [
    "Streaming SSE state machine separating narration / tool calls / final answer",
    "First-class MCP integration with plugin + ephemeral_mcp support",
    "Runs over Tailscale to a self-hosted DGX Spark (no cloud dependency)"
  ],
  "technologies": [
    "React 19",
    "TypeScript",
    "Vite 6",
    "Tailwind 4",
    "MCP",
    "LM Studio"
  ],
  "mainTech": "react",
  "links": [],
  "tags": [
    "ai-ml",
    "llm",
    "ai",
    "react",
    "mcp",
    "streaming",
    "on-premise",
    "tailscale"
  ]
};

export default project;
