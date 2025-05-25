import { tools } from "@/lib/ai/mcp-tools";
import { auth } from "@/lib/auth/auth";

import { createAPIFileRoute } from "@tanstack/react-start/api";

import { createMcpHandler } from "@vercel/mcp-adapter";

const handler = async (req: Request) => {
  const session = await auth.api.getMcpSession({
    headers: req.headers,
  });

  // if (!session) {
  //   console.log("🔑 No session");
  //   return new Response(null, {
  //     status: 401,
  //   });
  // }

  return createMcpHandler(
    async (server) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      tools.forEach((tool) => {
        console.log("🌐 Registering tool", tool.name);
        server.tool(
          tool.name,
          tool.description,
          tool.inputSchema ? tool.inputSchema.shape : {},
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
  )(req);
};

export const APIRoute = createAPIFileRoute("/api/ai/mcp/$transport")({
  POST: async ({ request }) => {
    const session = await auth.api.getMcpSession({
      headers: request.headers,
    });

    console.log("🔑 Session", session);
    if (!session) {
      //this is important and you must return 401
      return new Response(null, {
        status: 401,
      });
    }
    return handler(request);
  },
});

// usage in Cursor:
// "remote-example": {
//     "command": "npx",
//     "args": ["mcp-remote", "http://localhost:3000/api/ai/mcp/mcp"]
//   }
