import { openai } from "@ai-sdk/openai";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export const APIRoute = createAPIFileRoute("/api/ai/chat")({
  POST: async ({ request }) => {
    const { messages } = await request.json();

    const result = streamText({
      model: openai("gpt-4o-2024-05-13"),
      messages,
    });

    return result.toDataStreamResponse();
  },
});
