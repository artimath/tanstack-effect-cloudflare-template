import { openai } from "@ai-sdk/openai";

import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const Route = createFileRoute("/api/ai/chat")({
  server: {
    handlers: {
  POST: async ({ request }) => {
    const { messages } = await request.json();

    const result = streamText({
      model: openai("gpt-4o-2024-05-13"),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  },
  },
  },
});
