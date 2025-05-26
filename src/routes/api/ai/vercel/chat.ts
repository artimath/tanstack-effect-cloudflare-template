import { vercel } from "@ai-sdk/vercel";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

import { streamText } from "ai";

export const ServerRoute = createServerFileRoute().methods({
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
