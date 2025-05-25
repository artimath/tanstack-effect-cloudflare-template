import { tools } from "@/lib/ai/mcp-tools";

import { createAPIFileRoute } from "@tanstack/react-start/api";
import { createMcpHandler } from "@vercel/mcp-adapter";

const handler = createMcpHandler(
  async (server) => {
    // biome-ignore lint/complexity/noForEach: <explanation>
    tools.forEach((tool) => {
      console.log("🌐 Registering tool", tool.name);
      server.tool(
        tool.name,
        tool.description,
        tool.inputSchema ? tool.inputSchema.shape : {},
        // @ts-expect-error TODO: fix this type
        tool.callback,
      );
    });
  },
  {
    capabilities: {
      tools: {
        ...tools.reduce(
          (acc, tool) => {
            acc[tool.name] = {
              description: tool.description,
            };
            return acc;
          },
          {} as Record<string, { description: string }>,
        ),
      },
    },
  },
  {
    basePath: "/api/ai/mcp",
    verboseLogs: true,
    maxDuration: 60,
  },
);

export const APIRoute = createAPIFileRoute("/api/ai/mcp/$transport")({
  POST: async ({ request }) => {
    return handler(request);
  },
});

// usage in Cursor:
// "remote-example": {
//     "command": "npx",
//     "args": ["mcp-remote", "http://localhost:3000/api/ai/mcp/mcp"]
//   }
