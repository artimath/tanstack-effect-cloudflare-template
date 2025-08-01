import { openai } from "@ai-sdk/openai";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { convertToModelMessages, stepCountIs, streamText, tool } from "ai";
import { z } from "zod";
import { findRelevantContent } from "@/features/ai/embedding";
import { createResource } from "@/features/resource/create";

export const ServerRoute = createServerFileRoute("/api/ai/chat/rag").methods({
  POST: async ({ request }) => {
    const { messages } = await request.json();

    const result = streamText({
      model: openai("gpt-4o"),
      onError: (error) => {
        console.log("error", error);
      },
      stopWhen: stepCountIs(3),
      messages: convertToModelMessages(messages),
      system: `You are a helpful assistant. Check your knowledge base before answering any questions.
        Try to respond to questions using information from tool calls and before send result please check the answer is in the same language as the question.
        If no relevant information is found in the tool calls, respond, "Sorry, I don't know."`,
      tools: {
        addResource: tool({
          description: `add a resource to your knowledge base.
              If the user provides a random piece of knowledge unprompted or a file, use this tool without asking for confirmation.`,
          inputSchema: z.object({
            content: z.string().describe("the content or resource to add to the knowledge base"),
          }),
          execute: async ({ content }) => createResource({ content }),
        }),
        getInformation: tool({
          description: "get information from your knowledge base to answer questions.",
          inputSchema: z.object({
            question: z.string().describe("the users question"),
          }),
          execute: async ({ question }) => findRelevantContent(question),
        }),
      },
    });

    return result.toUIMessageStreamResponse();
  },
});
