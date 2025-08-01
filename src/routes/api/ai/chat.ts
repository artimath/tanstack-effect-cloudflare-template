import { openai } from "@ai-sdk/openai";

import { createServerFileRoute } from "@tanstack/react-start/server";
import { convertToModelMessages, streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const ServerRoute = createServerFileRoute("/api/ai/chat").methods({
  POST: async ({ request }) => {
    const { messages } = await request.json();

    const result = streamText({
      model: openai("gpt-4o-2024-05-13"),
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  },
});
