import { vercel } from "@ai-sdk/vercel";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { streamText } from "ai";

export const APIRoute = createAPIFileRoute("/api/ai/vercel/chat")({
  POST: async ({ request }) => {
    try {
      const { messages } = await request.json();

      console.log("🔑 Messages", messages);

      const response = streamText({
        model: vercel("v0-1.0-md"),
        messages,
      });

      return response.toDataStreamResponse();
    } catch (error) {
      console.error("🔑 Error", error);
      return json({ error: "Internal server error" }, { status: 500 });
    }
  },
});
