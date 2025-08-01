import { openai } from "@ai-sdk/openai";

import { createServerFileRoute } from "@tanstack/react-start/server";
import { experimental_generateImage as generateImage, type UIMessage, streamText, tool, convertToModelMessages } from "ai";
import { z } from "zod";

export const ServerRoute = createServerFileRoute("/api/ai/chat/image/generation").methods({
  POST: async ({ request }) => {
    const { messages }: { messages: UIMessage[] } = await request.json();

    // Filter through messages and remove base64 image data to avoid sending to the model
    const filteredMessages = messages.map((message) => ({
      ...message,
      parts: message.parts.map((part) => {
        // Keep text parts as-is
        if (part.type === "text") return part;
        
        // For tool parts, filter out large data
        if (part.type.startsWith("tool-")) {
          // If it's an image generation tool result, remove the base64 data but keep the structure
          if (part.type === "tool-generateImage" && "output" in part && part.output) {
            const toolPart = part as any;
            return {
              ...toolPart,
              output: {
                // Keep prompt but remove the large base64 image data
                prompt: toolPart.output.prompt,
                // image: "[image data removed for context efficiency]" // Optional: add placeholder
              }
            };
          }
          // Keep other tool parts as-is
          return part;
        }
        
        // Keep other part types as-is
        return part;
      }),
    }));

    const result = streamText({
      model: openai("gpt-4o"),
      messages: convertToModelMessages(filteredMessages),
      tools: {
        generateImage: tool({
          description: "Generate an image",
          inputSchema: z.object({
            prompt: z.string().describe("The prompt to generate the image from"),
          }),
          execute: async ({ prompt }) => {
            const { image } = await generateImage({
              model: openai.image("gpt-image-1"),
              prompt,
            });
            // in production, save this image to blob storage and return a URL
            return { image: image.base64, prompt };
          },
        }),
      },
    });
    return result.toUIMessageStreamResponse();
  },
});
