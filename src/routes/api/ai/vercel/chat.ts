import { vercel } from "@ai-sdk/vercel";
import { json } from "@tanstack/react-start";
import { createFileRoute } from "@tanstack/react-router";

import { convertToModelMessages, streamText } from "ai";

export const Route = createFileRoute("/api/ai/vercel/chat")({
  server: {
    handlers: {
  POST: async ({ request }) => {
    try {
      const { messages } = await request.json() as { messages: any[] };

      console.log("🔑 Messages", messages);

      const response = streamText({
        model: vercel("v0-1.0-md"),
        messages: convertToModelMessages(messages),
      });

      return response.toUIMessageStreamResponse();
    } catch (error) {
      console.error("🔑 Error", error);
      return json({ error: "Internal server error" }, { status: 500 });
    }
  },
  },
  },
});
